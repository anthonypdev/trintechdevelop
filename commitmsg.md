# Commit Message

fix: resolve duplicate useEffect declaration causing bundle syntax error

Fixed the JavaScript syntax error where useEffect was being declared twice in the bundled components. Updated the build script to properly handle React hooks destructuring to avoid duplicates.

Changes:
- Modified build-simple.js to track React hooks imports and remove duplicates
- Regenerated bundle-babel.js without duplicate declarations
- Replaced index.html with fixed version

The living room picture issue was identified as an unused Unsplash background image in LiquidGlass.css demo file - not affecting the main site.