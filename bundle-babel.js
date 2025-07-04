// TrinityAI Website Bundle - Generated on 2025-07-04T01:30:36.620Z
// This bundle requires Babel to be loaded in the browser for JSX transformation


// ==================== ShaderBackground ====================
const { useEffect } = React;

// React component for the WebGL shader background
window.ShaderBackground = ({ canvasRef }) => {

  useEffect(() => {
    const canvas = canvasRef.current;
    // Request a 'webgl2' context
    const gl = canvas.getContext('webgl2');

    // Check for WebGL2 support
    if (!gl) {
      console.error('WebGL 2 is not supported by your browser.');
      return;
    }
    
    // Set the clear color to black
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Function to handle resizing the canvas
    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    };
    resize();
    window.addEventListener('resize', resize);

    // Vertex shader for WebGL2
    const vertexShaderSource = `#version 300 es
      in vec4 position;
      void main() {
        gl_Position = position;
      }
    `;

    // Fragment shader
    const fragmentShaderSource = `#version 300 es
      precision highp float;
      out vec4 O;
      uniform float time;
      uniform vec2 resolution;
      #define FC gl_FragCoord.xy
      #define R resolution
      #define T (time+660.)
      
      float rnd(vec2 p) {
        p=fract(p*vec2(12.9898,78.233));
        p+=dot(p,p+34.56);
        return fract(p.x*p.y);
      }

      float noise(vec2 p) {
        vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
        float a=rnd(i), b=rnd(i+vec2(1,0)), c=rnd(i+vec2(0,1)), d=rnd(i+1.);
        return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
      }

      float fbm(vec2 p) {
        float t=.0, a=1., h=.0; 
        mat2 m=mat2(1.,-1.2,.2,1.2);
        for (float i=.0; i<5.; i++) {
          t+=a*noise(p);
          p*=2.*m;
          a*=.5;
          h+=a;
        }
        return t/h;
      }

      void main() {
        vec2 uv=(FC-.5*R)/R.y;
        vec2 k=vec2(0,T*.015); 
        vec3 col=vec3(1);
        uv.x+=.25;
        uv*=vec2(2,1);
        float n=fbm(uv*.28+vec2(-T*.01,0));
        n=noise(uv*3.+n*2.);
        col.r-=fbm(uv+k+n);
        col.g-=fbm(uv*1.003+k+n+.003);
        col.b-=fbm(uv*1.006+k+n+.006);
        
        // --- BLOOM EFFECT LOGIC ---
        float grayscale = dot(col, vec3(0.333));
        vec3 base_color = vec3(grayscale);
        float bloom_factor = smoothstep(0.7, 1.0, grayscale);
        vec3 bloom_color = base_color * bloom_factor * 0.4;
        vec3 final_color = base_color + bloom_color;
        
        // Reduce gray mixing to make background brighter
        final_color = mix(final_color, vec3(0.5), 0.1);

        // Remove dark overlay - keep natural brightness
        final_color=clamp(final_color, 0.0, 1.0);
        O=vec4(final_color,1);
      }
    `;

    const createShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const createProgram = (vs, fs) => {
      const program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
        return null;
      }
      return program;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;
    
    const program = createProgram(vertexShader, fragmentShader);
    if (!program) return;

    const positionAttributeLocation = gl.getAttribLocation(program, 'position');
    const resolutionUniformLocation = gl.getUniformLocation(program, 'resolution');
    const timeUniformLocation = gl.getUniformLocation(program, 'time');

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]),
      gl.STATIC_DRAW
    );

    let animationFrameId;
    const render = (time) => {
      time *= 0.001; // Convert time to seconds
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(resolutionUniformLocation, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform1f(timeUniformLocation, time);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      
      animationFrameId = requestAnimationFrame(render);
    };

    render(0);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ 
    position: 'fixed', 
    top: 0, 
    left: 0, 
    width: '100vw', 
    height: '100vh', 
    zIndex: -2 
  }} />;
};




// ==================== NoiseOverlay ====================
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




// ==================== LiquidGlassButton ====================
// Shared styling system with header

/**
 * A reusable button styled using the LiquidGlass visual system.
 * Supports label, click handler, and optional inline styles.
 */
window.LiquidGlassButton = ({ label = 'Click Me', onClick, style = {}, className = '' }) => {
  return (
    <button
      className={`liquid-button ${className}`}
      onClick={onClick}
      style={style}
    >
      {label}
    </button>
  );
};




// ==================== SpectroButton ====================
// SpectroButton component

window.SpectroButton = () => {
  return (
    <>
      <a href="#contact" className="spectro-button" style={{textDecoration: 'none', display: 'inline-flex'}}>Get Started</a>
      <style>{`
        :root {
          /*  change this for scaling  */
          --m: 1rem;

          --red: #FF6565;
          --pink: #FF64F9;
          --purple: #6B5FFF;
          --blue: #4D8AFF;
          --green: #5BFF89;
          --yellow: #FFEE55;
          --orange: #FF6D1B;
        }

        .spectro-button {
          border: calc(0.08 * var(--m)) solid transparent;
          position: relative;
          color: #F3F3F3;
          font-family: 'Space Grotesk', sans-serif;
          font-size: var(--m);
          border-radius: calc(0.7 * var(--m));
          padding: calc(0.5 * var(--m)) calc(1 * var(--m));
          display: flex;
          justify-content: center;
          cursor: pointer;

          background:
            linear-gradient(#121213, #121213),
            linear-gradient(#121213 50%, rgba(18, 18, 19, 0.6) 80%, rgba(18, 18, 19, 0)),
            linear-gradient(90deg, var(--orange), var(--yellow), var(--green), var(--blue), var(--purple), var(--pink), var(--red));
          background-origin: border-box;
          background-clip: padding-box, border-box, border-box;
          background-size: 200%;
          animation: animate 2s infinite linear;
        }

        .spectro-button::before {
          content: '';
          background: linear-gradient(90deg, var(--orange), var(--yellow), var(--green), var(--blue), var(--purple), var(--pink), var(--red));
          height: 30%;
          width: 60%;
          position: absolute;
          bottom: -20%;
          z-index: -5;
          background-size: 200%;
          animation: animate 2s infinite linear;
          filter: blur(calc(0.8 * var(--m)));
        }

        .spectro-button:hover,
        .spectro-button:hover::before {
          animation: animate 0.5s infinite linear;
        }

        @keyframes animate {
          0% {
            background-position: 0;
          }
          100% {
            background-position: 200%;
          }
        }

        @media screen and (max-width: 1000px) {
          :root {
            --m: 0.8rem;
          }
        }
      `}</style>
    </>
  );
};




// ==================== ContentModal ====================
const { useState } = React;

window.ContentModal = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState('home');

  if (!isOpen) return null;

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return (
          <div className="modal-section">
            <h1 className="modal-title">TrinityAi</h1>
            <p className="modal-subtitle">
              At TrinityAi, we bridge the gap between complex data and tangible business outcomes. We are a dedicated team of AI specialists, data scientists, and full-stack engineers committed to developing bespoke Artificial Intelligence, Machine Learning, and Deep Learning solutions.
            </p>
          </div>
        );
      
      case 'products':
        return (
          <div className="modal-section">
            <h2 className="modal-title">Our Products</h2>
            <p className="modal-subtitle">Cutting-edge AI solutions designed to transform your business operations</p>
            <div className="products-preview">
              <div className="product-item">
                <h3>TrinityAI Insight Engine™</h3>
                <p>The Intelligent Search and Discovery Tool</p>
              </div>
              <div className="product-item">
                <h3>TrinityAI Conversational Front Desk™</h3>
                <p>The 24/7 AI-Powered Receptionist</p>
              </div>
              <div className="product-item">
                <h3>TrinityAI Companion™</h3>
                <p>The Personalized AI Partner for Your Workflow</p>
              </div>
            </div>
          </div>
        );
      
      case 'about':
        return (
          <div className="modal-section">
            <h2 className="modal-title">About TrinityAi</h2>
            <p className="modal-text">
              We don't just build models; we build partnerships. By integrating seamlessly with your team, we analyze your unique challenges and opportunities to deliver robust, scalable, and fully-managed AI systems. From intelligent automation to predictive analytics, TrinityAi empowers your business to operate with greater insight, speed, and competitive advantage in a data-driven world.
            </p>
          </div>
        );
      
      case 'contact':
        return (
          <div className="modal-section">
            <h2 className="modal-title">Ready to Transform Your Business?</h2>
            <p className="modal-text">
              Let's discuss how TrinityAi can help bridge the gap between your data and business outcomes.
            </p>
            <div className="modal-cta">
              <SpectroButton />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container liquid-glass-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <nav className="modal-nav">
            <button 
              className={`modal-nav-btn ${activeSection === 'home' ? 'active' : ''}`}
              onClick={() => setActiveSection('home')}
            >
              Home
            </button>
            <button 
              className={`modal-nav-btn ${activeSection === 'products' ? 'active' : ''}`}
              onClick={() => setActiveSection('products')}
            >
              Products
            </button>
            <button 
              className={`modal-nav-btn ${activeSection === 'about' ? 'active' : ''}`}
              onClick={() => setActiveSection('about')}
            >
              About
            </button>
            <button 
              className={`modal-nav-btn ${activeSection === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveSection('contact')}
            >
              Contact
            </button>
          </nav>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};




// ==================== App ====================
const { useRef } = React;
const { ShaderBackground, SpectroButton } = window;

function App() {
    const shaderCanvasRef = useRef(null);

    return (
        <div className="App">
            <ShaderBackground canvasRef={shaderCanvasRef} />
            
            <nav className="nav liquid-glass" id="nav">
                <div className="container liquid-glass-content">
                    <div className="nav-container">
                        <a href="#" className="nav-logo">
                            <span>TrinityAI</span>
                        </a>

                        <ul className="nav-menu liquid-glass">
                            <div className="liquid-glass-content">
                                <li><a href="#home" className="nav-link">Home</a></li>
                                <li><a href="#products" className="nav-link">Forge</a></li>
                                <li><a href="#about" className="nav-link">Taius</a></li>
                                <li><a href="#portfolio" className="nav-link">MCP Hub</a></li>
                            </div>
                        </ul>

                        <div onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
                            <SpectroButton />
                        </div>
                    </div>
                </div>
            </nav>
            
            <main className="content">
                <section className="hero" id="home">
                    <div className="container">
                        <div className="hero-content">
                            <img src="/assets/trintechalpha.png" alt="TrinityAi" className="hero-logo" />
                            <h1>Welcome to TrinityAi</h1>
                            <p>The future of artificial intelligence</p>
                        </div>
                    </div>
                </section>
                
                <section className="section reveal" id="products" style={{padding: '6rem 0', textAlign: 'center'}}>
                    <div className="container">
                        <h2 style={{fontSize: '3rem', marginBottom: '2rem', color: 'white'}}>Our Products</h2>
                        <p style={{fontSize: '1.2rem', color: '#cccccc', marginBottom: '3rem'}}>Cutting-edge AI solutions designed to transform your business operations</p>
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem'}}>
                            <div className="reveal" style={{background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)'}}>
                                <h3 style={{color: 'white', marginBottom: '1rem'}}>TrinityAI Insight Engine™</h3>
                                <p style={{color: '#cccccc'}}>The Intelligent Search and Discovery Tool</p>
                            </div>
                            <div className="reveal" style={{background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)'}}>
                                <h3 style={{color: 'white', marginBottom: '1rem'}}>TrinityAI Conversational Front Desk™</h3>
                                <p style={{color: '#cccccc'}}>The 24/7 AI-Powered Receptionist</p>
                            </div>
                            <div className="reveal" style={{background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)'}}>
                                <h3 style={{color: 'white', marginBottom: '1rem'}}>TrinityAI Companion™</h3>
                                <p style={{color: '#cccccc'}}>The Personalized AI Partner for Your Workflow</p>
                            </div>
                        </div>
                    </div>
                </section>
                
                <section className="section reveal" id="about" style={{padding: '6rem 0', textAlign: 'center'}}>
                    <div className="container">
                        <h2 style={{fontSize: '3rem', marginBottom: '2rem', color: 'white'}}>About TrinityAI</h2>
                        <p style={{fontSize: '1.2rem', color: '#cccccc', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8'}}>
                            We don't just build models; we build partnerships. By integrating seamlessly with your team, we analyze your unique challenges and opportunities to deliver robust, scalable, and fully-managed AI systems. From intelligent automation to predictive analytics, TrinityAI empowers your business to operate with greater insight, speed, and competitive advantage in a data-driven world.
                        </p>
                    </div>
                </section>
                
                <section className="section reveal" id="portfolio" style={{padding: '6rem 0', textAlign: 'center'}}>
                    <div className="container">
                        <h2 style={{fontSize: '3rem', marginBottom: '2rem', color: 'white'}}>Portfolio</h2>
                        <p style={{fontSize: '1.2rem', color: '#cccccc', marginBottom: '3rem'}}>Our work speaks for itself</p>
                        <div className="reveal" style={{height: '400px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)'}}>
                            <p style={{color: '#888', fontSize: '1.5rem'}}>Portfolio Coming Soon</p>
                        </div>
                    </div>
                </section>
                
                <section className="section cta reveal" id="contact" style={{padding: '6rem 0', textAlign: 'center', position: 'relative', overflow: 'hidden'}}>
                    <div className="cta-background" style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(ellipse at center, rgba(124, 58, 237, 0.15) 0%, transparent 60%)',
                        animation: 'ctaPulse 4s ease-in-out infinite'
                    }}></div>
                    <div className="container">
                        <div className="cta-content liquid-glass" style={{
                            maxWidth: '800px',
                            margin: '0 auto',
                            padding: '3rem',
                            borderRadius: '24px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0px 16px var(--lg-drop-shadow-blur) rgba(0, 0, 0, 0.35)'
                        }}>
                            <div className="liquid-glass-content">
                                <h2 style={{fontSize: '3rem', marginBottom: '2rem', color: 'white'}}>Ready to Transform Your Business?</h2>
                                <p style={{fontSize: '1.2rem', color: '#cccccc', marginBottom: '3rem'}}>
                                    Let's discuss how TrinityAI can help bridge the gap between your data and business outcomes.
                                </p>
                                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center'}}>
                                    <SpectroButton />
                                    <p style={{fontSize: '0.9rem', color: '#888', marginTop: '1rem'}}>Contact us at: hello@trinityai.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                <section id="bottom" style={{padding: '2rem 0', textAlign: 'center'}}>
                    <div className="container">
                        <p style={{color: '#666', fontSize: '0.9rem'}}>&copy; 2024 TrinityAI. All rights reserved.</p>
                    </div>
                </section>
            </main>
            
            {/* Required SVG filters for liquid glass effect */}
            <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style={{position:'absolute', overflow:'hidden', zIndex: -100}}>
                <defs>
                    {/* Filter for the liquid distortion effect */}
                    <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="92" result="noise" />
                        <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
                        <feDisplacementMap in="SourceGraphic" in2="blurred" scale="77" xChannelSelector="R" yChannelSelector="G" />
                    </filter>
                    
                    {/* Mask to create the inset blur effect on the edges only */}
                    <mask id="edge-blur-mask" maskUnits="objectBoundingBox" x="0" y="0" width="1" height="1">
                        <rect width="1" height="1" fill="white" rx="0.09" /> 
                        <rect x="0.1" y="0.15" width="0.8" height="0.7" fill="black" rx="0.06" />
                    </mask>
                </defs>
            </svg>
        </div>
    );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Add smooth scrolling for navigation links and navbar scroll effect
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Navbar scroll effect with 100px threshold
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('nav');
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    
    // Intersection Observer for reveal animations
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
});

