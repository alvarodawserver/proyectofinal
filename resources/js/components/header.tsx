import { Link, usePage } from '@inertiajs/react';
import Button from "./button";

const Header = () => {
  const { auth } = usePage().props;
  const user = auth.user;

  return (
    <header style={headerContainerStyle}>
      <div style={topBarStyle}>


        <div style={logoStyle}>
          <Link href="/" style={{ textDecoration: 'none', color: 'white' }}>
            Refugio del mar
          </Link>
        </div>

        
        <div style={topActionsContainerStyle}>


          <button type="button" style={topButtonStyle}>💬 Idioma</button>
          <button type="button" style={topButtonStyle}>✈️ Viajes</button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.8rem' }}>Hola, <strong>{user.name}</strong></span>
              <Link href="/logout" method="post" as="button" style={logoutLinkStyle}>Salir</Link>
            </div>
          ) : (
            <Link href="/login">
              <Button label="Inicio de sesión" style={loginButtonStyle} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};


const headerContainerStyle = { backgroundColor: '#008080', color: 'white' };

const topBarStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '15px 5%'
};

const inputWithBorderStyle = {
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #8B4513', 
  backgroundColor: 'white',
  flex: '1 1 120px', 
  fontSize: '0.9rem',
  color: '#333'
};

const topButtonStyle = {
  background: 'white',
  border: 'none',
  padding: '5px 12px',
  borderRadius: '15px',
  cursor: 'pointer',
  fontSize: '0.8rem'
};



const loginButtonStyle = {
  backgroundColor: '#F4A460', 
  color: 'white',
  padding: '6px 15px',
  borderRadius: '20px',
  fontSize: '0.8rem',
  border: 'none',
  cursor: 'pointer'
};


const searchButtonStyle = {
  backgroundColor: '#8B4513', 
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '8px'
};


const topActionsContainerStyle = {
  display: 'flex', 
  gap: '12px', 
  alignItems: 'center',
  flexWrap: 'wrap', 
  justifyContent: 'flex-end'
};

const logoStyle = { fontSize: '1.4rem', fontWeight: 'bold' };
const logoutLinkStyle = { background: 'none', border: '1px solid white', color: 'white', padding: '4px 8px', borderRadius: '5px', cursor: 'pointer' };

export default Header;