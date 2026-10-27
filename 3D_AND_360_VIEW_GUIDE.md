# 3D Architectural Walkaround & 360° VR Tour Pro Architecture Guide

> **Master Reference Document**: Complete technical design, shader implementations, mathematical models, bug resolutions, and copy-paste components for Interactive 3D GLB Walkarounds and 360° WebGL Equirectangular Panoramic Virtual Tours in Next.js / React projects.

---

## Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Interactive 3D Walkaround (`@google/model-viewer`)](#2-interactive-3d-walkaround-googlemodel-viewer)
   - [Why `<model-viewer>` instead of Three.js / Sketchfab](#why-model-viewer-instead-of-threejs--sketchfab)
   - [Client-Side Dynamic Script Loading](#client-side-dynamic-script-loading)
   - [Critical Parameter Configurations](#critical-parameter-configurations)
   - [Eliminating Camera Push/Snap on First Click (`disable-tap`, `disable-pan`)](#eliminating-camera-pushsnap-on-first-click)
   - [Building Center Calibration (`camera-target`)](#building-center-calibration-camera-target)
   - [Close-Up Immersive Zoom Orbit](#close-up-immersive-zoom-orbit)
   - [Mobile Touch Protection (`touch-action: pan-y`)](#mobile-touch-protection-touch-action-pan-y)
   - [Draco-Compressed GLB Asset Serving](#draco-compressed-glb-asset-serving)
3. [Interactive 360° VR Tour Pro (Custom Pure WebGL Shader Pipeline)](#3-interactive-360-vr-tour-pro-custom-pure-webgl-shader-pipeline)
   - [Equirectangular Vertex & Fragment Shaders](#equirectangular-vertex--fragment-shaders)
   - [The WebGL NPOT (Non-Power-of-Two) Black Screen Fix](#the-webgl-npot-non-power-of-two-black-screen-fix)
   - [Seamless 360 Seam Wrapping (`fract` + `clamp`)](#seamless-360-seam-wrapping-fract--clamp)
   - [In-Memory Texture Canvas Cache & 0ms Room Switching](#in-memory-texture-canvas-cache--0ms-room-switching)
   - [Spherical-to-Screen Perspective Projection (`projectAngleToScreen`)](#spherical-to-screen-perspective-projection-projectangletoscreen)
   - [Interactive Hotspots, Teleport Nav Portals & Digital Ruler](#interactive-hotspots-teleport-nav-portals--digital-ruler)
   - [Radar Floor Plan with Dynamic FOV View Cone](#radar-floor-plan-with-dynamic-fov-view-cone)
   - [Day / Night Ambient Color Grading in Shader](#day--night-ambient-color-grading-in-shader)
4. [Turntable 360° Exterior Image Sequence (`VirtualTour360`)](#4-turntable-360-exterior-image-sequence-virtualtour360)
   - [Frame-Scrubbing Technique & Multi-Layer Views](#frame-scrubbing-technique--multi-layer-views)
5. [Universal Interactive Modal System (`ProjectInteractiveModal`)](#5-universal-interactive-modal-system-projectinteractivemodal)
6. [Ready-to-Use Boilerplate Snippets](#6-ready-to-use-boilerplate-snippets)
7. [Troubleshooting & Gotchas Checklist](#7-troubleshooting--gotchas-checklist)

---

## 1. Architecture Overview

```
src/
├── components/
│   ├── Project3DExperience.tsx       # Standalone 3D elevation viewer (GLB) with zoom & specs
│   ├── InteriorTour360.tsx           # Full WebGL Tour Pro 360° interior walkthrough
│   ├── VirtualTour360.tsx            # Exterior 120-frame turntable sequence (Day/Skeleton/Night)
│   ├── ProjectInteractiveModal.tsx   # Universal popup modal for cards (3D, 360, Specs, Before/After)
│   └── BeforeAfterSlider.tsx         # Interactive renovation image comparison
├── data/
│   └── projectsData.ts               # Structured schemas with camera targets, orbits, and 360 rooms
└── public/
    ├── models/
    │   ├── villa.glb                 # Draco-compressed 3D architectural asset (~13MB)
    │   └── LuxuryVilla_site_draco.glb
    └── panoramas/
        ├── living-room.jpg           # 2:1 Equirectangular 360° images (resampled to 2048x1024)
        ├── master-bedroom.jpg
        ├── modular-kitchen.jpg
        └── sky-terrace.jpg
```

---

## 2. Interactive 3D Walkaround (`@google/model-viewer`)

### Why `<model-viewer>` instead of Three.js / Sketchfab
- **Zero Third-Party Branding / White-Label**: No Sketchfab watermarks, logos, or slow iframe ads.
- **Production Performance**: Google's `<model-viewer>` is written on top of Three.js with built-in PBR (Physically Based Rendering), tone-mapping, shadow rendering, WebXR/AR pass-through, and Draco decoding out of the box.
- **Bundle Footprint**: Loaded as an asynchronous web component (~400KB compressed), keeping initial Next.js first-load JS minimal.

### Client-Side Dynamic Script Loading
To prevent Next.js SSR hydration mismatches (`HTMLElement is not defined` or custom element conflicts), load the web component dynamically inside `useEffect`:

```tsx
// Inside component:
const [is3dLoaded, setIs3dLoaded] = useState(false);

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
```

Add TypeScript typings in `src/types/model-viewer.d.ts` or at top of file:
```ts
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": any;
    }
  }
}
```

### Critical Parameter Configurations
Here is the calibrated production configuration:

```tsx
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
  camera-orbit={`35deg 72deg ${isMobile ? 95 : 80}%`}
  camera-target={selectedProject.cameraTarget || "0m 4.5m -5m"}
  min-camera-orbit="auto auto 40%"
  max-camera-orbit="auto auto 200%"
  field-of-view="30deg"
  shadow-intensity="1.2"
  shadow-softness="0.8"
  exposure="1.0"
  loading="eager"
  reveal="auto"
  interaction-prompt="none"
  style={{
    width: "100%",
    height: "100%",
    backgroundColor: "#0a0a0d",
    outline: "none",
    touchAction: "pan-y",
  }}
>
  <div slot="progress-bar" style={{ display: "none" }} />
</model-viewer>
```

### Eliminating Camera Push/Snap on First Click
By default, `<model-viewer>` exhibits two jarring behaviors on user interaction:
1. **Tap-to-Recenter Jump**: Clicking/tapping any part of the model automatically casts a ray and snaps the camera target to that clicked surface point.
   - **Fix**: Add the `disable-tap` attribute.
2. **Right-Click/Multi-Touch Pan Disorientation**: Pan controls often drag the building off-screen so the user gets lost.
   - **Fix**: Add the `disable-pan` attribute.
3. **Turntable Jump on Pointer Down**: When auto-rotation is abruptly paused, `<model-viewer>` can snap to default angular coordinates.
   - **Fix**: Set `rotation-per-second="6deg"` (very subtle slow rotation) and `auto-rotate-delay="999999"` once the user touches the canvas:

```tsx
useEffect(() => {
  const mv = modelViewerRef.current;
  if (!mv) return;

  const handleUserTouch = () => {
    setShowGestureHint(false);
  };

  mv.addEventListener("pointerdown", handleUserTouch);
  mv.addEventListener("touchstart", handleUserTouch, { passive: true });
  mv.addEventListener("wheel", handleUserTouch, { passive: true });

  return () => {
    mv.removeEventListener("pointerdown", handleUserTouch);
    mv.removeEventListener("touchstart", handleUserTouch);
    mv.removeEventListener("wheel", handleUserTouch);
  };
}, [is3dLoaded, selectedProject.id]);
```

### Building Center Calibration (`camera-target`)
Most raw 3D architectural GLB/GLTF exports have their local origin `(0, 0, 0)` at the ground plane corner or center of plot rather than the visual center of the 2-to-3 storey building.
- Without calibration, the building spins eccentrically and wobbles out of frame.
- **Calibrated Value for Residential Villas**:
  `cameraTarget: "0m 4.5m -5m"`
  - `X: 0m` (centered horizontally between left and right building wings)
  - `Y: 4.5m` (elevated to First-Floor slab level, eye-level middle of 2 storeys)
  - `Z: -5m` (centered within the main living core rather than the far front gate or back fence)

#### How to Calculate `camera-target` for ANY New GLB Model (Python Utility):
Run this quick script in terminal on any `.glb` file to instantly find the exact bounding box and center coordinates:
```bash
python -c "
import struct, json, numpy as np

with open('public/models/your_model.glb', 'rb') as f:
    f.seek(12)
    chunk_len, chunk_type = struct.unpack('<II', f.read(8))
    gltf = json.loads(f.read(chunk_len).decode('utf-8'))

nodes = gltf.get('nodes', [])
meshes = gltf.get('meshes', [])
accessors = gltf.get('accessors', [])

# Find all meshes belonging to the main structure (ignore distant site/roads)
corners = []
for node in nodes:
    name = node.get('name', '')
    if any(k in name for k in ['Slab', 'Wall', 'Roof', 'Pillar', 'Window', 'Door', 'Stair']):
        m_idx = node.get('mesh')
        if m_idx is not None:
            for prim in meshes[m_idx].get('primitives', []):
                acc = accessors[prim['attributes']['POSITION']]
                if 'min' in acc and 'max' in acc:
                    corners.append(acc['min'])
                    corners.append(acc['max'])

if corners:
    c = np.array(corners)
    center = (c.min(axis=0) + c.max(axis=0)) / 2.0
    print(f'Recommended camera-target: \"{center[0]:.1f}m {center[1]:.1f}m {center[2]:.1f}m\"')
"
```

### Loading State & Gesture Sync Contract (No Black Screen / No Static 2D Poster)
1. **Never use static 2D image `poster="..."` on the 3D canvas**:
   - Showing a 2D photograph inside `<model-viewer>` causes visual confusion because users expect a real-time rotating 3D viewport.
   - Omit the `poster` attribute entirely so the canvas renders 100% native WebGL.
2. **Sync the White Hand Gesture Overlay to `isModelLoaded`**:
   - Because 3D assets (~13MB) take 1-2 seconds to stream into GPU memory, displaying the gesture hint immediately on page load causes the user to see a waving hand against an empty black background.
   - Track model readiness with the custom DOM `load` event:
```tsx
const [isModelLoaded, setIsModelLoaded] = useState(false);

useEffect(() => {
  setIsModelLoaded(false);
  const mv = modelViewerRef.current;
  if (!mv) return;

  const handleModelLoad = () => setIsModelLoaded(true);
  mv.addEventListener("load", handleModelLoad);
  return () => mv.removeEventListener("load", handleModelLoad);
}, [selectedProject.id, is3dLoaded]);
```
3. **Keep the Gesture Overlay Non-Blocking (`pointer-events-none`)**:
   - The animated hand container MUST have `pointer-events-none`.
   - Any click or drag passes straight through to `<model-viewer>`, giving immediate 60fps orbit response from the very first frame.
4. **Custom Architectural Loader**:
   - While `!isModelLoaded`, show a sleek spinning loader (`Loading 3D Architectural Model...`). As soon as `isModelLoaded` turns `true`, the spinner disappears and the hand gesture fades in directly over the rendered 3D model.

### Close-Up Immersive Zoom Orbit
- Standard model-viewer default radius is `105%` to `120%`, which makes buildings look small and distant.
- **Calibrated Orbit**:
  - Desktop: `35deg 72deg 80%`
  - Mobile: `35deg 72deg 95%`
  - `field-of-view="30deg"` provides telephoto architectural perspective without wide-angle fish-eye distortion.

### Programmatic Zoom In / Zoom Out Controls
```tsx
const zoomCameraIn = () => {
  const mv = modelViewerRef.current;
  if (!mv) return;
  const orbit = mv.getCameraOrbit();
  if (!orbit) return;
  mv.cameraOrbit = `${orbit.theta}rad ${orbit.phi}rad ${orbit.radius * 0.8}m`;
};

const zoomCameraOut = () => {
  const mv = modelViewerRef.current;
  if (!mv) return;
  const orbit = mv.getCameraOrbit();
  if (!orbit) return;
  mv.cameraOrbit = `${orbit.theta}rad ${orbit.phi}rad ${orbit.radius * 1.25}m`;
};

const resetCamera = () => {
  const mv = modelViewerRef.current;
  if (!mv) return;
  mv.cameraOrbit = `35deg 72deg ${isMobile ? 95 : 80}%`;
  mv.cameraTarget = "0m 4.5m -5m";
  mv.fieldOfView = "30deg";
  mv.setAttribute("auto-rotate", "");
};
```

### Mobile Touch Protection (`touch-action: pan-y`)
Embedding full-screen touchable 3D canvases on mobile pages usually blocks users from scrolling down the page.
- Adding `touchAction: "pan-y"` allows single-finger vertical swipes to scroll the webpage naturally, while horizontal swipes rotate the 3D model.

### Draco-Compressed GLB Asset Serving
Store `.glb` files in `public/models/`. When generating models via Blender or gltf-pipeline, compress with Draco geometry compression:
```bash
npx gltf-pipeline -i input.glb -o public/models/villa.glb -d
```
`<model-viewer>` loads the Draco WebAssembly decoders automatically without extra configuration.

---

## 3. Interactive 360° VR Tour Pro (Custom Pure WebGL Shader Pipeline)

Instead of relying on heavy third-party VR libraries (e.g., Pannellum, Marzipano, or Three.js OrbitControls) which add ~500KB+ overhead and introduce cross-browser texture rendering glitches, we created a **pure WebGL 1.0 Shader Pipeline** rendering equirectangular panoramic projections directly onto a full-screen quad.

### Equirectangular Vertex & Fragment Shaders

#### Vertex Shader:
```glsl
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
```

#### Fragment Shader (with Night Mode Grading & Seamless Wrap):
```glsl
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
  // Map screen UV to [-1, 1] normalized space
  vec2 screen = (v_uv - 0.5) * 2.0;
  float tanHalfFov = tan(u_fov * 0.5);
  vec3 ray = normalize(vec3(screen.x * tanHalfFov * u_aspect, -screen.y * tanHalfFov, 1.0));

  // 1. Pitch rotation around X axis
  float cp = cos(u_pitch);
  float sp = sin(u_pitch);
  vec3 rPitch = vec3(
    ray.x,
    ray.y * cp - ray.z * sp,
    ray.y * sp + ray.z * cp
  );

  // 2. Yaw rotation around Y axis
  float cy = cos(u_yaw);
  float sy = sin(u_yaw);
  vec3 rYaw = vec3(
    rPitch.x * cy + rPitch.z * sy,
    rPitch.y,
    -rPitch.x * sy + rPitch.z * cy
  );

  // 3. Convert Cartesian ray direction to Spherical Coordinates (Longitude & Latitude)
  float lon = atan(rYaw.x, rYaw.z);
  float lat = asin(clamp(rYaw.y, -0.9999, 0.9999));

  // 4. Wrap texture coordinates with fract to avoid black border artifacts at 360 wrap seam
  vec2 texCoord = vec2(
    fract(lon / (2.0 * PI) + 0.5),
    clamp(lat / PI + 0.5, 0.001, 0.999)
  );

  vec4 col = texture2D(u_image, texCoord);

  // 5. Night Mode Color Grading: Warm 2700K ambient luxury tint
  if (u_night_factor > 0.0) {
    vec3 nightTint = vec3(col.r * 1.05 + 0.02, col.g * 0.88, col.b * 0.72) * 0.85;
    col.rgb = mix(col.rgb, nightTint, u_night_factor);
  }

  gl_FragColor = col;
}
```

### The WebGL NPOT (Non-Power-of-Two) Black Screen Fix
Standard equirectangular panoramas from cameras/renders are often non-power-of-two (e.g. `3840x1920`, `4000x2000`, `1920x1080`).
- **WebGL 1.0 Requirement**: When a texture is not power-of-two ($2^n \times 2^m$), WebGL strictly forbids `gl.REPEAT` and mipmaps, which frequently causes a black screen or crash on iOS Safari, Android Chrome, and older GPUs.
- **The Solution**: An off-screen canvas rasterizer converts any panorama image into an exact **`2048 x 1024` Power-of-Two Canvas** before uploading to WebGL:

```tsx
const rasterizeImageToPotCanvas = (source: HTMLImageElement): HTMLCanvasElement => {
  const pot = document.createElement("canvas");
  pot.width = 2048;
  pot.height = 1024;
  const ctx = pot.getContext("2d");
  if (ctx) {
    ctx.drawImage(source, 0, 0, 2048, 1024);
  }
  return pot;
};
```

When uploading to the texture:
```tsx
gl.bindTexture(gl.TEXTURE_2D, tex);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, potCanvas);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
```

### In-Memory Texture Canvas Cache & 0ms Room Switching
Network latency when switching between rooms makes 360 virtual tours feel sluggish. We implement:
1. **Module-Scoped Memory Cache**:
   ```tsx
   const textureCanvasCache: Record<string, HTMLCanvasElement> = {};
   ```
2. **Background Preloader on Mount**:
   As soon as the page loads, an asynchronous preloader converts all room panoramas in the background into the POT cache.
3. **Instant 0ms Room Switching**:
   When clicking another room, `textureCanvasCache[targetRoom.id]` returns instantly and uploads synchronously to WebGL without any flicker or network wait.

### Spherical-to-Screen Perspective Projection (`projectAngleToScreen`)
To position HTML hotspots, teleport portals, or measurement lines on top of the rotating 360 canvas:

```tsx
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

  // Calculate delta yaw with -PI to +PI wrapping
  let deltaYaw = targetYaw - currentYaw;
  while (deltaYaw > Math.PI) deltaYaw -= 2 * Math.PI;
  while (deltaYaw < -Math.PI) deltaYaw += 2 * Math.PI;

  const deltaPitch = targetPitch - currentPitch;
  const halfFovX = (currentFov * 0.5) * aspect;
  const halfFovY = currentFov * 0.5;

  // Frustum Culling (Check if hotspot is within the current visible FOV cone)
  if (Math.abs(deltaYaw) > halfFovX + 0.18 || Math.abs(deltaPitch) > halfFovY + 0.18) {
    return null;
  }

  const tanHalfFov = Math.tan(currentFov * 0.5);
  const tanHalfFovX = tanHalfFov * aspect;

  const screenX = (width * 0.5) + (Math.tan(deltaYaw) / tanHalfFovX) * (width * 0.5);
  const screenY = (height * 0.5) - (Math.tan(deltaPitch) / tanHalfFov) * (height * 0.5);

  // Prevent edge clipping
  if (screenX < 24 || screenX > width - 24 || screenY < 24 || screenY > height - 24) {
    return null;
  }

  return { x: screenX, y: screenY };
};
```

### Interactive Hotspots, Teleport Nav Portals & Digital Ruler
Using `projectAngleToScreen()`, we render three types of pins:
1. **Engineering Hotspots**: Pulsing circular markers with category, description, and technical civil specs.
2. **Nav Portals**: Walking footsteps icon (`Footprints`) that teleports the user into an adjacent room with animated yaw alignment:
   ```tsx
   <button onClick={() => switchRoom(portal.targetRoomIndex, portal.yaw)}>
     Walk to {portal.label}
   </button>
   ```
3. **Digital Ruler / Dimension Callouts**: Dimension badges (e.g. `↔ 18' 0" x 20' 0"` or `↕ 14' 6" Ceiling`) showing structural measurements.

### Radar Floor Plan with Dynamic FOV View Cone
An interactive 2D architectural blueprint map with:
- Blue pulsing dot indicating active room position `(mapCoords.x, mapCoords.y)`.
- Directional field-of-view cone rotating smoothly with camera `yaw`:
```tsx
const headingDeg = ((yaw * 180) / Math.PI) % 360;

<svg className="w-16 h-16" viewBox="0 0 100 100" style={{ transform: `rotate(${headingDeg}deg)` }}>
  {/* 60-degree sector showing field-of-view */}
  <path d="M 50 50 L 25 10 A 50 50 0 0 1 75 10 Z" fill="rgba(217, 119, 6, 0.35)" />
</svg>
```

### Day / Night Ambient Color Grading in Shader
Instead of duplicating and downloading multiple 360 images for night views, we implemented real-time architectural lighting in GLSL:
```tsx
uniform float u_night_factor; // 0.0 for Daylight, 0.75 for Night Warm

if (u_night_factor > 0.0) {
  vec3 nightTint = vec3(col.r * 1.05 + 0.02, col.g * 0.88, col.b * 0.72) * 0.85;
  col.rgb = mix(col.rgb, nightTint, u_night_factor);
}
```
This reduces bundle and image download requirements by 50%!

---

## 4. Turntable 360° Exterior Image Sequence (`VirtualTour360`)

For projects where a GLB model is not available or where hyper-realistic V-Ray / Corona rendered passes are used, we built `VirtualTour360.tsx`:

- **120-Frame Sequence**: Frames pre-rendered in 3° increments around the building.
- **Layer Switching**:
  1. `exterior`: Full architectural materials, glazing, and landscaping.
  2. `skeleton`: Structural RCC column, beam, shear wall, and slab frame.
  3. `night`: Architectural warm uplighting and facade illumination.
- **Frame-Scrubbing Math**:
  ```tsx
  const handlePointerMove = (clientX: number) => {
    if (!isDragging) return;
    const deltaX = clientX - startX;
    const framesToAdvance = Math.floor(deltaX / 6); // 6px drag per frame
    if (framesToAdvance !== 0) {
      setFrameIndex((prev) => (prev - framesToAdvance + TOTAL_FRAMES) % TOTAL_FRAMES);
      setStartX(clientX);
    }
  };
  ```

---

## 5. Universal Interactive Modal System (`ProjectInteractiveModal`)

Every project card across the portfolio can open a unified, high-performance modal containing:
1. **Interactive 3D Walkaround** (Eager WebGL model-viewer)
2. **Interactive 360° VR Room Tour** (Equirectangular WebGL shader with room switcher)
3. **Engineering & Civil Specifications** (RCC grade, steel, concrete mix, IS codes)
4. **Before vs After Renovation Slider** (Dual-image interactive handle)

### WhatsApp Deep-Linking Context
When a user clicks "Inquire via WhatsApp" from inside the 3D or 360 viewer, the WhatsApp URL dynamically includes the currently viewed project and active room/hotspot:
```tsx
const handleOpenWhatsApp = () => {
  const msg = encodeURIComponent(
    `Hi Danam Holdings, I am reviewing the 3D Elevation & 360° VR View for "${project.title}" (${project.location}) and would like to build a similar project.`
  );
  window.open(`https://wa.me/918883332499?text=${msg}`, "_blank");
};
```

---

## 6. Ready-to-Use Boilerplate Snippets

### Minimal 360° WebGL React Component
Copy and drop this into any Next.js/React project:

```tsx
"use client";
import React, { useEffect, useRef, useState } from "react";

const VS = `attribute vec2 p; varying vec2 v; void main(){ v=p*0.5+0.5; gl_Position=vec4(p,0.0,1.0); }`;
const FS = `
precision mediump float;
uniform sampler2D img;
uniform float yaw, pitch, fov, aspect;
varying vec2 v;
#define PI 3.141592653589793
void main() {
  vec2 sc = (v - 0.5) * 2.0;
  float th = tan(fov * 0.5);
  vec3 r = normalize(vec3(sc.x * th * aspect, -sc.y * th, 1.0));
  float cp = cos(pitch), sp = sin(pitch);
  vec3 rp = vec3(r.x, r.y * cp - r.z * sp, r.y * sp + r.z * cp);
  float cy = cos(yaw), sy = sin(yaw);
  vec3 ry = vec3(rp.x * cy + rp.z * sy, rp.y, -rp.x * sy + rp.z * cy);
  vec2 uv = vec2(fract(atan(ry.x, ry.z) / (2.0 * PI) + 0.5), clamp(asin(clamp(ry.y, -0.9999, 0.9999)) / PI + 0.5, 0.001, 0.999));
  gl_FragColor = texture2D(img, uv);
}`;

export default function Minimal360({ src }: { src: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [yaw, setYaw] = useState(0);
  const [pitch, setPitch] = useState(0);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const sh = (t: number, s: string) => {
      const o = gl.createShader(t)!;
      gl.shaderSource(o, s);
      gl.compileShader(o);
      return o;
    };
    const pr = gl.createProgram()!;
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(pr);
    gl.useProgram(pr);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(pr, "p");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const tex = gl.createTexture();
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const pot = document.createElement("canvas");
      pot.width = 2048; pot.height = 1024;
      pot.getContext("2d")?.drawImage(img, 0, 0, 2048, 1024);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pot);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    };
    img.src = src;

    let id: number;
    const render = () => {
      if (canvas.clientWidth > 0 && canvas.clientHeight > 0) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      gl.uniform1f(gl.getUniformLocation(pr, "yaw"), yaw);
      gl.uniform1f(gl.getUniformLocation(pr, "pitch"), pitch);
      gl.uniform1f(gl.getUniformLocation(pr, "fov"), 1.25);
      gl.uniform1f(gl.getUniformLocation(pr, "aspect"), canvas.width / canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      id = requestAnimationFrame(render);
    };
    id = requestAnimationFrame(render);
    return () => cancelAnimationFrame(id);
  }, [src, yaw, pitch]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-grab active:cursor-grabbing"
      onPointerDown={(e) => { isDragging.current = true; lastPos.current = { x: e.clientX, y: e.clientY }; }}
      onPointerMove={(e) => {
        if (!isDragging.current) return;
        setYaw((y) => (y - (e.clientX - lastPos.current.x) * 0.0035) % (Math.PI * 2));
        setPitch((p) => Math.max(-1.18, Math.min(1.18, p + (e.clientY - lastPos.current.y) * 0.0035)));
        lastPos.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={() => (isDragging.current = false)}
    />
  );
}
```

---

## 7. Troubleshooting & Gotchas Checklist

| Symptom | Cause | Solution |
| :--- | :--- | :--- |
| **Black screen on iOS/Safari in 360** | NPOT (non-power-of-two) texture dimensions or lack of `CLAMP_TO_EDGE`. | Always resample loaded images to `2048x1024` offscreen canvas before calling `texImage2D()`. |
| **Seam line / black slit in 360 view** | `atan()` wrap boundary crossing 0 to $2\pi$. | Use `fract(lon / (2.0 * PI) + 0.5)` in fragment shader. |
| **Building snaps / jumps on first click** | `<model-viewer>` default tap-to-recenter behavior. | Add `disable-tap` and `disable-pan` attributes. |
| **Building spins off-center / wobbles** | GLB origin is at plot corner, not center of building. | Calibrate `camera-target="0m 4.5m -5m"`. |
| **3D model looks distant on load** | Default orbit radius is too large. | Set `camera-orbit="35deg 72deg 80%"` and `field-of-view="30deg"`. |
| **Cannot scroll page past 3D viewer on mobile** | Canvas captures vertical touch gestures. | Set CSS `touchAction: "pan-y"` on `<model-viewer>`. |
| **Next.js SSR crash on `<model-viewer>`** | Web component evaluated on Node server. | Load script dynamically in `useEffect` and guard with `customElements.get("model-viewer")`. |
| **Hotspot pins drift when zooming / rotating** | Missing aspect ratio or incorrect tangent projection. | Use `Math.tan(deltaYaw) / (Math.tan(fov * 0.5) * aspect)` projection formula. |
| **Slow room switching** | Loading 4MB panorama on every click. | Use module-scoped `textureCanvasCache` and preload all rooms on mount. |
