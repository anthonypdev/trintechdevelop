import React from 'react';
import './LiquidGlass.css'; // Import the dedicated CSS file

/**
 * Renders the header component.
 * The visual styling is handled by the imported CSS module
 * to support complex properties like pseudo-elements.
 */
const LiquidGlassHeader = () => {
  return (
    <header className="liquid-header">
      <h1>LiquidGlass Header</h1>
      {/* Additional navigation elements can be placed here */}
    </header>
  );
};

export default LiquidGlassHeader;
