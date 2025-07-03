const { useRef } = React;
const { ShaderBackground, SpectroButton } = window;

function App() {
    const shaderCanvasRef = useRef(null);

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
                            <li><a href="#home" className="nav-link">Home</a></li>
                            <li><a href="#products" className="nav-link">Products</a></li>
                            <li><a href="#about" className="nav-link">About</a></li>
                            <li><a href="#portfolio" className="nav-link">Portfolio</a></li>
                        </ul>

                        <div onClick={() => document.getElementById('bottom').scrollIntoView({ behavior: 'smooth' })}>
                            <SpectroButton />
                        </div>
                    </div>
                </div>
            </nav>
            
            <main className="content">
                <section className="hero" id="home">
                    <div className="container">
                        <img src="/assets/trintechalpha.png" alt="TrinityAi" className="hero-logo" />
                        <h1>Welcome to TrinityAi</h1>
                        <p>The future of artificial intelligence</p>
                    </div>
                </section>
                
                <section className="section" id="products" style={{padding: '6rem 0', textAlign: 'center'}}>
                    <div className="container">
                        <h2 style={{fontSize: '3rem', marginBottom: '2rem', color: 'white'}}>Our Products</h2>
                        <p style={{fontSize: '1.2rem', color: '#cccccc', marginBottom: '3rem'}}>Cutting-edge AI solutions designed to transform your business operations</p>
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem'}}>
                            <div style={{background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)'}}>
                                <h3 style={{color: 'white', marginBottom: '1rem'}}>TrinityAI Insight Engine™</h3>
                                <p style={{color: '#cccccc'}}>The Intelligent Search and Discovery Tool</p>
                            </div>
                            <div style={{background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)'}}>
                                <h3 style={{color: 'white', marginBottom: '1rem'}}>TrinityAI Conversational Front Desk™</h3>
                                <p style={{color: '#cccccc'}}>The 24/7 AI-Powered Receptionist</p>
                            </div>
                            <div style={{background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)'}}>
                                <h3 style={{color: 'white', marginBottom: '1rem'}}>TrinityAI Companion™</h3>
                                <p style={{color: '#cccccc'}}>The Personalized AI Partner for Your Workflow</p>
                            </div>
                        </div>
                    </div>
                </section>
                
                <section className="section" id="about" style={{padding: '6rem 0', textAlign: 'center'}}>
                    <div className="container">
                        <h2 style={{fontSize: '3rem', marginBottom: '2rem', color: 'white'}}>About TrinityAI</h2>
                        <p style={{fontSize: '1.2rem', color: '#cccccc', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8'}}>
                            We don't just build models; we build partnerships. By integrating seamlessly with your team, we analyze your unique challenges and opportunities to deliver robust, scalable, and fully-managed AI systems. From intelligent automation to predictive analytics, TrinityAI empowers your business to operate with greater insight, speed, and competitive advantage in a data-driven world.
                        </p>
                    </div>
                </section>
                
                <section className="section" id="portfolio" style={{padding: '6rem 0', textAlign: 'center'}}>
                    <div className="container">
                        <h2 style={{fontSize: '3rem', marginBottom: '2rem', color: 'white'}}>Portfolio</h2>
                        <p style={{fontSize: '1.2rem', color: '#cccccc', marginBottom: '3rem'}}>Our work speaks for itself</p>
                        <div style={{height: '400px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)'}}>
                            <p style={{color: '#888', fontSize: '1.5rem'}}>Portfolio Coming Soon</p>
                        </div>
                    </div>
                </section>
                
                <section className="section cta" id="contact" style={{padding: '6rem 0', textAlign: 'center', position: 'relative', overflow: 'hidden'}}>
                    <div className="cta-background" style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(ellipse at center, rgba(124, 58, 237, 0.15) 0%, transparent 60%)',
                        animation: 'ctaPulse 4s ease-in-out infinite'
                    }}></div>
                    <div className="container">
                        <div className="cta-content" style={{
                            position: 'relative',
                            zIndex: 10,
                            maxWidth: '800px',
                            margin: '0 auto',
                            background: 'rgba(5, 5, 5, 0.3)',
                            padding: '3rem',
                            borderRadius: '24px',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: 'var(--shadow-elevated), inset 0 1px 2px rgba(255, 255, 255, 0.05)'
                        }}>
                            <h2 style={{fontSize: '3rem', marginBottom: '2rem', color: 'white'}}>Ready to Transform Your Business?</h2>
                            <p style={{fontSize: '1.2rem', color: '#cccccc', marginBottom: '3rem'}}>
                                Let's discuss how TrinityAI can help bridge the gap between your data and business outcomes.
                            </p>
                            <SpectroButton />
                        </div>
                    </div>
                </section>
            </main>
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
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.nav');
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
});