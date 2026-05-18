import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

interface ReviewData {
    id: number;
    valoracion: number;
    comentario: string;
    created_at: string;
    user: { name: string; profile_photo_url?: string };
}

interface ReviewsSectionProps {
    hotelId: number;
    reviews?: ReviewData[]; 
    eligida_reserva_id: number | null;
}

export default function ReviewsSection({ hotelId, reviews = [], eligida_reserva_id }: ReviewsSectionProps) {
    const [hoveredStar, setHoveredStar] = useState(0);
    const [mostrarFormForzado, setMostrarFormForzado] = useState(false);

    // Filtro de seguridad para evitar que 'undefined' rompa los bucles o condicionales
    const listaReviews = Array.isArray(reviews) ? reviews : [];

    // Formulario de Inertia
    const { data, setData, post, processing, reset, errors } = useForm({
        reserva_id: eligida_reserva_id || '',
        valoracion: 5,
        comentario: '',
    });

    // Sincroniza el ID de la reserva si cambia o tarda en llegar desde el servidor
    useEffect(() => {
        if (eligida_reserva_id) {
            setData('reserva_id', eligida_reserva_id);
        }
    }, [eligida_reserva_id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/hoteles/${hotelId}/reviews`, {
            onSuccess: () => {
                reset('comentario');
                setMostrarFormForzado(false);
                alert('¡Gracias! Tu opinión ha sido publicada correctamente.');
            },
        });
    };

    const renderStars = (rating: number, interactive = false) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                    const estrellaActiva = interactive 
                        ? star <= (hoveredStar || data.valoracion)
                        : star <= rating;

                    return (
                        <span
                            key={star}
                            onClick={() => interactive && setData('valoracion', star)}
                            onMouseEnter={() => interactive && setHoveredStar(star)}
                            onMouseLeave={() => interactive && setHoveredStar(0)}
                            style={{
                                cursor: interactive ? 'pointer' : 'default',
                                color: estrellaActiva ? '#ffb300' : '#ccc',
                                fontSize: interactive ? '1.8rem' : '1.1rem',
                                transition: 'color 0.2s'
                            }}
                        >
                            ★
                        </span>
                    );
                })}
            </div>
        );
    };

    // Condicional corregido usando la lista blindada
    const debeMostrarFormulario = eligida_reserva_id && (listaReviews.length > 0 || mostrarFormForzado);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginTop: '10px' }}>
            
            {/* CASO ESPECIAL: Si el hotel NO tiene ningún comentario aún */}
            {listaReviews.length === 0 && (
                <div style={noCommentsBoxStyle}>
                    <h3 style={{ color: '#004d4d', margin: '0 0 10px 0', fontWeight: 'bold' }}>
                        Aún no hay opiniones sobre este alojamiento
                    </h3>
                    
                    {eligida_reserva_id ? (
                        /* Sub-caso A: No hay comentarios pero el usuario SÍ estuvo en el hotel recientemente */
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                            <p style={{ color: '#555', fontSize: '0.9rem', margin: 0, maxWidth: '500px' }}>
                                Fuiste uno de los últimos huéspedes en alojarte aquí. Tu experiencia es súper valiosa para inaugurar esta sección.
                            </p>
                            {!mostrarFormForzado && (
                                <button 
                                    onClick={() => setMostrarFormForzado(true)} 
                                    style={submitButtonStyle}
                                >
                                    ✍️ ¡Sé el primero en opinar!
                                </button>
                            )}
                        </div>
                    ) : (
                        /* Sub-caso B: No hay comentarios y el usuario NO tiene reservas para poder opinar */
                        <p style={{ fontStyle: 'italic', color: '#777', fontSize: '0.9rem', margin: 0 }}>
                            Nadie ha dejado un comentario aún. ¡Reserva tu estancia hoy y comparte tu experiencia al regresar!
                        </p>
                    )}
                </div>
            )}

            {/* FORMULARIO DE RESERVA */}
            {debeMostrarFormulario && (
                <div style={formBoxStyle}>
                    <h3 style={{ margin: '0 0 5px 0', color: '#004d4d', fontWeight: 'bold' }}>Cuéntanos tu experiencia</h3>
                    <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '0.8rem' }}>
                        Tu opinión se vinculará automáticamente a tu última estancia en este hotel.
                    </p>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        
                        <div>
                            <label style={labelStyle}>Tu puntuación:</label>
                            {renderStars(data.valoracion, true)}
                        </div>

                        <div>
                            <label style={labelStyle}>Tu comentario:</label>
                            <textarea
                                value={data.comentario}
                                onChange={(e) => setData('comentario', e.target.value)}
                                placeholder="¿Qué tal estuvo la habitación, el trato del personal, la comida o la ubicación...?"
                                style={textareaStyle}
                                rows={4}
                                required
                            />
                            {errors.comentario && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.comentario}</p>}
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" disabled={processing} style={submitButtonStyle}>
                                {processing ? 'Enviando...' : 'Publicar Reseña'}
                            </button>
                            {mostrarFormForzado && (
                                <button 
                                    type="button" 
                                    onClick={() => setMostrarFormForzado(false)} 
                                    style={{ ...submitButtonStyle, backgroundColor: '#ccc', color: '#333' }}
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            {/* LISTADO DE COMENTARIOS DE OTROS HUÉSPEDES */}
            {listaReviews.length > 0 && (
                <div>
                    <h3 style={{ marginBottom: '20px', color: '#8B4513', fontWeight: 'bold' }}>
                        Opiniones de los huéspedes ({listaReviews.length})
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {listaReviews.map((rev) => (
                            <div key={rev.id} style={reviewCardStyle}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                                    
                                    {/* Cabecera del comentario (Usuario) */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <img
                                            src={rev.user.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(rev.user.name)}&background=008080&color=fff`}
                                            alt="Avatar"
                                            style={{ borderRadius: '50%', width: '40px', height: '40px', objectFit: 'cover' }}
                                        />
                                        <div>
                                            <strong style={{ display: 'block', color: '#333', fontSize: '0.95rem' }}>{rev.user.name}</strong>
                                            <span style={{ fontSize: '0.75rem', color: '#999' }}>
                                                {rev.created_at 
                                                    ? new Date(rev.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
                                                    : 'Fecha no disponible'
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    {/* Estrellas puntuadas */}
                                    {renderStars(rev.valoracion)}
                                </div>

                                {/* Cuerpo del comentario */}
                                {rev.comentario && (
                                    <p style={{ margin: '12px 0 0 0', fontSize: '0.9rem', color: '#555', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                                        “{rev.comentario}”
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// --- ESTILOS ---
const formBoxStyle = { backgroundColor: '#f0f7f7', padding: '20px', borderRadius: '16px', border: '1px solid #b3d9d9' };
const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: 'bold' as const, marginBottom: '5px', color: '#555' };
const textareaStyle = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ccc', fontSize: '0.9rem', fontFamily: 'inherit', resize: 'vertical' as const };
const submitButtonStyle = { alignSelf: 'flex-start', backgroundColor: '#008080', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' };
const reviewCardStyle = { backgroundColor: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 2px 6px rgba(0,0,0,0.01)' };

const noCommentsBoxStyle = {
    backgroundColor: '#fffcf5',
    padding: '30px 20px',
    borderRadius: '16px',
    border: '1px dashed #D2B48C',
    textAlign: 'center' as const,
    boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
};