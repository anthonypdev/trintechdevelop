import React, { useRef, useEffect } from 'react';

// React component for the WebGL shader background
const ShaderBackground = ({ canvasRef }) => {

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
        
        // This mixes the result with a mid-gray to prevent harsh extremes.
        final_color = mix(final_color, vec3(0.5), 0.3);

        // Blend with a dark gray color
        vec3 dark_color = vec3(0.08);
        final_color=mix(dark_color, final_color, min(time*.1,1.));
        final_color=clamp(final_color, 0.08, 1.0);
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

export default ShaderBackground;