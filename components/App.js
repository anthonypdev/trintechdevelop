const { useState } = React;

function App() {
    return (
        <div>
            <Header />
            <Hero />
            <About />
            <Contact />
        </div>
    );
}

function Header() {
    return (
        <header>
            <div className="container">
                <nav>
                    <h2>Your Name</h2>
                </nav>
            </div>
        </header>
    );
}

function Hero() {
    return (
        <section className="hero">
            <div className="container">
                <h1>Welcome to My Website</h1>
                <p>I'm a developer passionate about creating amazing experiences</p>
                <a href="#contact" className="btn">Get In Touch</a>
            </div>
        </section>
    );
}

function About() {
    return (
        <section id="about">
            <div className="container">
                <h2>About Me</h2>
                <p>Tell your story here...</p>
            </div>
        </section>
    );
}

function Contact() {
    return (
        <section id="contact">
            <div className="container">
                <h2>Contact</h2>
                <p>Get in touch with me...</p>
            </div>
        </section>
    );
}

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));
