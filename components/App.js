const { useRef, useState } = React;
const { ShaderBackground, LiquidGlassButton, SpectroButton, ContentModal } = window;

function App() {
    const shaderCanvasRef = useRef(null);
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className="App">
            <ShaderBackground canvasRef={shaderCanvasRef} />
            
            <nav className="nav" id="nav">
                <div className="container">
                    <div className="nav-container">
                        <a href="#" className="nav-logo">
                            <img src="/assets/trintechalpha.png" alt="TrinityAi" className="nav-logo-image" />
                        </a>

                        <ul className="nav-menu">
                            <li><LiquidGlassButton label="Home" onClick={() => setModalOpen(true)} /></li>
                            <li><LiquidGlassButton label="Products" onClick={() => setModalOpen(true)} /></li>
                            <li><LiquidGlassButton label="About" onClick={() => setModalOpen(true)} /></li>
                        </ul>

                        <div onClick={() => document.getElementById('bottom').scrollIntoView({ behavior: 'smooth' })}>
                            <SpectroButton />
                        </div>
                    </div>
                </div>
            </nav>
            
            <main className="content">
                <section className="hero">
                    <div className="container">
                        <h1>Welcome to TrinityAi</h1>
                        <p>The future of artificial intelligence</p>
                    </div>
                </section>
                <div id="bottom" style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <h2 style={{color: 'white'}}>Coming Soon...</h2>
                </div>
            </main>
            
            <ContentModal 
                isOpen={modalOpen} 
                onClose={() => setModalOpen(false)} 
            />
        </div>
    );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);