"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ProjectItem, Project360Room } from "@/data/projectsData";
import {
  X,
  Rotate3D,
  RotateCcw,
  Compass,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  MessageCircle,
  FileText,
  Clock,
  Sun,
  Moon,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  Info,
  Lightbulb,
  Palette
} from "lucide-react";
import BeforeAfterSlider from "./BeforeAfterSlider";
import { DUAL_COLOR_THEMES, DualColorTheme } from "./Project3DExperience";

interface ProjectInteractiveModalProps {
  project: ProjectItem | null;
  initialTab?: "3d" | "360" | "specs" | "before-after";
  onClose: () => void;
}

// In-memory cache for 360 canvases
const modal360TextureCache: Record<string, HTMLCanvasElement> = {};

// WebGL Equirectangular Shader Sources
const VS_SOURCE = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FS_SOURCE = `
precision mediump float;
uniform sampler2D u_image;
uniform float u_yaw;
uniform float u_pitch;
uniform float u_fov;
uniform float u_aspect;
uniform float u_night_factor;
varying vec2 v_uv;

#define PI 3.14159265358979323846

void main() {
  vec2 screen = (v_uv - 0.5) * 2.0;
  float tanHalfFov = tan(u_fov * 0.5);
  vec3 ray = normalize(vec3(screen.x * tanHalfFov * u_aspect, -screen.y * tanHalfFov, 1.0));

  float cp = cos(u_pitch);
  float sp = sin(u_pitch);
  vec3 rPitch = vec3(
    ray.x,
    ray.y * cp - ray.z * sp,
    ray.y * sp + ray.z * cp
  );

  float cy = cos(u_yaw);
  float sy = sin(u_yaw);
  vec3 rYaw = vec3(
    rPitch.x * cy + rPitch.z * sy,
    rPitch.y,
    -rPitch.x * sy + rPitch.z * cy
  );

  float lon = atan(rYaw.x, rYaw.z);
  float lat = asin(clamp(rYaw.y, -0.9999, 0.9999));

  vec2 texCoord = vec2(
    fract(lon / (2.0 * PI) + 0.5),
    clamp(lat / PI + 0.5, 0.001, 0.999)
  );

  vec4 col = texture2D(u_image, texCoord);

  if (u_night_factor > 0.0) {
    vec3 nightTint = vec3(col.r * 1.05 + 0.02, col.g * 0.88, col.b * 0.72) * 0.85;
    col.rgb = mix(col.rgb, nightTint, u_night_factor);
  }

  gl_FragColor = col;
}
`;

export default function ProjectInteractiveModal({
  project,
  initialTab = "3d",
  onClose
}: ProjectInteractiveModalProps) {
  const [activeTab, setActiveTab] = useState<"3d" | "360" | "specs" | "before-after">(initialTab);
  const [is3dLoaded, setIs3dLoaded] = useState<boolean>(false);
  const [selectedRoomIdx, setSelectedRoomIdx] = useState<number>(0);
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [yaw, setYaw] = useState<number>(0);
  const [pitch, setPitch] = useState<number>(0);
  const [fov, setFov] = useState<number>(1.25);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showGestureGuide, setShowGestureGuide] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);
  const [bgTheme, setBgTheme] = useState<"white" | "black">("black");
  const [buildingLightsOn, setBuildingLightsOn] = useState<boolean>(true);
  const [selectedThemeId, setSelectedThemeId] = useState<string>("white-charcoal");
  const [primaryColor, setPrimaryColor] = useState<string>("#F5F6F4");
  const [accentColor, setAccentColor] = useState<string>("#2B2E33");

  const modalContainerRef = useRef<HTMLDivElement>(null);
  const modelViewerRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const textureRef = useRef<WebGLTexture | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const yawRef = useRef<number>(0);
  const pitchRef = useRef<number>(0);
  const fovRef = useRef<number>(1.25);
  const autoRotateRef = useRef<boolean>(true);
  const isDraggingRef = useRef<boolean>(false);
  const nightFactorRef = useRef<number>(0);

  // Keep refs in sync for 360 60fps render loop
  useEffect(() => {
    yawRef.current = yaw;
  }, [yaw]);
  useEffect(() => {
    pitchRef.current = pitch;
  }, [pitch]);
  useEffect(() => {
    fovRef.current = fov;
  }, [fov]);
  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);
  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);
  useEffect(() => {
    nightFactorRef.current = isNightMode ? 0.75 : 0.0;
  }, [isNightMode]);

  // Synchronize initialTab when project opens
  useEffect(() => {
    if (project) {
      setActiveTab(initialTab);
      setSelectedRoomIdx(0);
      setYaw(0);
      setPitch(0);
      setFov(1.25);
      yawRef.current = 0;
      pitchRef.current = 0;
    }
  }, [project, initialTab]);

  // Load Google <model-viewer> script (local first, CDN fallback)
  useEffect(() => {
    if (typeof window !== "undefined" && customElements.get("model-viewer")) {
      setIs3dLoaded(true);
      return;
    }
    const s = document.createElement("script");
    s.type = "module";
    s.src = "/js/model-viewer.min.js";
    s.onload = () => {
      customElements.whenDefined("model-viewer").then(() => setIs3dLoaded(true));
    };
    s.onerror = () => {
      const fallback = document.createElement("script");
      fallback.type = "module";
      fallback.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js";
      fallback.onload = () => {
        customElements.whenDefined("model-viewer").then(() => setIs3dLoaded(true));
      };
      document.body.appendChild(fallback);
    };
    document.body.appendChild(s);
  }, []);

  const hexToRGBA = (hex: string): [number, number, number, number] => {
    const cleanHex = hex.replace("#", "");
    const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
    return [r, g, b, 1.0];
  };

  const applyCustomColor = (target: "primary" | "accent", hex: string) => {
    const newPrimary = target === "primary" ? hex : primaryColor;
    const newAccent = target === "accent" ? hex : accentColor;
    if (target === "primary") setPrimaryColor(hex);
    if (target === "accent") setAccentColor(hex);
    setSelectedThemeId("custom");

    const mv = modelViewerRef.current;
    if (!mv) return;

    const materials = mv.model?.materials;
    if (!materials || !Array.isArray(materials)) return;

    const primaryRGBA = hexToRGBA(newPrimary);
    const accentRGBA = hexToRGBA(newAccent);

    for (const mat of materials) {
      const name = (mat.name || "").toUpperCase();

      const isPrimaryWall =
        name === "PLASTER WHITE" ||
        name === "M_PLASTER" ||
        name === "M_WALLWARM" ||
        name === "M_CEILING" ||
        (name.includes("PLASTER") && !name.includes("BLACK")) ||
        (name.includes("WALL") && !name.includes("LIGHT") && !name.includes("WOOD") && !name.includes("BLACK"));

      if (isPrimaryWall && mat.pbrMetallicRoughness?.setBaseColorFactor) {
        mat.pbrMetallicRoughness.setBaseColorFactor(primaryRGBA);
      }

      const isAccent =
        name === "PLASTER BLACK" ||
        name.includes("PLASTER BLACK") ||
        name.includes("LOUVER") ||
        name.includes("FENCE") ||
        name === "M_FASCIA__GLB" ||
        name === "M_METALDARK" ||
        name === "M_METALBRONZE" ||
        name === "M_SOFFIT" ||
        name === "M_STEEL";

      if (isAccent && mat.pbrMetallicRoughness?.setBaseColorFactor) {
        mat.pbrMetallicRoughness.setBaseColorFactor(accentRGBA);
      }
    }
  };

  const selectBgTheme = (theme: "white" | "black") => {
    setBgTheme(theme);
    if (theme === "black") {
      setBuildingLightsOn(true);
      applyBuildingLights(true);
    }
  };

  const applyBuildingLights = (on: boolean) => {
    const mv = modelViewerRef.current;
    if (!mv) return;

    const materials = mv.model?.materials;
    if (!materials || !Array.isArray(materials)) return;

    for (const mat of materials) {
      const name = (mat.name || "").toUpperCase();

      const isLightFixture =
        name.includes("LIGHT") ||
        name.includes("LED") ||
        name.includes("LAMP") ||
        name.includes("CHANDELIER") ||
        name.includes("BOLLARD") ||
        name.includes("EMIT") ||
        name.includes("POTLIGHT");

      if (isLightFixture && mat.setEmissiveFactor) {
        if (on) {
          if (name.includes("POOL")) {
            mat.setEmissiveFactor([0.2, 0.85, 1.0]);
          } else if (name.includes("CHANDELIER") || name.includes("INTERIOR")) {
            mat.setEmissiveFactor([1.0, 0.96, 0.82]);
          } else {
            mat.setEmissiveFactor([1.0, 0.94, 0.75]);
          }
        } else {
          mat.setEmissiveFactor([0.0, 0.0, 0.0]);
        }
      }

      const isWindowOrCurtain =
        name === "GLAZING" ||
        name.includes("GLAZING") ||
        name.includes("CURTAIN") ||
        name.includes("GLASS");

      if (isWindowOrCurtain && !name.includes("RAILING") && mat.setEmissiveFactor) {
        if (on) {
          mat.setEmissiveFactor([0.55, 0.42, 0.22]);
        } else {
          mat.setEmissiveFactor([0.0, 0.0, 0.0]);
        }
      }

      const isPoolWater = name.includes("WATER") || name.includes("POOL");
      if (isPoolWater && mat.setEmissiveFactor) {
        if (on) {
          mat.setEmissiveFactor([0.15, 0.70, 0.95]);
        } else {
          mat.setEmissiveFactor([0.0, 0.0, 0.0]);
        }
      }
    }
  };

  const toggleBuildingLights = () => {
    const next = !buildingLightsOn;
    setBuildingLightsOn(next);
    applyBuildingLights(next);
  };

  const applyDualColorTheme = (theme: DualColorTheme) => {
    setSelectedThemeId(theme.id);
    setPrimaryColor(theme.primaryHex);
    setAccentColor(theme.accentHex);
    const mv = modelViewerRef.current;
    if (!mv) return;

    const materials = mv.model?.materials;
    if (!materials || !Array.isArray(materials)) return;

    for (const mat of materials) {
      const name = (mat.name || "").toUpperCase();

      const isPrimaryWall =
        name === "PLASTER WHITE" ||
        name === "M_PLASTER" ||
        name === "M_WALLWARM" ||
        name === "M_CEILING" ||
        (name.includes("PLASTER") && !name.includes("BLACK")) ||
        (name.includes("WALL") && !name.includes("LIGHT") && !name.includes("WOOD") && !name.includes("BLACK"));

      if (isPrimaryWall && mat.pbrMetallicRoughness?.setBaseColorFactor) {
        mat.pbrMetallicRoughness.setBaseColorFactor(theme.primaryRGBA);
      }

      const isAccent =
        name === "PLASTER BLACK" ||
        name.includes("PLASTER BLACK") ||
        name.includes("LOUVER") ||
        name.includes("FENCE") ||
        name === "M_FASCIA__GLB" ||
        name === "M_METALDARK" ||
        name === "M_METALBRONZE" ||
        name === "M_SOFFIT" ||
        name === "M_STEEL";

      if (isAccent && mat.pbrMetallicRoughness?.setBaseColorFactor) {
        mat.pbrMetallicRoughness.setBaseColorFactor(theme.accentRGBA);
      }
    }
  };

  // Track 3D model load in modal to dismiss loading spinner
  useEffect(() => {
    if (activeTab !== "3d") return;
    setIsModelLoaded(false);

    const mv = modelViewerRef.current;
    if (!mv) {
      const fallbackTimer = setTimeout(() => setIsModelLoaded(true), 1500);
      return () => clearTimeout(fallbackTimer);
    }

    const handleReady = () => {
      setIsModelLoaded(true);
      const current = DUAL_COLOR_THEMES.find((c) => c.id === selectedThemeId);
      setTimeout(() => {
        try {
          if (current) {
            applyDualColorTheme(current);
          } else {
            applyCustomColor("primary", primaryColor);
          }
          applyBuildingLights(buildingLightsOn);
        } catch {}
      }, 150);
    };

    if (mv.loaded || mv.modelIsVisible) {
      handleReady();
      return;
    }

    const handleProgress = (e: any) => {
      if (e?.detail?.totalProgress >= 0.95) handleReady();
    };

    mv.addEventListener("load", handleReady);
    mv.addEventListener("progress", handleProgress);
    mv.addEventListener("error", handleReady);

    // Maximum 2.0s failsafe timer so user is never blocked by infinite spinner
    const timer = setTimeout(() => {
      handleReady();
    }, 2000);

    return () => {
      clearTimeout(timer);
      mv.removeEventListener("load", handleReady);
      mv.removeEventListener("progress", handleProgress);
      mv.removeEventListener("error", handleReady);
    };
  }, [project?.id, activeTab, is3dLoaded]);

  // Stop auto-rotation when user interacts with 3D model
  useEffect(() => {
    const mv = modelViewerRef.current;
    if (!mv) return;

    const stopRotate = () => {
      setShowGestureGuide(false);
    };

    mv.addEventListener("pointerdown", stopRotate);
    mv.addEventListener("touchstart", stopRotate, { passive: true });
    mv.addEventListener("wheel", stopRotate, { passive: true });

    return () => {
      mv.removeEventListener("pointerdown", stopRotate);
      mv.removeEventListener("touchstart", stopRotate);
      mv.removeEventListener("wheel", stopRotate);
    };
  }, [is3dLoaded, activeTab]);

  // Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Helper: Create fallback procedural architectural grid canvas texture
  const createFallbackTexture = useCallback((): HTMLCanvasElement => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 512;
    const ctx = c.getContext("2d");
    if (!ctx) return c;

    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, "#12151b");
    grad.addColorStop(0.5, "#1e2430");
    grad.addColorStop(1, "#0d0f14");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    ctx.fillStyle = "rgba(197, 168, 128, 0.15)";
    ctx.beginPath();
    ctx.arc(512, 160, 220, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(197, 168, 128, 0.25)";
    ctx.lineWidth = 1.5;
    for (let x = 0; x <= 1024; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 256);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }
    for (let y = 256; y <= 512; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }
    return c;
  }, []);

  // Upload canvas texture helper
  const uploadTexture = useCallback((source: HTMLCanvasElement | HTMLImageElement) => {
    const gl = glRef.current;
    const tex = textureRef.current;
    if (!gl || !tex) return;

    try {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    } catch (e) {
      console.warn("Upload texture err:", e);
    }
  }, []);

  // Rasterize image to 2048x1024 POT canvas
  const rasterizeToPot = useCallback((img: HTMLImageElement): HTMLCanvasElement => {
    const pot = document.createElement("canvas");
    pot.width = 2048;
    pot.height = 1024;
    const ctx = pot.getContext("2d");
    if (ctx) {
      ctx.drawImage(img, 0, 0, 2048, 1024);
    }
    return pot;
  }, []);

  // Robust 360 texture loader
  const load360Room = useCallback((room: Project360Room) => {
    if (!room) return;
    const gl = glRef.current;
    if (!gl) return;

    if (modal360TextureCache[room.panoramaUrl]) {
      uploadTexture(modal360TextureCache[room.panoramaUrl]);
      return;
    }

    const img = new Image();
    if (room.panoramaUrl.startsWith("http://") || room.panoramaUrl.startsWith("https://")) {
      img.crossOrigin = "anonymous";
    }

    const handleSuccess = () => {
      try {
        const pot = rasterizeToPot(img);
        modal360TextureCache[room.panoramaUrl] = pot;
        uploadTexture(pot);
      } catch {
        uploadTexture(img);
      }
    };

    const handleError = () => {
      uploadTexture(createFallbackTexture());
    };

    img.onload = handleSuccess;
    img.onerror = handleError;
    img.src = room.panoramaUrl;

    if (img.complete && img.naturalWidth > 0) {
      handleSuccess();
    }
  }, [uploadTexture, rasterizeToPot, createFallbackTexture]);

  // WebGL Initialization when 360 tab is active
  useEffect(() => {
    if (activeTab !== "360") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl = canvas.getContext("webgl", {
      antialias: true,
      alpha: false,
      powerPreference: "high-performance"
    }) as WebGLRenderingContext | null;

    if (!gl) {
      gl = canvas.getContext("experimental-webgl") as WebGLRenderingContext | null;
    }

    if (!gl) return;
    glRef.current = gl;

    const compileShader = (type: number, src: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(gl.VERTEX_SHADER, VS_SOURCE);
    const fs = compileShader(gl.FRAGMENT_SHADER, FS_SOURCE);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    programRef.current = prog;
    gl.useProgram(prog);

    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    const quadVertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

    const posAttr = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, createFallbackTexture());
    textureRef.current = tex;

    // Load active room texture
    if (project && project.rooms360[selectedRoomIdx]) {
      load360Room(project.rooms360[selectedRoomIdx]);
    }

    let lastTime = performance.now();
    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (autoRotateRef.current && !isDraggingRef.current) {
        yawRef.current = (yawRef.current + 0.12 * dt) % (Math.PI * 2);
        setYaw(yawRef.current);
      }

      if (canvas.clientWidth > 0 && canvas.clientHeight > 0) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const displayW = Math.round(canvas.clientWidth * dpr);
        const displayH = Math.round(canvas.clientHeight * dpr);
        if (canvas.width !== displayW || canvas.height !== displayH) {
          canvas.width = displayW;
          canvas.height = displayH;
          gl.viewport(0, 0, displayW, displayH);
        }
      }

      const aspect = (canvas.width || 1) / (canvas.height || 1);

      gl.useProgram(prog);
      gl.uniform1f(gl.getUniformLocation(prog, "u_yaw"), yawRef.current);
      gl.uniform1f(gl.getUniformLocation(prog, "u_pitch"), pitchRef.current);
      gl.uniform1f(gl.getUniformLocation(prog, "u_fov"), fovRef.current);
      gl.uniform1f(gl.getUniformLocation(prog, "u_aspect"), aspect);
      gl.uniform1f(gl.getUniformLocation(prog, "u_night_factor"), nightFactorRef.current);
      gl.uniform1i(gl.getUniformLocation(prog, "u_image"), 0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (tex) gl.deleteTexture(tex);
      if (quadBuffer) gl.deleteBuffer(quadBuffer);
      if (prog) gl.deleteProgram(prog);
      glRef.current = null;
      textureRef.current = null;
    };
  }, [activeTab, createFallbackTexture, load360Room, project, selectedRoomIdx]);

  // Load new room when selectedRoomIdx changes
  useEffect(() => {
    if (activeTab === "360" && project && project.rooms360[selectedRoomIdx]) {
      load360Room(project.rooms360[selectedRoomIdx]);
    }
  }, [activeTab, selectedRoomIdx, project, load360Room]);

  // Mouse & Touch 360 drag handlers
  const handlePointerDown = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setAutoRotate(false);
    setShowGestureGuide(false);
    lastMousePosRef.current = { x: clientX, y: clientY };
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDraggingRef.current) return;
    const dx = clientX - lastMousePosRef.current.x;
    const dy = clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: clientX, y: clientY };

    const sensitivity = 0.0035;
    let nextYaw = (yawRef.current - dx * sensitivity) % (Math.PI * 2);
    if (nextYaw < 0) nextYaw += Math.PI * 2;

    const maxPitch = 1.18;
    const nextPitch = Math.max(-maxPitch, Math.min(maxPitch, pitchRef.current + dy * sensitivity));

    yawRef.current = nextYaw;
    pitchRef.current = nextPitch;
    setYaw(nextYaw);
    setPitch(nextPitch);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // 3D Model Zoom & Reset helpers
  const zoomModelIn = () => {
    const mv = modelViewerRef.current;
    if (!mv) return;
    try {
      const orbit = mv.getCameraOrbit();
      if (!orbit) return;
      mv.cameraOrbit = `${orbit.theta}rad ${orbit.phi}rad ${orbit.radius * 0.8}m`;
    } catch (e) {
      console.warn("Zoom in error:", e);
    }
  };

  const zoomModelOut = () => {
    const mv = modelViewerRef.current;
    if (!mv) return;
    try {
      const orbit = mv.getCameraOrbit();
      if (!orbit) return;
      mv.cameraOrbit = `${orbit.theta}rad ${orbit.phi}rad ${orbit.radius * 1.25}m`;
    } catch (e) {
      console.warn("Zoom out error:", e);
    }
  };

  const resetModelCamera = () => {
    const mv = modelViewerRef.current;
    if (!mv) return;
    try {
      mv.cameraOrbit = project?.cameraOrbit || "35deg 72deg 80%";
      mv.cameraTarget = project?.cameraTarget || "0m 4.5m -5m";
      mv.fieldOfView = project?.fieldOfView || "30deg";
      mv.setAttribute("rotation-per-second", "18deg");
      mv.setAttribute("auto-rotate", "");
    } catch (e) {
      console.warn("Reset camera error:", e);
    }
  };

  if (!project) return null;

  const currentRoom = project.rooms360[selectedRoomIdx] || project.rooms360[0];

  const handleOpenLeadModal = () => {
    onClose();
    window.dispatchEvent(new CustomEvent("open-lead-modal"));
  };

  const handleOpenWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hi Danam Holdings, I am reviewing the 3D Elevation & 360° VR View for "${project.title}" (${project.location}) and would like to build a similar project.`
    );
    window.open(`https://wa.me/918883332499?text=${msg}`, "_blank");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div
        ref={modalContainerRef}
        onClick={(e) => e.stopPropagation()}
        className={`bg-[#0b0e14] border border-white/20 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col transition-all duration-300 ${
          isFullscreen ? "fixed inset-0 rounded-none max-w-none h-full z-50" : "max-h-[92vh]"
        }`}
      >
        {/* Modal Top Header Bar */}
        <div className="bg-[#0e121a] px-3.5 sm:px-6 py-2.5 sm:py-3.5 border-b border-white/10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="flex items-center justify-between w-full sm:w-auto gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-1.5 sm:p-2 rounded-xl bg-brand-forest/20 text-brand-leaf-light border border-brand-forest/30 shrink-0">
                <Rotate3D className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-spin-slow" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold bg-amber-400/10 px-1.5 sm:px-2 py-0.5 rounded border border-amber-400/20 truncate">
                    {project.badge}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono text-white/50 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-brand-leaf-light shrink-0" />
                    <span className="truncate">{project.location}</span>
                  </span>
                </div>
                <h3 className="font-display text-sm sm:text-base md:text-xl font-bold text-white tracking-tight mt-0.5 truncate">
                  {project.title}
                </h3>
              </div>
            </div>

            {/* Mobile Actions: Fullscreen & Close on Top Right */}
            <div className="flex items-center gap-1 text-white/70 shrink-0 sm:hidden">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Interactive Mode Tabs (Smooth swipe on mobile) */}
          <div className="flex items-center bg-[#07090d] border border-white/15 p-1 rounded-2xl gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("3d")}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl font-ui text-[11px] sm:text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === "3d"
                  ? "bg-brand-forest text-white shadow-md ring-1 ring-white/20"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <Rotate3D className="w-3.5 h-3.5 text-amber-300" />
              <span>3D Exterior</span>
            </button>

            <button
              onClick={() => setActiveTab("360")}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl font-ui text-[11px] sm:text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === "360"
                  ? "bg-brand-forest text-white shadow-md ring-1 ring-white/20"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-emerald-300" />
              <span>360° Interior VR</span>
            </button>

            <button
              onClick={() => setActiveTab("before-after")}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl font-ui text-[11px] sm:text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === "before-after"
                  ? "bg-brand-forest text-white shadow-md ring-1 ring-white/20"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-300" />
              <span>Before / After</span>
            </button>

            <button
              onClick={() => setActiveTab("specs")}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl font-ui text-[11px] sm:text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === "specs"
                  ? "bg-brand-forest text-white shadow-md ring-1 ring-white/20"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Specs & BOQ</span>
            </button>
          </div>

          {/* Desktop Close & Fullscreen Actions */}
          <div className="hidden sm:flex items-center gap-1 text-white/70 shrink-0">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content Stage */}
        <div className="relative flex-1 bg-black overflow-y-auto min-h-[380px] sm:min-h-[460px] flex flex-col justify-between">
          
          {/* TAB 1: 3D Exterior Walkaround */}
          {activeTab === "3d" && (
            <div className={`relative w-full h-full min-h-[420px] sm:min-h-[500px] flex items-center justify-center transition-colors duration-500 overflow-hidden ${
              bgTheme === "white" ? "bg-white" : "bg-black"
            }`}>
              {is3dLoaded ? (
                // @ts-ignore
                <model-viewer
                  ref={modelViewerRef}
                  src={project.glbModel}
                  alt={project.title}
                  onLoad={() => setIsModelLoaded(true)}
                  onError={() => setIsModelLoaded(true)}
                  camera-controls
                  disable-tap
                  disable-pan
                  auto-rotate
                  auto-rotate-delay="999999"
                  rotation-per-second="6deg"
                  interaction-prompt="none"
                  shadow-intensity={bgTheme === "white" ? "1.6" : "1.3"}
                  shadow-softness={bgTheme === "white" ? "0.2" : "0.35"}
                  environment-image="neutral"
                  tone-mapping="neutral"
                  exposure={bgTheme === "white" ? "1.35" : (buildingLightsOn ? "0.95" : "0.60")}
                  loading="eager"
                  reveal="auto"
                  camera-orbit={project.cameraOrbit || "35deg 72deg 80%"}
                  camera-target={project.cameraTarget || "auto auto auto"}
                  min-camera-orbit="auto auto 40%"
                  max-camera-orbit="auto auto 200%"
                  field-of-view={project.fieldOfView || "30deg"}
                  style={{
                    width: "100%",
                    height: "100%",
                    minHeight: isFullscreen ? "calc(100vh - 150px)" : "480px",
                    background: bgTheme === "white" ? "#ffffff" : "#000000",
                    outline: "none",
                    touchAction: "pan-y"
                  }}
                >
                  <div slot="progress-bar" style={{ display: "none" }} />
                {/* @ts-ignore */}
                </model-viewer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-white/60 gap-3 py-20">
                  <div className="w-8 h-8 border-2 border-brand-forest border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-mono">Initializing 3D Engine...</span>
                </div>
              )}

              {/* Seamless Loading Spinner that smoothly disappears once model is ready */}
              {is3dLoaded && !isModelLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-30 pointer-events-none transition-opacity duration-300">
                  <div className="flex flex-col items-center gap-3 text-white">
                    <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-mono tracking-wider uppercase text-amber-300">
                      Loading 3D Architectural Model...
                    </span>
                  </div>
                </div>
              )}

              {/* Viewfinder Reticles */}
              <span className={`pointer-events-none absolute left-4 top-4 z-20 h-4 w-4 border-l border-t transition-colors duration-300 ${
                bgTheme === "white" ? "border-slate-800/40" : "border-white/40"
              }`} />
              <span className={`pointer-events-none absolute right-4 top-4 z-20 h-4 w-4 border-r border-t transition-colors duration-300 ${
                bgTheme === "white" ? "border-slate-800/40" : "border-white/40"
              }`} />
              <span className={`pointer-events-none absolute left-4 bottom-4 z-20 h-4 w-4 border-l border-b transition-colors duration-300 ${
                bgTheme === "white" ? "border-slate-800/40" : "border-white/40"
              }`} />
              <span className={`pointer-events-none absolute right-4 bottom-4 z-20 h-4 w-4 border-r border-b transition-colors duration-300 ${
                bgTheme === "white" ? "border-slate-800/40" : "border-white/40"
              }`} />

              {/* Top HUD Controls Bar (Responsive: Left Controls + Right Zoom/Reset) */}
              <div className="absolute top-2.5 left-2 sm:left-4 right-2 sm:right-4 z-25 flex items-center justify-between pointer-events-none select-none gap-2">
                {/* Left: 3D Badge + White/Black Switcher + Lights Toggle + View Inside 360 */}
                <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto flex-wrap">
                  <div className="bg-[#0a0a0d]/90 backdrop-blur-md border border-white/15 px-2.5 sm:px-3 py-1 rounded-full text-white text-[10px] sm:text-xs font-mono flex items-center gap-1.5 tracking-wider uppercase shadow-md shrink-0">
                    <Rotate3D className="w-3.5 h-3.5 text-[#C5A880] animate-spin-slow" />
                    <span className="hidden sm:inline">3D Exterior Tour</span>
                  </div>

                  {/* White & Black Background Switcher */}
                  <div className="bg-[#0a0a0d]/90 backdrop-blur-md border border-white/15 p-0.5 rounded-full flex items-center shadow-lg shrink-0">
                    <button
                      onClick={() => selectBgTheme("white")}
                      className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono flex items-center gap-1.5 cursor-pointer transition-all ${
                        bgTheme === "white"
                          ? "bg-white text-stone-900 font-bold shadow-md scale-105"
                          : "text-white/80 hover:text-white"
                      }`}
                      title="White Background"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-white border border-stone-400 shrink-0" />
                      <span>White</span>
                    </button>

                    <button
                      onClick={() => selectBgTheme("black")}
                      className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono flex items-center gap-1.5 cursor-pointer transition-all ${
                        bgTheme === "black"
                          ? "bg-black text-white font-bold ring-1 ring-white/60 shadow-md scale-105"
                          : "text-white/80 hover:text-white"
                      }`}
                      title="Black Background"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-black border border-white/70 shrink-0" />
                      <span>Black</span>
                    </button>
                  </div>

                  {/* Dedicated Building Lights ON / OFF Toggle */}
                  <button
                    onClick={toggleBuildingLights}
                    className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all backdrop-blur-md border shadow-lg shrink-0 ${
                      buildingLightsOn
                        ? "bg-amber-400 text-stone-950 font-bold border-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.5)]"
                        : "bg-[#0a0a0d]/90 text-white/70 hover:text-white border-white/15"
                    }`}
                    title="Toggle Architectural Lights ON / OFF"
                  >
                    <Lightbulb className={`w-3.5 h-3.5 ${buildingLightsOn ? "fill-stone-950 text-stone-950 animate-pulse" : "text-white/70"}`} />
                    <span>{buildingLightsOn ? "Lights ON" : "Lights OFF"}</span>
                  </button>

                  {/* View Inside 360° Interior VR Walkthrough */}
                  {project.rooms360 && project.rooms360.length > 0 && (
                    <button
                      onClick={() => setActiveTab("360")}
                      className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all backdrop-blur-md border shadow-lg shrink-0 bg-amber-500/20 text-amber-300 border-amber-400/40 hover:bg-amber-500/30 font-semibold"
                      title="Step Inside 360° Furnished Interior VR Rooms"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      <span className="hidden sm:inline">View Inside 360°</span>
                      <span className="sm:hidden">360° VR</span>
                    </button>
                  )}
                </div>

                {/* Right: Zoom & Reset Controls */}
                <div className="flex items-center gap-0.5 sm:gap-1 bg-[#0a0a0d]/95 backdrop-blur-md border border-white/15 p-1 rounded-xl shadow-xl pointer-events-auto select-none shrink-0">
                  <button
                    onClick={zoomModelOut}
                    className="px-1.5 sm:px-2 py-1 text-white/90 hover:text-white hover:bg-white/20 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase hidden md:inline">Zoom Out</span>
                  </button>
                  <button
                    onClick={zoomModelIn}
                    className="px-1.5 sm:px-2 py-1 text-white/90 hover:text-white hover:bg-white/20 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer border-l border-white/20 flex items-center gap-1"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase hidden md:inline">Zoom In</span>
                  </button>
                  <button
                    onClick={resetModelCamera}
                    className="px-1.5 sm:px-2 py-1 text-white/90 hover:text-white hover:bg-white/20 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer border-l border-white/20 flex items-center gap-1"
                    title="Reset View to Center"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase hidden md:inline">Reset</span>
                  </button>
                </div>
              </div>

              {/* Bottom Architectural Real-Time Color Customization Bar */}
              {isModelLoaded && (
                <div className="absolute bottom-3 left-2 sm:left-4 right-2 sm:right-4 z-25 flex items-center gap-1.5 sm:gap-2 bg-[#0a0a0d]/90 backdrop-blur-md border border-white/15 px-2.5 sm:px-3 py-1.5 rounded-2xl shadow-xl overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="flex items-center gap-1 text-white/90 font-mono text-[10px] shrink-0">
                    <Palette className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-[10px] font-mono uppercase tracking-wider hidden sm:inline whitespace-nowrap">
                      Colors:
                    </span>
                  </div>

                  {/* Primary Wall Color Picker */}
                  <label
                    className="group relative flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 cursor-pointer transition-all shadow-sm shrink-0"
                    title="Click to pick custom Primary Wall color"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white shrink-0 shadow-xs"
                      style={{ backgroundColor: primaryColor }}
                    />
                    <span className="text-[10px] font-mono text-white/90 whitespace-nowrap">
                      Wall: <strong className="text-white">{primaryColor.toUpperCase()}</strong>
                    </span>
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => applyCustomColor("primary", e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </label>

                  {/* Accent / Louver Color Picker */}
                  <label
                    className="group relative flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 cursor-pointer transition-all shadow-sm shrink-0"
                    title="Click to pick custom Accent / Louver / Trim color"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white shrink-0 shadow-xs"
                      style={{ backgroundColor: accentColor }}
                    />
                    <span className="text-[10px] font-mono text-white/90 whitespace-nowrap">
                      Accent: <strong className="text-white">{accentColor.toUpperCase()}</strong>
                    </span>
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => applyCustomColor("accent", e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </label>

                  {/* Preset Theme Swatches */}
                  <div className="flex items-center gap-1 sm:gap-1.5 pl-1.5 sm:pl-2 border-l border-white/20 shrink-0">
                    {DUAL_COLOR_THEMES.map((theme) => {
                      const isActive = selectedThemeId === theme.id;
                      return (
                        <button
                          key={theme.id}
                          onClick={() => applyDualColorTheme(theme)}
                          title={`${theme.name} (${theme.tag}): ${theme.primaryLabel} + ${theme.accentLabel}`}
                          className={`group relative w-5 h-5 sm:w-6 sm:h-6 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center p-[1px] ${
                            isActive
                              ? "ring-2 ring-amber-400 scale-110 shadow-lg"
                              : "hover:scale-105 opacity-75 hover:opacity-100"
                          }`}
                        >
                          <div className="w-full h-full rounded-full overflow-hidden flex border border-white/30">
                            <div className="w-1/2 h-full" style={{ backgroundColor: theme.primaryHex }} />
                            <div className="w-1/2 h-full" style={{ backgroundColor: theme.accentHex }} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Gesture Hint overlay */}
              {showGestureGuide && (
                <div
                  className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none transition-opacity duration-500"
                >
                  <div
                    onClick={() => setShowGestureGuide(false)}
                    className="bg-[#0b0e14]/95 border border-white/25 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce pointer-events-auto cursor-pointer"
                  >
                    <Rotate3D className="w-5 h-5 text-amber-400 animate-spin-slow" />
                    <div>
                      <h5 className="text-white text-xs font-bold uppercase tracking-wider">Drag to Orbit 360° Around Building</h5>
                      <p className="text-white/60 text-[11px]">Pinch / Scroll to zoom into architectural cantilevers & balconies</p>
                    </div>
                    <span className="text-[10px] text-amber-400 font-mono uppercase bg-amber-400/10 px-2 py-1 rounded-md border border-amber-400/20">
                      Tap to interact
                    </span>
                  </div>
                </div>
              )}

              {/* Author attribution pill */}
              <div className="absolute bottom-4 left-4 z-20 pointer-events-none bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-white/50 text-[10px] font-mono">
                <span>Model Architecture: {project.modelAuthor}</span>
              </div>
            </div>
          )}

          {/* TAB 2: 360° Interior Virtual Tour */}
          {activeTab === "360" && (
            <div
              onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
              onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
              onMouseUp={handlePointerUp}
              onMouseLeave={handlePointerUp}
              onTouchStart={(e) => {
                if (e.touches[0]) handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
              }}
              onTouchMove={(e) => {
                if (e.touches[0]) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
              }}
              onTouchEnd={handlePointerUp}
              className="relative w-full h-full min-h-[420px] sm:min-h-[500px] bg-black cursor-grab active:cursor-grabbing select-none"
              style={{ touchAction: "none" }}
            >
              <canvas ref={canvasRef} className="w-full h-full block min-h-[420px]" />

              {/* Top-Left: Active Room Badge */}
              <div className="absolute top-4 left-4 z-20 pointer-events-none">
                <div className="bg-[#0b0e14]/90 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-white text-xs font-mono flex items-center gap-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-amber-300 uppercase tracking-wider">{currentRoom.name}</span>
                  <span className="text-white/30">|</span>
                  <span className="text-white/70 text-[11px]">{currentRoom.specs}</span>
                </div>
              </div>

              {/* Top-Right: 360 HUD Controls */}
              <div className="absolute top-4 right-4 z-25 flex items-center gap-1.5 bg-[#0b0e14]/90 backdrop-blur-md border border-white/20 p-1 rounded-2xl shadow-xl">
                <button
                  onClick={() => setIsNightMode(!isNightMode)}
                  className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                    isNightMode ? "bg-indigo-600/30 text-indigo-300 border border-indigo-400/40" : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                  title="Toggle Day / Night Lighting"
                >
                  {isNightMode ? <Moon className="w-4 h-4 text-indigo-300" /> : <Sun className="w-4 h-4 text-amber-400" />}
                  <span className="text-[11px] uppercase hidden sm:inline">{isNightMode ? "Night" : "Day"}</span>
                </button>

                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                    autoRotate ? "bg-brand-forest text-white" : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                  title="Auto Rotate"
                >
                  <Rotate3D className="w-3.5 h-3.5" />
                  <span className="text-[11px] uppercase hidden sm:inline">{autoRotate ? "Cruise" : "Hold"}</span>
                </button>

                <button
                  onClick={() => setFov((prev) => Math.min(1.65, prev + 0.15))}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setFov((prev) => Math.max(0.75, prev - 0.15))}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setYaw(0);
                    setPitch(0);
                    setFov(1.25);
                    yawRef.current = 0;
                    pitchRef.current = 0;
                    fovRef.current = 1.25;
                    setAutoRotate(true);
                  }}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
                  title="Reset View"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Scene Thumbnail Switcher Strip */}
              <div className="absolute bottom-4 left-4 right-4 z-25 flex justify-center pointer-events-auto">
                <div className="flex items-center gap-2 bg-[#0b0e14]/90 backdrop-blur-xl border border-white/20 p-1.5 rounded-2xl shadow-2xl overflow-x-auto max-w-full">
                  {project.rooms360.map((room, rIdx) => {
                    const isSelected = selectedRoomIdx === rIdx;
                    return (
                      <button
                        key={room.id}
                        onClick={() => setSelectedRoomIdx(rIdx)}
                        className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                          isSelected
                            ? "bg-brand-forest/70 border border-amber-400/80 shadow-md ring-1 ring-amber-400/40"
                            : "hover:bg-white/10 border border-transparent"
                        }`}
                      >
                        <Compass className={`w-3.5 h-3.5 ${isSelected ? "text-amber-300" : "text-white/60"}`} />
                        <div className="text-left">
                          <span className={`text-[11px] font-bold block leading-tight ${isSelected ? "text-amber-300" : "text-white/80"}`}>
                            {room.name}
                          </span>
                          <span className="text-[9px] font-mono text-white/40 block">
                            {room.tag}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Before / After Transformation Slider */}
          {activeTab === "before-after" && (
            <div className="p-6 sm:p-10 flex flex-col items-center justify-center bg-[#07090d] min-h-[460px]">
              <div className="max-w-3xl w-full">
                <div className="text-center mb-6">
                  <span className="text-brand-forest font-mono text-xs uppercase tracking-widest block font-bold mb-1">
                    RCC Structural Skeleton vs. Turnkey Handover
                  </span>
                  <h4 className="font-display text-xl sm:text-2xl font-bold text-white">
                    Civil Construction Progression
                  </h4>
                  <p className="text-xs text-white/60 max-w-md mx-auto mt-1">
                    Drag the interactive center slider to verify structural alignment between the initial RCC frame and final handover.
                  </p>
                </div>

                <div className="bg-[#0b0e14] border border-white/15 p-3 rounded-2xl shadow-2xl">
                  <BeforeAfterSlider
                    beforeImg={project.beforeImg}
                    afterImg={project.img}
                    beforeLabel="Structural RCC Skeleton (IS-456)"
                    afterLabel="Finished Turnkey Handover"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Civil Specs & Itemized BOQ Details */}
          {activeTab === "specs" && (
            <div className="p-6 sm:p-8 bg-[#07090d] text-white min-h-[460px] space-y-6">
              <div>
                <span className="text-brand-forest font-mono text-xs uppercase tracking-widest block font-bold mb-1">
                  Civil Engineering Documentation
                </span>
                <h4 className="font-display text-2xl font-bold text-white">
                  Technical Specifications & BOQ Scope
                </h4>
                <p className="font-ui text-xs sm:text-sm text-white/70 max-w-2xl mt-1 leading-relaxed">
                  {project.desc}
                </p>
              </div>

              {/* 7-Point Technical Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="bg-[#0e121a] p-3.5 rounded-xl border border-white/10">
                  <span className="text-[10px] text-white/40 uppercase font-mono block">RCC Structural Code</span>
                  <span className="text-xs font-bold text-amber-300 mt-0.5 block">{project.civilSpecs.structure}</span>
                </div>

                <div className="bg-[#0e121a] p-3.5 rounded-xl border border-white/10">
                  <span className="text-[10px] text-white/40 uppercase font-mono block">Steel Reinforcement</span>
                  <span className="text-xs font-bold text-emerald-400 mt-0.5 block">{project.civilSpecs.steel}</span>
                </div>

                <div className="bg-[#0e121a] p-3.5 rounded-xl border border-white/10">
                  <span className="text-[10px] text-white/40 uppercase font-mono block">Concrete Matrix</span>
                  <span className="text-xs font-bold text-white mt-0.5 block">{project.civilSpecs.concrete}</span>
                </div>

                <div className="bg-[#0e121a] p-3.5 rounded-xl border border-white/10">
                  <span className="text-[10px] text-white/40 uppercase font-mono block">Vastu Orientation</span>
                  <span className="text-xs font-bold text-white mt-0.5 block">{project.civilSpecs.vastu}</span>
                </div>

                <div className="bg-[#0e121a] p-3.5 rounded-xl border border-white/10">
                  <span className="text-[10px] text-white/40 uppercase font-mono block">Clear Ceiling Span</span>
                  <span className="text-xs font-bold text-amber-300 mt-0.5 block">{project.civilSpecs.ceiling}</span>
                </div>

                <div className="bg-[#0e121a] p-3.5 rounded-xl border border-white/10">
                  <span className="text-[10px] text-white/40 uppercase font-mono block">Turnkey Timeline</span>
                  <span className="text-xs font-bold text-emerald-400 mt-0.5 block">{project.civilSpecs.handoverTime}</span>
                </div>
              </div>

              {/* Engineering Highlights */}
              <div className="bg-[#0e121a] p-4 rounded-xl border border-white/10">
                <h5 className="font-display text-xs font-bold uppercase tracking-wider text-amber-300 mb-2.5 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Quality Benchmarks & Structural Guarantees
                </h5>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white/80 font-ui">
                  {project.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Verified Client Testimonial */}
              <div className="bg-brand-forest/10 border border-brand-forest/30 p-4 rounded-xl">
                <p className="font-ui text-xs italic text-white/90 mb-1.5 leading-relaxed">
                  &ldquo;{project.quote}&rdquo;
                </p>
                <span className="font-ui text-[11px] font-bold text-amber-300 block">
                  — {project.author} ({project.location})
                </span>
              </div>
            </div>
          )}

          {/* Modal Bottom Sticky CTA Footer */}
          <div className="bg-[#0e121a] p-4 sm:px-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
            <div className="text-left w-full sm:w-auto">
              <span className="text-[10px] text-white/40 uppercase font-mono block">Scope & Built-up</span>
              <span className="text-xs font-bold text-white">{project.area} • {project.duration} Handover</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleOpenWhatsApp}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all cursor-pointer"
                title="Discuss with Engineer on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Query</span>
              </button>

              <button
                onClick={handleOpenLeadModal}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-forest hover:bg-brand-forest-dark text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                <span>Request Custom BOQ Quote</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
