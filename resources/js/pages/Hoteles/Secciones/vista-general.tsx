import { Hotel } from '@/types';
import { MapPin } from 'lucide-react';
import  SearchBar  from '@/components/search-bar';

interface Props {
    hotel: Hotel;
    images: string[];
    rating: { average: number; count: number; description: string };
}

export default function GeneralSection({ hotel, images, rating }: Props) {
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
                <div style={ratingBoxStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#008080' }}>
                                {rating.description}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#777' }}>
                                {rating.count} comentarios
                            </div>
                        </div>
                        <div style={ratingScoreStyle}>{rating.average}</div>
                    </div>
                    <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                        <p style={{ fontSize: '0.9rem', color: '#555' }}>
                            “La ubicación es excelente y el apartamento tiene todo lo necesario...”
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#666' }}>
                            <img src="https://via.placeholder.com/20" alt="Avatar" style={{ borderRadius: '50%' }} /> 
                            Elena <span style={{ color: '#999' }}>🇪🇸 España</span>
                        </div>
                    </div>
                </div>

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

// COPIA AQUÍ LOS ESTILOS QUE PERTENECEN A ESTA VISTA
const mosaicoStyle = { display: 'flex', gap: '5px', flexWrap: 'wrap' as const, overflow: 'hidden', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' };
const imgPrincipalStyle = { flex: '1 1 500px', height: '400px', objectFit: 'cover' as const };
const imgSecundariaStyle = { height: '197.5px', width: '100%', objectFit: 'cover' as const };
const thumbnailsStyle = { display: 'flex', gap: '5px', marginTop: '5px', width: '100%', flexWrap: 'wrap' as const };
const imgThumbStyle = { flex: '1 1 100px', height: '100px', objectFit: 'cover' as const, borderRadius: '4px' };
const verMasFotosStyle = { ...imgThumbStyle, backgroundColor: '#8B4513', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' as const, cursor: 'pointer' };

const ratingBoxStyle = { backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #D2B48C', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' };
const ratingScoreStyle = { backgroundColor: '#008080', color: 'white', padding: '10px 15px', borderRadius: '8px', fontSize: '1.4rem', fontWeight: 'bold' as const };
const mapBoxStyle = { backgroundColor: 'white', padding: '15px', borderRadius: '12px', border: '1px solid #D2B48C', marginTop: '15px', display: 'flex', alignItems: 'center', gap: '10px' };