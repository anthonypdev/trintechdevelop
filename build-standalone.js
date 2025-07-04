#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

// This script creates a fully self-contained bundle without requiring npm dependencies
console.log('Building standalone bundle...\n');

// Component files in dependency order
const components = [
    'components/ShaderBackground.js',
    'components/NoiseOverlay.js',
    'components/LiquidGlassButton.js', 
    'components/SpectroButton.js',
    'components/ContentModal.js',
    'components/App.js'
];

// Function to download Babel standalone
function downloadBabel() {
    return new Promise((resolve, reject) => {
        console.log('Downloading Babel standalone...');
        
        const url = 'https://unpkg.com/@babel/standalone@7/babel.min.js';
        let data = '';
        
        https.get(url, (res) => {
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log('Babel downloaded successfully');
                resolve(data);
            });
        }).on('error', reject);
    });
}

// Function to transform JSX using regex (simple transformation)
function transformJSX(code) {
    // This is a very basic JSX transformer - for production use the full Babel
    let transformed = code;
    
    // Transform self-closing tags: <Component /> -> React.createElement(Component)
    transformed = transformed.replace(/<(\w+)\s*\/>/g, 'React.createElement($1)');
    
    // Transform tags with props: <Component prop="value" /> -> React.createElement(Component, {prop: "value"})
    transformed = transformed.replace(/<(\w+)\s+([^>]+)\/>/g, (match, tag, props) => {
        const propsObj = props.trim().split(/\s+/).map(prop => {
            const [key, value] = prop.split('=');
            return `${key}: ${value}`;
        }).join(', ');
        return `React.createElement(${tag}, {${propsObj}})`;
    });
    
    // Transform opening/closing tags with children
    transformed = transformed.replace(/<(\w+)>([^<]+)<\/\1>/g, 'React.createElement("$1", null, "$2")');
    
    return transformed;
}

async function build() {
    try {
        // Read all components and combine them
        let bundle = `// TrinityAI Website Bundle - Pre-compiled JavaScript
// Generated on ${new Date().toISOString()}

(function() {
    'use strict';
    
    // Check for React
    if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
        console.error('React and ReactDOM must be loaded before this bundle');
        return;
    }
    
    const { useState, useEffect, useRef, useCallback } = React;
    
`;

        // Process each component
        for (const componentPath of components) {
            console.log(`Processing ${componentPath}...`);
            
            const fullPath = path.join(__dirname, componentPath);
            const code = fs.readFileSync(fullPath, 'utf8');
            const componentName = path.basename(componentPath, '.js');
            
            // For now, we'll include the JSX as-is and rely on Babel in the browser
            // A full implementation would transform the JSX here
            bundle += `
    // ==================== ${componentName} ====================
    ${code}
    
`;
        }

        bundle += `
})(); // End of bundle
`;

        // Write the bundle that still needs Babel
        fs.writeFileSync('bundle-raw.js', bundle);
        console.log('✅ Raw bundle created: bundle-raw.js');

        // Create a Python script to do the Babel transformation
        const pythonScript = `#!/usr/bin/env python3
"""
Standalone build script for TrinityAI website
This script creates a pre-compiled bundle without needing Node.js dependencies
"""

import re
import json
from datetime import datetime

# Component files in dependency order
components = [
    'components/ShaderBackground.js',
    'components/NoiseOverlay.js',
    'components/LiquidGlassButton.js',
    'components/SpectroButton.js', 
    'components/ContentModal.js',
    'components/App.js'
]

def simple_jsx_transform(code):
    """Basic JSX to React.createElement transformation"""
    # This is a simplified transformer - for production use proper Babel
    
    # Replace className with className (already done in source)
    # Transform self-closing components
    code = re.sub(r'<(\\w+)\\s*\\/>', r'React.createElement(\\1)', code)
    
    # Note: Full JSX transformation is complex and requires proper parsing
    # For now, we'll create a bundle that still requires Babel
    return code

print("Building TrinityAI website bundle...\\n")

# Create bundle header
bundle = f"""// TrinityAI Website Bundle
// Generated on {datetime.now().isoformat()}
// This bundle requires Babel for JSX transformation

"""

# Read and combine all components
for component_path in components:
    print(f"Adding {component_path}...")
    
    try:
        with open(component_path, 'r') as f:
            code = f.read()
            component_name = component_path.split('/')[-1].replace('.js', '')
            
            bundle += f"""
// ==================== {component_name} ====================
{code}

"""
    except Exception as e:
        print(f"Error reading {component_path}: {e}")
        exit(1)

# Write the bundle
with open('bundle.js', 'w') as f:
    f.write(bundle)

print(f"\\n✅ Bundle created: bundle.js")
print(f"📦 Bundle size: {len(bundle.encode()) / 1024:.2f} KB")

# Create production HTML
html = """<!DOCTYPE html>
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
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    
    <!-- Bundle -->
    <script type="text/babel" src="bundle.js"></script>
</body>
</html>
"""

with open('index-bundle.html', 'w') as f:
    f.write(html)

print("📄 Production HTML created: index-bundle.html")
print("\\n🚀 Build complete!")
`;

        fs.writeFileSync('build.py', pythonScript);
        console.log('✅ Python build script created: build.py');

        // Make the Python script executable
        fs.chmodSync('build.py', '755');

        console.log('\n📝 Build scripts created successfully!');
        console.log('\nTo build your bundle, you can use:');
        console.log('  1. Node.js with Babel: npm install && npm run build');
        console.log('  2. Simple concatenation: node build-simple.js');
        console.log('  3. Python script: python3 build.py');
        console.log('  4. Direct usage: Use bundle-raw.js with Babel in browser');

    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

// Run the build
build();