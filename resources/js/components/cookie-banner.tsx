import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function CookieBanner() {
    const [mostrarBanner, setMostrarBanner] = useState(false);

    useEffect(() => {
        const consentimiento = Cookies.get('cookie_consent');
        if (!consentimiento) {
            setMostrarBanner(true);
        }
    }, []);

    const aceptarCookies = () => {
        Cookies.set('cookie_consent', 'accepted', { expires: 365, secure: false, sameSite: 'lax' });
        setMostrarBanner(false);
        
        guardarUbicacionInicial();
    };

    const rechazarCookies = () => {
        Cookies.set('cookie_consent', 'rejected', { expires: 365, secure: false, sameSite: 'lax' });
        setMostrarBanner(false);
    };

    const guardarUbicacionInicial = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                Cookies.set('user_lat', String(latitude), { expires: 7, secure: false, sameSite: 'lax' });
                Cookies.set('user_lng', String(longitude), { expires: 7, secure: false, sameSite: 'lax' });
            });
        }
    };

    if (!mostrarBanner) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-xl z-50 flex flex-col md:flex-row items-center justify-between border-t border-gray-700 animate-bounce-short">
            <div className="text-sm max-w-4xl mb-4 md:mb-0">
                <p>
                    Utilizamos cookies propias para mejorar tu experiencia de usuario, recordar tus preferencias de búsqueda (como tu última ciudad y fechas) y mostrarte hoteles cercanos.
                </p>
            </div>
            <div className="flex space-x-4 shrink-0">
                <button 
                    onClick={rechazarCookies}
                    className="px-4 py-2 text-sm text-gray-400 hover:text-white transition"
                >
                    Rechazar
                </button>
                <button 
                    onClick={aceptarCookies}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow transition"
                >
                    Aceptar todas
                </button>
            </div>
        </div>
    );
}