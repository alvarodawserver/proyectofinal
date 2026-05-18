interface CuadroReviewProps {
    rating: {
        average: number;
        count: number;
        description: string;
    };
    review_destacada?: {
        comentario: string;
        valoracion: number;
        user: {
            name: string;
            profile_photo_url?: string;
        };
    } | null;
    eligida_reserva_id: number | null; 
    onActionClick: () => void;         
}

export default function CuadroReview({ rating, review_destacada, eligida_reserva_id, onActionClick }: CuadroReviewProps) {
    
    // Función para renderizar las estrellas doradas
    const renderStars = (rating: number) => {
        return (
            <div style={{ color: '#ffb300', fontSize: '0.8rem', letterSpacing: '1px' }}>
                {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
            </div>
        );
    };

    return (
        <div style={ratingBoxStyle}>
            {/* CABECERA: Puntuación General */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#008080', lineHeight: '1.2' }}>
                        {rating.description}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#777' }}>
                        Basado en {rating.count} opiniones
                    </div>
                </div>
                <div style={ratingScoreStyle}>
                    {rating.count > 0 ? rating.average.toFixed(1) : '-'}
                </div>
            </div>
            
            {/* CUERPO: Reseña destacada */}
            {review_destacada ? (
                <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '12px' }}>
                    <p style={commentStyle}>
                        “{review_destacada.comentario}”
                    </p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {/* Info del Usuario */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img 
                                src={review_destacada.user.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(review_destacada.user.name)}&background=0D8ABC&color=fff`} 
                                alt="Avatar" 
                                style={{ borderRadius: '50%', width: '24px', height: '24px', objectFit: 'cover' }} 
                            /> 
                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#555' }}>
                                {review_destacada.user.name}
                            </span>
                        </div>
                        
                        {/* Valoración en estrellas */}
                        {renderStars(review_destacada.valoracion)}
                    </div>
                </div>
            ) : (
                <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '15px', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.8rem', color: '#999', fontStyle: 'italic', margin: 0 }}>
                        Aún no hay reseñas de viajeros.
                    </p>
                </div>
            )}

            {/* SECCIÓN NUEVA: Llamada a la acción (Acceso rápido) */}
            <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '12px', textAlign: 'center' }}>
                {eligida_reserva_id ? (
                    <button 
                        onClick={onActionClick}
                        style={writeButtonStyle}
                    >
                        ✍️ Dejar mi opinión
                    </button>
                ) : (
                    <button 
                        onClick={onActionClick}
                        style={readLinkStyle}
                    >
                        Leer todas las opiniones →
                    </button>
                )}
            </div>
        </div>
    );
}

// --- ESTILOS ---

const ratingBoxStyle = { 
    backgroundColor: 'white', 
    padding: '20px', 
    borderRadius: '16px', 
    border: '1px solid #D2B48C', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
    display: 'flex',
    flexDirection: 'column' as const
};

const ratingScoreStyle = { 
    backgroundColor: '#008080', 
    color: 'white', 
    padding: '8px 12px', 
    borderRadius: '10px', 
    fontSize: '1.2rem', 
    fontWeight: 'bold' as const,
    minWidth: '45px',
    textAlign: 'center' as const
};

const commentStyle = { 
    fontSize: '0.85rem', 
    color: '#444', 
    margin: '0 0 12px 0', 
    lineHeight: '1.4',
    display: '-webkit-box',
    WebkitLineClamp: 3,           
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis'      
};


const writeButtonStyle = {
    width: '100%',
    backgroundColor: '#008080',
    color: 'white',
    border: 'none',
    padding: '10px 14px',
    borderRadius: '10px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
};

const readLinkStyle = {
    background: 'none',
    border: 'none',
    color: '#8B4513',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: '4px 0'
};