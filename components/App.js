import React, { useRef } from 'react';
import ShaderBackground from './ShaderBackground.js';
import NoiseOverlay from './NoiseOverlay.js';
import LiquidGlassButton from './LiquidGlassButton.js';
import SpectroButton from './SpectroButton.js';

function App() {
    const shaderCanvasRef = useRef(null);

    return (
        <div className="App">
            <ShaderBackground canvasRef={shaderCanvasRef} />
            <NoiseOverlay sourceCanvasRef={shaderCanvasRef} />
            
            <header className="main-header">
                <div className="header-content">
                    <div className="brand">
                        <h1>TrinityAi</h1>
                    </div>
                    <nav className="nav-buttons">
                        <LiquidGlassButton label="Products" onClick={() => console.log('Products')} />
                        <LiquidGlassButton label="Solutions" onClick={() => console.log('Solutions')} />
                        <LiquidGlassButton label="About" onClick={() => console.log('About')} />
                        <SpectroButton />
                    </nav>
                </div>
            </header>
            
            <main className="content">
                <section className="hero">
                    <div className="container">
                        <h1>Welcome to TrinityAi</h1>
                        <p>The future of artificial intelligence</p>
                    </div>
                </section>
            </main>
        </div>
    );
}

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));