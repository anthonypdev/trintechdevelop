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
                                <li><a href="#products" className="nav-link">Products</a></li>
                                <li><a href="#about" className="nav-link">About</a></li>
                                <li><a href="#portfolio" className="nav-link">Portfolio</a></li>
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