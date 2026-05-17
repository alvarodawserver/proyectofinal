// resources/js/Pages/Hoteles/Secciones/cuadro_review.tsx

interface CuadroReviewProps {
    rating: {
        average: number;
        count: number;
        description: string;
    };
    // Ahora reflejamos la estructura real de tu base de datos y relaciones de Laravel
    review_destacada?: {
        comentario: string;
        valoracion: number;
        user: {
            name: string;
            profile_photo_url?: string; // Por si usas Jetstream o guardas avatares
        };
    } | null;
}

export default function CuadroReview({ rating, review_destacada }: CuadroReviewProps) {
    
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
                    {/* El comentario con truncado por CSS (3 líneas máx) */}
                    <p style={commentStyle}>
                        “{review_destacada.comentario}”
                    </p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {/* Info del Usuario */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img 
                                src={review_destacada.user.profile_photo_url || `https://ui-avatars.com/api/?name=${review_destacada.user.name}&background=0D8ABC&color=fff`} 
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
                    <p style={{ fontSize: '0.8rem', color: '#999', fontStyle: 'italic' }}>
                        Aún no hay reseñas de viajeros.
                    </p>
                </div>
            )}
        </div>
    );
}

// --- ESTILOS ---

const ratingBoxStyle = { 
    backgroundColor: 'white', 
    padding: '20px', 
    borderRadius: '16px', 
    border: '1px solid #D2B48C', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)' 
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