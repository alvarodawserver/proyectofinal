// resources/js/Components/SearchBar.tsx
import { useState } from 'react';
import { router, usePage, Link } from '@inertiajs/react';
import { Search } from 'lucide-react';

export default function SearchBar() {
    const { url } = usePage();
    const [destination, setDestination] = useState('');
    const [dates, setDates] = useState({ checkIn: '', checkOut: '' });
    const [people, setPeople] = useState({ adults: 1, children: 0 });

    const totalPeople = people.adults + people.children;

    const handleSearch = () => {
        router.get('/busqueda', {
            lugar: destination,
            entrada: dates.checkIn,
            salida: dates.checkOut,
            personas: totalPeople
        });
    };

    const isActive = (path: string) => url === path || (path === '/' && url === '');

    return (
        <div style={searchBarAreaStyle}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', width: '90%' }}>
                

                <div style={{ display: 'flex', gap: '5px' }}>
                    <Link href="/" style={getTabStyle(isActive('/'))}>🏨 Hoteles</Link>
                    <Link href="/vehiculos" style={getTabStyle(isActive('/vehiculos'))}>🚗 Vehículos</Link>
                    <Link href="/actividades" style={getTabStyle(isActive('/actividades'))}>⛰️ Actividades</Link>
                </div>


                <div style={searchBarWrapper}>
                    

                    <div style={{ ...inputGroup, width: '100%', marginBottom: '10px' }}>
                        <label style={labelStyle}>Lugar</label>
                        <input 
                            style={inputStyle} 
                            type="text" 
                            placeholder="¿A dónde vas?" 
                            value={destination} 
                            onChange={e => setDestination(e.target.value)} 
                        />
                    </div>


                    <div style={secondRowStyle}>
                        

                        <div style={{ ...inputGroup, flex: 2 }}>
                            <label style={labelStyle}>Fechas (Entrada - Salida)</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input style={inputStyle} type="date" onChange={e => setDates({ ...dates, checkIn: e.target.value })} />
                                <input style={inputStyle} type="date" onChange={e => setDates({ ...dates, checkOut: e.target.value })} />
                            </div>
                        </div>


                        <div style={{ ...inputGroup, flex: 1.5 }}>
                            <div style={peopleSelectorStyle}>
                                <div style={counterGroup}>
                                    <small style={miniLabelStyle}>Adultos</small>
                                    <select 
                                        style={selectStyle} 
                                        value={people.adults} 
                                        onChange={e => setPeople({...people, adults: parseInt(e.target.value)})}
                                    >
                                        {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </div>
                                <div style={counterGroup}>
                                    <small style={miniLabelStyle}>Niños</small>
                                    <select 
                                        style={selectStyle} 
                                        value={people.children} 
                                        onChange={e => setPeople({...people, children: parseInt(e.target.value)})}
                                    >
                                        {[0, 1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

    
                        <button onClick={handleSearch} style={searchButtonStyle}>
                            <Search size={22} /> <strong>BUSCAR</strong>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- ESTILOS ACTUALIZADOS ---

const searchBarAreaStyle = { 
    backgroundColor: '#D2B48C', 
    padding: '60px 0', 
    backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 2px, transparent 2px, transparent 4px)',
};

const searchBarWrapper = {
    display: 'flex',
    flexDirection: 'column' as const, 
    backgroundColor: '#fff',
    padding: '35px',
    borderRadius: '0 20px 20px 20px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
    gap: '20px'
};

const secondRowStyle = {
    display: 'flex',
    gap: '30px', // Aumentamos el hueco entre grupos
    alignItems: 'flex-end',
    flexWrap: 'wrap' as const
};

const inputGroup = { display: 'flex', flexDirection: 'column' as const, gap: '8px' };

const labelStyle = { 
    fontSize: '0.8rem', 
    fontWeight: 'bold', 
    color: '#8B4513', 
    textTransform: 'uppercase' as const,
    letterSpacing: '1px'
};

const inputStyle = {
    padding: '15px',
    borderRadius: '10px',
    border: '1px solid #e0e0e0',
    fontSize: '1rem',
    width: '100%',
    backgroundColor: '#fdfdfd',
    color: '#333'
};

const selectStyle = {
    ...inputStyle,
    padding: '10px 15px',
    cursor: 'pointer',
    appearance: 'none' as const, // Quita el estilo nativo feo
    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
    backgroundSize: '15px',
    minWidth: '80px'
};

const peopleSelectorStyle = { 
    display: 'flex', 
    gap: '20px', 
    backgroundColor: '#f4f1ea', 
    padding: '10px 20px', 
    borderRadius: '12px',
    border: '1px solid #d2b48c' 
};

const miniLabelStyle = { fontSize: '0.7rem', color: '#8b4513', fontWeight: 'bold', marginBottom: '4px' };
const counterGroup = { display: 'flex', flexDirection: 'column' as const, flex: 1 };

const searchButtonStyle = { 
    backgroundColor: '#008080', 
    color: 'white', 
    border: 'none', 
    padding: '0 40px', 
    borderRadius: '12px', 
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    height: '54px', 
    boxShadow: '0 10px 20px rgba(0,128,128,0.3)',
    transition: 'all 0.2s',
    marginTop: 'auto'
};

const getTabStyle = (active: boolean) => ({
    backgroundColor: active ? '#fff' : 'rgba(139, 69, 19, 0.2)',
    color: active ? '#008080' : 'white',
    padding: '15px 35px',
    borderRadius: '15px 15px 0 0',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backdropFilter: 'blur(5px)'
});