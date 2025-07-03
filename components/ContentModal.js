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

