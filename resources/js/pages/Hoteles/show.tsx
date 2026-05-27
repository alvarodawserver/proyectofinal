// resources/js/Pages/Hoteles/Show.tsx

import Cookies from 'js-cookie';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useRef, useState, useEffect } from 'react';
import { Hotel, Image, Servicio } from '@/types'; 
import GeneralSection from './Secciones/vista-general';
import ServicesSection from './Secciones/servicios';
import PricingSection from './Secciones/precios';
import { Button } from '@/components/ui/button';
import ReviewsSection from './Secciones/reviews';

interface Props {
    hotel: Hotel;
    rating: { average: number; count: number; description: string };
    images: string[];
    servicios: Servicio[];
    oferta_aplicada?: {
        id: number;
        nombre: string;
        descuento_porcentaje: number;
    } | null;
    review_destacada?: {
        comentario: string;
        valoracion: number;
        user: {
            name: string;
            profile_photo_url?: string;
        };
    } | null;
    all_reviews: any[];        
    eligida_reserva_id: number | null; 
    reviews: any[];
}

export default function Show({ hotel, rating, images, servicios, oferta_aplicada, review_destacada, all_reviews, eligida_reserva_id, reviews }: Props) {

    const [activeTab, setActiveTab] = useState('general');
    const tabsRef = useRef<HTMLDivElement>(null);

    const manejarSaltoAComentarios = () => {
        setActiveTab('comentarios');
        setTimeout(() => {
            tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    };

   useEffect(() => {
        if (Cookies.get('cookie_consent') === 'accepted') {
            const vistosCookie = Cookies.get('hoteles_vistos');
    
            let vistos = vistosCookie ? JSON.parse(vistosCookie) : [];
            
            if (!vistos.includes(hotel.nombre_hotel)) {
                vistos.unshift(hotel.nombre_hotel); 
                vistos = vistos.slice(0, 4); 
                Cookies.set('hoteles_vistos', JSON.stringify(vistos), { expires: 30 });
            }
        }
    }, [hotel.id]);

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

                {/* Banner de Oferta (Solo si existe oferta_aplicada) */}
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

                {/* Añadida la referencia tabsRef aquí para controlar el scroll */}
                <div ref={tabsRef} style={tabsBarStyle}>
                    <button onClick={() => setActiveTab('general')} style={getTabStyle('general')}>Vista general</button>
                    <button onClick={() => setActiveTab('precios')} style={getTabStyle('precios')}>Precios</button>
                    <button onClick={() => setActiveTab('servicios')} style={getTabStyle('servicios')}>Servicios</button>
                    <button onClick={() => setActiveTab('comentarios')} style={getTabStyle('comentarios')}>Comentarios ({all_reviews?.length || 0})</button>
                </div>

                <div style={headerStyle}>
                    <div style={{ flex: 1 }}>
                        <h1 style={titleStyle}>{hotel.nombre_hotel}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '5px' }}>
                            <p style={{ margin: 0 }}>📍 {hotel.direccion}, {hotel.ciudad}</p>
                        </div>
                    </div>
                    <Button
                        style={reservaButtonStyle}
                        onClick={() => setActiveTab('precios')}>
                        Reservar Ahora
                    </Button>
                </div>

                {activeTab === 'general' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        <GeneralSection 
                            hotel={hotel} 
                            images={images} 
                            rating={rating} 
                            review_destacada={review_destacada} 
                            eligida_reserva_id={eligida_reserva_id} 
                            onActionClick={manejarSaltoAComentarios}
                        />
                        
                        {hotel.politica_cancelacion && hotel.politica_cancelacion.length > 0 && (
                            <div style={policyBoxStyle}>
                                <div style={{ fontSize: '1.4rem' }}>🛡️</div>
                                <div style={{ width: '100%' }}>
                                    <strong style={{ display: 'block', marginBottom: '6px', color: '#78350f' }}>
                                        Conditions y Política de Cancelación
                                    </strong>
                                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.95rem', color: '#451a03', lineHeight: '1.6' }}>
                                        {hotel.politica_cancelacion.map((regla, index) => (
                                            <li key={index}>
                                                {regla.porcentaje === 0 ? (
                                                    <span>
                                                        Cancelación <strong>GRATUITA</strong> hasta <strong>{regla.dias_antes} días</strong> antes de la fecha de entrada.
                                                    </span>
                                                ) : (
                                                    <span>
                                                        Cancelaciones con menos de <strong>{regla.dias_antes} días</strong> de antelación o no presentarse: cargo del <strong>{regla.porcentaje}%</strong> del importe total.
                                                    </span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'servicios' && (
                    <ServicesSection servicios={servicios} />
                )}

                {activeTab === 'precios' && (
                    <PricingSection hotel={hotel} oferta_aplicada={oferta_aplicada} />
                )}
                {activeTab === 'comentarios' && (
                    <ReviewsSection 
                        hotelId={hotel.id}
                        reviews={all_reviews || []} 
                        eligida_reserva_id={eligida_reserva_id} 
                    />
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

const policyBoxStyle = {
    backgroundColor: '#fffbeb',
    border: '1px solid #fcd34d', 
    color: '#78350f',           
    padding: '18px 22px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '15px',
    boxShadow: '0 2px 8px rgba(245, 158, 11, 0.04)',
    marginTop: '10px'
};

const tabsBarStyle = { display: 'flex', gap: '2px', borderBottom: '1px solid #ccc', marginBottom: '15px' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' };
const titleStyle = { margin: '0 0 5px 0', fontSize: '1.8rem', fontWeight: 'bold', color: '#8B4513' };
const reservaButtonStyle = { backgroundColor: '#008080', color: 'white', padding: '12px 25px', borderRadius: '8px' };

