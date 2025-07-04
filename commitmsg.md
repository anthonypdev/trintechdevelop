fix: resolve useRef undefined error and remove living room background image

Fixed JavaScript error where useRef was not properly imported in the bundle. Also removed the living room background image from LiquidGlass.css and replaced it with a gradient.

Changes:
- Added useRef and useState to React imports in bundle-babel.js
- Replaced Unsplash living room image with gradient background in LiquidGlass.css
- This should resolve both the JavaScript error and the unwanted background image