"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Rotate3D,
  Sparkles,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Compass,
  ArrowRight,
  ExternalLink,
  Info,
  Camera,
  FileText,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Palette,
  Lightbulb,
  Moon,
  DoorOpen,
  MapPin,
  X,
  Building2,
  Eye,
  Maximize2
} from "lucide-react";

export interface ProjectHotspot {
  id: string;
  number: number;
  title: string;
  category: string;
  position: string;
  normal: string;
  specs: string;
  materials: string[];
  focusOrbit?: string;
  focusTarget?: string;
}

export interface Project3DItem {
  id: string;
  title: string;
  tagline: string;
  category: "Residential Villa" | "Commercial Complex" | "Turnkey EPC";
  location: string;
  builtUpArea: string;
  glbModel: string;
  thumbnail: string;
  author: string;
  cameraTarget?: string;
  cameraOrbit?: string;
  interiorCameraTarget?: string;
  interiorCameraOrbit?: string;
  specs: {
    structure: string;
    steel: string;
    concrete: string;
    vastu: string;
    floors: string;
    handoverTime: string;
  };
  highlights: string[];
  hotspots: ProjectHotspot[];
}

export interface DualColorTheme {
  id: string;
  name: string;
  primaryLabel: string;
  accentLabel: string;
  primaryHex: string;
  primaryRGBA: [number, number, number, number];
  accentHex: string;
  accentRGBA: [number, number, number, number];
  tag: string;
}

export const DUAL_COLOR_THEMES: DualColorTheme[] = [
  {
    id: "white-charcoal",
    name: "Alpine & Charcoal",
    primaryLabel: "Alpine White",
    accentLabel: "Charcoal Slate",
    primaryHex: "#F5F6F4",
    primaryRGBA: [0.96, 0.96, 0.95, 1.0],
    accentHex: "#2B2E33",
    accentRGBA: [0.17, 0.18, 0.20, 1.0],
    tag: "High Contrast"
  },
  {
    id: "sand-teak",
    name: "Sand & Burma Teak",
    primaryLabel: "Sand Beige",
    accentLabel: "Burma Teak",
    primaryHex: "#DDD0B8",
    primaryRGBA: [0.86, 0.81, 0.72, 1.0],
    accentHex: "#4A3525",
    accentRGBA: [0.29, 0.21, 0.15, 1.0],
    tag: "Tropical Warmth"
  },
  {
    id: "ivory-terracotta",
    name: "Ivory & Terracotta",
    primaryLabel: "Ivory Travertine",
    accentLabel: "Earthy Clay",
    primaryHex: "#EAE3D2",
    primaryRGBA: [0.92, 0.89, 0.82, 1.0],
    accentHex: "#A85338",
    accentRGBA: [0.66, 0.33, 0.22, 1.0],
    tag: "Heritage Fusion"
  },
  {
    id: "greige-obsidian",
    name: "Greige & Obsidian",
    primaryLabel: "Slate Greige",
    accentLabel: "Obsidian Black",
    primaryHex: "#B8BCBA",
    primaryRGBA: [0.72, 0.74, 0.73, 1.0],
    accentHex: "#1F2224",
    accentRGBA: [0.12, 0.13, 0.14, 1.0],
    tag: "Urban Minimal"
  },
  {
    id: "frost-steel",
    name: "Frost & Steel Navy",
    primaryLabel: "Nordic Frost",
    accentLabel: "Steel Blue",
    primaryHex: "#E4E7E8",
    primaryRGBA: [0.89, 0.91, 0.91, 1.0],
    accentHex: "#2E3D48",
    accentRGBA: [0.18, 0.24, 0.28, 1.0],
    tag: "Modern Coastal"
  },
  {
    id: "champagne-emerald",
    name: "Pearl & Danam Emerald",
    primaryLabel: "Pearl Cream",
    accentLabel: "Forest Emerald",
    primaryHex: "#F0EDE4",
    primaryRGBA: [0.94, 0.93, 0.89, 1.0],
    accentHex: "#1B3B18",
    accentRGBA: [0.11, 0.23, 0.09, 1.0],
    tag: "Danam Signature"
  }
];

// Config array: standalone .glb models loaded via @google/model-viewer (100% white-label, zero Sketchfab overlays)
export const PROJECT_3D_LIST: Project3DItem[] = [
  {
    id: "modern-villa-g1",
    title: "Modern Villa G+1 (Client Elevation)",
    tagline: "Contemporary two-storey architectural residence with Gate #25 designer elevation & tinted glass facade",
    category: "Residential Villa",
    location: "Koodal Nagar / Sikandar Chavadi, Madurai",
    builtUpArea: "3,200 Sq.Ft (G+1)",
    glbModel: "/models/modern_villa_g1.glb",
    thumbnail: "/images/danam/FFLiving-002.webp",
    author: "Client Project Elevation (SketchUp 2026)",
    cameraTarget: "auto auto auto",
    cameraOrbit: "28deg 74deg 92%",
    interiorCameraTarget: "0.2m 0.55m 0.15m",
    interiorCameraOrbit: "10deg 85deg 0.8m",
    specs: {
      structure: "Engineered RCC Column-Beam Seismic Zone-III Frame",
      steel: "Fe550D High-Ductility TMT Rebars",
      concrete: "Ultratech M25 Ready-Mix Concrete Matrix",
      vastu: "100% Vastu-Compliant East Entrance & North-East Water Body",
      floors: "G+1 Floors with Double-Height Facade Glazing",
      handoverTime: "150 Days Handover Guarantee"
    },
    highlights: [
      "Designer boundary wall with Gate #25 architectural integration",
      "Expansive floor-to-ceiling tinted glass facade for optimal daylight",
      "Upper level cantilevered balcony deck with privacy louvers",
      "Waterproofing & thermal insulation across all roof terraces"
    ],
    hotspots: [
      {
        id: "gate-25",
        number: 1,
        title: "Gate #25 Architectural Entrance",
        category: "Civil Elevation & Fabrication",
        position: "-0.7m 0.35m 0.5m",
        normal: "0m 0m 1m",
        specs: "Heavy-gauge designer MS fabrication with anti-rust zinc primer, teak texture inlays, and automated sliding motor conduit.",
        materials: ["IS 2062 Grade Steel", "Reinforced M25 Gate Pillars", "Concealed Motor Provision"],
        focusOrbit: "15deg 80deg 50%",
        focusTarget: "-0.7m 0.35m 0.5m"
      },
      {
        id: "facade-glazing",
        number: 2,
        title: "Floor-to-Ceiling Tinted Glazing",
        category: "Fenestration & Thermal Insulation",
        position: "0.35m 0.65m 0.35m",
        normal: "0m 0m 1m",
        specs: "Saint-Gobain double-glazed toughened solar glass (35dB acoustic noise cutoff, 78% UV rejection) with architectural mullions.",
        materials: ["Saint-Gobain Solar Control", "35dB Acoustic Cutoff", "Heavy Powder-Coat Aluminum"],
        focusOrbit: "30deg 75deg 55%",
        focusTarget: "0.35m 0.65m 0.35m"
      },
      {
        id: "balcony-louvers",
        number: 3,
        title: "Cantilever Balcony Deck & Louvers",
        category: "Structural RCC & Facade",
        position: "-0.45m 0.85m 0.35m",
        normal: "0m 0m 1m",
        specs: "Engineered RCC projection with privacy vertical louvers, LED deck soffits, and 12mm toughened glass safety railing.",
        materials: ["Fe550D TMT Reinforcement", "Weatherproof Louvers", "12mm Toughened Glass"],
        focusOrbit: "-10deg 70deg 55%",
        focusTarget: "-0.45m 0.85m 0.35m"
      },
      {
        id: "courtyard-pool",
        number: 4,
        title: "Courtyard Water Feature & Pool",
        category: "Landscape & Waterproofing",
        position: "0.65m 0.18m 0.45m",
        normal: "0m 1m 0m",
        specs: "Reinforced concrete leisure pool with turquoise underwater LED illumination, overflow channel, and 4-layer FRP waterproofing.",
        materials: ["FRP Dual-Coat Membrane", "LED IP68 Underwater Lights", "Anti-Skid Coping"],
        focusOrbit: "45deg 65deg 55%",
        focusTarget: "0.65m 0.18m 0.45m"
      },
      {
        id: "terrace-slab",
        number: 5,
        title: "Rooftop Terrace & Solar Provision",
        category: "Roofing & Thermal Barrier",
        position: "-0.1m 1.15m 0.1m",
        normal: "0m 1m 0m",
        specs: "Monolithic RCC slab with cool-roof reflective tiles, 5kW solar conduit array, and parapet safety glass rails.",
        materials: ["IS 456 M25 Concrete", "Cool Roof Solar Reflectance", "Concealed Inverter Line"],
        focusOrbit: "20deg 45deg 70%",
        focusTarget: "-0.1m 1.15m 0.1m"
      }
    ]
  },
  {
    id: "luxury-villa-01",
    title: "Modern Luxury Villa Elevation",
    tagline: "Contemporary 4BHK architectural design with Burma teak louvers and terrace deck",
    category: "Residential Villa",
    location: "Kamarajar Salai / KK Nagar, Madurai",
    builtUpArea: "4,650 Sq.Ft (G+2)",
    glbModel: "/models/villa.glb",
    thumbnail: "/images/danam/about-villa.webp",
    author: "Zigurat Architecture Studio",
    cameraTarget: "0m 4.5m -5m",
    cameraOrbit: "35deg 72deg 80%",
    interiorCameraTarget: "0m 3.2m 0m",
    interiorCameraOrbit: "0deg 85deg 5m",
    specs: {
      structure: "Seismic Zone-III Earthquake Resistant RCC Frame",
      steel: "Fe550D High-Ductility TMT Rebars",
      concrete: "M25 Ready-Mix Concrete Matrix with Lab Cube Audits",
      vastu: "100% Vastu-Compliant East Entrance & Agni Kitchen",
      floors: "G+2 Floors with Double-Height Living Room",
      handoverTime: "150 Days Handover Guarantee"
    },
    highlights: [
      "Natural Teak Wood Louver facade for tropical heat barrier",
      "Acoustic UPVC double-glazed panoramic windows (35dB noise cutoff)",
      "Dedicated Pooja Room in Ishanya (North-East) corner",
      "Rooftop terrace garden ready for 5kW Solar array & waterproof membrane"
    ],
    hotspots: [
      {
        id: "lux-entrance",
        number: 1,
        title: "Grand Entrance Portico",
        category: "Portico & Cladding",
        position: "0m 1.5m 6m",
        normal: "0m 0m 1m",
        specs: "Double-height main door with Burma teak solid timber frame and biometric smart lock integration.",
        materials: ["Grade-A Burma Teak", "Biometric Access", "Polished Granite Threshold"],
        focusOrbit: "0deg 80deg 50%",
        focusTarget: "0m 1.5m 6m"
      },
      {
        id: "lux-louvers",
        number: 2,
        title: "Natural Teak Sun-Breaker Louvers",
        category: "Passive Climate Architecture",
        position: "-4.5m 5.2m 3m",
        normal: "0m 0m 1m",
        specs: "Vertical treated wooden fins providing natural solar shading and cutting peak afternoon heat by 5°C.",
        materials: ["Weather-Treated Wood", "Thermal Cutoff", "Concealed Steel Core"],
        focusOrbit: "-20deg 75deg 50%",
        focusTarget: "-4.5m 5.2m 3m"
      },
      {
        id: "lux-terrace",
        number: 3,
        title: "Sky Terrace Garden & Deck",
        category: "Rooftop Architecture",
        position: "0m 8.5m -2m",
        normal: "0m 1m 0m",
        specs: "Weatherproof WPC composite wood decking with built-in drip irrigation planters and solar array provision.",
        materials: ["WPC Composite Deck", "FRP Waterproof Membrane", "Toughened Glass Railing"],
        focusOrbit: "25deg 50deg 60%",
        focusTarget: "0m 8.5m -2m"
      }
    ]
  },
  {
    id: "contemporary-residence-02",
    title: "Architectural Contemporary Home",
    tagline: "Ultra-modern open plan residence with cantilevered balcony & landscaped courtyard",
    category: "Residential Villa",
    location: "Anna Nagar / Iyer Bungalow, Madurai",
    builtUpArea: "3,800 Sq.Ft (G+1)",
    glbModel: "/models/LuxuryVilla_site_draco.glb",
    thumbnail: "/images/danam/ddhvrktrjjjln58schqk.webp",
    author: "Zigurat Architecture Studio",
    cameraTarget: "0m 4.5m -5m",
    cameraOrbit: "35deg 72deg 80%",
    interiorCameraTarget: "0m 3m 0m",
    interiorCameraOrbit: "0deg 85deg 4.5m",
    specs: {
      structure: "Engineered Monolithic Shear Wall + Column RCC",
      steel: "TATA Tiscon 550D Super Ductile",
      concrete: "Ultratech M30 High-Strength Concrete",
      vastu: "North-Facing Auspicious Main Door Layout",
      floors: "G+1 with Skylight Central Atrium",
      handoverTime: "180 Days Turnkey Handover"
    },
    highlights: [
      "Thermal-break aluminum sliding glass envelopes",
      "Rainwater harvesting & groundwater recharge pit integrated",
      "Concealed copper electrical conduit with surge protection",
      "Anti-skid Italian marble finish in common living zones"
    ],
    hotspots: [
      {
        id: "contemp-balcony",
        number: 1,
        title: "Cantilevered Floating Balcony",
        category: "Structural RCC",
        position: "-3m 4.5m 2m",
        normal: "0m 0m 1m",
        specs: "Monolithic cantilevered deck with high-ductility Fe550D reinforcement and flush glass balustrade.",
        materials: ["TATA Tiscon 550D", "Clear Vision 12mm Glass", "Anti-Skid Vitrified"],
        focusOrbit: "-15deg 70deg 50%",
        focusTarget: "-3m 4.5m 2m"
      },
      {
        id: "contemp-glazing",
        number: 2,
        title: "Thermal-Break Glass Envelopes",
        category: "Energy-Efficient Glazing",
        position: "2m 2.5m 3m",
        normal: "0m 0m 1m",
        specs: "Heavy-duty sliding glass pocket doors connecting interior living lounge directly with courtyard.",
        materials: ["Double Insulated Glass", "Thermal Break Aluminum", "Hafele Slide Gear"],
        focusOrbit: "30deg 75deg 50%",
        focusTarget: "2m 2.5m 3m"
      }
    ]
  }
];

// WebGL Equirectangular Shader Sources for 360 Interior VR Room Tour
const VS_PANORAMA = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FS_PANORAMA = `
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
    vec3 nightWarm = vec3(col.r * 1.08 + 0.04, col.g * 0.88, col.b * 0.70) * 0.85;
    col.rgb = mix(col.rgb, nightWarm, u_night_factor);
  }

  gl_FragColor = col;
}
`;

function Interior360Canvas({ panoramaUrl, isNight }: { panoramaUrl: string; isNight: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl = canvas.getContext("webgl", { antialias: true, alpha: false }) as WebGLRenderingContext | null;
    if (!gl) {
      gl = canvas.getContext("experimental-webgl") as WebGLRenderingContext | null;
    }
    if (!gl) return;

    const compileShader = (type: number, src: string) => {
      if (!gl) return null;
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const vs = compileShader(gl.VERTEX_SHADER, VS_PANORAMA);
    const fs = compileShader(gl.FRAGMENT_SHADER, FS_PANORAMA);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const posAttr = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Initial placeholder 2x2
    const placeholder = document.createElement("canvas");
    placeholder.width = 2;
    placeholder.height = 2;
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, placeholder);

    // Load panorama image
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (!gl) return;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    };
    img.src = panoramaUrl;

    const uYaw = gl.getUniformLocation(prog, "u_yaw");
    const uPitch = gl.getUniformLocation(prog, "u_pitch");
    const uFov = gl.getUniformLocation(prog, "u_fov");
    const uAspect = gl.getUniformLocation(prog, "u_aspect");
    const uNight = gl.getUniformLocation(prog, "u_night_factor");

    let running = true;
    const render = () => {
      if (!running || !gl || !canvas) return;

      // Auto gentle continuous pan when user is not touching
      if (!isDraggingRef.current) {
        yawRef.current += 0.0008;
      }

      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      gl.useProgram(prog);
      gl.uniform1f(uYaw, yawRef.current);
      gl.uniform1f(uPitch, pitchRef.current);
      gl.uniform1f(uFov, 1.25);
      gl.uniform1f(uAspect, canvas.width / (canvas.height || 1));
      gl.uniform1f(uNight, isNight ? 0.75 : 0.0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animFrameRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [panoramaUrl, isNight]);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastPosRef.current.x;
    const dy = e.clientY - lastPosRef.current.y;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    yawRef.current -= dx * 0.004;
    pitchRef.current = Math.max(-1.4, Math.min(1.4, pitchRef.current + dy * 0.004));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="w-full h-full cursor-grab active:cursor-grabbing block"
      style={{ touchAction: "none" }}
    />
  );
}

export default function Project3DExperience() {
  const [selectedProject, setSelectedProject] = useState<Project3DItem>(PROJECT_3D_LIST[0]);
  const [activeView, setActiveView] = useState<"3d" | "photos" | "specs">("3d");
  const [is3dLoaded, setIs3dLoaded] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [showGestureHint, setShowGestureHint] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [selectedThemeId, setSelectedThemeId] = useState<string>("white-charcoal");
  const [primaryColor, setPrimaryColor] = useState<string>("#F5F6F4");
  const [accentColor, setAccentColor] = useState<string>("#2B2E33");
  const [bgTheme, setBgTheme] = useState<"white" | "black">("black");
  const [buildingLightsOn, setBuildingLightsOn] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"exterior" | "interior">("exterior");
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [activeHotspot, setActiveHotspot] = useState<ProjectHotspot | null>(null);
  const [show360InteriorModal, setShow360InteriorModal] = useState<boolean>(false);
  const [active360RoomId, setActive360RoomId] = useState<string>("living-room");
  const [is360Night, setIs360Night] = useState<boolean>(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const modelViewerRef = useRef<any>(null);

  const hexToRGBA = (hex: string): [number, number, number, number] => {
    const cleanHex = hex.replace("#", "");
    const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
    return [r, g, b, 1.0];
  };

  // Real-time custom color picker applicator for primary walls or accent louvers
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

      // 1. PRIMARY WALLS:
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

      // 2. ACCENT FEATURES & LOUVERS:
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

  // Real-time architectural lighting control (illuminates fixtures, glowing windows, curtains & pool)
  const applyBuildingLights = (on: boolean) => {
    const mv = modelViewerRef.current;
    if (!mv) return;

    const materials = mv.model?.materials;
    if (!materials || !Array.isArray(materials)) return;

    for (const mat of materials) {
      const name = (mat.name || "").toUpperCase();

      // 1. Light Fixtures (Downlights, Sconces, Bollards, Stairs, Chandeliers)
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

      // 2. Window Glazing & Curtains (Warm interior illumination glowing through glass)
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

      // 3. Pool / Courtyard Water Feature
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

  // Apply real-time dual-tone architectural colors across all models (Villa G+1, Luxury Villa, Contemporary Home)
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

      // 1. PRIMARY WALLS:
      // modern_villa_g1: PLASTER WHITE
      // villa.glb & LuxuryVilla_site_draco: M_Plaster, M_WallWarm, M_Ceiling
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

      // 2. ACCENT FEATURES & LOUVERS:
      // modern_villa_g1: PLASTER BLACK, LOUVER\WINDOW, COMPOUND WALL FENCE
      // villa.glb & LuxuryVilla_site_draco: M_Fascia__GLB, M_MetalDark, M_MetalBronze, M_Soffit, M_Steel
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

  // Responsive device check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Dynamically load Google <model-viewer> official standalone bundle on client mount
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

  // Track 3D model load completion to display gesture hint directly over the rendered 3D model
  useEffect(() => {
    setIsModelLoaded(false);
    const mv = modelViewerRef.current;
    if (!mv) return;

    const handleModelLoad = () => {
      setIsModelLoaded(true);
      const current = DUAL_COLOR_THEMES.find((c) => c.id === selectedThemeId);
      setTimeout(() => {
        if (current) {
          applyDualColorTheme(current);
        } else {
          applyCustomColor("primary", primaryColor);
        }
        applyBuildingLights(buildingLightsOn);
      }, 150);
    };

    mv.addEventListener("load", handleModelLoad);
    return () => {
      mv.removeEventListener("load", handleModelLoad);
    };
  }, [selectedProject.id, is3dLoaded]);

  // Hide gesture hint smoothly when user interacts with the model
  useEffect(() => {
    const mv = modelViewerRef.current;
    if (!mv) return;

    const stopRotate = () => {
      setShowGestureHint(false);
    };

    mv.addEventListener("pointerdown", stopRotate);
    mv.addEventListener("touchstart", stopRotate, { passive: true });
    mv.addEventListener("wheel", stopRotate, { passive: true });

    return () => {
      mv.removeEventListener("pointerdown", stopRotate);
      mv.removeEventListener("touchstart", stopRotate);
      mv.removeEventListener("wheel", stopRotate);
    };
  }, [is3dLoaded, selectedProject.id]);

  const dismissGestureHint = () => {
    setShowGestureHint(false);
  };

  // Zoom In / Zoom Out via cameraOrbit
  const zoomCameraIn = () => {
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

  const zoomCameraOut = () => {
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

  const resetCamera = () => {
    const mv = modelViewerRef.current;
    if (!mv) return;
    try {
      setViewMode("exterior");
      setActiveHotspot(null);
      mv.cameraOrbit = selectedProject.cameraOrbit || (isMobile ? "35deg 72deg 95%" : "35deg 72deg 80%");
      mv.cameraTarget = selectedProject.cameraTarget || "0m 4.5m -5m";
      mv.fieldOfView = "30deg";
      mv.setAttribute("auto-rotate", "");
    } catch (e) {
      console.warn("Reset camera error:", e);
    }
  };

  const toggleViewMode = () => {
    const nextMode = viewMode === "exterior" ? "interior" : "exterior";
    setViewMode(nextMode);
    setActiveHotspot(null);

    const mv = modelViewerRef.current;
    if (!mv) return;

    try {
      if (nextMode === "interior") {
        mv.removeAttribute("auto-rotate");
        mv.cameraTarget = selectedProject.interiorCameraTarget || "0.2m 0.55m 0.15m";
        mv.cameraOrbit = selectedProject.interiorCameraOrbit || "10deg 85deg 0.8m";
        mv.fieldOfView = "48deg";
        // Ensure warm interior lights are on
        if (!buildingLightsOn) {
          setBuildingLightsOn(true);
          applyBuildingLights(true);
        }
      } else {
        mv.cameraTarget = selectedProject.cameraTarget || "auto auto auto";
        mv.cameraOrbit = selectedProject.cameraOrbit || (isMobile ? "35deg 72deg 95%" : "35deg 72deg 80%");
        mv.fieldOfView = "30deg";
      }
    } catch (e) {
      console.warn("Toggle view mode error:", e);
    }
  };

  const toggleHotspots = () => {
    setShowHotspots((prev) => !prev);
    if (showHotspots) {
      setActiveHotspot(null);
    }
  };

  const handleSelectHotspot = (hotspot: ProjectHotspot) => {
    setActiveHotspot(hotspot);
    const mv = modelViewerRef.current;
    if (mv && hotspot.focusOrbit && hotspot.focusTarget) {
      try {
        mv.removeAttribute("auto-rotate");
        mv.cameraOrbit = hotspot.focusOrbit;
        mv.cameraTarget = hotspot.focusTarget;
      } catch (e) {
        console.warn("Focus hotspot error:", e);
      }
    }
  };

  const INTERIOR_360_ROOMS = [
    {
      id: "living-room",
      name: "Living & Atrium",
      tag: "Double Volume",
      panoramaUrl: "/panoramas/living-room.jpg",
      specs: "480 Sq.Ft · 14'6\" Height · Italian Statuario Marble · Ambient LED Coves",
      features: "Patio Pocket Sliders · Acoustic Glass · Double Height Chandelier"
    },
    {
      id: "master-bedroom",
      name: "Master Suite",
      tag: "King Sanctuary",
      panoramaUrl: "/panoramas/master-bedroom.jpg",
      specs: "320 Sq.Ft · Burma Teak Accents · Walk-in Wardrobe Provision · 35dB Noise Cutoff",
      features: "Private Balcony Access · False Ceiling Indirect Warm Glow"
    },
    {
      id: "modular-kitchen",
      name: "Modular Kitchen",
      tag: "German Blum",
      panoramaUrl: "/panoramas/modular-kitchen.jpg",
      specs: "220 Sq.Ft · Seamless Quartz Countertops · Blum Soft-Close Pullouts · SS304 Sink",
      features: "Integrated Chimney Duct · Quartz Breakfast Island"
    },
    {
      id: "sky-terrace",
      name: "Sky Terrace Lounge",
      tag: "Rooftop Open",
      panoramaUrl: "/panoramas/sky-terrace.jpg",
      specs: "650 Sq.Ft · Weatherproof WPC Decking · Toughened Glass Balustrades · Solar Ready",
      features: "Drip Irrigation Planters · FRP Waterproof Membrane"
    }
  ];

  const realProjects = [
    { name: "Rajmahal Aishvaryam", loc: "Madurai", img: "/images/danam/ddhvrktrjjjln58schqk.webp", tag: "Turnkey EPC" },
    { name: "Theni Anandham", loc: "Aruppukottai", img: "/images/danam/l3s2jgqoz98xoktjyzvk.webp", tag: "Commercial" },
    { name: "Ocean Peacock SR", loc: "Madurai", img: "/images/danam/FFLiving-002.webp", tag: "Luxury Residential" },
    { name: "SACS Landmark", loc: "K.Pudhur, Madurai", img: "/images/danam/rvxn271huf5gcqqtdb46.webp", tag: "Civil Construction" }
  ];

  const handleOpenLeadModal = () => {
    window.dispatchEvent(new CustomEvent("open-lead-modal"));
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(
      `Hi Danam Holdings, I was exploring the 3D Model of the ${selectedProject.title} and would like to consult on my land/plot construction.`
    );
    window.open(`https://wa.me/918883332499?text=${text}`, "_blank");
  };

  return (
    <section ref={sectionRef} id="project-3d-experience" className="py-12 sm:py-16 bg-surface-1 border-y border-border-subtle relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-brand-forest/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[350px] h-[350px] bg-brand-amber/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-brand-forest/10 border border-brand-forest/20 text-brand-forest text-xs font-bold uppercase tracking-wider mb-2.5">
              <Rotate3D className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Interactive 3D Experience</span>
            </div>
            <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight text-text-primary">
              Experience Your Building in 3D
            </h2>
            <p className="font-ui text-xs md:text-sm text-text-secondary max-w-2xl mt-1.5 leading-relaxed">
              Don’t settle for flat 2D blueprints. Walk around, orbit 360°, inspect structural elevations, and verify architectural finishes before laying a single brick.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-surface-0 border border-border-medium p-1 rounded-xl shadow-xs self-stretch md:self-auto justify-between sm:justify-center overflow-x-auto gap-1">
            <button
              onClick={() => setActiveView("3d")}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg font-ui text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeView === "3d"
                  ? "bg-brand-forest text-white shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Rotate3D className="w-3.5 h-3.5" />
              <span>Live 3D Walkaround</span>
            </button>

            <button
              onClick={() => setActiveView("photos")}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg font-ui text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeView === "photos"
                  ? "bg-brand-forest text-white shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Project Photos</span>
            </button>

            <button
              onClick={() => setActiveView("specs")}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg font-ui text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeView === "specs"
                  ? "bg-brand-forest text-white shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Civil Specs</span>
            </button>

            <button
              onClick={() => setShow360InteriorModal(true)}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg font-ui text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 border border-amber-500/30"
              title="Step Inside Furnished 360° Interior VR Rooms"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>Step Inside 360°</span>
            </button>
          </div>
        </div>

        {/* Main Showcase Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left / Center: Interactive 3D Viewer (Clean Framed 3D Card with Dark Architectural Theme) */}
          <div className="lg:col-span-7 bg-[#0a0a0d] border border-white/10 rounded-[22px] overflow-hidden shadow-2xl flex flex-col">
            {/* Viewer Stage: Clean Luxury 3D Card with Architectural Corner Accents */}
            <div className={`relative w-full transition-colors duration-500 overflow-hidden h-[340px] sm:h-[400px] lg:h-[460px] ${
              bgTheme === "white" ? "bg-white" : "bg-black"
            }`}>
              {/* Luxury Architectural Viewfinder Corner Reticles */}
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

              {activeView === "3d" && (
                <div className={`relative w-full h-full overflow-hidden flex items-center justify-center transition-colors duration-500 ${
                  bgTheme === "white" ? "bg-white" : "bg-black"
                }`}>

                  {/* Top Header: Left Controls (Badges & Mode) + Right Controls (Zoom/Reset) with No Overlap */}
                  <div className="absolute top-2.5 left-2 sm:left-4 right-2 sm:right-4 z-25 flex items-center justify-between pointer-events-none select-none gap-2">
                    {/* Left: 3D Badge + White/Black Switcher + Lights Toggle */}
                    <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto flex-wrap">
                      <div className="bg-[#0a0a0d]/90 backdrop-blur-md border border-white/15 px-2.5 sm:px-3 py-1 rounded-full text-white text-[10px] sm:text-xs font-mono flex items-center gap-1.5 tracking-wider uppercase shadow-md shrink-0">
                        <Rotate3D className="w-3.5 h-3.5 text-[#C5A880] animate-spin-slow" />
                        <span className="hidden sm:inline">3D Villa Tour</span>
                      </div>

                      {/* ONLY White & Complete Black Background Options */}
                      <div className="bg-[#0a0a0d]/90 backdrop-blur-md border border-white/15 p-0.5 rounded-full flex items-center shadow-lg shrink-0">
                        <button
                          onClick={() => selectBgTheme("white")}
                          className={`px-3 py-1 rounded-full text-[11px] font-mono flex items-center gap-1.5 cursor-pointer transition-all ${
                            bgTheme === "white"
                              ? "bg-white text-stone-900 font-bold shadow-md scale-105"
                              : "text-white/80 hover:text-white"
                          }`}
                          title="Complete White Background"
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-white border border-stone-400 shrink-0" />
                          <span>White</span>
                        </button>

                        <button
                          onClick={() => selectBgTheme("black")}
                          className={`px-3 py-1 rounded-full text-[11px] font-mono flex items-center gap-1.5 cursor-pointer transition-all ${
                            bgTheme === "black"
                              ? "bg-black text-white font-bold ring-1 ring-white/60 shadow-md scale-105"
                              : "text-white/80 hover:text-white"
                          }`}
                          title="Complete Black Background"
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
                        title="Toggle Building Architectural Lights ON / OFF"
                      >
                        <Lightbulb className={`w-3.5 h-3.5 ${buildingLightsOn ? "fill-stone-950 text-stone-950 animate-pulse" : "text-white/70"}`} />
                        <span>{buildingLightsOn ? "Lights ON" : "Lights OFF"}</span>
                      </button>

                      {/* Hotspot Pins Toggle ("Hubstop Pins") */}
                      <button
                        onClick={toggleHotspots}
                        className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all backdrop-blur-md border shadow-lg shrink-0 ${
                          showHotspots
                            ? "bg-amber-500/20 text-amber-300 border-amber-400/40 hover:bg-amber-500/30"
                            : "bg-[#0a0a0d]/90 text-white/60 hover:text-white border-white/15"
                        }`}
                        title="Toggle 3D Civil Engineering Hotspot Pins"
                      >
                        <MapPin className={`w-3.5 h-3.5 ${showHotspots ? "text-amber-400" : "text-white/60"}`} />
                        <span>{showHotspots ? "Pins ON" : "Pins OFF"}</span>
                      </button>

                      {/* View Inside / Exterior Elevation Switcher */}
                      <button
                        onClick={toggleViewMode}
                        className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all backdrop-blur-md border shadow-lg shrink-0 ${
                          viewMode === "interior"
                            ? "bg-emerald-500 text-stone-950 font-bold border-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.5)] scale-105"
                            : "bg-[#0a0a0d]/90 text-white/80 hover:text-white border-white/15"
                        }`}
                        title={viewMode === "interior" ? "Switch back to Exterior Elevation View" : "Step inside 3D model to inspect ground floor & interior layout"}
                      >
                        {viewMode === "interior" ? (
                          <>
                            <Building2 className="w-3.5 h-3.5" />
                            <span>Exterior View</span>
                          </>
                        ) : (
                          <>
                            <DoorOpen className="w-3.5 h-3.5 text-amber-400" />
                            <span>View Inside</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Right: Clean Interactive Zoom & Reset Controls */}
                    <div className="flex items-center gap-0.5 sm:gap-1 bg-[#0a0a0d]/95 backdrop-blur-md border border-white/15 p-1 rounded-xl shadow-xl pointer-events-auto select-none shrink-0">
                      <button
                        onClick={zoomCameraOut}
                        className="px-1.5 sm:px-2 py-1 text-white/90 hover:text-white hover:bg-white/20 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1"
                        title="Zoom Out (Full View)"
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                        <span className="text-[10px] uppercase hidden md:inline">Zoom Out</span>
                      </button>
                      <button
                        onClick={zoomCameraIn}
                        className="px-1.5 sm:px-2 py-1 text-white/90 hover:text-white hover:bg-white/20 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer border-l border-white/20 flex items-center gap-1"
                        title="Zoom In"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span className="text-[10px] uppercase hidden md:inline">Zoom In</span>
                      </button>
                      <button
                        onClick={resetCamera}
                        className="px-1.5 sm:px-2 py-1 text-white/90 hover:text-white hover:bg-white/20 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer border-l border-white/20 flex items-center gap-1"
                        title="Reset View to Center"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="text-[10px] uppercase hidden md:inline">Reset</span>
                      </button>
                    </div>
                  </div>

                  {/* Architectural 3D Loading Spinner (Visible while GLB streams directly into WebGL) */}
                  {!isModelLoaded && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0a0a0d] pointer-events-none">
                      <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                      <span className="mt-3 text-xs font-mono tracking-widest text-emerald-400/90 uppercase">
                        Loading 3D Architectural Model...
                      </span>
                    </div>
                  )}

                  {/* Exact White Pointer Hand & Arrows (Non-blocking, only visible once 3D model is active) */}
                  {isModelLoaded && showGestureHint && (
                    <div
                      className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none select-none transition-opacity duration-500"
                    >
                      <div
                        className="flex items-center gap-3 drop-shadow-[0_6px_20px_rgba(0,0,0,1)] filter pointer-events-none"
                        style={{
                          animation: "handPointerSway 2s ease-in-out infinite",
                        }}
                      >
                        {/* Left Arrow */}
                        <svg
                          className="w-5 h-5 text-white fill-white"
                          viewBox="0 0 24 24"
                        >
                          <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
                        </svg>

                        {/* Crisp White Hand Pointer Icon */}
                        <svg
                          className="w-10 h-10 text-white fill-white"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 11.24V7.5a2.5 2.5 0 0 1 5 0v3.74c1.21-.81 2-2.18 2-3.74a4.5 4.5 0 0 0-9 0c0 1.56.79 2.93 2 3.74zm9.84 4.63-4.54-2.26a1.98 1.98 0 0 0-1.92.1l-.88.58V7.5a1.5 1.5 0 0 0-3 0v10.74l-3.44-.72a1.53 1.53 0 0 0-1.48.43l-.78.79 4.93 4.93c.38.38.89.59 1.42.59H17c1.02 0 1.88-.77 1.98-1.78l.48-4.8c.07-.68-.21-1.35-.62-1.81z" />
                        </svg>

                        {/* Right Arrow */}
                        <svg
                          className="w-5 h-5 text-white fill-white"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Google <model-viewer>: 100% Native WebGL 3D with PBR White Studio / Pure Solid Black Lighting */}
                  <div
                    onPointerDown={dismissGestureHint}
                    className={`w-full h-full flex items-center justify-center overflow-hidden relative cursor-grab active:cursor-grabbing transition-colors duration-500 ${
                      bgTheme === "white" ? "bg-white" : "bg-black"
                    }`}
                  >
                    <model-viewer
                      ref={modelViewerRef}
                      key={selectedProject.id}
                      src={selectedProject.glbModel}
                      alt={selectedProject.title}
                      camera-controls
                      disable-tap
                      disable-pan
                      auto-rotate
                      rotation-per-second="6deg"
                      auto-rotate-delay="999999"
                      camera-orbit={selectedProject.cameraOrbit || (isMobile ? "35deg 72deg 95%" : "35deg 72deg 80%")}
                      camera-target={selectedProject.cameraTarget || "0m 4.5m -5m"}
                      min-camera-orbit="auto auto 40%"
                      max-camera-orbit="auto auto 200%"
                      field-of-view="30deg"
                      environment-image="neutral"
                      tone-mapping="neutral"
                      shadow-intensity={bgTheme === "white" ? "1.6" : "1.3"}
                      shadow-softness={bgTheme === "white" ? "0.2" : "0.35"}
                      exposure={bgTheme === "white" ? "1.35" : (buildingLightsOn ? "0.95" : "0.60")}
                      loading="eager"
                      reveal="auto"
                      interaction-prompt="none"
                      style={{
                        width: "100%",
                        height: "100%",
                        background: bgTheme === "white" ? "#ffffff" : "#000000",
                        outline: "none",
                        touchAction: "pan-y",
                      }}
                    >
                      <div slot="progress-bar" style={{ display: "none" }} />

                      {/* Interactive 3D Hotspot Pins ("Hubstop Pins") */}
                      {showHotspots && viewMode === "exterior" && selectedProject.hotspots?.map((hotspot) => (
                        <button
                          key={hotspot.id}
                          slot={`hotspot-${hotspot.id}`}
                          data-position={hotspot.position}
                          data-normal={hotspot.normal}
                          data-visibility-attribute="visible"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectHotspot(hotspot);
                          }}
                          className="hotspot group pointer-events-auto cursor-pointer focus:outline-none select-none"
                          style={{
                            background: "transparent",
                            border: "none",
                            padding: 0,
                            transform: "translate(-50%, -50%)",
                          }}
                          title={`Click to inspect: ${hotspot.title}`}
                        >
                          <div className="relative flex items-center justify-center">
                            {/* Radar Wave */}
                            <span className="absolute -inset-1.5 rounded-full bg-amber-400/50 animate-ping opacity-75 pointer-events-none" />
                            {/* Pin Badge */}
                            <span className="relative w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-500 hover:bg-amber-400 border-2 border-white shadow-[0_0_14px_rgba(245,158,11,0.9)] flex items-center justify-center text-[10px] font-bold font-mono text-stone-950 transition-transform group-hover:scale-125">
                              {hotspot.number}
                            </span>
                            {/* Tooltip on hover */}
                            <span className="pointer-events-none absolute left-1/2 -top-8 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-950/95 text-white border border-white/20 text-[10px] font-mono whitespace-nowrap px-2 py-0.5 rounded-md shadow-2xl z-30">
                              {hotspot.title}
                            </span>
                          </div>
                        </button>
                      ))}
                    </model-viewer>
                  </div>

                  {/* Interior Mode HUD Banner */}
                  {viewMode === "interior" && (
                    <div className="absolute top-14 left-2 right-2 sm:left-1/2 sm:-translate-x-1/2 sm:w-auto z-25 bg-[#0a0a0d]/90 backdrop-blur-md border border-emerald-400/40 px-3 py-1.5 rounded-full text-white text-[11px] sm:text-xs font-mono flex items-center justify-between sm:justify-center gap-2 shadow-2xl animate-in fade-in">
                      <div className="flex items-center gap-1.5">
                        <DoorOpen className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
                        <span className="truncate">Viewing Ground Floor Interior · Orbit 360° Inside</span>
                      </div>
                      <button
                        onClick={() => setShow360InteriorModal(true)}
                        className="px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 font-bold hover:bg-amber-300 transition-colors text-[10px] uppercase flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <span>360° VR Rooms</span>
                        <Maximize2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  )}

                  {/* Active Hotspot Spec Card Pop-up */}
                  {activeHotspot && (
                    <div className="absolute bottom-16 sm:bottom-14 left-3 right-3 sm:left-auto sm:right-4 sm:max-w-sm z-30 bg-[#0a0a0d]/95 backdrop-blur-xl border border-amber-400/35 rounded-2xl p-4 shadow-[0_12px_40px_rgba(0,0,0,0.85)] animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-mono font-bold text-xs flex items-center justify-center shadow-sm">
                            {activeHotspot.number}
                          </span>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                            {activeHotspot.category}
                          </span>
                        </div>
                        <button
                          onClick={() => setActiveHotspot(null)}
                          className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                          title="Close Hotspot Details"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4 className="font-display text-sm sm:text-base font-bold text-white mt-1.5">
                        {activeHotspot.title}
                      </h4>
                      <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                        {activeHotspot.specs}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {activeHotspot.materials.map((mat, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-stone-200 border border-white/15"
                          >
                            ✓ {mat}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-white/15">
                        <button
                          onClick={() => {
                            const text = encodeURIComponent(
                              `Hi Danam Holdings, I'm interested in the "${activeHotspot.title}" specification (${activeHotspot.category}) on the ${selectedProject.title}. Please share itemized civil pricing.`
                            );
                            window.open(`https://wa.me/918883332499?text=${text}`, "_blank");
                          }}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-ui text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <span>Enquire Spec</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={resetCamera}
                          className="py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 text-xs font-mono transition-colors cursor-pointer"
                          title="Reset Camera View"
                        >
                          Reset View
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Real-time Interactive Color Picker & Palette Bar */}
                  {isModelLoaded && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-25 flex items-center gap-1.5 sm:gap-2.5 bg-[#0a0a0d]/95 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full shadow-2xl pointer-events-auto select-none max-w-[95%] overflow-x-auto">
                      <div className="flex items-center gap-1.5 pr-1.5 sm:pr-2 border-r border-white/20 text-white/90 shrink-0">
                        <Palette className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="text-[10px] font-mono uppercase tracking-wider hidden sm:inline whitespace-nowrap">
                          Color Pickers:
                        </span>
                      </div>

                      {/* Primary Wall Color Picker */}
                      <label
                        className="group relative flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 cursor-pointer transition-all shadow-sm shrink-0"
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
                        className="group relative flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 cursor-pointer transition-all shadow-sm shrink-0"
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
                      <div className="flex items-center gap-1.5 pl-1.5 sm:pl-2 border-l border-white/20 shrink-0">
                        {DUAL_COLOR_THEMES.map((theme) => {
                          const isActive = selectedThemeId === theme.id;
                          return (
                            <button
                              key={theme.id}
                              onClick={() => applyDualColorTheme(theme)}
                              title={`${theme.name} (${theme.tag}): ${theme.primaryLabel} + ${theme.accentLabel}`}
                              className={`group relative w-6 h-6 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center p-[1px] ${
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
                </div>
              )}

              {activeView === "photos" && (
                <div className="w-full h-full p-4 grid grid-cols-2 gap-3 overflow-y-auto bg-stone-900">
                  {realProjects.map((p, idx) => (
                    <div
                      key={idx}
                      className="group relative rounded-xl overflow-hidden border border-white/10 aspect-[4/3] bg-stone-900"
                    >
                      <img
                        src={p.img}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-brand-leaf-light block">
                          {p.tag}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold truncate">{p.name}</h4>
                        <span className="text-[10px] text-white/70">{p.loc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeView === "specs" && (
                <div className="w-full h-full p-6 overflow-y-auto bg-surface-0 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-xl font-bold text-text-primary mb-2">
                      Engineering & Structural Blueprint
                    </h3>
                    <p className="font-ui text-xs text-text-secondary mb-6 leading-relaxed">
                      Danam Holdings strictly builds adhering to Indian Standard Civil Codes (IS 456, IS 1893 seismic criteria) with lab-certified steel and ready-mix concrete.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3.5 rounded-xl border border-border-subtle bg-surface-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-forest block">
                          Structural Core
                        </span>
                        <p className="text-xs font-semibold text-text-primary mt-1">
                          {selectedProject.specs.structure}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl border border-border-subtle bg-surface-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-forest block">
                          Reinforcement Steel
                        </span>
                        <p className="text-xs font-semibold text-text-primary mt-1">
                          {selectedProject.specs.steel}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl border border-border-subtle bg-surface-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-forest block">
                          Concrete Matrix
                        </span>
                        <p className="text-xs font-semibold text-text-primary mt-1">
                          {selectedProject.specs.concrete}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl border border-border-subtle bg-surface-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-forest block">
                          Vastu Alignment
                        </span>
                        <p className="text-xs font-semibold text-text-primary mt-1">
                          {selectedProject.specs.vastu}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border-subtle flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-bold text-brand-forest flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Certified Quality & 100% Transparency</span>
                    </span>
                    <button
                      onClick={handleOpenWhatsApp}
                      className="px-4 py-2 bg-brand-forest hover:bg-brand-forest-dark text-white rounded-lg font-ui text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Discuss Specifications
                    </button>
                  </div>
                </div>
              )}
              {/* Sub-bar: Instructions & Direct Fullscreen/Reset View */}
              <div className="bg-[#0e0e12] px-4 py-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-ui">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-[#8D8A83] text-[11px] sm:text-xs">
                  <span>Drag to rotate · Pinch to zoom</span>
                  <span className="hidden sm:inline text-white/20">|</span>
                  <span className="text-[#8D8A83]/80">Model by {selectedProject.author} (CC-BY 4.0)</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={resetCamera}
                    className="text-[#C5A880] hover:text-[#F3EFEA] text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    Reset view
                  </button>
                  <a
                    href="#interior-360-tour"
                    className="text-[#C5A880] hover:text-white text-[11px] flex items-center gap-1 transition-colors font-semibold uppercase tracking-wider"
                    title="Step Inside 360 Rooms"
                  >
                    <span>Interior 360°</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                  <a
                    href="/skyline-villas.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-tertiary hover:text-white text-[11px] flex items-center gap-1 transition-colors"
                    title="Open Skyline 3D Villa Experience"
                  >
                    <span>View Skyline</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Key Architectural Highlights & Direct Consultation */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Quick Details Card */}
            <div className="bg-surface-0 border border-border-medium rounded-2xl p-5 shadow-sm text-text-primary">
              {/* Interactive Project Switcher */}
              <div className="mb-4 pb-3 border-b border-border-subtle">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary block mb-2">
                  Select 3D Model:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PROJECT_3D_LIST.map((proj) => {
                    const isSelected = selectedProject.id === proj.id;
                    return (
                      <button
                        key={proj.id}
                        onClick={() => {
                          setSelectedProject(proj);
                          setShowGestureHint(true);
                        }}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-ui font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-brand-forest text-white shadow-xs font-bold"
                            : "bg-surface-1 text-text-secondary hover:text-text-primary hover:bg-surface-2 border border-border-subtle"
                        }`}
                      >
                        <Rotate3D className={`w-3 h-3 ${isSelected ? "text-amber-300" : "text-text-tertiary"}`} />
                        <span>{proj.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <span className="inline-block px-2.5 py-0.5 rounded-full bg-brand-amber/10 border border-brand-amber/30 text-brand-gold text-[10px] font-extrabold uppercase tracking-wider mb-2">
                Featured 3D Concept
              </span>
              <h3 className="font-display text-2xl font-bold text-text-primary leading-tight">
                {selectedProject.title}
              </h3>
              <p className="font-ui text-xs text-text-secondary mt-1.5 leading-relaxed">
                {selectedProject.tagline}
              </p>

              <div className="mt-5 space-y-2.5 border-t border-border-subtle pt-4 text-xs font-ui">
                <div className="flex justify-between py-1 border-b border-border-subtle/50">
                  <span className="text-text-tertiary">Built-up Area</span>
                  <span className="font-semibold text-text-primary">{selectedProject.builtUpArea}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border-subtle/50">
                  <span className="text-text-tertiary">Location Coverage</span>
                  <span className="font-semibold text-text-primary">{selectedProject.location}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border-subtle/50">
                  <span className="text-text-tertiary">Handover Timeline</span>
                  <span className="font-semibold text-brand-forest">{selectedProject.specs.handoverTime}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-text-tertiary">Standard Code</span>
                  <span className="font-semibold text-text-primary">IS 456 Structural Compliant</span>
                </div>
              </div>

              {/* Highlights List */}
              <div className="mt-5 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-primary block">
                  Design & Quality Highlights:
                </span>
                {selectedProject.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-forest shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              {/* Interactive Real-Time Dual-Color Theme Configurator & Color Pickers */}
              <div className="mt-5 pt-4 border-t border-border-subtle">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-brand-forest" />
                    <span>Exterior Wall & Accent Finishes</span>
                  </span>
                  <span className="text-xs font-bold text-brand-forest">
                    {selectedThemeId === "custom" ? "Custom Color Palette" : DUAL_COLOR_THEMES.find((c) => c.id === selectedThemeId)?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-text-tertiary mb-3">
                  <span>Custom Color Pickers or Architectural Palettes</span>
                  <span className="font-mono text-[10px] text-brand-forest bg-brand-forest/10 px-2 py-0.5 rounded border border-brand-forest/20">
                    {primaryColor.toUpperCase()} & {accentColor.toUpperCase()}
                  </span>
                </div>

                {/* Multiple Interactive Color Pickers (Wall & Accent) */}
                <div className="grid grid-cols-2 gap-2.5 mb-3.5">
                  <label className="p-2.5 rounded-xl border border-border-subtle bg-surface-1 flex items-center gap-2.5 cursor-pointer hover:border-brand-forest hover:bg-surface-2 transition-all relative shadow-xs">
                    <span
                      className="w-6 h-6 rounded-full border-2 border-white shadow-xs shrink-0"
                      style={{ backgroundColor: primaryColor }}
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase text-text-tertiary block leading-tight">Primary Wall</span>
                      <span className="text-xs font-mono font-bold text-text-primary block leading-tight mt-0.5">{primaryColor.toUpperCase()}</span>
                    </div>
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => applyCustomColor("primary", e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      title="Click to pick custom Primary Wall color"
                    />
                  </label>

                  <label className="p-2.5 rounded-xl border border-border-subtle bg-surface-1 flex items-center gap-2.5 cursor-pointer hover:border-brand-forest hover:bg-surface-2 transition-all relative shadow-xs">
                    <span
                      className="w-6 h-6 rounded-full border-2 border-white shadow-xs shrink-0"
                      style={{ backgroundColor: accentColor }}
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase text-text-tertiary block leading-tight">Accent Louver</span>
                      <span className="text-xs font-mono font-bold text-text-primary block leading-tight mt-0.5">{accentColor.toUpperCase()}</span>
                    </div>
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => applyCustomColor("accent", e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      title="Click to pick custom Accent / Louver / Trim color"
                    />
                  </label>
                </div>

                {/* Preset Themes */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {DUAL_COLOR_THEMES.map((theme) => {
                    const isSelected = selectedThemeId === theme.id;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => applyDualColorTheme(theme)}
                        className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer text-left ${
                          isSelected
                            ? "border-brand-forest bg-brand-forest/10 ring-1 ring-brand-forest shadow-xs font-bold"
                            : "border-border-subtle hover:border-border-medium bg-surface-1 text-text-secondary"
                        }`}
                        title={`${theme.name} (${theme.tag})`}
                      >
                        {/* Split Dual-Color Swatch */}
                        <div className="w-6 h-6 rounded-full overflow-hidden flex border border-black/20 shrink-0 shadow-xs">
                          <div className="w-1/2 h-full" style={{ backgroundColor: theme.primaryHex }} />
                          <div className="w-1/2 h-full" style={{ backgroundColor: theme.accentHex }} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[11px] font-semibold text-text-primary block truncate">
                            {theme.name}
                          </span>
                          <span className="text-[9px] text-text-tertiary block truncate">
                            {theme.tag}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  onClick={handleOpenLeadModal}
                  className="w-full py-3 bg-brand-forest hover:bg-brand-forest-dark text-white rounded-xl font-ui text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Get Quote for Similar Villa</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleOpenWhatsApp}
                  className="w-full py-2.5 bg-surface-1 hover:bg-surface-2 border border-border-medium text-text-primary rounded-xl font-ui text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Chat on WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Client Note Banner */}
            <div className="bg-gradient-to-br from-brand-forest/10 via-brand-forest/5 to-transparent border border-brand-forest/20 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-forest text-white flex items-center justify-center shrink-0 shadow-xs">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide">
                    Custom 3D Models For Clients
                  </h4>
                  <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                    When you provide your elevation drawing, CAD model, or 3D Sketchfab link, we plug it directly into your portfolio seamlessly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 360° Interior VR Walkthrough Modal */}
      {show360InteriorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl bg-[#0a0a0d] border border-white/15 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-[#121217]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Compass className="w-4 h-4 animate-spin-slow" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-sm sm:text-base font-bold text-white">
                      360° Interior Virtual Walkthrough
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase hidden sm:inline">
                      Turnkey Spec
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-white/60 font-mono">
                    Drag mouse or touch 360° to look around • Real Madurai villa interior finish
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Night Glow Toggle */}
                <button
                  onClick={() => setIs360Night((prev) => !prev)}
                  className={`px-3 py-1 rounded-full text-xs font-mono flex items-center gap-1.5 cursor-pointer border transition-all ${
                    is360Night
                      ? "bg-amber-400 text-stone-950 font-bold border-amber-300"
                      : "bg-white/10 text-white/80 hover:text-white border-white/15"
                  }`}
                  title="Toggle Day / Night Ambient Lighting in Room"
                >
                  <Moon className={`w-3.5 h-3.5 ${is360Night ? "fill-stone-950" : ""}`} />
                  <span className="hidden sm:inline">{is360Night ? "Warm Night" : "Natural Day"}</span>
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setShow360InteriorModal(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/15"
                  title="Return to 3D Villa"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Room Switcher Tabs */}
            <div className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 bg-black/40 border-b border-white/10 overflow-x-auto">
              <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 mr-1 hidden sm:inline">
                Select Room:
              </span>
              {INTERIOR_360_ROOMS.map((room) => {
                const isActive = active360RoomId === room.id;
                return (
                  <button
                    key={room.id}
                    onClick={() => setActive360RoomId(room.id)}
                    className={`px-3 py-1.5 rounded-xl font-ui text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? "bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20"
                        : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/10"
                    }`}
                  >
                    <span>{room.name}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${isActive ? "bg-stone-950/20 text-stone-950" : "text-white/40"}`}>
                      {room.tag}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Main Interactive 360 Viewport */}
            <div className="relative w-full h-[360px] sm:h-[450px] md:h-[500px] bg-black overflow-hidden select-none">
              <Interior360Canvas
                panoramaUrl={
                  INTERIOR_360_ROOMS.find((r) => r.id === active360RoomId)?.panoramaUrl ||
                  "/panoramas/living-room.jpg"
                }
                isNight={is360Night}
              />

              {/* Viewport Overlay Controls */}
              <div className="pointer-events-none absolute left-4 top-4 z-20 flex items-center gap-2">
                <span className="bg-black/70 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>360° Equirectangular VR</span>
                </span>
              </div>

              {/* Gesture Guide */}
              <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black/70 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full text-white/80 font-mono text-[10px] flex items-center gap-1.5">
                <Compass className="w-3 h-3 text-amber-400 animate-spin-slow" />
                <span>Click & drag horizontally/vertically to look 360°</span>
              </div>
            </div>

            {/* Room Specs Footer */}
            {(() => {
              const currentRoom = INTERIOR_360_ROOMS.find((r) => r.id === active360RoomId);
              if (!currentRoom) return null;
              return (
                <div className="p-4 sm:p-5 bg-[#121217] border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display text-sm font-bold text-white">
                        {currentRoom.name}
                      </h4>
                      <span className="text-[10px] font-mono text-amber-400 border border-amber-400/30 px-2 py-0.5 rounded-full">
                        {currentRoom.tag}
                      </span>
                    </div>
                    <p className="text-xs text-stone-300 mt-1 font-mono">
                      {currentRoom.specs}
                    </p>
                    <p className="text-[11px] text-white/50 mt-0.5">
                      {currentRoom.features}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
                    <button
                      onClick={() => {
                        const text = encodeURIComponent(
                          `Hi Danam Holdings, I was viewing the 360° interior tour of the ${currentRoom.name} (${selectedProject.title}) and would like turnkey interior pricing.`
                        );
                        window.open(`https://wa.me/918883332499?text=${text}`, "_blank");
                      }}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-ui text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <span>Get Room Estimate</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setShow360InteriorModal(false)}
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors cursor-pointer border border-white/15"
                    >
                      Back to 3D Villa
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </section>
  );
}
