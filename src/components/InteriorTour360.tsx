"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Rotate3D,
  Compass,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronRight,
  Info,
  X,
  Play,
  Pause,
  MessageCircle,
  PhoneCall,
  CheckCircle2,
  BedDouble,
  Sofa,
  Utensils,
  Sunset
} from "lucide-react";

export interface Hotspot {
  id: string;
  title: string;
  category: string;
  desc: string;
  specs: string[];
  yaw: number; // in radians (-PI to +PI)
  pitch: number; // in radians (-PI/2 to +PI/2)
}

export interface Room360 {
  id: string;
  name: string;
  tag: string;
  icon: "sofa" | "bed" | "kitchen" | "terrace";
  title: string;
  subtitle: string;
  panoramaUrl: string;
  fallbackImage: string;
  specs: {
    area: string;
    ceiling: string;
    flooring: string;
    lighting: string;
    features: string;
  };
  highlights: string[];
  hotspots: Hotspot[];
}

const ROOMS_DATA: Room360[] = [
  {
    id: "living-room",
    name: "Living & Atrium",
    tag: "Double Height",
    icon: "sofa",
    title: "Grand Living & Dining Atrium",
    subtitle: "Expansive 480 sq.ft living lounge featuring a 14'6\" double-height ceiling, bookmatched Italian Statuario marble, and acoustic floor-to-ceiling glass envelopes.",
    panoramaUrl: "/panoramas/living-room.jpg",
    fallbackImage: "/images/danam/FFLiving-002.webp",
    specs: {
      area: "480 Sq.Ft Double Volume",
      ceiling: "14'6\" Clear Atrium Height",
      flooring: "Bookmatched Italian Statuario Marble",
      lighting: "Custom Chandelier + 3000K Indirect Cove",
      features: "Patio Pocket Sliders & Natural Courtyard"
    },
    highlights: [
      "Seismic shear wall core integrated with open-plan layout",
      "Concealed Daikin VRV air-conditioning ducts in false ceiling",
      "Acoustically laminated double-glaze glass reducing street noise by 38dB",
      "Vastu-aligned North-East morning sunlight orientation"
    ],
    hotspots: [
      {
        id: "marble-floor",
        title: "Bookmatched Italian Statuario Marble",
        category: "Floor Finishes",
        desc: "Hand-selected 20mm thick Italian marble slabs laid with zero-grout seamless diamond polishing and anti-stain nano-seal.",
        specs: ["20mm Calacatta/Statuario", "Epoxy Zero-Joint Filling", "Nano Hydrophobic Sealer"],
        yaw: 0.15,
        pitch: -0.52
      },
      {
        id: "chandelier",
        title: "Atrium Chandelier & False Ceiling",
        category: "Lighting Design",
        desc: "Architectural floating ceiling crafted from Saint-Gobain Gyproc with dimmable warm 3000K LED coves and central brass chandelier.",
        specs: ["Saint-Gobain Gyproc Sheet", "Philips DALI Smart Dimming", "3000K Warm Glow"],
        yaw: -0.22,
        pitch: 0.42
      },
      {
        id: "glass-wall",
        title: "Acoustic Double-Glazed Glass Walls",
        category: "Fenestration",
        desc: "Heavy-duty thermal-break aluminum sliders with 6mm + 12mm Argon + 6mm toughened DGU glass for acoustic silence and thermal insulation.",
        specs: ["Thermal-Break Aluminum", "38dB Sound Cutoff", "Low-E Heat Reflective"],
        yaw: 1.15,
        pitch: 0.05
      },
      {
        id: "teak-louvers",
        title: "Burma Teak Acoustic Louvers",
        category: "Wall Paneling",
        desc: "Seasoned Grade-A Burma teak wood slats with acoustic backing fabric to prevent echo in the grand atrium.",
        specs: ["100% Genuine Burma Teak", "Acoustic Rockwool Core", "PU Matte Clear Polish"],
        yaw: -1.35,
        pitch: 0.12
      }
    ]
  },
  {
    id: "master-bedroom",
    name: "Master Suite",
    tag: "King Sanctuary",
    icon: "bed",
    title: "Presidential Master Suite with Balcony",
    subtitle: "Private luxury retreat finished with fluted Burma teak accents, herringbone natural oak flooring, walk-in dressing portal, and a sunrise-facing terrace.",
    panoramaUrl: "/panoramas/master-bedroom.jpg",
    fallbackImage: "/images/danam/about-villa.webp",
    specs: {
      area: "360 Sq.Ft + 90 Sq.Ft Balcony",
      ceiling: "10'6\" Flush Gypsum with Magnetic Tracks",
      flooring: "Herringbone Natural Oak Wood Plank",
      lighting: "4-Scene Smart Mood Touch Dimming",
      features: "Integrated Walk-in Wardrobe & Sunrise Balcony"
    },
    highlights: [
      "Sound-damped party walls ensuring 45dB acoustic bedroom privacy",
      "Motorized dual blackout and sheer motorized curtain tracks",
      "Concealed master distribution board with surge protection",
      "Direct walk-out access to private morning sunrise balcony"
    ],
    hotspots: [
      {
        id: "teak-headboard",
        title: "Fluted Burma Teak Feature Wall",
        category: "Interior Carpentry",
        desc: "Custom CNC-machined fluted Burma teak wall with integrated brass reading sconces and flush bedside touch controls.",
        specs: ["Seasoned Teak Timber", "Integrated Wireless Charging", "Brass Accent Trims"],
        yaw: 0.05,
        pitch: 0.08
      },
      {
        id: "dressing-portal",
        title: "Walk-in Wardrobe & Vanity Portal",
        category: "Wardrobe Suite",
        desc: "Floor-to-ceiling tinted fluted glass wardrobes with motion-sensor interior warm LED illumination and Italian pull-out organizers.",
        specs: ["Fluted Toughened Glass", "Hafele Soft-Close Hardware", "Dehumidified Jewelry Vault"],
        yaw: 1.42,
        pitch: -0.08
      },
      {
        id: "sunrise-slider",
        title: "Full-Height Sunrise Balcony Slider",
        category: "Open Enclosure",
        desc: "Full-height 9-foot sliding glass doors leading directly to a private morning tea terrace overlooking the garden.",
        specs: ["9' High Clear Glass", "SS304 Heavy Rollers", "Integrated Bug Mesh"],
        yaw: -1.25,
        pitch: 0.1
      }
    ]
  },
  {
    id: "modular-kitchen",
    name: "Modular Kitchen",
    tag: "German Blum",
    icon: "kitchen",
    title: "Modular Island Kitchen & Breakfast Lounge",
    subtitle: "Precision-engineered German modular kitchen with seamless quartz waterfall island, built-in induction & gas burners, and Vastu-compliant Agni corner layout.",
    panoramaUrl: "/panoramas/modular-kitchen.jpg",
    fallbackImage: "/images/danam/hh1.webp",
    specs: {
      area: "240 Sq.Ft Ergonomic Layout",
      ceiling: "10'0\" Moisture-Resistant POP Finish",
      flooring: "Anti-Skid Matte Porcelain 1200x600mm",
      lighting: "Under-Cabinet 4000K High-CRI Task Strips",
      features: "German Blum Soft-Close & Dual Island Stools"
    },
    highlights: [
      "100% Vastu-compliant South-East (Agni) cooking direction",
      "Heavy-duty marine-grade BWR plywood core with anti-termite guarantee",
      "Seamless 20mm composite quartz countertop resistant to stains and heat",
      "Dedicated high-suction 1400 m³/hr chimney duct routed directly outside"
    ],
    hotspots: [
      {
        id: "quartz-island",
        title: "Quartz Waterfall Breakfast Island",
        category: "Kitchen Island",
        desc: "Calacatta Gold engineered quartz island with 45-degree mitered waterfall drop and breakfast seating for 4.",
        specs: ["20mm Solid Quartz", "Non-Porous Stain Free", "Dual Power Pop-up Tower"],
        yaw: -0.05,
        pitch: -0.42
      },
      {
        id: "blum-cabinets",
        title: "German Blum Soft-Close Hardware",
        category: "Cabinetry",
        desc: "Lifetime-warranted Blum Legrabox drawers and Aventos lift-up overhead shutters tested for 200,000 motion cycles.",
        specs: ["Blum Legrabox Pure", "Aventos HF Lift Systems", "Matte Anti-Fingerprint Acrylic"],
        yaw: -1.18,
        pitch: 0.18
      },
      {
        id: "chimney-zone",
        title: "Vastu Agni Hob & High-Flow Hood",
        category: "Cooking Zone",
        desc: "Baffle-filter 1400 m³/hr kitchen chimney positioned over a 4-burner brass flame hob designed for Indian wok cooking.",
        specs: ["1400 m³/hr Airflow", "Heat Auto-Clean", "Dedicated Exhaust Shaft"],
        yaw: 1.25,
        pitch: -0.05
      }
    ]
  },
  {
    id: "sky-terrace",
    name: "Sky Terrace",
    tag: "Outdoor Deck",
    icon: "terrace",
    title: "Private Rooftop Sky Deck & Lounge",
    subtitle: "Open-air luxury sky lounge equipped with weatherproof composite teak decking, frameless glass balustrades, ambient deck lighting, and panoramic skyline vistas.",
    panoramaUrl: "/panoramas/sky-terrace.jpg",
    fallbackImage: "/images/danam/hh4.webp",
    specs: {
      area: "520 Sq.Ft Open Decking",
      ceiling: "Open Sky with Pergola Shading",
      flooring: "Weatherproof WPC Teak Deck with Drip Channels",
      lighting: "12V Low-Voltage Step Lights & Planter Ambience",
      features: "Frameless Glass Railing & Sunset Skyline View"
    },
    highlights: [
      "Brick-bat coba and 5-layer elastomeric waterproofing membrane underneath",
      "12mm toughened laminated glass railing tested for 1.5 kN wind pressure",
      "Automated drip-irrigation line for exotic ornamental planters",
      "Structural floor loading designed for optional 6-seater rooftop Jacuzzi"
    ],
    hotspots: [
      {
        id: "glass-railing",
        title: "Frameless Toughened Glass Balustrade",
        category: "Safety Railing",
        desc: "12mm laminated clear toughened safety glass anchored with marine-grade SS316 spigots for uninterrupted 360° views.",
        specs: ["12mm Laminated Glass", "SS316 Marine Spigots", "Wind Tested to 140 km/h"],
        yaw: 0.22,
        pitch: -0.12
      },
      {
        id: "wpc-deck",
        title: "Weatherproof Composite Teak Decking",
        category: "Deck Flooring",
        desc: "UV-stabilized wood-plastic composite decking with hidden clip fastening and sub-floor drainage channels.",
        specs: ["Zero Warping / Splintering", "Slip-Resistant Grain", "15-Year Weather Warranty"],
        yaw: -0.48,
        pitch: -0.58
      },
      {
        id: "planter-wall",
        title: "Integrated Drip Irrigation Planters",
        category: "Terrace Landscape",
        desc: "Lightweight FRP planters with automated timer drip system and drainage to keep the rooftop garden lush year-round.",
        specs: ["Automated Drip Timer", "FRP Waterproof Planters", "Eco Root Barrier"],
        yaw: 1.35,
        pitch: 0.12
      }
    ]
  }
];

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
varying vec2 v_uv;

#define PI 3.14159265358979323846

void main() {
  vec2 screen = (v_uv - 0.5) * 2.0;
  float tanHalfFov = tan(u_fov * 0.5);
  vec3 ray = normalize(vec3(screen.x * tanHalfFov * u_aspect, -screen.y * tanHalfFov, 1.0));

  // Pitch rotation (X axis)
  float cp = cos(u_pitch);
  float sp = sin(u_pitch);
  vec3 rPitch = vec3(
    ray.x,
    ray.y * cp - ray.z * sp,
    ray.y * sp + ray.z * cp
  );

  // Yaw rotation (Y axis)
  float cy = cos(u_yaw);
  float sy = sin(u_yaw);
  vec3 rYaw = vec3(
    rPitch.x * cy + rPitch.z * sy,
    rPitch.y,
    -rPitch.x * sy + rPitch.z * cy
  );

  // Convert ray to spherical coordinates
  float lon = atan(rYaw.x, rYaw.z);
  float lat = asin(clamp(rYaw.y, -0.9999, 0.9999));

  vec2 texCoord = vec2(
    fract(lon / (2.0 * PI) + 0.5),
    clamp(lat / PI + 0.5, 0.001, 0.999)
  );

  gl_FragColor = texture2D(u_image, texCoord);
}
`;

export default function InteriorTour360() {
  const [activeRoomIndex, setActiveRoomIndex] = useState<number>(0);
  const [yaw, setYaw] = useState<number>(0); // radians
  const [pitch, setPitch] = useState<number>(0); // radians (-0.7 to 0.7)
  const [fov, setFov] = useState<number>(1.25); // ~72 degrees
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [isLoadingTexture, setIsLoadingTexture] = useState<boolean>(true);
  const [showGestureGuide, setShowGestureGuide] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
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

  // Keep refs in sync for 60fps render loop
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

  const activeRoom = ROOMS_DATA[activeRoomIndex];

  // Helper: Create fallback procedural architectural grid canvas texture
  const createFallbackTexture = useCallback((): HTMLCanvasElement => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 512;
    const ctx = c.getContext("2d");
    if (!ctx) return c;

    // Rich luxury dark interior gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, "#12151b");
    grad.addColorStop(0.5, "#1e2430");
    grad.addColorStop(1, "#0d0f14");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Warm architectural ambient lights
    ctx.fillStyle = "rgba(197, 168, 128, 0.15)";
    ctx.beginPath();
    ctx.arc(512, 160, 220, 0, Math.PI * 2);
    ctx.fill();

    // Perspective floor lines
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

  // WebGL initialization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { antialias: true, alpha: false });
    if (!gl) {
      console.warn("WebGL not supported, fallback active");
      return;
    }
    glRef.current = gl;

    // Compile Shader helper
    const compileShader = (type: number, src: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile err:", gl.getShaderInfoLog(shader));
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
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Program link err:", gl.getProgramInfoLog(prog));
      return;
    }
    programRef.current = prog;
    gl.useProgram(prog);

    // Full screen quad buffer [-1, -1] to [1, 1]
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

    // Initial placeholder texture
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      createFallbackTexture()
    );
    textureRef.current = tex;

    // Render loop
    let lastTime = performance.now();
    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // Auto rotation cruise when not dragging
      if (autoRotateRef.current && !isDraggingRef.current) {
        yawRef.current = (yawRef.current + 0.12 * dt) % (Math.PI * 2);
        setYaw(yawRef.current);
      }

      // Resize canvas to match display client size
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayW = Math.round(canvas.clientWidth * dpr);
      const displayH = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== displayW || canvas.height !== displayH) {
        canvas.width = displayW;
        canvas.height = displayH;
        gl.viewport(0, 0, displayW, displayH);
      }

      const aspect = canvas.width / (canvas.height || 1);

      gl.useProgram(prog);
      gl.uniform1f(gl.getUniformLocation(prog, "u_yaw"), yawRef.current);
      gl.uniform1f(gl.getUniformLocation(prog, "u_pitch"), pitchRef.current);
      gl.uniform1f(gl.getUniformLocation(prog, "u_fov"), fovRef.current);
      gl.uniform1f(gl.getUniformLocation(prog, "u_aspect"), aspect);
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
    };
  }, [createFallbackTexture]);

  // Load new room panorama texture when room changes
  useEffect(() => {
    setIsLoadingTexture(true);
    setSelectedHotspot(null);
    const gl = glRef.current;
    if (!gl) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = activeRoom.panoramaUrl;

    const onTextureReady = (source: HTMLImageElement | HTMLCanvasElement) => {
      if (!glRef.current || !textureRef.current) return;
      const g = glRef.current;
      g.bindTexture(g.TEXTURE_2D, textureRef.current);

      // WebGL 1.0 mandates Power-of-Two dimensions to prevent black textures on NPOT images
      const potCanvas = document.createElement("canvas");
      potCanvas.width = 2048;
      potCanvas.height = 1024;
      const ctx = potCanvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(source, 0, 0, 2048, 1024);
        g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, potCanvas);
      } else {
        g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, source);
      }

      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
      setIsLoadingTexture(false);
    };

    img.onload = () => {
      onTextureReady(img);
    };

    img.onerror = () => {
      // If generated panorama is still downloading, load fallback room image onto canvas
      const fallbackImg = new Image();
      fallbackImg.crossOrigin = "anonymous";
      fallbackImg.src = activeRoom.fallbackImage;
      fallbackImg.onload = () => {
        // Draw onto a 2:1 canvas to format as panoramic texture
        const c = document.createElement("canvas");
        c.width = 1600;
        c.height = 800;
        const ctx = c.getContext("2d");
        if (ctx) {
          ctx.drawImage(fallbackImg, 0, 0, 1600, 800);
          onTextureReady(c);
        }
      };
      fallbackImg.onerror = () => {
        onTextureReady(createFallbackTexture());
      };
    };
  }, [activeRoomIndex, activeRoom.panoramaUrl, activeRoom.fallbackImage, createFallbackTexture]);

  // Mouse & Touch Drag interactions
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
    // Yaw wraps 360 infinitely
    let nextYaw = (yawRef.current - dx * sensitivity) % (Math.PI * 2);
    if (nextYaw < 0) nextYaw += Math.PI * 2;

    // Pitch clamped to prevent pole flip (-68 deg to +68 deg)
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

  // Zoom controls
  const zoomIn = () => {
    setFov((prev) => Math.max(0.75, prev - 0.15)); // down to ~43 deg
  };

  const zoomOut = () => {
    setFov((prev) => Math.min(1.65, prev + 0.15)); // up to ~95 deg
  };

  const resetView = () => {
    setYaw(0);
    setPitch(0);
    setFov(1.25);
    setAutoRotate(true);
    yawRef.current = 0;
    pitchRef.current = 0;
    fovRef.current = 1.25;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Project Hotspot into screen coordinates
  const getHotspotScreenPos = (hs: Hotspot) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return null;

    const aspect = width / height;
    const currentYaw = yawRef.current;
    const currentPitch = pitchRef.current;
    const currentFov = fovRef.current;

    let deltaYaw = hs.yaw - currentYaw;
    while (deltaYaw > Math.PI) deltaYaw -= 2 * Math.PI;
    while (deltaYaw < -Math.PI) deltaYaw += 2 * Math.PI;

    const deltaPitch = hs.pitch - currentPitch;
    const halfFovX = (currentFov * 0.5) * aspect;
    const halfFovY = currentFov * 0.5;

    // Hotspot visible check
    if (Math.abs(deltaYaw) > halfFovX + 0.15 || Math.abs(deltaPitch) > halfFovY + 0.15) {
      return null;
    }

    const tanHalfFov = Math.tan(currentFov * 0.5);
    const tanHalfFovX = tanHalfFov * aspect;

    const screenX = (width * 0.5) + (Math.tan(deltaYaw) / tanHalfFovX) * (width * 0.5);
    const screenY = (height * 0.5) - (Math.tan(deltaPitch) / tanHalfFov) * (height * 0.5);

    if (screenX < 20 || screenX > width - 20 || screenY < 20 || screenY > height - 20) {
      return null;
    }

    return { x: screenX, y: screenY };
  };

  // Compass Heading calculation
  const getCompassHeading = () => {
    const degrees = Math.round(((yawRef.current * 180) / Math.PI) % 360);
    const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(degrees / 45) % 8;
    return `${dirs[index]} ${degrees}°`;
  };

  const handleOpenLeadModal = () => {
    window.dispatchEvent(new CustomEvent("open-lead-modal"));
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(
      `Hi Danam Holdings, I was exploring the 360° Interior Room Tour of the ${activeRoom.title} and would like to discuss interior fit-outs and structural planning for my project.`
    );
    window.open(`https://wa.me/918110006913?text=${text}`, "_blank");
  };

  return (
    <section
      id="interior-360-tour"
      ref={containerRef}
      className={`py-12 sm:py-16 bg-[#07090d] border-b border-border-subtle relative overflow-hidden select-none ${
        isFullscreen ? "fixed inset-0 z-50 p-0 m-0 rounded-none bg-black" : ""
      }`}
    >
      {/* Background radial atmosphere */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-brand-forest/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className={`${isFullscreen ? "h-full w-full p-4 flex flex-col justify-between" : "max-w-6xl mx-auto px-4 sm:px-8"} relative z-10`}>
        
        {/* Section Header (Hidden in Fullscreen) */}
        {!isFullscreen && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-brand-forest/15 border border-brand-forest/30 text-brand-leaf-light text-xs font-bold uppercase tracking-wider mb-2.5">
                <Rotate3D className="w-3.5 h-3.5 animate-spin-slow text-amber-400" />
                <span>360° Immersive Interior Walkthrough</span>
              </div>
              <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight text-white">
                Step Inside Your Landmark Building
              </h2>
              <p className="font-ui text-xs md:text-sm text-white/70 max-w-2xl mt-1.5 leading-relaxed">
                Walk through every key room before ground-break. Orbit 360° horizontally & vertically to inspect spatial volumes, natural light, and luxury civil finishes.
              </p>
            </div>

            {/* Room Selector Pills (Desktop & Mobile Horizontal Scroll) */}
            <div className="flex items-center bg-[#0d1117] border border-white/15 p-1 rounded-2xl shadow-xl overflow-x-auto max-w-full gap-1">
              {ROOMS_DATA.map((room, idx) => {
                const isActive = activeRoomIndex === idx;
                return (
                  <button
                    key={room.id}
                    onClick={() => {
                      setActiveRoomIndex(idx);
                      resetView();
                    }}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-ui text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-brand-forest text-white shadow-lg ring-1 ring-white/20"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {room.icon === "sofa" && <Sofa className="w-3.5 h-3.5 text-amber-300" />}
                    {room.icon === "bed" && <BedDouble className="w-3.5 h-3.5 text-amber-300" />}
                    {room.icon === "kitchen" && <Utensils className="w-3.5 h-3.5 text-amber-300" />}
                    {room.icon === "terrace" && <Sunset className="w-3.5 h-3.5 text-amber-300" />}
                    <span>{room.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono uppercase ${
                      isActive ? "bg-white/20 text-white" : "bg-white/5 text-white/40"
                    }`}>
                      {room.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main 360 Panoramic Stage */}
        <div className="relative w-full bg-[#0a0a0d] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
          
          {/* Viewport Container */}
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
            className={`relative w-full overflow-hidden bg-black cursor-grab active:cursor-grabbing select-none ${
              isFullscreen ? "h-[calc(100vh-140px)]" : "h-[380px] sm:h-[460px] lg:h-[520px]"
            }`}
            style={{ touchAction: "none" }}
          >
            {/* Native WebGL 360 Canvas */}
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Corner Architectural Viewfinder Reticles */}
            <span className="pointer-events-none absolute left-4 top-4 z-20 h-4 w-4 border-l border-t border-white/40" />
            <span className="pointer-events-none absolute right-4 top-4 z-20 h-4 w-4 border-r border-t border-white/40" />
            <span className="pointer-events-none absolute left-4 bottom-4 z-20 h-4 w-4 border-l border-b border-white/40" />
            <span className="pointer-events-none absolute right-4 bottom-4 z-20 h-4 w-4 border-r border-b border-white/40" />

            {/* Top-Left: Active Room Badge & Compass Heading */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none select-none">
              <div className="bg-[#0b0e14]/90 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-white text-xs font-mono flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-amber-300 uppercase tracking-wider">{activeRoom.name}</span>
                <span className="text-white/30">|</span>
                <span className="text-white/70 flex items-center gap-1 text-[11px]">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  {getCompassHeading()}
                </span>
              </div>
            </div>

            {/* Top-Right: Quick Control HUD (Auto Cruise, Zoom, Fullscreen) */}
            <div className="absolute top-4 right-4 z-25 flex items-center gap-1.5 bg-[#0b0e14]/90 backdrop-blur-md border border-white/20 p-1 rounded-2xl shadow-xl pointer-events-auto select-none">
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                  autoRotate
                    ? "bg-brand-forest text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
                title="Toggle Auto Rotation Cruise"
              >
                {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="text-[11px] uppercase hidden sm:inline">{autoRotate ? "Cruising" : "Cruise"}</span>
              </button>

              <button
                onClick={zoomOut}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <button
                onClick={zoomIn}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <button
                onClick={resetView}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
                title="Reset View"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Gesture Guide Hint (Dismisses on first drag) */}
            {showGestureGuide && (
              <div
                onClick={() => setShowGestureGuide(false)}
                className="absolute inset-0 z-30 flex items-center justify-center pointer-events-auto cursor-grab select-none bg-black/30 backdrop-blur-xs transition-opacity duration-500"
              >
                <div className="bg-[#0b0e14]/90 border border-white/25 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
                  <div className="p-2 rounded-xl bg-brand-forest/20 text-brand-leaf-light border border-brand-forest/30">
                    <Rotate3D className="w-5 h-5 animate-spin-slow" />
                  </div>
                  <div>
                    <h5 className="text-white text-xs font-bold uppercase tracking-wider">Drag to look 360° around the room</h5>
                    <p className="text-white/60 text-[11px] mt-0.5">Horizontal 360° orbit · Vertical tilt · Tap pins for specs</p>
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono uppercase bg-amber-400/10 px-2 py-1 rounded-md border border-amber-400/20">
                    Tap to start
                  </span>
                </div>
              </div>
            )}

            {/* Interactive Hotspot Pins Rendered on Top of Canvas */}
            {activeRoom.hotspots.map((hs) => {
              const pos = getHotspotScreenPos(hs);
              if (!pos) return null;
              const isSelected = selectedHotspot?.id === hs.id;

              return (
                <div
                  key={hs.id}
                  style={{
                    position: "absolute",
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    transform: "translate(-50%, -50%)",
                    zIndex: isSelected ? 40 : 25
                  }}
                  className="pointer-events-auto"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedHotspot(isSelected ? null : hs);
                    }}
                    className={`group relative flex items-center justify-center cursor-pointer transition-transform duration-300 ${
                      isSelected ? "scale-125" : "hover:scale-115"
                    }`}
                  >
                    {/* Pulsing Outer Glow */}
                    <span className="absolute -inset-2 rounded-full bg-amber-400/30 animate-ping pointer-events-none" />
                    
                    {/* Pin Circle */}
                    <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 border-2 border-white shadow-xl flex items-center justify-center text-stone-900">
                      <Sparkles className="w-3.5 h-3.5 text-stone-950 stroke-[2.5]" />
                    </div>

                    {/* Tooltip Pill */}
                    <div className="absolute left-8 top-1/2 -translate-y-1/2 bg-[#0b0e14]/95 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider whitespace-nowrap shadow-xl pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity">
                      <span>{hs.title}</span>
                    </div>
                  </button>
                </div>
              );
            })}

            {/* Hotspot Detailed Popover Card */}
            {selectedHotspot && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-5 left-5 right-5 sm:left-6 sm:right-auto sm:max-w-md z-45 bg-[#0d1117]/95 backdrop-blur-xl border border-white/25 p-5 rounded-2xl shadow-2xl text-white select-text transition-all animate-in fade-in slide-in-from-bottom-4 duration-300"
              >
                <div className="flex justify-between items-start gap-3 mb-2">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 text-[10px] font-mono uppercase font-bold tracking-wider">
                      {selectedHotspot.category}
                    </span>
                    <h4 className="font-display text-base font-bold text-white mt-1">
                      {selectedHotspot.title}
                    </h4>
                  </div>
                  <button
                    onClick={() => setSelectedHotspot(null)}
                    className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="font-ui text-xs text-white/80 leading-relaxed mb-3">
                  {selectedHotspot.desc}
                </p>

                {/* Tech Specs tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {selectedHotspot.specs.map((sp, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-mono text-emerald-300"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{sp}</span>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <button
                    onClick={handleOpenLeadModal}
                    className="flex-1 bg-brand-forest hover:bg-brand-forest-dark text-white text-xs font-bold py-2 px-3 rounded-xl uppercase tracking-wider transition-colors text-center cursor-pointer shadow-md"
                  >
                    Inquire for My Plan
                  </button>
                  <button
                    onClick={handleOpenWhatsApp}
                    className="p-2 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 rounded-xl transition-colors cursor-pointer"
                    title="Ask on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Floating Info Pill */}
            <div className="absolute bottom-4 right-4 z-20 pointer-events-none select-none hidden sm:flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-white/60 text-[10px] font-mono">
              <Info className="w-3 h-3 text-amber-400" />
              <span>FOV: {Math.round((fov * 180) / Math.PI)}° · Drag to Orbit · Click Golden Pins for Specs</span>
            </div>
          </div>

          {/* Sub-bar: Engineering Specs & Consultation Row */}
          <div className="bg-[#0b0e14] p-4 sm:px-6 border-t border-white/15 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            
            {/* Quick Specs Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto text-xs font-ui">
              <div>
                <span className="text-white/40 block text-[10px] uppercase font-mono tracking-wider">Usable Volume</span>
                <span className="font-bold text-white text-xs">{activeRoom.specs.area}</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px] uppercase font-mono tracking-wider">Ceiling Clear</span>
                <span className="font-bold text-amber-300 text-xs">{activeRoom.specs.ceiling}</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px] uppercase font-mono tracking-wider">Flooring Base</span>
                <span className="font-bold text-white text-xs truncate block max-w-[150px]">{activeRoom.specs.flooring}</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px] uppercase font-mono tracking-wider">Lighting Mode</span>
                <span className="font-bold text-emerald-300 text-xs truncate block max-w-[150px]">{activeRoom.specs.lighting}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
              <button
                onClick={handleOpenLeadModal}
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-forest hover:bg-brand-forest-dark text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                <span>Customize Interior Plan</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleOpenWhatsApp}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all cursor-pointer"
                title="Consult with Interior Engineer"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
