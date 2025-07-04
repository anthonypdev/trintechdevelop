const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

// Component files in dependency order
const components = [
    'components/ShaderBackground.js',
    'components/NoiseOverlay.js',
    'components/LiquidGlassButton.js',
    'components/SpectroButton.js',
    'components/ContentModal.js',
    'components/App.js'
];

// Babel configuration
const babelConfig = {
    presets: ['@babel/preset-react'],
    plugins: []
};

// Bundle header
let bundle = `// TrinityAI Website Bundle - Generated on ${new Date().toISOString()}
// This file contains all React components pre-compiled to vanilla JavaScript

(function() {
    'use strict';
    
    // Ensure React and ReactDOM are available
    if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
        console.error('React and ReactDOM must be loaded before this bundle');
        return;
    }
    
    const { useState, useEffect, useRef, useCallback } = React;
    
    // Components will be attached to window object for global access
    
`;

console.log('Building TrinityAI website bundle...\n');

// Process each component
components.forEach((componentPath, index) => {
    console.log(`Processing ${componentPath}...`);
    
    try {
        // Read the component file
        const fullPath = path.join(__dirname, componentPath);
        const code = fs.readFileSync(fullPath, 'utf8');
        
        // Extract component name from file path
        const componentName = path.basename(componentPath, '.js');
        
        // Transform JSX to JavaScript
        const result = babel.transformSync(code, babelConfig);
        
        // Wrap component code to prevent conflicts and expose to window
        let wrappedCode = `
    // === ${componentName} ===
    (function() {
        ${result.code}
        
        // Export component to window if it's defined
        if (typeof ${componentName} !== 'undefined') {
            window.${componentName} = ${componentName};
        }
    })();
    `;
        
        // Special handling for App.js which needs to render
        if (componentName === 'App') {
            // Remove the ReactDOM.render part from App.js and handle it separately
            wrappedCode = wrappedCode.replace(/const root = ReactDOM\.createRoot[\s\S]*?root\.render\(<App \/>\);/, '');
            
            // Add the render logic at the end
            if (index === components.length - 1) {
                wrappedCode += `
    // Render the App component
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(App));
    `;
            }
        }
        
        bundle += wrappedCode;
        
    } catch (error) {
        console.error(`Error processing ${componentPath}:`, error.message);
        process.exit(1);
    }
});

// Bundle footer - includes the DOMContentLoaded event handlers from App.js
bundle += `
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

})(); // End of bundle IIFE
`;

// Write the bundle to file
const outputPath = path.join(__dirname, 'bundle.js');
fs.writeFileSync(outputPath, bundle);

console.log(`\n✅ Bundle created successfully: ${outputPath}`);
console.log(`📦 Bundle size: ${(Buffer.byteLength(bundle) / 1024).toFixed(2)} KB`);

// Create a production HTML file that uses the bundle
const productionHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TrinityAI - The Future of Artificial Intelligence</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="components/LiquidGlass.css">
</head>
<body>
    <div id="root"></div>
    
    <!-- React Production -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    
    <!-- Pre-compiled Bundle -->
    <script src="bundle.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index-production.html'), productionHTML);

console.log(`📄 Production HTML created: index-production.html`);
console.log('\n🚀 Build complete! Use index-production.html for deployment.');