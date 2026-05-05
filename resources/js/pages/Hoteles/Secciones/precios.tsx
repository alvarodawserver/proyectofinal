import { useState, useMemo } from 'react';
import { Hotel } from '@/types';
import { router } from '@inertiajs/react'; // Importante importar esto
import { Button } from '@/components/ui/button';

interface Props {
    hotel: Hotel;
    // NUEVO: Añadimos la prop de la oferta
    oferta_aplicada?: {
        id: number;
        nombre: string;
        descuento_porcentaje: number;
    } | null;
}

export default function PricingSection({ hotel, oferta_aplicada }: Props) {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [selectedRoomIds, setSelectedRoomIds] = useState<number[]>([]);

    // --- LÓGICA DE RESERVA ACTUALIZADA ---
    const handleReserva = () => {
        router.post('/reservas', {
            hotel_id: hotel.id,
            fecha_entrada: checkIn,
            fecha_salida: checkOut,
            adultos: adults,
            niños: children,
            habitaciones: selectedRoomIds,
            precio_total: totals,
            // NUEVO: Enviamos el ID de la oferta para que el backend la registre
            oferta_id: oferta_aplicada?.id || null 
        }, {
            onBefore: () => confirm('¿Estás seguro de que deseas confirmar esta reserva?'),
        });
    };

    const nights = useMemo(() => {
        if (!checkIn || !checkOut) return 0;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const calculatedNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return calculatedNights > 0 ? calculatedNights : 0;
    }, [checkIn, checkOut]);

    const totalCapacity = useMemo(() => {
        const selectedRooms = hotel.habitaciones.filter(h => selectedRoomIds.includes(h.id));
        return selectedRooms.reduce((acc, h) => acc + (h.tipo.capacidad || 0), 0);
    }, [selectedRoomIds, hotel.habitaciones]);

    const totalGuests = adults + children;
    const isOverCapacity = totalGuests > totalCapacity && selectedRoomIds.length > 0;

    const toggleRoom = (id: number) => {
        if (nights === 0) return; 
        setSelectedRoomIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    // --- CÁLCULO DE TOTALES CON DESCUENTO ---
    const { totals, savings } = useMemo(() => {
        const selectedRooms = hotel.habitaciones.filter(h => selectedRoomIds.includes(h.id));
        const priceBase = selectedRooms.reduce((acc, h) => acc + Number(h.tipo.precio_base || 0), 0) * nights;
        
        let finalPrice = priceBase;
        let savedAmount = 0;

        if (oferta_aplicada) {
            finalPrice = priceBase * (1 - oferta_aplicada.descuento_porcentaje / 100);
            savedAmount = priceBase - finalPrice;
        }

        return { 
            totals: finalPrice, 
            savings: savedAmount 
        };
    }, [selectedRoomIds, nights, hotel.habitaciones, oferta_aplicada]);

    return (
        <div style={cardStyle}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '20px', color: '#333' }}>Calcula tu estancia</h3>
            
            {/* SECCIÓN FECHAS Y PASAJEROS (Igual que antes) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div style={inputContainerStyle}>
                    <label style={miniLabelStyle}>📅 Entrada</label>
                    <input type="date" style={inputStyle} onChange={(e) => setCheckIn(e.target.value)} />
                </div>
                <div style={inputContainerStyle}>
                    <label style={miniLabelStyle}>📅 Salida</label>
                    <input type="date" style={inputStyle} onChange={(e) => setCheckOut(e.target.value)} />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                <div style={inputContainerStyle}>
                    <label style={miniLabelStyle}>Adultos</label>
                    <input type="number" min="1" value={adults} style={inputStyle} onChange={(e) => setAdults(parseInt(e.target.value) || 1)} />
                </div>
                <div style={inputContainerStyle}>
                    <label style={miniLabelStyle}>Niños</label>
                    <input type="number" min="0" value={children} style={inputStyle} onChange={(e) => setChildren(parseInt(e.target.value) || 0)} />
                </div>
            </div>

            {/* LISTADO DE HABITACIONES ACTUALIZADO */}
            <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '0.9rem', color: nights === 0 ? '#ff4d4d' : '#666', marginBottom: '10px' }}>
                    {nights === 0 ? 'Selecciona fechas para habilitar' : 'Selecciona habitaciones:'}
                </p>
                
                {hotel.habitaciones.map((h) => {
                    const originalPrice = Number(h.tipo.precio_base);
                    const discountedPrice = oferta_aplicada 
                        ? originalPrice * (1 - oferta_aplicada.descuento_porcentaje / 100) 
                        : originalPrice;

                    return (
                        <div 
                            key={h.id} 
                            onClick={() => toggleRoom(h.id)}
                            style={{
                                ...roomOptionStyle,
                                opacity: nights === 0 ? 0.5 : 1,
                                backgroundColor: selectedRoomIds.includes(h.id) ? '#e6f4f4' : '#fff',
                                borderColor: selectedRoomIds.includes(h.id) ? '#008080' : '#ddd'
                            }}
                        >
                            <div>
                                <div style={{ fontWeight: '600' }}>{h.tipo.tipo_habitacion}</div>
                                <div style={{ fontSize: '0.75rem', color: '#777' }}>Capacidad: {h.tipo.capacidad} pers.</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                {oferta_aplicada && (
                                    <div style={{ fontSize: '0.8rem', color: '#999', textDecoration: 'line-through' }}>
                                        {originalPrice.toFixed(2)}€
                                    </div>
                                )}
                                <div style={{ fontWeight: 'bold', color: oferta_aplicada ? '#c53030' : '#333' }}>
                                    {discountedPrice.toFixed(2)}€
                                </div>
                            </div>
                        </div>
                    );
                })}

                {isOverCapacity && (
                    <div style={errorBannerStyle}>
                        ⚠️ La capacidad de las habitaciones es insuficiente para {totalGuests} personas.
                    </div>
                )}
            </div>


            <div style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
                <div style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem' }}>
                        <span>Total ({nights} noches):</span>
                        <strong style={{ color: '#008080' }}>{totals.toFixed(2)} €</strong>
                    </div>
                    {savings > 0 && (
                        <div style={{ textAlign: 'right', color: '#c53030', fontSize: '0.9rem', fontWeight: 'bold' }}>
                            ¡Ahorras {savings.toFixed(2)} € con la oferta!
                        </div>
                    )}
                </div>
                
                <Button 
                    onClick={handleReserva}
                    disabled={selectedRoomIds.length === 0 || nights === 0 || isOverCapacity}
                    style={{ 
                        ...buttonStyle, 
                        opacity: (selectedRoomIds.length === 0 || nights === 0 || isOverCapacity) ? 0.6 : 1,
                        cursor: (selectedRoomIds.length === 0 || nights === 0 || isOverCapacity) ? 'not-allowed' : 'pointer'
                    }}
                >
                    Reservar ahora
                </Button>
            </div>
        </div>
    );
}

// --- ESTILOS ---
const cardStyle = { backgroundColor: '#ffffff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e0e0e0' };
const inputContainerStyle = { display: 'flex', flexDirection: 'column' as const, gap: '5px' };
const miniLabelStyle = { fontSize: '0.8rem', color: '#555', fontWeight: '600' };
const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', width: '100%', fontSize: '0.9rem' };
const roomOptionStyle = { padding: '12px', border: '1px solid', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.3s' };
const buttonStyle = { width: '100%', backgroundColor: '#008080', color: 'white', padding: '14px', borderRadius: '8px', border: 'none', marginTop: '10px', fontSize: '1rem', fontWeight: 'bold', transition: '0.2s' };
const errorBannerStyle = { backgroundColor: '#fce8e6', color: '#d93025', padding: '10px', borderRadius: '6px', fontSize: '0.85rem', marginTop: '10px', border: '1px solid #f1c4c0', fontWeight: '500' };