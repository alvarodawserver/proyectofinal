import React from 'react';
interface CardProps {
  nombre: string;
  imagen: string | null;
  precio_minimo: number;
  rating: number;
  ciudad: string;
  categoria: string;
}



const HotelCard = ({ nombre, imagen, precio_minimo, rating, ciudad, categoria } : CardProps) => {
  return (
    <div style={cardStyle}>

      <img 
        src={imagen || 'https://via.placeholder.com/300x180?text=Sin+Foto'} 
        alt={nombre} 
        style={imgStyle} 
      />


      <div style={infoStyle}>
        <h3 style={titleStyle}>{nombre}</h3>
        

        <p style={{ color: '#006666', fontSize: '0.85rem', margin: '0 0 10px 0', fontWeight: 'bold' }}>
          📍 {ciudad} — {categoria}
        </p>
        

        <div style={ratingRowStyle}>
          <span style={ratingScoreStyle}>{rating > 0 ? rating : 'S/V'}</span>
          <span style={ratingTextStyle}>
            {rating >= 8 ? 'Excelente' : rating > 0 ? 'Muy bueno' : 'Sin valoraciones'}
          </span>
        </div>
        

        <div style={priceAreaStyle}>
          <span style={priceStyle}>{precio_minimo}€</span>
          <span style={priceContextStyle}>precio base por noche</span>
        </div>
      </div>
    </div>
  );
};




const cardStyle = {
  border: '1px solid #eee',
  borderRadius: '12px',
  overflow: 'hidden',
  backgroundColor: 'white',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  fontFamily: 'sans-serif',
  transition: 'transform 0.2s ease-in-out',
};

const imgStyle = {
  width: '100%',
  height: '180px',
  objectFit: 'cover'
};

const infoStyle = {
  backgroundColor: '#E0FFFF', 
  padding: '15px',
  color: '#333',
  display: 'flex',
  flexDirection: 'column',
  gap: '5px'
};

const titleStyle = {
  margin: '0 0 5px 0',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  color: '#006666' 
};

const ratingRowStyle = {
  display: 'flex',
  alignItems: 'baseline',
  gap: '8px',
  fontSize: '0.9rem'
};

const ratingScoreStyle = {
  fontWeight: 'bold',
  color: '#333',
  backgroundColor: '#fff',
  padding: '2px 6px',
  borderRadius: '4px'
};

const ratingTextStyle = {
  color: '#666'
};

const priceAreaStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  marginTop: '10px'
};

const priceStyle = {
  fontSize: '1.4rem',
  fontWeight: 'bold',
  color: '#008080' 
};

const priceContextStyle = {
  fontSize: '0.8rem',
  color: '#777'
};

export default HotelCard;