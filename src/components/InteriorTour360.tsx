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
  Sunset,
  Map,
  Ruler,
  Sun,
  Moon,
  Footprints,
  LayoutGrid
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

export interface NavPortal {
  id: string;
  targetRoomIndex: number;
  label: string;
  sublabel: string;
  yaw: number;
  pitch: number;
}

export interface DimensionCallout {
  id: string;
  label: string;
  value: string;
  yaw: number;
  pitch: number;
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
  mapCoords: { x: number; y: number }; // percentage on floor plan (0-100)
  specs: {
    area: string;
    ceiling: string;
    flooring: string;
    lighting: string;
    features: string;
  };
  highlights: string[];
  hotspots: Hotspot[];
  portals: NavPortal[];
  dimensions: DimensionCallout[];
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
    mapCoords: { x: 50, y: 65 },
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
    ],
    portals: [
      {
        id: "portal-master",
        targetRoomIndex: 1,
        label: "Walk to Master Suite",
        sublabel: "King Sanctuary · 360 Sq.Ft",
        yaw: 1.52,
        pitch: -0.15
      },
      {
        id: "portal-kitchen",
        targetRoomIndex: 2,
        label: "Step into Modular Kitchen",
        sublabel: "German Blum · Quartz Island",
        yaw: -1.45,
        pitch: -0.18
      },
      {
        id: "portal-terrace",
        targetRoomIndex: 3,
        label: "Take Stairs to Sky Terrace",
        sublabel: "Rooftop Open Lounge",
        yaw: -2.85,
        pitch: 0.02
      }
    ],
    dimensions: [
      { id: "dim-1", label: "Clear Ceiling Height", value: "↕ 14' 6\"", yaw: 0.0, pitch: 0.38 },
      { id: "dim-2", label: "Living Room Span", value: "↔ 24' 0\" x 20' 0\"", yaw: 0.0, pitch: -0.35 },
      { id: "dim-3", label: "Acoustic Glazing Height", value: "↕ 10' 0\" Full Height", yaw: 1.15, pitch: -0.12 }
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
    mapCoords: { x: 25, y: 35 },
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
    ],
    portals: [
      {
        id: "portal-living",
        targetRoomIndex: 0,
        label: "Return to Living Atrium",
        sublabel: "Double-Height Lounge",
        yaw: -1.65,
        pitch: -0.15
      },
      {
        id: "portal-terrace-2",
        targetRoomIndex: 3,
        label: "Go up to Sky Terrace",
        sublabel: "Rooftop Open Lounge",
        yaw: 2.7,
        pitch: 0.05
      }
    ],
    dimensions: [
      { id: "dim-4", label: "Bedroom Span", value: "↔ 18' 0\" x 20' 0\"", yaw: 0.05, pitch: -0.32 },
      { id: "dim-5", label: "Ceiling Clear", value: "↕ 10' 6\"", yaw: 0.05, pitch: 0.32 }
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
    mapCoords: { x: 75, y: 35 },
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
    ],
    portals: [
      {
        id: "portal-living-from-kit",
        targetRoomIndex: 0,
        label: "Walk to Living & Dining",
        sublabel: "Grand Atrium",
        yaw: 1.45,
        pitch: -0.15
      }
    ],
    dimensions: [
      { id: "dim-6", label: "Island Length", value: "↔ 9' 6\" Quartz Island", yaw: -0.05, pitch: -0.28 },
      { id: "dim-7", label: "Aisle Clearance", value: "↔ 4' 0\" Ergonomic Aisle", yaw: -0.85, pitch: -0.3 }
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
    mapCoords: { x: 50, y: 15 },
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
    ],
    portals: [
      {
        id: "portal-down-to-living",
        targetRoomIndex: 0,
        label: "Take Stairs to Living Atrium",
        sublabel: "Lower Level",
        yaw: 1.85,
        pitch: -0.22
      }
    ],
    dimensions: [
      { id: "dim-8", label: "Open Deck Area", value: "↔ 520 Sq.Ft Deck", yaw: -0.45, pitch: -0.35 },
      { id: "dim-9", label: "Glass Railing Height", value: "↕ 3' 6\" Safety Glass", yaw: 0.22, pitch: -0.25 }
    ]
  }
];

// WebGL Equirectangular Shader Sources with fract wrapping and night mode grading
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

  vec4 col = texture2D(u_image, texCoord);

  // Night Mode grading: Warm 2700K ambient luxury tint
  if (u_night_factor > 0.0) {
    vec3 nightTint = vec3(col.r * 1.05 + 0.02, col.g * 0.88, col.b * 0.72) * 0.85;
    col.rgb = mix(col.rgb, nightTint, u_night_factor);
  }

  gl_FragColor = col;
}
`;

// Shared in-memory cache for pre-rasterized 2048x1024 power-of-two canvas textures
const textureCanvasCache: Record<string, HTMLCanvasElement> = {};

export default function InteriorTour360() {
  const [activeRoomIndex, setActiveRoomIndex] = useState<number>(0);
  const [yaw, setYaw] = useState<number>(0); // radians
  const [pitch, setPitch] = useState<number>(0); // radians (-0.7 to 0.7)
  const [fov, setFov] = useState<number>(1.25); // ~72 degrees
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [isLoadingTexture, setIsLoadingTexture] = useState<boolean>(false);
  const [showGestureGuide, setShowGestureGuide] = useState<boolean>(true);

  // Tour Pro 360 Feature States
  const [showFloorPlan, setShowFloorPlan] = useState<boolean>(true);
  const [showSceneReel, setShowSceneReel] = useState<boolean>(true);
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  const [showDimensions, setShowDimensions] = useState<boolean>(false);

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
  const nightFactorRef = useRef<number>(0);
  const activeRoomIndexRef = useRef<number>(0);

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
  useEffect(() => {
    nightFactorRef.current = isNightMode ? 0.75 : 0.0;
  }, [isNightMode]);
  useEffect(() => {
    activeRoomIndexRef.current = activeRoomIndex;
  }, [activeRoomIndex]);

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

  // Helper: Upload canvas or image to WebGL texture
  const uploadCanvasTexture = useCallback((source: HTMLCanvasElement | HTMLImageElement) => {
    const gl = glRef.current;
    const tex = textureRef.current;
    if (!gl || !tex) return;

    try {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        source
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    } catch (err) {
      console.warn("Texture upload error:", err);
    }
    setIsLoadingTexture(false);
  }, []);

  // Helper: Convert any loaded image to a 2048x1024 power-of-two canvas
  const rasterizeImageToPotCanvas = useCallback((source: HTMLImageElement): HTMLCanvasElement => {
    const pot = document.createElement("canvas");
    pot.width = 2048;
    pot.height = 1024;
    const ctx = pot.getContext("2d");
    if (ctx) {
      ctx.drawImage(source, 0, 0, 2048, 1024);
    }
    return pot;
  }, []);

  // Robust texture loader for any room
  const loadRoomTexture = useCallback((targetRoom: Room360) => {
    const gl = glRef.current;
    const tex = textureRef.current;
    if (!gl || !tex) return;

    setIsLoadingTexture(true);

    // 1. Check in-memory cache first (instant 0ms switch)
    const cachedCanvas = textureCanvasCache[targetRoom.id];
    if (cachedCanvas) {
      uploadCanvasTexture(cachedCanvas);
      return;
    }

    // 2. Load primary panorama
    const img = new Image();
    if (targetRoom.panoramaUrl.startsWith("http://") || targetRoom.panoramaUrl.startsWith("https://")) {
      img.crossOrigin = "anonymous";
    }

    const handleSuccess = () => {
      try {
        const potCanvas = rasterizeImageToPotCanvas(img);
        textureCanvasCache[targetRoom.id] = potCanvas;
        uploadCanvasTexture(potCanvas);
      } catch {
        uploadCanvasTexture(img);
      }
    };

    const handleError = () => {
      console.warn("Primary panorama failed, trying fallback:", targetRoom.fallbackImage);
      const fallbackImg = new Image();
      if (targetRoom.fallbackImage.startsWith("http://") || targetRoom.fallbackImage.startsWith("https://")) {
        fallbackImg.crossOrigin = "anonymous";
      }

      fallbackImg.onload = () => {
        try {
          const potCanvas = rasterizeImageToPotCanvas(fallbackImg);
          textureCanvasCache[targetRoom.id] = potCanvas;
          uploadCanvasTexture(potCanvas);
        } catch {
          uploadCanvasTexture(createFallbackTexture());
        }
      };

      fallbackImg.onerror = () => {
        uploadCanvasTexture(createFallbackTexture());
      };

      fallbackImg.src = targetRoom.fallbackImage;
      if (fallbackImg.complete && fallbackImg.naturalWidth > 0) {
        fallbackImg.onload(new Event("load"));
      }
    };

    // Attach callbacks before setting src to catch synchronous cache hits
    img.onload = handleSuccess;
    img.onerror = handleError;
    img.src = targetRoom.panoramaUrl;

    if (img.complete && img.naturalWidth > 0) {
      handleSuccess();
    }
  }, [createFallbackTexture, uploadCanvasTexture, rasterizeImageToPotCanvas]);

  // Preload all 4 room panoramas in background on mount
  useEffect(() => {
    ROOMS_DATA.forEach((room) => {
      if (textureCanvasCache[room.id]) return;
      const img = new Image();
      if (room.panoramaUrl.startsWith("http://") || room.panoramaUrl.startsWith("https://")) {
        img.crossOrigin = "anonymous";
      }
      img.onload = () => {
        try {
          const pot = rasterizeImageToPotCanvas(img);
          textureCanvasCache[room.id] = pot;
        } catch {
          // ignore background cache failure
        }
      };
      img.src = room.panoramaUrl;
    });
  }, [rasterizeImageToPotCanvas]);

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

    // Initial placeholder texture with CLAMP_TO_EDGE
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

    // Immediately trigger texture loading for current active room as soon as WebGL is ready
    loadRoomTexture(ROOMS_DATA[activeRoomIndexRef.current]);

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

      // Safe resize canvas to match display client size
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
  }, [createFallbackTexture, loadRoomTexture]);

  // Load new room panorama texture when room changes
  useEffect(() => {
    setSelectedHotspot(null);
    loadRoomTexture(ROOMS_DATA[activeRoomIndex]);
  }, [activeRoomIndex, loadRoomTexture]);

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

  // Switch room with smooth view reset
  const switchRoom = (idx: number, targetYaw: number = 0) => {
    setActiveRoomIndex(idx);
    setYaw(targetYaw);
    setPitch(0);
    yawRef.current = targetYaw;
    pitchRef.current = 0;
  };

  // Generic 3D-to-2D perspective projection for screen markers
  const projectAngleToScreen = (targetYaw: number, targetPitch: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return null;

    const aspect = width / height;
    const currentYaw = yawRef.current;
    const currentPitch = pitchRef.current;
    const currentFov = fovRef.current;

    let deltaYaw = targetYaw - currentYaw;
    while (deltaYaw > Math.PI) deltaYaw -= 2 * Math.PI;
    while (deltaYaw < -Math.PI) deltaYaw += 2 * Math.PI;

    const deltaPitch = targetPitch - currentPitch;
    const halfFovX = (currentFov * 0.5) * aspect;
    const halfFovY = currentFov * 0.5;

    // Visibility test
    if (Math.abs(deltaYaw) > halfFovX + 0.18 || Math.abs(deltaPitch) > halfFovY + 0.18) {
      return null;
    }

    const tanHalfFov = Math.tan(currentFov * 0.5);
    const tanHalfFovX = tanHalfFov * aspect;

    const screenX = (width * 0.5) + (Math.tan(deltaYaw) / tanHalfFovX) * (width * 0.5);
    const screenY = (height * 0.5) - (Math.tan(deltaPitch) / tanHalfFov) * (height * 0.5);

    if (screenX < 24 || screenX > width - 24 || screenY < 24 || screenY > height - 24) {
      return null;
    }

    return { x: screenX, y: screenY };
  };

  // Compass Heading calculation
  const getCompassDegrees = () => {
    return Math.round(((yawRef.current * 180) / Math.PI) % 360);
  };

  const getCompassHeading = () => {
    const degrees = getCompassDegrees();
    const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(degrees / 45) % 8;
    return `${dirs[index]} ${degrees}°`;
  };

  const handleOpenLeadModal = () => {
    window.dispatchEvent(new CustomEvent("open-lead-modal"));
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(
      `Hi Danam Holdings, I was exploring the Tour Pro 360° Walkthrough of the ${activeRoom.title} and would like to discuss interior fit-outs and structural planning for my project.`
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
                <span>Tour Pro 360° Architectural Walkthrough</span>
              </div>
              <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight text-white">
                Step Inside Your Landmark Building
              </h2>
              <p className="font-ui text-xs md:text-sm text-white/70 max-w-2xl mt-1.5 leading-relaxed">
                Tour Pro 360 experience: Interactive floor plan radar, door-to-door room portals, day & night mood lighting, and engineering specs.
              </p>
            </div>

            {/* Room Selector Quick Pills */}
            <div className="flex items-center bg-[#0d1117] border border-white/15 p-1 rounded-2xl shadow-xl overflow-x-auto max-w-full gap-1">
              {ROOMS_DATA.map((room, idx) => {
                const isActive = activeRoomIndex === idx;
                return (
                  <button
                    key={room.id}
                    onClick={() => switchRoom(idx)}
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
              isFullscreen ? "h-[calc(100vh-140px)]" : "h-[400px] sm:h-[480px] lg:h-[540px]"
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

            {/* Top-Right: Tour Pro HUD Controls Bar */}
            <div className="absolute top-4 right-4 z-25 flex items-center gap-1.5 bg-[#0b0e14]/90 backdrop-blur-md border border-white/20 p-1 rounded-2xl shadow-xl pointer-events-auto select-none">
              
              {/* Floor Plan Radar Toggle */}
              <button
                onClick={() => setShowFloorPlan(!showFloorPlan)}
                className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                  showFloorPlan ? "bg-amber-500/25 text-amber-300 border border-amber-400/40" : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
                title="Toggle Floor Plan Mini-Map"
              >
                <Map className="w-4 h-4 text-amber-400" />
                <span className="text-[11px] uppercase hidden sm:inline">Map</span>
              </button>

              {/* Day / Night Mood Toggle */}
              <button
                onClick={() => setIsNightMode(!isNightMode)}
                className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                  isNightMode ? "bg-indigo-600/30 text-indigo-300 border border-indigo-400/40" : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
                title="Toggle Day / Night Architectural Lighting"
              >
                {isNightMode ? <Moon className="w-4 h-4 text-indigo-300" /> : <Sun className="w-4 h-4 text-amber-400" />}
                <span className="text-[11px] uppercase hidden sm:inline">{isNightMode ? "Night" : "Day"}</span>
              </button>

              {/* Dimensions Tool Toggle */}
              <button
                onClick={() => setShowDimensions(!showDimensions)}
                className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                  showDimensions ? "bg-emerald-600/30 text-emerald-300 border border-emerald-400/40" : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
                title="Toggle Architectural Room Dimensions"
              >
                <Ruler className="w-4 h-4 text-emerald-400" />
                <span className="text-[11px] uppercase hidden sm:inline">Ruler</span>
              </button>

              {/* Auto Cruise Toggle */}
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                  autoRotate ? "bg-brand-forest text-white" : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
                title="Toggle Auto Rotation Cruise"
              >
                {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="text-[11px] uppercase hidden sm:inline">{autoRotate ? "Cruise" : "Play"}</span>
              </button>

              {/* Zoom Controls */}
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

              {/* Reset View */}
              <button
                onClick={resetView}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
                title="Reset View"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Fullscreen */}
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
                    <p className="text-white/60 text-[11px] mt-0.5">Use walk chevrons to move between rooms · Check floor plan</p>
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono uppercase bg-amber-400/10 px-2 py-1 rounded-md border border-amber-400/20">
                    Tap to start
                  </span>
                </div>
              </div>
            )}

            {/* Tour Pro 360: Floor Walkthrough Navigation Chevrons ("Walk to Room") */}
            {activeRoom.portals.map((portal) => {
              const pos = projectAngleToScreen(portal.yaw, portal.pitch);
              if (!pos) return null;

              return (
                <div
                  key={portal.id}
                  style={{
                    position: "absolute",
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    transform: "translate(-50%, -50%)",
                    zIndex: 35
                  }}
                  className="pointer-events-auto"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      switchRoom(portal.targetRoomIndex);
                    }}
                    className="group flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-110"
                    title={portal.label}
                  >
                    {/* Pulsing Floor Target Rings */}
                    <div className="relative w-11 h-11 flex items-center justify-center">
                      <span className="absolute inset-0 rounded-full border-2 border-emerald-400/50 animate-ping" />
                      <span className="absolute inset-1 rounded-full bg-emerald-500/20 border border-emerald-400/80" />
                      
                      <div className="relative w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg group-hover:bg-emerald-400 transition-colors">
                        <Footprints className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* Portal Badge Card */}
                    <div className="mt-1.5 bg-[#0b0e14]/95 backdrop-blur-md border border-emerald-500/40 px-3 py-1.5 rounded-xl shadow-2xl text-center group-hover:border-emerald-400 transition-colors whitespace-nowrap">
                      <span className="text-xs font-bold text-emerald-300 block leading-tight">
                        {portal.label}
                      </span>
                      <span className="text-[10px] font-mono text-white/50 block">
                        {portal.sublabel}
                      </span>
                    </div>
                  </button>
                </div>
              );
            })}

            {/* Architectural Dimension Callouts (When Ruler tool is active) */}
            {showDimensions && activeRoom.dimensions.map((dim) => {
              const pos = projectAngleToScreen(dim.yaw, dim.pitch);
              if (!pos) return null;

              return (
                <div
                  key={dim.id}
                  style={{
                    position: "absolute",
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    transform: "translate(-50%, -50%)",
                    zIndex: 30
                  }}
                  className="pointer-events-none select-none animate-in fade-in zoom-in duration-300"
                >
                  <div className="bg-[#0b0e14]/90 backdrop-blur-md border border-emerald-400/60 px-3 py-1.5 rounded-lg shadow-xl text-center">
                    <span className="text-[10px] font-mono text-white/60 block uppercase">
                      {dim.label}
                    </span>
                    <span className="text-xs font-bold font-mono text-emerald-400 block">
                      {dim.value}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Interactive Hotspot Pins Rendered on Top of Canvas */}
            {activeRoom.hotspots.map((hs) => {
              const pos = projectAngleToScreen(hs.yaw, hs.pitch);
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
                    zIndex: isSelected ? 45 : 25
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

            {/* Tour Pro 360 Feature: Interactive 2D Floor Plan with Real-Time Rotating Radar Cone */}
            {showFloorPlan && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-16 left-4 z-35 bg-[#0b0e14]/95 backdrop-blur-xl border border-white/20 rounded-2xl p-3 shadow-2xl w-[190px] sm:w-[220px] transition-all animate-in fade-in slide-in-from-top-2 duration-300 select-none"
              >
                <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-white/10 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Map className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-mono text-[10px] font-bold text-white uppercase tracking-wider">Villa Floor Plan</span>
                  </div>
                  <button
                    onClick={() => setShowFloorPlan(false)}
                    className="text-white/40 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>

                {/* Floor Plan Blueprint Layout Visualizer */}
                <div className="relative w-full h-[140px] bg-[#07090d] border border-white/15 rounded-xl overflow-hidden p-2">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />

                  {/* Room Boundary Blocks */}
                  {ROOMS_DATA.map((room, rIdx) => {
                    const isCurrent = activeRoomIndex === rIdx;
                    return (
                      <button
                        key={room.id}
                        onClick={() => switchRoom(rIdx)}
                        style={{
                          left: `${room.mapCoords.x}%`,
                          top: `${room.mapCoords.y}%`,
                          transform: "translate(-50%, -50%)"
                        }}
                        className="absolute flex flex-col items-center cursor-pointer group z-10"
                        title={`Jump to ${room.name}`}
                      >
                        {/* Radar Cone on Active Room Node */}
                        {isCurrent && (
                          <div
                            style={{
                              position: "absolute",
                              width: "70px",
                              height: "70px",
                              transform: `rotate(${getCompassDegrees() + 90}deg)`,
                              pointerEvents: "none",
                              zIndex: 5
                            }}
                          >
                            <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow">
                              {/* 60-degree Field of view Radar light beam */}
                              <path
                                d="M 50 50 L 20 5 A 50 50 0 0 1 80 5 Z"
                                fill="rgba(197, 168, 128, 0.4)"
                                stroke="rgba(197, 168, 128, 0.8)"
                                strokeWidth="1"
                              />
                            </svg>
                          </div>
                        )}

                        {/* Node Beacon */}
                        <div className={`relative w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                          isCurrent
                            ? "bg-amber-400 ring-4 ring-amber-400/30 scale-125"
                            : "bg-white/30 hover:bg-white hover:scale-110"
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${isCurrent ? "bg-stone-950" : "bg-white"}`} />
                        </div>

                        <span className={`text-[8px] font-mono tracking-wider uppercase mt-1 px-1 py-0.2 rounded whitespace-nowrap ${
                          isCurrent ? "bg-amber-400/20 text-amber-300 font-bold" : "text-white/50 group-hover:text-white"
                        }`}>
                          {room.name.split(" ")[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 flex items-center justify-between text-[9px] font-mono text-white/50">
                  <span>Golden cone = Radar FOV</span>
                  <span className="text-amber-400">Click node to jump</span>
                </div>
              </div>
            )}

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

            {/* Tour Pro 360: Collapsible Bottom Thumbnail Scene Strip (Tour Reel) */}
            {showSceneReel && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-4 left-4 right-4 z-25 flex justify-center pointer-events-auto"
              >
                <div className="flex items-center gap-2 bg-[#0b0e14]/90 backdrop-blur-xl border border-white/20 p-1.5 rounded-2xl shadow-2xl overflow-x-auto max-w-full">
                  {ROOMS_DATA.map((room, rIdx) => {
                    const isCurrent = activeRoomIndex === rIdx;
                    return (
                      <button
                        key={room.id}
                        onClick={() => switchRoom(rIdx)}
                        className={`group relative flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                          isCurrent
                            ? "bg-brand-forest/60 border border-amber-400/80 shadow-md ring-1 ring-amber-400/40"
                            : "hover:bg-white/10 border border-transparent"
                        }`}
                      >
                        <div className="w-9 h-7 rounded-lg overflow-hidden bg-stone-900 shrink-0 border border-white/20">
                          <img
                            src={room.fallbackImage}
                            alt={room.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <div className="text-left">
                          <span className={`text-[11px] font-bold block leading-tight ${isCurrent ? "text-amber-300" : "text-white/80"}`}>
                            {room.name}
                          </span>
                          <span className="text-[9px] font-mono text-white/40 block">
                            {room.specs.area.split(" ")[0]} Sq.Ft
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom Floating Info Pill (Desktop only) */}
            <div className="absolute bottom-4 right-4 z-20 pointer-events-none select-none hidden lg:flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-white/60 text-[10px] font-mono">
              <Info className="w-3 h-3 text-amber-400" />
              <span>Tour Pro 360 · Radar Floor Plan · Click Chevrons to Walk</span>
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
