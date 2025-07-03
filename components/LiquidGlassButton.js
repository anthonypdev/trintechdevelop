// Shared styling system with header

/**
 * A reusable button styled using the LiquidGlass visual system.
 * Supports label, click handler, and optional inline styles.
 */
const LiquidGlassButton = ({ label = 'Click Me', onClick, style = {}, className = '' }) => {
  return (
    <button
      className={`liquid-button ${className}`}
      onClick={onClick}
      style={style}
    >
      {label}
    </button>
  );
};

export default LiquidGlassButton;