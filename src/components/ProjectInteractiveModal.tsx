"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ProjectItem, Project360Room, ProjectCadDrawing } from "@/data/projectsData";
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
  Ruler,
  ExternalLink
} from "lucide-react";
import BeforeAfterSlider from "./BeforeAfterSlider";

interface ProjectInteractiveModalProps {
  project: ProjectItem | null;
  initialTab?: "3d" | "360" | "cad" | "specs" | "before-after";
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
  const [activeTab, setActiveTab] = useState<"3d" | "360" | "cad" | "specs" | "before-after">(initialTab);
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

  // CAD Blueprint Viewer State
  const [selectedCadIdx, setSelectedCadIdx] = useState<number>(0);
  const [cadZoom, setCadZoom] = useState<number>(1);
  const [cadPan, setCadPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isCadDragging, setIsCadDragging] = useState<boolean>(false);
  const [cadDragStart, setCadDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [cadTheme, setCadTheme] = useState<"blueprint" | "drafting">("blueprint");

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
      setSelectedCadIdx(0);
      setCadZoom(1);
      setCadPan({ x: 0, y: 0 });
      setYaw(0);
      setPitch(0);
      setFov(1.25);
      yawRef.current = 0;
      pitchRef.current = 0;
    }
  }, [project, initialTab]);

  // CAD Blueprint Pan & Zoom Handlers
  const handleCadWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.2 : -0.2;
    setCadZoom((prev) => Math.min(3.5, Math.max(0.6, Number((prev + zoomDelta).toFixed(2)))));
  };

  const handleCadMouseDown = (e: React.MouseEvent) => {
    setIsCadDragging(true);
    setCadDragStart({ x: e.clientX - cadPan.x, y: e.clientY - cadPan.y });
  };

  const handleCadMouseMove = (e: React.MouseEvent) => {
    if (!isCadDragging) return;
    setCadPan({
      x: e.clientX - cadDragStart.x,
      y: e.clientY - cadDragStart.y
    });
  };

  const handleCadMouseUp = () => {
    setIsCadDragging(false);
  };

  const resetCadTransform = () => {
    setCadZoom(1);
    setCadPan({ x: 0, y: 0 });
  };

  // Load Google <model-viewer> script
  useEffect(() => {
    if (typeof window !== "undefined" && customElements.get("model-viewer")) {
      setIs3dLoaded(true);
      return;
    }
    const s = document.createElement("script");
    s.type = "module";
    s.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js";
    s.onload = () => setIs3dLoaded(true);
    document.body.appendChild(s);
  }, []);

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
  const currentCad = project.cadDrawings?.[selectedCadIdx] || project.cadDrawings?.[0];

  const handleOpenLeadModal = () => {
    onClose();
    window.dispatchEvent(new CustomEvent("open-lead-modal"));
  };

  const handleOpenWhatsApp = () => {
    let msgText = `Hi Danam Holdings, I am reviewing "${project.title}" (${project.location}) on your website.`;
    if (activeTab === "cad") {
      msgText = `Hi Danam Holdings, I am reviewing the CAD Blueprint & Architectural Drawings for "${project.title}" (${currentCad?.sheetNo || "DWG"}) on your website and would like to consult on architectural plans for my site.`;
    } else if (activeTab === "3d") {
      msgText = `Hi Danam Holdings, I am reviewing the interactive 3D Exterior Elevation for "${project.title}" (${project.location}) and would like to build a similar project.`;
    } else if (activeTab === "360") {
      msgText = `Hi Danam Holdings, I am exploring the 360° Interior VR Walkthrough for "${project.title}" (${currentRoom?.name || "Room"}) and would like to consult on interior execution.`;
    }
    const msg = encodeURIComponent(msgText);
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
        <div className="bg-[#0e121a] px-4 sm:px-6 py-3.5 border-b border-white/10 flex flex-wrap justify-between items-center gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-forest/20 text-brand-leaf-light border border-brand-forest/30">
              <Rotate3D className="w-5 h-5 text-amber-400 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  {project.badge}
                </span>
                <span className="text-[11px] font-mono text-white/50 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-brand-leaf-light" />
                  {project.location}
                </span>
              </div>
              <h3 className="font-display text-base sm:text-xl font-bold text-white tracking-tight mt-0.5">
                {project.title}
              </h3>
            </div>
          </div>

          {/* Interactive Mode Tabs */}
          <div className="flex items-center bg-[#07090d] border border-white/15 p-1 rounded-2xl gap-1">
            <button
              onClick={() => setActiveTab("3d")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-ui text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-ui text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "360"
                  ? "bg-brand-forest text-white shadow-md ring-1 ring-white/20"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-emerald-300" />
              <span>360° Interior VR</span>
            </button>

            <button
              onClick={() => setActiveTab("cad")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-ui text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "cad"
                  ? "bg-brand-forest text-white shadow-md ring-1 ring-white/20"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <Ruler className="w-3.5 h-3.5 text-cyan-300" />
              <span>CAD & Blueprints</span>
            </button>

            <button
              onClick={() => setActiveTab("before-after")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-ui text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "before-after"
                  ? "bg-brand-forest text-white shadow-md ring-1 ring-white/20"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-300" />
              <span className="hidden sm:inline">Before / After</span>
            </button>

            <button
              onClick={() => setActiveTab("specs")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-ui text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "specs"
                  ? "bg-brand-forest text-white shadow-md ring-1 ring-white/20"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Specs & BOQ</span>
            </button>
          </div>

          {/* Modal Header Actions */}
          <div className="flex items-center gap-1 text-white/70">
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
            <div className="relative w-full h-full min-h-[420px] sm:min-h-[500px] flex items-center justify-center bg-[#07090d]">
              {is3dLoaded ? (
                // @ts-ignore
                <model-viewer
                  ref={modelViewerRef}
                  src={project.glbModel}
                  alt={project.title}
                  camera-controls
                  disable-tap
                  disable-pan
                  auto-rotate
                  auto-rotate-delay="999999"
                  rotation-per-second="18deg"
                  interaction-prompt="auto"
                  shadow-intensity="1.5"
                  shadow-softness="0.8"
                  environment-image="neutral"
                  exposure="1.05"
                  loading="eager"
                  reveal="auto"
                  camera-orbit={project.cameraOrbit || "35deg 72deg 80%"}
                  camera-target={project.cameraTarget || "0m 4.5m -5m"}
                  min-camera-orbit="auto auto 40%"
                  max-camera-orbit="auto auto 200%"
                  field-of-view={project.fieldOfView || "30deg"}
                  style={{
                    width: "100%",
                    height: "100%",
                    minHeight: isFullscreen ? "calc(100vh - 150px)" : "480px",
                    backgroundColor: "#07090d",
                    outline: "none"
                  }}
                >
                  {/* Model Viewer Slot Overlays */}
                  <div slot="progress-bar" className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-30">
                    <div className="flex flex-col items-center gap-3 text-white">
                      <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-mono tracking-wider uppercase text-amber-300">
                        Loading 3D Architectural Model...
                      </span>
                    </div>
                  </div>
                {/* @ts-ignore */}
                </model-viewer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-white/60 gap-3 py-20">
                  <div className="w-8 h-8 border-2 border-brand-forest border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-mono">Initializing Google 3D Engine...</span>
                </div>
              )}

              {/* Viewfinder Reticles */}
              <span className="pointer-events-none absolute left-4 top-4 z-20 h-4 w-4 border-l border-t border-white/40" />
              <span className="pointer-events-none absolute right-4 top-4 z-20 h-4 w-4 border-r border-t border-white/40" />
              <span className="pointer-events-none absolute left-4 bottom-4 z-20 h-4 w-4 border-l border-b border-white/40" />
              <span className="pointer-events-none absolute right-4 bottom-4 z-20 h-4 w-4 border-r border-b border-white/40" />

              {/* 3D Model HUD Controls */}
              <div className="absolute top-4 right-4 z-25 flex items-center gap-1.5 bg-[#0b0e14]/90 backdrop-blur-md border border-white/20 p-1 rounded-2xl shadow-xl">
                <button
                  onClick={zoomModelOut}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={zoomModelIn}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={resetModelCamera}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
                  title="Reset Camera Angle"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

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

          {/* TAB: CAD & Blueprints Interactive Technical Drawing Inspector */}
          {activeTab === "cad" && (
            <div className="relative flex-1 flex flex-col bg-[#070b12] text-white min-h-[500px]">
              {/* CAD Controls Top Toolbar */}
              <div className="bg-[#0b101b] border-b border-white/10 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0 z-20">
                {/* Left: Drawing Sheet Selector */}
                <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1 mr-1">
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Sheets:</span>
                  </span>
                  {(project.cadDrawings || []).map((sheet, sIdx) => {
                    const isSelected = selectedCadIdx === sIdx;
                    return (
                      <button
                        key={sheet.id}
                        onClick={() => {
                          setSelectedCadIdx(sIdx);
                          resetCadTransform();
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 font-bold shadow-xs"
                            : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-transparent"
                        }`}
                      >
                        <span className="text-[10px] opacity-75">{sheet.sheetNo}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="truncate max-w-[140px] sm:max-w-none">{sheet.type}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Right: Zoom, Theme, and Reset Controls */}
                <div className="flex items-center gap-2">
                  {/* Theme Switcher */}
                  <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-0.5 text-[11px] font-mono">
                    <button
                      onClick={() => setCadTheme("blueprint")}
                      className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                        cadTheme === "blueprint" ? "bg-cyan-600/40 text-cyan-300 font-bold" : "text-white/50 hover:text-white"
                      }`}
                      title="Engineering Blueprint Mode"
                    >
                      Blueprint
                    </button>
                    <button
                      onClick={() => setCadTheme("drafting")}
                      className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                        cadTheme === "drafting" ? "bg-white/20 text-white font-bold" : "text-white/50 hover:text-white"
                      }`}
                      title="Architectural Drafting Paper Mode"
                    >
                      Draft
                    </button>
                  </div>

                  {/* Zoom Controls */}
                  <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-xl p-0.5">
                    <button
                      onClick={() => setCadZoom((prev) => Math.max(0.6, Number((prev - 0.25).toFixed(2))))}
                      className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                      title="Zoom Out CAD Sheet"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-mono font-bold px-1.5 text-cyan-300 min-w-[42px] text-center">
                      {Math.round(cadZoom * 100)}%
                    </span>
                    <button
                      onClick={() => setCadZoom((prev) => Math.min(3.5, Number((prev + 0.25).toFixed(2))))}
                      className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                      title="Zoom In CAD Sheet"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={resetCadTransform}
                      className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                      title="Reset View"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Open Raw High-Res Link */}
                  {currentCad && (
                    <a
                      href={currentCad.dwgUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-white/70 hover:text-cyan-300 hover:bg-white/10 border border-white/10 rounded-xl transition-colors cursor-pointer"
                      title="Open High-Resolution Blueprint Image in New Tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Main Interactive CAD Stage */}
              <div
                className={`relative flex-1 overflow-hidden select-none cursor-grab active:cursor-grabbing min-h-[360px] sm:min-h-[440px] flex items-center justify-center ${
                  cadTheme === "blueprint"
                    ? "bg-[#061527] bg-[radial-gradient(#1e3a5f_1px,transparent_1px)] [background-size:24px_24px]"
                    : "bg-[#181a20] bg-[radial-gradient(#2d3342_1px,transparent_1px)] [background-size:20px_20px]"
                }`}
                onWheel={handleCadWheel}
                onMouseDown={handleCadMouseDown}
                onMouseMove={handleCadMouseMove}
                onMouseUp={handleCadMouseUp}
                onMouseLeave={handleCadMouseUp}
              >
                {/* Viewfinder Reticles */}
                <span className="pointer-events-none absolute left-4 top-4 z-10 h-5 w-5 border-l-2 border-t-2 border-cyan-400/40" />
                <span className="pointer-events-none absolute right-4 top-4 z-10 h-5 w-5 border-r-2 border-t-2 border-cyan-400/40" />
                <span className="pointer-events-none absolute left-4 bottom-4 z-10 h-5 w-5 border-l-2 border-b-2 border-cyan-400/40" />
                <span className="pointer-events-none absolute right-4 bottom-4 z-10 h-5 w-5 border-r-2 border-b-2 border-cyan-400/40" />

                {/* Engineering Blueprint Watermark & Stamp */}
                <div className="absolute top-4 left-6 z-10 pointer-events-none">
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-400/30">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <div>
                      <span className="text-[10px] font-mono font-bold text-cyan-300 block tracking-wider uppercase">
                        {currentCad?.sheetNo || "CAD DWG"} • {currentCad?.scale || "1:50"}
                      </span>
                      <span className="text-[9px] text-white/50 font-mono block">
                        {currentCad?.approvalStatus || "IS 456 Structural Verified"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Scale Bar Indicator in Bottom Left */}
                <div className="absolute bottom-4 left-6 z-10 pointer-events-none hidden sm:flex flex-col bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 font-mono text-[9px] text-white/60">
                  <span className="text-[8px] text-cyan-400 font-bold uppercase tracking-widest mb-0.5">Scale Bar</span>
                  <div className="flex items-center gap-1">
                    <span>0m</span>
                    <div className="w-16 h-1.5 border border-cyan-400/70 bg-gradient-to-r from-cyan-400 via-transparent to-cyan-400"></div>
                    <span>5m</span>
                    <div className="w-16 h-1.5 border border-cyan-400/70 bg-gradient-to-r from-cyan-400 via-transparent to-cyan-400"></div>
                    <span>10m</span>
                  </div>
                </div>

                {/* Hint banner */}
                <div className="absolute bottom-4 right-6 z-10 pointer-events-none text-right hidden md:block">
                  <span className="text-[10px] font-mono text-white/40 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10">
                    Drag to Pan • Scroll to Zoom ({Math.round(cadZoom * 100)}%)
                  </span>
                </div>

                {/* The CAD Drawing Canvas Image with Transform */}
                {currentCad ? (
                  <div
                    style={{
                      transform: `translate(${cadPan.x}px, ${cadPan.y}px) scale(${cadZoom})`,
                      transition: isCadDragging ? "none" : "transform 0.15s ease-out",
                      transformOrigin: "center center"
                    }}
                    className="relative max-w-full max-h-full p-6 flex items-center justify-center transition-all"
                  >
                    <div
                      className={`relative rounded-xl overflow-hidden shadow-2xl border transition-all ${
                        cadTheme === "blueprint"
                          ? "border-cyan-400/50 shadow-[0_0_50px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400/30"
                          : "border-white/20 shadow-2xl"
                      }`}
                    >
                      <img
                        src={currentCad.dwgUrl}
                        alt={currentCad.title}
                        className={`max-w-[85vw] max-h-[62vh] object-contain transition-all ${
                          cadTheme === "blueprint"
                            ? "contrast-125 brightness-95 filter hue-rotate-15"
                            : "contrast-110"
                        }`}
                        draggable={false}
                      />

                      {/* Corner Title Block inside Blueprint */}
                      <div className="absolute bottom-2 right-2 bg-black/85 backdrop-blur-md border border-cyan-400/40 p-2 rounded-lg text-left font-mono text-[9px] pointer-events-none max-w-[220px]">
                        <span className="text-cyan-400 font-bold block uppercase truncate">DANAM HOLDINGS CIVIL EPC</span>
                        <span className="text-white/80 block truncate font-sans text-[10px] font-semibold">{project.title}</span>
                        <span className="text-white/50 block">{currentCad.sheetNo} • REV-03</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-white/50 font-mono text-xs">No CAD Blueprint Attached</div>
                )}
              </div>

              {/* Technical Blueprint Specifications Drawer */}
              {currentCad && (
                <div className="bg-[#0b101b] border-t border-white/10 p-4 sm:p-5 shrink-0">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                          {currentCad.sheetNo}
                        </span>
                        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {currentCad.approvalStatus}
                        </span>
                        <span className="text-xs font-mono text-white/50">
                          Scale: {currentCad.scale} • Dim: {currentCad.dimensions}
                        </span>
                      </div>
                      <h4 className="font-display text-sm sm:text-base font-bold text-white">
                        {currentCad.title}
                      </h4>
                      <p className="font-ui text-xs text-white/70 mt-1 leading-relaxed">
                        {currentCad.description}
                      </p>
                    </div>

                    {/* Quick Specs Badges */}
                    <div className="flex flex-wrap lg:flex-col gap-1.5 shrink-0 font-ui text-[11px] text-white/80">
                      {currentCad.keySpecs.map((spec, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span className="truncate max-w-[320px]">{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
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
