// resources/js/Pages/Hoteles/Show.tsx

import { Link, usePage } from '@inertiajs/react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useState } from 'react';
import { Hotel, Image, Review, Servicio } from '@/types';
import { DynamicIcon } from '@/components/dynamic-icon';
import GeneralSection  from './Secciones/vista-general';
import  ServicesSection  from './Secciones/servicios';
import PricingSection from './Secciones/precios';
import { Button } from '@/components/ui/button';




interface Props {
    hotel: Hotel;
    rating: { average: number; count: number; description: string };
    images: string[];
    servicios: Servicio[];
    // NUEVO: Añadimos la oferta aplicada
    oferta_aplicada?: {
        id: number;
        nombre: string;
        descuento_porcentaje: number;
    } | null;
}

export default function Show({ hotel, rating, images, servicios, oferta_aplicada }: Props) { // <-- Recibimos la prop

    const [activeTab, setActiveTab] = useState('general');

    // Mover la lógica de cálculo aquí si la necesitas, 
    // aunque lo ideal es que PricingSection la use internamente
    const calcularPrecio = (precioBase: number) => {
        if (oferta_aplicada) {
            return (precioBase * (1 - oferta_aplicada.descuento_porcentaje / 100)).toFixed(2);
        }
        return precioBase;
    };
    
    const getTabStyle = (tab: string) => ({
        padding: '10px 20px',
        cursor: 'pointer',
        border: 'none',
        background: 'none',
        borderBottom: activeTab === tab ? '2px solid #008080' : '2px solid transparent',
        color: activeTab === tab ? '#008080' : '#666',
        fontWeight: activeTab === tab ? 'bold' : 'normal'
    });

   return (
        <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', color: '#333' }}>
            <Header />
            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>

                {/* NUEVO: Banner de Oferta (Solo si existe oferta_aplicada) */}
                {oferta_aplicada && (
                    <div style={offerAlertStyle}>
                        <div style={{ fontSize: '1.2rem' }}>🎉</div>
                        <div>
                            <strong style={{ display: 'block' }}>¡Oferta Especial Aplicada: {oferta_aplicada.nombre}!</strong>
                            <span style={{ fontSize: '0.9rem' }}>
                                Se ha aplicado un <strong>{oferta_aplicada.descuento_porcentaje}% de descuento</strong> a todos los precios de este hotel.
                            </span>
                        </div>
                    </div>
                )}

                <div style={tabsBarStyle}>
                    <button onClick={() => setActiveTab('general')} style={getTabStyle('general')}>Vista general</button>
                    <button onClick={() => setActiveTab('precios')} style={getTabStyle('precios')}>Precios</button>
                    <button onClick={() => setActiveTab('servicios')} style={getTabStyle('servicios')}>Servicios</button>
                </div>

                <div style={headerStyle}>
                    <div style={{ flex: 1 }}>
                        <h1 style={titleStyle}>{hotel.nombre_hotel}</h1>
                        <p>📍 {hotel.direccion}, {hotel.ciudad}</p>
                    </div>
                    <Button
                        style={reservaButtonStyle} 
                        onClick={() => setActiveTab('precios') }>
                        Reservar Ahora
                    </Button>
                </div>

                {activeTab === 'general' && (
                    <GeneralSection hotel={hotel} images={images} rating={rating} />
                )}

                {activeTab === 'servicios' && (
                    <ServicesSection servicios={servicios} />
                )}

                {activeTab === 'precios' && (
 
                    <PricingSection hotel={hotel} oferta_aplicada={oferta_aplicada} />
                )}

            </main>
            <Footer />
        </div>
    );
}


const offerAlertStyle = {
    backgroundColor: '#fff5f5',
    border: '1px solid #feb2b2',
    color: '#c53030',
    padding: '15px 20px',
    borderRadius: '12px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
};



const tabsBarStyle = { display: 'flex', gap: '2px', borderBottom: '1px solid #ccc', marginBottom: '15px' };
const tabStyle = { padding: '10px 20px', cursor: 'pointer', fontSize: '0.9rem', borderBottom: '2px solid transparent' };
const tabStyleActive = { ...tabStyle, borderBottom: '2px solid #008080', color: '#008080', fontWeight: 'bold' };

const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' };
const titleStyle = { margin: '0 0 5px 0', fontSize: '1.8rem', fontWeight: 'bold', color: '#8B4513' };
const reservaButtonStyle = { backgroundColor: '#008080', color: 'white', padding: '12px 25px', borderRadius: '8px' };

const mosaicoStyle = { display: 'flex', gap: '5px', flexWrap: 'wrap', overflow: 'hidden', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' };
const imgPrincipalStyle = { flex: '1 1 500px', height: '400px', objectFit: 'cover' as const };
const imgSecundariaStyle = { height: '197.5px', width: '100%', objectFit: 'cover' as const };
const thumbnailsStyle = { display: 'flex', gap: '5px', marginTop: '5px', width: '100%', flexWrap: 'wrap' };
const imgThumbStyle = { flex: '1 1 100px', height: '100px', objectFit: 'cover' as const, borderRadius: '4px' };
const verMasFotosStyle = { ...imgThumbStyle, backgroundColor: '#8B4513', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer' };

const ratingBoxStyle = { backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #D2B48C', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' };
const ratingScoreStyle = { backgroundColor: '#008080', color: 'white', padding: '10px 15px', borderRadius: '8px', fontSize: '1.4rem', fontWeight: 'bold' };

const mapBoxStyle = { backgroundColor: 'white', padding: '15px', borderRadius: '12px', border: '1px solid #D2B48C', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', marginTop: '15px', display: 'flex', alignItems: 'center', gap: '10px' };

