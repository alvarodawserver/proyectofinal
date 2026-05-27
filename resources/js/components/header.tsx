import React, { useState, useEffect } from 'react'; 
import { Link, usePage } from '@inertiajs/react'; 
import { Calendar, Settings, ShoppingCart, X } from 'lucide-react';
import Button from "./button";
import LoginForm from "./auth/login-form"; 
import RegisterForm from "./auth/register-form";

const Header = () => {
  const { auth } = usePage<any>().props;
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setAuthMode(null); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    if (auth?.user) {
      setAuthMode(null);
    }
  }, [auth?.user]);

  return (
    <>
      <header style={headerContainerStyle}>
        <div style={topBarStyle}>
          <div style={logoStyle}>
            <Link href="/" style={{ textDecoration: 'none', color: 'white' }}>
              Refugio del mar
            </Link>
          </div>

          <div style={topActionsContainerStyle}>
            <Link href="/mis-reservas" className="flex items-center gap-2 rounded-full bg-aqua-700 px-3 py-2 text-white shadow-lg transition-transform hover:scale-105">
              <Calendar size={18}/>Mis reservas
            </Link>
            
            {auth.user?.can_access_admin &&(
              <Link href="/dashboard" className="flex items-center gap-2 rounded-full bg-neutral-900 px-3 py-2 text-white shadow-lg transition-transform hover:scale-105">
                <Settings size={18} className="animate-spin-slow" />
                <span className="text-xs font-bold">Panel Admin</span>
              </Link>
            )}

            {auth.user?.can_access_propietario &&(
              <Link href="/hoteles" className="flex items-center gap-2 rounded-full bg-neutral-900 px-3 py-2 text-white shadow-lg transition-transform hover:scale-105">
                <Settings size={18} className="animate-spin-slow" />
                <span className="text-xs font-bold">Panel Propietario</span>
              </Link>
            )}

            {auth.user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Link href="/carrito" style={cartContainerStyle} title="Ver mi carrito">
                  <ShoppingCart size={20} color="white" />
                </Link>

                <Link 
                  href="/settings/profile" 
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textDecoration: 'none', color: 'inherit' }}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                  title="Ir a mi perfil"
                >
                  <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Hola,</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{auth.user.name}</span>
                </Link>

                <Link href="/logout" method="post" as="button" style={logoutLinkStyle}>Salir</Link>
              </div>
            ) : (
              <div onClick={() => setAuthMode('login')}>
                <Button label="Inicio de sesión" style={loginButtonStyle} />
              </div>
            )}
          </div>
        </div>
      </header>

      {authMode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setAuthMode(null)}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
            >
              <X size={20} className="text-gray-500" />
            </button>

            <div className="p-8">
              {authMode === 'login' ? (
                <LoginForm 
                  onSwitchToRegister={() => setAuthMode('register')} 
                  canResetPassword={true}
                />
              ) : (
                <RegisterForm 
                  onSwitchToLogin={() => setAuthMode('login')} 
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const headerContainerStyle = { backgroundColor: '#008080', color: 'white' };
const topBarStyle = { display: 'flex', flexWrap: 'wrap' as const, justifyContent: 'space-between', alignItems: 'center', padding: '15px 5%' };
const topActionsContainerStyle = { display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' as const, justifyContent: 'flex-end' };
const topButtonStyle = { background: 'rgba(255, 255, 255, 0.2)', border: 'none', padding: '5px 12px', borderRadius: '15px', cursor: 'pointer', fontSize: '0.8rem', color: 'white' };
const cartContainerStyle = { position: 'relative' as const, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', borderRadius: '50%', backgroundColor: 'rgba(0, 0, 0, 0.1)', transition: 'background 0.3s', cursor: 'pointer' };
const loginButtonStyle = { backgroundColor: '#F4A460', color: 'white', padding: '8px 20px', borderRadius: '20px', fontSize: '0.85rem', border: 'none', cursor: 'pointer', fontWeight: 'bold' };
const logoStyle = { fontSize: '1.4rem', fontWeight: 'bold' };
const logoutLinkStyle = { background: 'none', border: '1px solid rgba(255,255,255,0.5)', color: 'white', padding: '4px 10px', borderRadius: '15px', cursor: 'pointer', fontSize: '0.75rem', transition: 'all 0.2s' };

export default Header;