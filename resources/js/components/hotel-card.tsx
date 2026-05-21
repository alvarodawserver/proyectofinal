import React from 'react';

interface CardProps {
  nombre: string;
  imagen: string | null; 
  precio_final: number;
  precio_original: number;
  tiene_oferta: boolean;
  descuento: number;
  reviews_avg: number;
  reviews_count: number;
  ciudad: string;
  categoria: string;
}

export default function HotelCard({ 
  nombre, 
  imagen, 
  precio_final, 
  precio_original, 
  tiene_oferta, 
  descuento, 
  reviews_avg, 
  reviews_count, 
  ciudad, 
  categoria 
}: CardProps) {

  // Si no hay imagen, metemos una de repuesto elegante
  const fotoSrc = imagen ? imagen : 'https://via.placeholder.com/300x180?text=Sin+Imagen+Principal';

  // Calculamos la nota sobre 10 multiplicando por 2 (solo si hay reviews)
  // Usamos Number() y toFixed(1) para asegurarnos de que quede limpio (ej. 8.0, 9.2)
  const ratingBase10 = reviews_count > 0 ? Number((reviews_avg * 2).toFixed(1)) : 'S/V';

  return (
    <div style={cardStyle}>
      {tiene_oferta && <div style={badgeOfertaStyle}>-{descuento}%</div>}

      <div style={{ width: '100%', height: '180px', overflow: 'hidden' }}>
        <img src={fotoSrc} alt={nombre} style={imgStyle} />
      </div>

      <div style={infoStyle}>
        <h3 style={titleStyle}>{nombre}</h3>
        <p style={{ color: '#006666', fontSize: '0.85rem', margin: '0 0 10px 0', fontWeight: 'bold' }}>
          📍 {ciudad} — {categoria}
        </p>
        
        <div style={ratingRowStyle}>
          {/* Pintamos nuestra nueva variable calculada */}
          <span style={ratingScoreStyle}>{ratingBase10}</span>
          <span style={ratingTextStyle}>
            {reviews_count > 0 ? `(${reviews_count} opiniones)` : 'Sin valoraciones'}
          </span>
        </div>
        
        <div style={priceAreaStyle}>
          {tiene_oferta ? (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={priceStyle}>{precio_final}€</span>
              <span style={oldPriceStyle}>{precio_original}€</span>
            </div>
          ) : (
            <span style={priceStyle}>{precio_final}€</span>
          )}
          <span style={priceContextStyle}>precio base por noche</span>
        </div>
      </div>
    </div>
  );
}

const cardStyle = { border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', fontFamily: 'sans-serif' };
const badgeOfertaStyle = { position: 'absolute' as const, backgroundColor: '#ff3333', color: 'white', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.9rem', margin: '10px', zIndex: 10 };
const imgStyle = { width: '100%', height: '100%', objectFit: 'cover' as const };
const infoStyle = { backgroundColor: '#E0FFFF', padding: '15px', color: '#333' };
const titleStyle = { margin: '0 0 5px 0', fontSize: '1.2rem', fontWeight: 'bold', color: '#006666' };
const ratingRowStyle = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' };
const ratingScoreStyle = { fontWeight: 'bold', color: '#333', backgroundColor: '#fff', padding: '2px 6px', borderRadius: '4px' };
const ratingTextStyle = { color: '#666' };
const priceAreaStyle = { display: 'flex', flexDirection: 'column', marginTop: '10px' };
const priceStyle = { fontSize: '1.4rem', fontWeight: 'bold', color: '#008080' };
const oldPriceStyle = { fontSize: '1rem', color: '#999', textDecoration: 'line-through' };
const priceContextStyle = { fontSize: '0.8rem', color: '#777' };