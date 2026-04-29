
const Footer = () => {
  return (
    <footer style={footerContainerStyle}>
      <div style={footerGridStyle}>
        

        <div style={footerColumnStyle}>
          <h4 style={columnTitleStyle}>Empresa</h4>
          <a href="#" style={footerLinkStyle}>Quiénes somos</a>
          <a href="#" style={footerLinkStyle}>Contáctanos</a>
        </div>


        <div style={footerColumnStyle}>
          <h4 style={columnTitleStyle}>Políticas</h4>
          <a href="#" style={footerLinkStyle}>Términos y condiciones</a>
          <a href="#" style={footerLinkStyle}>Políticas de la empresa</a>
        </div>

        <div style={footerColumnStyle}>
          <h4 style={columnTitleStyle}>Ayuda</h4>
          <a href="#" style={footerLinkStyle}>¿Problemas con algún hotel?</a>
          <a href="#" style={footerLinkStyle}>Cupones de descuento</a>
        </div>

        <div style={footerColumnStyle}>
          <h4 style={columnTitleStyle}>Síguenos</h4>
          <div style={socialIconsStyle}>
            
            <a href="#" style={socialIconLink}><i className="bi bi-telegram"></i> Facebook</a>
            <a href="#" style={socialIconLink}><i className="bi bi-twitter"></i> Twitter</a>
            <a href="#" style={socialIconLink}><i className="bi bi-telegram"></i> Telegram</a>
          </div>
        </div>
      </div>
    </footer>
  );
};


const footerContainerStyle = {
  backgroundColor: '#00E5FF', 
  color: '#333',
  padding: '40px'
};

const footerGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '30px'
};

const footerColumnStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const columnTitleStyle = {
  margin: '0 0 10px 0',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  color: '#006666'
};

const footerLinkStyle = {
  color: '#333',
  textDecoration: 'none',
  fontSize: '0.9rem'
};

const socialIconsStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const socialIconLink = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  textDecoration: 'none',
  color: '#333',
  fontSize: '0.9rem'
};

export default Footer;