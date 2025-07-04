#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// This is a simple build script that concatenates components without requiring Babel
// It assumes the components are already transpiled or will be transpiled in the browser

console.log('Building simple bundle (requires Babel in browser)...\n');

// Component files in dependency order
const components = [
    'components/ShaderBackground.js',
    'components/NoiseOverlay.js', 
    'components/LiquidGlassButton.js',
    'components/SpectroButton.js',
    'components/ContentModal.js',
    'components/App.js'
];

// Create bundle header
let bundle = `// TrinityAI Website Bundle - Generated on ${new Date().toISOString()}
// This bundle requires Babel to be loaded in the browser for JSX transformation

`;

// Track which React hooks have been imported to avoid duplicates
let reactHooksImported = false;

// Read and concatenate all components
components.forEach(componentPath => {
    console.log(`Adding ${componentPath}...`);
    
    try {
        const fullPath = path.join(__dirname, componentPath);
        let code = fs.readFileSync(fullPath, 'utf8');
        const componentName = path.basename(componentPath, '.js');
        
        // Fix React hooks destructuring to avoid duplicates
        if (!reactHooksImported) {
            // Keep the first React destructuring as-is
            reactHooksImported = true;
        } else {
            // Remove React destructuring from subsequent components
            code = code.replace(/const \{ [^}]+ \} = React;\s*\n/g, '');
        }
        
        bundle += `
// ==================== ${componentName} ====================
${code}

`;
    } catch (error) {
        console.error(`Error reading ${componentPath}:`, error.message);
        process.exit(1);
    }
});

// Write the bundle
const outputPath = path.join(__dirname, 'bundle-babel.js');
fs.writeFileSync(outputPath, bundle);

console.log(`\n✅ Bundle created: ${outputPath}`);
console.log(`📦 Bundle size: ${(Buffer.byteLength(bundle) / 1024).toFixed(2)} KB`);

// Create HTML file that uses the babel bundle
const babelHTML = `<!DOCTYPE html>
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
    
    <!-- React Development -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    
    <!-- Bundle with Babel transformation -->
    <script type="text/babel" src="bundle-babel.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index-babel.html'), babelHTML);

console.log(`📄 Babel HTML created: index-babel.html`);
console.log('\n✨ Simple build complete!');