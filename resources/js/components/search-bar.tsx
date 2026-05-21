// resources/js/Components/SearchBar.tsx
import { useState, useEffect, useRef } from 'react';
import { router, usePage, Link } from '@inertiajs/react';
import { Search, MapPin, Building2 } from 'lucide-react'; 
import axios from 'axios';

export default function SearchBar() {
    const { url } = usePage();
    const [destination, setDestination] = useState('');
    const [dates, setDates] = useState({ checkIn: '', checkOut: '' });
    const [people, setPeople] = useState({ adults: 1, children: 0 });
    const [perfilViaje, setPerfilViaje] = useState('');

    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (destination.length > 0) {
            const delayDebounceFn = setTimeout(() => {
                axios.get(`/api/sugerencias?q=${destination}`)
                    .then(res => {
                        setSuggestions(res.data);
                        setIsOpen(true);
                    })
                    .catch(() => setSuggestions([]));
            }, 300);
            return () => clearTimeout(delayDebounceFn);
        } else {
            setSuggestions([]);
            setIsOpen(false);
        }
    }, [destination]);

    const handleSearch = () => {
        const params: any = {
            lugar: destination,
            entrada: dates.checkIn,
            salida: dates.checkOut,
            personas: people.adults + people.children
        };

        if (perfilViaje !== '') {
            params.perfil = perfilViaje;
        }

        router.get('/busqueda', params);
        setIsOpen(false);
    };

    const selectSuggestion = (label: string) => {
        setDestination(label);
        setIsOpen(false);
        
        const params: any = {
            lugar: label, 
            entrada: dates.checkIn,
            salida: dates.checkOut,
            personas: people.adults + people.children
        };

        if (perfilViaje !== '') {
            params.perfil = perfilViaje;
        }

        router.get('/busqueda', params);
    };

    const isActive = (path: string) => url === path || (path === '/' && url === '');

    return (
        <div style={searchBarAreaStyle}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', width: '90%' }}>
                
                <div style={{ display: 'flex', gap: '5px' }}>
                    <Link href="/" style={getTabStyle(isActive('/'))}>🏨 Hoteles</Link>
                    <Link href="/experiencias" style={getTabStyle(isActive('/experiencias'))}>⛰️ Actividades</Link>
                </div>

                <div style={searchBarWrapper}>
                    
                    {/* INPUT DE LUGAR CON SUGERENCIAS */}
                    <div ref={wrapperRef} style={{ ...inputGroup, width: '100%', marginBottom: '10px', position: 'relative' }}>
                        <label style={labelStyle}>Lugar</label>
                        <input 
                            style={inputStyle} 
                            type="text" 
                            placeholder="¿A dónde vas?" 
                            value={destination} 
                            onChange={e => setDestination(e.target.value)}
                            onFocus={() => destination.length > 0 && setIsOpen(true)}
                        />

                        {/* PANEL DE SUGERENCIAS */}
                        {isOpen && suggestions.length > 0 && (
                            <div style={suggestionsPanelStyle}>
                                {suggestions.map((item: any, index) => (
                                    <div 
                                        key={index} 
                                        style={suggestionItemStyle}
                                        onClick={() => selectSuggestion(item.label)}
                                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f4f1ea')}
                                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                                    >
                                        <MapPin size={18} color="#008080" />
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: '600', color: '#333' }}>{item.label}</span>
                                            <span style={{ fontSize: '0.75rem', color: '#888' }}>{item.ciudad}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={secondRowStyle}>
                        {/* FECHAS */}
                        <div style={{ ...inputGroup, flex: 2 }}>
                            <label style={labelStyle}>Fechas (Entrada - Salida)</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input style={inputStyle} type="date" onChange={e => setDates({ ...dates, checkIn: e.target.value })} />
                                <input style={inputStyle} type="date" onChange={e => setDates({ ...dates, checkOut: e.target.value })} />
                            </div>
                        </div>

                        {/* CONTADOR DE PERSONAS CORREGIDO */}
                        <div style={{ ...inputGroup, flex: 1.5 }}>
                            <div style={peopleSelectorStyle}>
                                <div style={counterGroup}>
                                    <small style={miniLabelStyle}>Adultos</small>
                                    <select 
                                        style={compactSelectStyle} 
                                        value={people.adults} 
                                        onChange={e => setPeople({...people, adults: parseInt(e.target.value)})}
                                    >
                                        {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </div>
                                <div style={counterGroup}>
                                    <small style={miniLabelStyle}>Niños</small>
                                    <select 
                                        style={compactSelectStyle} 
                                        value={people.children} 
                                        onChange={e => setPeople({...people, children: parseInt(e.target.value)})}
                                    >
                                        {[0, 1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* PERFIL DE VIAJE */}
                        <div style={{ ...inputGroup, flex: 1.2 }}>
                            <label style={labelStyle}>Perfil de Viaje</label>
                            <select 
                                style={selectStyle}
                                value={perfilViaje}
                                onChange={e => setPerfilViaje(e.target.value)}
                            >
                                <option value="">Cualquiera</option>
                                <option value="familiar">Familiar</option>
                                <option value="romantico">Romántico</option>
                                <option value="negocios">Negocios</option>
                                <option value="economico">Económico</option>
                                <option value="relajante">Relajante</option>
                            </select>
                        </div>

                        {/* BOTÓN BUSCAR */}
                        <button onClick={handleSearch} style={searchButtonStyle}>
                            <Search size={22} /> <strong>BUSCAR</strong>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- ESTILOS ---

const suggestionsPanelStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: '12px',
    marginTop: '8px',
    boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
    border: '1px solid #e0e0e0',
    zIndex: 1000,
    overflow: 'hidden',
    padding: '8px 0'
};

const suggestionItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
};

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
    gap: '20px', 
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
    color: '#333',
    boxSizing: 'border-box' as const
};

// Estilo para el select grande (Perfil de viaje)
const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
    appearance: 'none' as const, 
    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 15px center',
    backgroundSize: '15px',
    height: '54px' 
};

// NUEVO: Estilo hiper-compacto optimizado para los selects internos de Adultos/Niños
const compactSelectStyle = {
    padding: '6px 25px 6px 10px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    fontSize: '0.95rem',
    backgroundColor: 'white',
    color: '#333',
    cursor: 'pointer',
    appearance: 'none' as const,
    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 8px center',
    backgroundSize: '12px',
    width: '100%',
    boxSizing: 'border-box' as const,
};

// Caja contenedora de personas igualada a la altura de los inputs hermanos (54px)
const peopleSelectorStyle = { 
    display: 'flex', 
    gap: '15px', 
    backgroundColor: '#f4f1ea', 
    padding: '4px 15px', 
    borderRadius: '12px',
    border: '1px solid #d2b48c',
    height: '54px', 
    boxSizing: 'border-box' as const,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
};

const miniLabelStyle = { 
    fontSize: '0.7rem', 
    color: '#8b4513', 
    fontWeight: 'bold', 
    marginBottom: '2px',
    textAlign: 'center' as const,
    lineHeight: '1'
};

const counterGroup = { 
    display: 'flex', 
    flexDirection: 'column' as const, 
    flex: 1,
    justifyContent: 'center'
};

const searchButtonStyle = { 
    backgroundColor: '#008080', 
    color: 'white', 
    border: 'none', 
    padding: '0 30px', 
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