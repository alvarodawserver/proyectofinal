import React, { useState } from 'react'; 
import { Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import Button from "./button";
import LoginModal from "./login-modal"; 
import { Calendar, Settings, ShoppingCart } from 'lucide-react'; // Importamos ShoppingCart

const Header = () => {
  const { auth } = usePage<any>().props;
  const user = auth.user;

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('login') === 'true') {
        setIsLoginOpen(true); 
    }
}, []);

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
          <Link
            href="/mis-reservas"
            className="flex items-center gap-2 rounded-full bg-aqua-700 px-3 py-2 text-white shadow-lg transition-transform hover:scale-105">
            <Calendar />Mis reservas
          </Link>
          
          {auth.user?.can_access_admin && (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-full bg-neutral-900 px-3 py-2 text-white shadow-lg transition-transform hover:scale-105"
            >
              <Settings size={18} className="animate-spin-slow" />
              <span className="text-xs font-bold">Panel Admin</span>
            </Link>
          )}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {/* BOTÓN DEL CARRITO */}
              <Link 
                href="/carrito" 
                style={cartContainerStyle}
                title="Ver mi carrito"
              >
                <ShoppingCart size={20} color="white" />
                {/* Opcional: Podrías añadir un círculo con el número de items aquí */}
              </Link>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Hola,</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{user.name}</span>
              </div>
              
              <Link 
                href="/logout" 
                method="post" 
                as="button" 
                style={logoutLinkStyle}
              >
                Salir
              </Link>
            </div>
          ) : (
            <div onClick={() => setIsLoginOpen(true)}>
              <Button label="Inicio de sesión" style={loginButtonStyle} />
            </div>
          )}
        </div>
      </div>

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
    </header>
  );
};

// --- ESTILOS ---

const headerContainerStyle = { backgroundColor: '#008080', color: 'white' };

const topBarStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '15px 5%'
};

const topActionsContainerStyle = {
  display: 'flex', 
  gap: '15px', 
  alignItems: 'center',
  flexWrap: 'wrap' as const, 
  justifyContent: 'flex-end'
};

const topButtonStyle = {
  background: 'rgba(255, 255, 255, 0.2)', // Un poco transparente queda más elegante
  border: 'none',
  padding: '5px 12px',
  borderRadius: '15px',
  cursor: 'pointer',
  fontSize: '0.8rem',
  color: 'white'
};

const cartContainerStyle = {
  position: 'relative' as const,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '8px',
  borderRadius: '50%',
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  transition: 'background 0.3s',
  cursor: 'pointer'
};

const loginButtonStyle = {
  backgroundColor: '#F4A460', 
  color: 'white',
  padding: '8px 20px',
  borderRadius: '20px',
  fontSize: '0.85rem',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const logoStyle = { fontSize: '1.4rem', fontWeight: 'bold' };

const logoutLinkStyle = { 
  background: 'none', 
  border: '1px solid rgba(255,255,255,0.5)', 
  color: 'white', 
  padding: '4px 10px', 
  borderRadius: '15px', 
  cursor: 'pointer',
  fontSize: '0.75rem',
  transition: 'all 0.2s'
};

export default Header;