# Danam Holdings - Premier Civil Engineering & Turnkey EPC Website

A Next.js (App Router) web application featuring interactive 3D architectural walkarounds, 360° VR interior virtual tours, BOQ cost calculator, and CRM integration.

## Key Technical Documentation
- **[3D & 360° VR Tour Pro Architecture Guide](./3D_AND_360_VIEW_GUIDE.md)**: Master technical reference explaining how the interactive 3D model viewer and WebGL 360 equirectangular panoramic walkthrough are engineered, including shaders, projection math, NPOT texture fixes, camera calibration, and copy-paste boilerplate snippets.

## Core Features
1. **Interactive 3D Walkaround (`Project3DExperience.tsx`)**:
   - Native WebGL GLB viewer powered by Google's `@google/model-viewer`
   - Calibrated architectural camera target & close-up orbit
   - Smooth gesture hints, zoom controls, and civil engineering specifications
2. **360° Interior Tour Pro (`InteriorTour360.tsx`)**:
   - Custom pure WebGL equirectangular shader engine with zero heavy 3rd-party dependencies
   - 2048x1024 power-of-two offscreen canvas resampler (eliminating mobile black screens)
   - In-memory texture caching with 0ms room transitions
   - Dynamic 3D-to-2D perspective projection for engineering hotspots, nav portals, and digital tape measurement callouts
   - Interactive radar floor plan with rotating camera view cone
   - Real-time shader-based day/night color grading
3. **Turntable 360° Exterior Sequence (`VirtualTour360.tsx`)**:
   - 120-frame turntable sequence with layer switching (Exterior, RCC Skeleton Frame, Night Mode)
4. **Universal Project Modal (`ProjectInteractiveModal.tsx`)**:
   - Enables 3D, 360, civil specs, and before/after comparisons on every project portfolio card

## Tech Stack
- **Framework**: Next.js 16 (App Router) with React 19 & TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **3D & Graphics**: `@google/model-viewer` + Raw WebGL 1.0 Shaders
- **Localization**: English & Tamil support (`src/i18n/`)
