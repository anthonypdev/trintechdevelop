const { useRef, useEffect } = React;

window.NoiseOverlay = ({ sourceCanvasRef }) => {
  const overlayCanvasRef = useRef(null);
  const animationFrameId = useRef(null);

  useEffect(() => {
    const overlayCanvas = overlayCanvasRef.current;
    const glCanvas = sourceCanvasRef.current;
    if (!overlayCanvas || !glCanvas) return;

    const ctx = overlayCanvas.getContext('2d');
    const gl = glCanvas.getContext('webgl2');

    // Create a temporary canvas for sampling the WebGL background
    const sampleCanvas = document.createElement('canvas');
    const sampleCtx = sampleCanvas.getContext('2d');

    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio);
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      overlayCanvas.width = width * dpr;
      overlayCanvas.height = height * dpr;
      overlayCanvas.style.width = `${width}px`;
      overlayCanvas.style.height = `${height}px`;

      sampleCanvas.width = overlayCanvas.width;
      sampleCanvas.height = overlayCanvas.height;
    };

    const draw = () => {
      if (!gl) {
        console.error("Could not get WebGL2 context for sampling.");
        return;
      }
      
      const width = overlayCanvas.width;
      const height = overlayCanvas.height;
      ctx.clearRect(0, 0, width, height);

      // 1. Get brightness data from the main WebGL canvas
      const imageData = new Uint8Array(width * height * 4);
      gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, imageData);
      
      // We draw it to a 2D canvas to use getImageData, which is more convenient
      sampleCtx.putImageData(new ImageData(new Uint8ClampedArray(imageData.buffer), width, height), 0, 0);
      const pixels = sampleCtx.getImageData(0, 0, width, height);
      const data = pixels.data;

      const noiseData = ctx.createImageData(width, height);

      // Perlin Noise function for atmospheric layer
      const perlin = {
        rand_vect: function(){
          let theta = Math.random() * 2 * Math.PI;
          return {x: Math.cos(theta), y: Math.sin(theta)};
        },
        dot_prod_grid: function(x, y, vx, vy){
          let g_vect;
          let d_vect = {x: x - vx, y: y - vy};
          if (this.vectors[vx] && this.vectors[vx][vy]){
            g_vect = this.vectors[vx][vy];
          } else {
            g_vect = this.rand_vect();
            if(!this.vectors[vx]) this.vectors[vx] = {};
            this.vectors[vx][vy] = g_vect;
          }
          return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
        },
        smootherstep: function(x){
          return 6*x**5 - 15*x**4 + 10*x**3;
        },
        interp: function(x, a, b){
          return a + this.smootherstep(x) * (b-a);
        },
        seed: function(){
          this.vectors = {};
        },
        get: function(x, y){
          let xf = Math.floor(x);
          let yf = Math.floor(y);
          //interpolate
          let tl = this.dot_prod_grid(x, y, xf,   yf);
          let tr = this.dot_prod_grid(x, y, xf+1, yf);
          let bl = this.dot_prod_grid(x, y, xf,   yf+1);
          let br = this.dot_prod_grid(x, y, xf+1, yf+1);
          let xt = this.interp(x-xf, tl, tr);
          let xb = this.interp(x-xf, bl, br);
          return this.interp(y-yf, xt, xb);
        }
      };
      perlin.seed();

      const centerX = width / 2;
      const centerY = height / 2;
      const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

      // 2. Generate noise layers pixel by pixel
      for (let i = 0; i < data.length; i += 4) {
        const x = (i / 4) % width;
        const y = Math.floor((i / 4) / width);

        // Get original pixel's luminosity (0-1)
        const lum = data[i] / 255;

        // --- Depth Masking Calculation ---
        const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        const radialFalloff = 1.0 - (dist / maxDist); // 1 at center, 0 at edges
        
        let brightnessMask = 1.0 - Math.pow(lum, 4); // Reduces noise in bright areas
        let cornerMask = 1.0 + (1.0 - radialFalloff) * 0.3; // Increases density in corners

        // --- Layer 1: Film Grain ---
        const grainOpacity = 0.20 * brightnessMask * cornerMask;
        const grain = (Math.random() - 0.5) * 2 * 255 * grainOpacity;
        
        // --- Layer 2: Atmospheric Noise ---
        const atmosphericScale = 400 / width; // Scale for 300-500% effect
        const p_noise = (perlin.get(x * atmosphericScale, y * atmosphericScale) + 1) / 2;
        const atmosphericOpacity = 0.10; // 8-12% opacity
        
        // --- Layer 3: Digital Artifacts (Scanlines) ---
        const scanline = (y % 4 === 0) ? (0.04 * brightnessMask) : 0; // 3-5% opacity, 1px high, 3px apart

        // --- Combine Layers ---
        // Start with atmospheric noise (blue-cyan tint)
        let r = p_noise * 10 * atmosphericOpacity; // Subtle R
        let g = p_noise * 25 * atmosphericOpacity; // More G
        let b = p_noise * 30 * atmosphericOpacity; // Most B for cyan tint

        // Add film grain (warm tint)
        r += grain * 1.0; // More red for warmth
        g += grain * 0.9;
        b += grain * 0.8;
        
        // Add scanlines (cyan tint)
        r += scanline * 255 * 0.5;
        g += scanline * 255 * 0.9;
        b += scanline * 255 * 1.0;

        noiseData.data[i] = r;
        noiseData.data[i + 1] = g;
        noiseData.data[i + 2] = b;
        noiseData.data[i + 3] = 255; // We control opacity via blending
      }

      ctx.putImageData(noiseData, 0, 0);
      
      // Use 'overlay' or 'soft-light' blending to mix with the background
      ctx.globalCompositeOperation = 'soft-light';
      ctx.drawImage(glCanvas, 0, 0, width, height);

      // Reset composite operation for next frame
      ctx.globalCompositeOperation = 'source-over';

      animationFrameId.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [sourceCanvasRef]);

  return <canvas ref={overlayCanvasRef} style={{ 
    position: 'absolute', 
    top: 0, 
    left: 0,
    zIndex: 0, // Sits on top of the background but behind content
    pointerEvents: 'none' // Allows clicks to pass through
  }} />;
};

