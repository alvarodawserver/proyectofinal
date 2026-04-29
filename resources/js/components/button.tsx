// src/components/Button.jsx
interface ButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  href?: string;
  isExternal?: boolean;
}

const Button = ({ label, onClick, className, style, href, isExternal }: ButtonProps) => {
  const defaultButtonStyle = {
    backgroundColor: '#D2B48C', // Tono arena/marrón claro veraniego
    color: '#333',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontFamily: 'sans-serif'
  };

  const finalStyle = { ...defaultButtonStyle, ...style };

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={finalStyle}>
        {label}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={className} style={finalStyle}>
      {label}
    </button>
  );
};

export default Button;