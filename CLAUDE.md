# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**No build process required** - this is a browser-ready setup:
- **Development**: Open `/workspaces/trintechdevelop/index.html` directly in browser
- **Dependencies**: All loaded via CDN (React, ReactDOM, Babel)
- **Testing**: Manual testing via browser refresh

## Architecture Overview

This is a **personal website** featuring a sophisticated **WebGL shader background** with an **atmospheric noise overlay**. The project uses React components that interact through a reference-passing system for advanced graphics effects.

### Core Component Architecture

**App.js** - Main orchestrator that manages the shader canvas reference and renders all page sections

**ShaderBackground.js** - WebGL 2.0 component rendering animated fractal patterns with:
- Complex fragment shader using Perlin noise and fbm functions
- Time-based animation with bloom effects
- Positioned as fixed background (z-index: -2)

**NoiseOverlay.js** - 2D canvas overlay that samples the WebGL background to generate:
- Film grain with warm color tint
- Atmospheric noise with cyan-blue tint using Perlin noise
- Digital artifacts (scanlines) for retro aesthetic
- Depth masking based on background brightness
- Positioned above background but below content (z-index: 0)

### Component Interaction Flow

```
App.js creates shaderCanvasRef
    ↓
ShaderBackground receives canvasRef → renders WebGL to canvas
    ↓
NoiseOverlay receives sourceCanvasRef → samples WebGL pixels → generates noise → composites layers
    ↓
Main content renders on top with transparency effects
```

## Key Technical Patterns

**Ref-based Communication**: Components communicate through React refs rather than props for sharing the WebGL canvas

**Canvas Pixel Sampling**: NoiseOverlay uses `gl.readPixels()` to sample the WebGL background and generate depth-aware noise effects

**WebGL Resource Management**: Proper cleanup of shaders, programs, and buffers in useEffect cleanup functions

**Mathematical Rendering**: Heavy use of mathematical functions (Perlin noise, fbm, smoothstep) for visual effects

## File Structure

```
/workspaces/trintechdevelop/
├── index.html              # Entry point, loads React via CDN
├── styles.css              # Global styles with backdrop effects
└── components/
    ├── App.js              # Main app component
    ├── ShaderBackground.js # WebGL shader background
    └── NoiseOverlay.js     # Atmospheric noise overlay
```

## Styling Architecture

- **Layered Z-Index**: Background shader (-2), noise overlay (0), content (1)
- **Glass Morphism**: Header uses backdrop-filter for modern glass effect
- **Canvas Positioning**: Fixed positioning with 100vw/100vh for full-screen effects