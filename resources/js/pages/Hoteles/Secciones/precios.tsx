import { useState, useMemo } from 'react';
import { Hotel } from '@/types';

interface Props {
    hotel: Hotel;
}

export default function PricingSection({ hotel }: Props) {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [selectedRoomIds, setSelectedRoomIds] = useState<number[]>([]);

    // 1. Cálculo de noches
    const nights = useMemo(() => {
        if (!checkIn || !checkOut) return 0;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const calculatedNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return calculatedNights > 0 ? calculatedNights : 0;
    }, [checkIn, checkOut]);

    // 2. Lógica para alternar habitaciones
    const toggleRoom = (id: number) => {
        // Bloqueamos selección si no hay fechas
        if (nights === 0) return; 
        
        setSelectedRoomIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    // 3. Cálculo de totales (recalcula automáticamente si nights o selection cambian)
    const totals = useMemo(() => {
        const selectedRooms = hotel.habitaciones.filter(h => selectedRoomIds.includes(h.id));
        const price = selectedRooms.reduce((acc, h) => acc + Number(h.tipo.precio_base || 0), 0);
        return price * nights;
    }, [selectedRoomIds, nights, hotel.habitaciones]);

    return (
        <div style={cardStyle}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '20px', color: '#333' }}>Calcula tu estancia</h3>
            
            {/* INPUTS DE FECHA CON LABELS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                <div style={inputContainerStyle}>
                    <label style={miniLabelStyle}>Fecha de entrada</label>
                    <input type="date" style={inputStyle} onChange={(e) => setCheckIn(e.target.value)} />
                </div>
                <div style={inputContainerStyle}>
                    <label style={miniLabelStyle}>Fecha de salida</label>
                    <input type="date" style={inputStyle} onChange={(e) => setCheckOut(e.target.value)} />
                </div>
            </div>

            {/* LISTADO DE HABITACIONES */}
            <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '0.9rem', color: nights === 0 ? '#ff4d4d' : '#666', marginBottom: '10px' }}>
                    {nights === 0 ? 'Selecciona las fechas para habilitar habitaciones' : 'Selecciona habitaciones:'}
                </p>
                
                {hotel.habitaciones.map((h) => (
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
                        <span>{h.tipo.tipo_habitacion || 'Habitación'}</span>
                        <span style={{ fontWeight: 'bold' }}>{h.tipo.precio_base}€/noche</span>
                    </div>
                ))}
            </div>

            {/* TOTALES */}
            <div style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', marginBottom: '10px' }}>
                    <span>Total ({nights} noches):</span>
                    <strong style={{ color: '#008080' }}>{totals.toFixed(2)} €</strong>
                </div>
                <button 
                    disabled={selectedRoomIds.length === 0 || nights === 0}
                    style={{ ...buttonStyle, opacity: (selectedRoomIds.length === 0 || nights === 0) ? 0.6 : 1 }}
                >
                    Reservar ahora
                </button>
            </div>
        </div>
    );
}

// --- ESTILOS MEJORADOS ---
const cardStyle = { backgroundColor: '#ffffff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e0e0e0' };
const inputContainerStyle = { display: 'flex', flexDirection: 'column' as const, gap: '5px' };
const miniLabelStyle = { fontSize: '0.8rem', color: '#555', fontWeight: '600' };
const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', width: '100%' };
const roomOptionStyle = { padding: '12px', border: '1px solid', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', transition: '0.3s' };
const buttonStyle = { width: '100%', backgroundColor: '#008080', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', marginTop: '10px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' };