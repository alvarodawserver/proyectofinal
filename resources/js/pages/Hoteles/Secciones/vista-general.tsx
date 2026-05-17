// resources/js/Pages/Hoteles/Secciones/vista-general.tsx

import { Hotel } from '@/types';
import { MapPin } from 'lucide-react';
import SearchBar from '@/components/search-bar';
import CuadroReview from '@/components/cuadro-review'; 

interface Props {
    hotel: Hotel;
    images: string[];
    rating: { average: number; count: number; description: string };
    review_destacada: any;
}

export default function GeneralSection({ hotel, images, rating, review_destacada }: Props) {
    const galeria = images.length > 0 ? images : ['https://via.placeholder.com/800x500?text=Sin+Foto'];

    return (
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {/* PARTE IZQUIERDA: Galería y Descripción */}
            <div style={{ flex: '1 1 700px' }}>
                {/* MOSAICO DE FOTOS */}
                <div style={mosaicoStyle}>
                    <img src={galeria[0]} alt="Principal" style={imgPrincipalStyle} />
                    <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <img src={galeria[1] || galeria[0]} alt="Foto 1" style={imgSecundariaStyle} />
                        <img src={galeria[2] || galeria[0]} alt="Foto 2" style={imgSecundariaStyle} />
                    </div>
                    <div style={thumbnailsStyle}>
                        {galeria.slice(3, 7).map((img, i) => (
                            <img key={i} src={img} alt={`Thumb ${i}`} style={imgThumbStyle} />
                        ))}
                        {images.length > 7 && (
                            <div style={verMasFotosStyle}>Ver todas las fotos</div>
                        )}
                    </div>
                </div>

                {/* DESCRIPCIÓN DEL HOTEL */}
                <div style={{ marginTop: '30px' }}>
                    <h3 style={{ color: '#8B4513' }}>Sobre el alojamiento</h3>
                    <p style={{ lineHeight: '1.6', color: '#555' }}>{hotel.descripcion}</p>
                </div>
            </div>

            {/* PARTE DERECHA: Sidebar (Rating y Mapa) */}
            <div style={{ flex: '1 1 300px' }}>
                {/* NUEVO: Llamada al componente modularizado */}
                <CuadroReview rating={rating} />

                <div style={mapBoxStyle}>
                    <MapPin style={{ color: '#008080' }} size={24} />
                    <div style={{ color: '#008080', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 'bold' }}>
                        Ver en el mapa
                    </div>
                </div>
            </div>
        </div>
    );
}

// Estilos limpios de la sección general
const mosaicoStyle = { display: 'flex', gap: '5px', flexWrap: 'wrap' as const, overflow: 'hidden', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' };
const imgPrincipalStyle = { flex: '1 1 500px', height: '400px', objectFit: 'cover' as const };
const imgSecundariaStyle = { height: '197.5px', width: '100%', objectFit: 'cover' as const };
const thumbnailsStyle = { display: 'flex', gap: '5px', marginTop: '5px', width: '100%', flexWrap: 'wrap' as const };
const imgThumbStyle = { flex: '1 1 100px', height: '100px', objectFit: 'cover' as const, borderRadius: '4px' };
const verMasFotosStyle = { ...imgThumbStyle, backgroundColor: '#8B4513', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' as const, cursor: 'pointer' };

const mapBoxStyle = { backgroundColor: 'white', padding: '15px', borderRadius: '12px', border: '1px solid #D2B48C', marginTop: '15px', display: 'flex', alignItems: 'center', gap: '10px' };