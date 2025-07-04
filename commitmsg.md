# Commit Message

fix: resolve Netlify deployment issues with browser-based Babel transpilation

The issue was that the site uses type="text/babel" scripts which require browser-based JSX transpilation. This often fails on production deployments like Netlify due to CORS, timing issues, or silent transpilation failures.

Created a bundled version that combines all React components into a single file, reducing HTTP requests and potential loading issues while maintaining browser-based Babel transformation.

To fix Netlify deployment:

1. Use index-babel.html instead of index.html
2. Or rename: mv index-babel.html index.html
3. Ensure bundle-babel.js is included in deployment

This maintains the same functionality while being more reliable for production deployments.