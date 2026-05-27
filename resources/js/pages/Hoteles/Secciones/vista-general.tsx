import { Hotel } from '@/types';
import { MapPin } from 'lucide-react';
import { useState } from 'react';
import CuadroReview from '@/components/cuadro-review'; 

interface Props {
    hotel: Hotel;
    images: string[];
    rating: { average: number; count: number; description: string };
    review_destacada: any;
    eligida_reserva_id: number | null; 
    onActionClick: () => void;         
}

export default function GeneralSection({ hotel, images, rating, review_destacada, eligida_reserva_id, onActionClick }: Props) {
    // 1. Limpiamos duplicados exactos usando un Set
    const imagenesUnicas = Array.from(new Set(images || []));

    // 2. Si no hay fotos, metemos el placeholder. Si hay, usamos las limpias.
    const galeria = imagenesUnicas.length > 0 ? imagenesUnicas : ['https://via.placeholder.com/800x500?text=Sin+Foto'];

    // 3. Estado para controlar qué foto se está visualizando en el cuadro principal
    const [fotoPrincipal, setFotoPrincipal] = useState<string>(galeria[0]);

    return (
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>

            {/* PARTE IZQUIERDA: Galería y Descripción */}
            <div style={{ flex: '1 1 700px' }}>

                {/* GALERÍA PRINCIPAL + MINIATURAS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    
                    {/* Imagen Grande (Hero) */}
                    <img 
                        src={fotoPrincipal} 
                        alt="Principal" 
                        style={{ width: '100%', height: '450px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', transition: 'all 0.3s ease' }} 
                    />
                    
                    {/* Tira de Miniaturas (Muestra TODAS las fotos, para que puedas volver a la 1ª) */}
                    {galeria.length > 1 && (
                        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '5px 0' }}>
                            {galeria.map((img, i) => (
                                <img 
                                    key={i} 
                                    src={img} 
                                    alt={`Miniatura ${i}`} 
                                    onClick={() => setFotoPrincipal(img)} // ¡Ahora solo cambia al hacer clic!
                                    style={{
                                        minWidth: '120px',
                                        height: '80px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        border: fotoPrincipal === img ? '3px solid #008080' : '2px solid transparent',
                                        opacity: fotoPrincipal === img ? 1 : 0.6,
                                        transition: 'all 0.2s ease'
                                    }} 
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* DESCRIPCIÓN DEL HOTEL */}
                <div style={{ marginTop: '30px' }}>
                    <h3 style={{ color: '#8B4513' }}>Sobre el alojamiento</h3>
                    <p style={{ lineHeight: '1.6', color: '#555' }}>{hotel.descripcion}</p>
                </div>
            </div>

            {/* PARTE DERECHA: Sidebar (Rating y Mapa) */}
            <div style={{ flex: '1 1 300px' }}>
                <CuadroReview 
                    rating={rating}
                    review_destacada={review_destacada}
                    eligida_reserva_id={eligida_reserva_id}
                    onActionClick={onActionClick} 
                />

                <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '12px', border: '1px solid #D2B48C', marginTop: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MapPin style={{ color: '#008080' }} size={24} />
                    <div style={{ color: '#008080', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 'bold' }}>
                        <a 
                                href={`https://www.google.com/maps/search/?api=1&query=${hotel.latitud},${hotel.longitud}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={mapsLinkStyle}
                            >
                                Ver en Google Maps 🗺️
                            </a>
                    </div>
                </div>
            </div>
        </div>
    );
}


const mapsLinkStyle = {
    fontSize: '0.85rem',
    color: '#008080',
    backgroundColor: '#e6f2f2',
    padding: '4px 10px',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: 'bold',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'background-color 0.2s',
    border: '1px solid #cce5e5'
};