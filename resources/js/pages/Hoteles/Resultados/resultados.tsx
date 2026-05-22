// resources/js/pages/Hoteles/Resultados/resultados.tsx
import { Link, router } from '@inertiajs/react'; 
import Header from '@/components/header';
import Footer from '@/components/footer';
import HotelCard from '@/components/hotel-card';
import SearchBar from '@/components/search-bar';
import { Hotel, SearchFilters, Categoria } from '@/types';
import { useState, useEffect } from 'react';

interface Props {
    hoteles: Hotel[];
    filtros: any; 
    categorias: Categoria[];
}

export default function ResultsPage({ hoteles, filtros, categorias }: Props) {

    const [localPrecioMax, setLocalPrecioMax] = useState(filtros.precio_max || 1000);
    
    const [compareIds, setCompareIds] = useState<number[]>(
        filtros.compare_ids ? (Array.isArray(filtros.compare_ids) ? filtros.compare_ids.map(Number) : [Number(filtros.compare_ids)]) : []
    );

    const handleFilterChange = (key: string, value: any) => {
        const newFilters = { ...filtros, [key]: value };
        
        Object.keys(newFilters).forEach(k => (newFilters[k] == null || newFilters[k] === '') && delete newFilters[k]);

        if (key !== 'compare_ids' && newFilters.compare_ids) {
            delete newFilters.compare_ids;
            setCompareIds([]);
        }

        router.get('/busqueda', newFilters, {
            preserveState: true, 
            replace: true,        
        });
    };

    const updateQuery = (key: string, value: any) => {
        const newFilters = { ...filtros, [key]: value };
        router.get('/busqueda', newFilters, {
            preserveState: true, 
            preserveScroll: true, 
            replace: true,        
            only: ['hoteles', 'filtros'], 
        });
    };

    useEffect(() => {
        if (localPrecioMax !== (filtros.precio_max || 1000)) {
            const timeoutId = setTimeout(() => {
                updateQuery('precio_max', localPrecioMax);
            }, 400);
            return () => clearTimeout(timeoutId);
        }
    }, [localPrecioMax]);

    const toggleCompare = (id: number) => {
        if (compareIds.includes(id)) {
            setCompareIds(compareIds.filter(i => i !== id));
        } else {
            if (compareIds.length >= 3) {
                alert('Puedes comparar un máximo de 3 hoteles a la vez.');
                return;
            }
            setCompareIds([...compareIds, id]);
        }
    };

    const ejecutarComparativa = () => {
        if (compareIds.length < 2) {
            alert('Selecciona al menos 2 hoteles para comparar.');
            return;
        }
        handleFilterChange('compare_ids', compareIds);
    };

    return (
        <div style={pageContainerStyle}>
            <Header />
            
            <div style={{ padding: '20px 0' }}>
                <SearchBar />
            </div>

            <main style={mainLayout}>
                <aside style={sidebarStyle}>
                    <h3 style={sectionHeadingStyle}>Filtrar por</h3>
                    
                    {/* Perfil de viaje */}
                    <div style={filterGroupStyle}>
                        <h4 style={subHeadingStyle}>Perfil de Viaje</h4>
                        <select 
                            style={selectSortStyle}
                            value={filtros.perfil || ""}
                            onChange={(e) => handleFilterChange('perfil', e.target.value)}
                        >
                            <option value="">Cualquiera</option>
                            <option value="familiar">Familiar</option>
                            <option value="romantico">Romántico</option>
                            <option value="negocios">Negocios</option>
                            <option value="economico">Económico</option>
                            <option value="relajante">Relajante</option>
                        </select>
                    </div>

                    <div style={filterGroupStyle}>
                        <h4 style={subHeadingStyle}>Categorías</h4>
                        {categorias?.map(cat => (
                            <label key={cat.id} style={checkboxStyle}>
                                <input 
                                    type="checkbox" 
                                    style={{ marginRight: '10px' }} 
                                    checked={filtros.categoria_id == cat.id}
                                    onChange={(e) => handleFilterChange('categoria_id', e.target.checked ? cat.id : '')}
                                /> 
                                {cat.nombre || (cat as any).nombre}
                            </label>
                        ))}
                    </div>

                    <div style={filterGroupStyle}>
                        <h4 style={subHeadingStyle}>Precio máximo: {localPrecioMax}€</h4>
                        <input 
                            type="range" 
                            min="50" 
                            max="1000" 
                            step="10"
                            value={localPrecioMax}
                            onChange={(e) => setLocalPrecioMax(Number(e.target.value))}
                            style={{ width: '100%', marginTop: '10px', accentColor: '#008080' }} 
                        />
                        <div style={rangeLabelsStyle}>
                            <span>50€</span>
                            <span>1000€</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => router.get('/busqueda')}
                        style={{ color: '#008080', fontWeight: 'bold', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        Limpiar filtros
                    </button>
                </aside>

                {/* RESULTADOS O TABLA COMPARATIVA */}
                <section style={{ flex: 1 }}>
                    <div style={resultsHeaderStyle}>
                        <div>
                            <h2 style={{ color: '#2C3E50', margin: 0 }}>
                                {filtros.compare_ids ? 'Comparativa de Hoteles' : `Hoteles encontrados (${hoteles.length})`}
                            </h2>
                            {/* Panel de comparativa activo */}
                            {compareIds.length > 0 && !filtros.compare_ids && (
                                <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e0ffff', borderRadius: '8px', display: 'inline-block' }}>
                                    <span style={{ fontWeight: 'bold', color: '#008080' }}>
                                        {compareIds.length} seleccionado(s) para comparar
                                    </span>
                                    <button onClick={ejecutarComparativa} style={compareBtnStyle}>
                                        Comparar
                                    </button>
                                </div>
                            )}
                            {filtros.compare_ids && (
                                <button onClick={() => handleFilterChange('compare_ids', '')} style={{ marginTop: '10px', ...compareBtnStyle, backgroundColor: '#e3342f' }}>
                                    Volver a la búsqueda
                                </button>
                            )}
                        </div>
                        
                        {!filtros.compare_ids && (
                            <select 
                                name="sort" 
                                style={selectSortStyle} 
                                value={filtros.order || ""}
                                onChange={(e) => handleFilterChange('order', e.target.value)}
                            >
                                <option value="">Recomendados</option>
                                <option value="precio_asc">Precio: Menor a mayor</option>
                                <option value="precio_desc">Precio: Mayor a menor</option>
                            </select>
                        )}
                    </div>

                    {/* LÓGICA CONDICIONAL: ¿Mostrar tabla o mostrar grid normal? */}
                    {filtros.compare_ids ? (
                        <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', border: '1px solid #e8e4db', padding: '20px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr>
                                        <th style={{ padding: '15px', borderBottom: '2px solid #eee', color: '#4A3728' }}>Características</th>
                                        {hoteles.map(hotel => (
                                            <th key={`head-${hotel.id}`} style={{ padding: '15px', borderBottom: '2px solid #eee', textAlign: 'center' }}>
                                                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#2C3E50' }}>{hotel.nombre_hotel || (hotel as any).nombre}</div>
                                                <div style={{ fontSize: '0.85rem', color: '#777', fontWeight: 'normal' }}>{hotel.ciudad}</div>
                                                {hotel.images && hotel.images.length > 0 && (
                                                    <img 
                                                        src={`/storage/${hotel.images[0].path}`} 
                                                        alt={hotel.nombre_hotel} 
                                                        style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }}
                                                    />
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Precio */}
                                    <tr>
                                        <td style={{ padding: '15px', borderBottom: '1px solid #eee', fontWeight: 'bold', color: '#555' }}>Precio Base</td>
                                        {hoteles.map(hotel => (
                                            <td key={`precio-${hotel.id}`} style={{ padding: '15px', borderBottom: '1px solid #eee', textAlign: 'center', fontSize: '1.2rem', color: '#008080', fontWeight: 'bold' }}>
                                                {hotel.precio_min ? `${hotel.precio_min}€` : 'N/D'}
                                            </td>
                                        ))}
                                    </tr>
                                    
                                    {/* Valoraciones */}
                                    <tr>
                                        <td style={{ padding: '15px', borderBottom: '1px solid #eee', fontWeight: 'bold', color: '#555' }}>Valoración</td>
                                        {hoteles.map(hotel => (
                                            <td key={`rating-${hotel.id}`} style={{ padding: '15px', borderBottom: '1px solid #eee', textAlign: 'center' }}>
                                                <span style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '1.1rem' }}>★</span> {(hotel as any).reviews_avg_valoracion ? Number((hotel as any).reviews_avg_valoracion).toFixed(1) : 'S/N'} 
                                                <div style={{ fontSize: '0.8rem', color: '#777' }}>({(hotel as any).reviews_count || 0} opiniones)</div>
                                            </td>
                                        ))}
                                    </tr>

                                    {/* Categorías */}
                                    <tr>
                                        <td style={{ padding: '15px', borderBottom: '1px solid #eee', fontWeight: 'bold', color: '#555' }}>Categoría</td>
                                        {hoteles.map(hotel => (
                                            <td key={`cat-${hotel.id}`} style={{ padding: '15px', borderBottom: '1px solid #eee', textAlign: 'center', fontSize: '0.9rem' }}>
                                                {(hotel as any).categorias && (hotel as any).categorias.length > 0 
                                                    ? (hotel as any).categorias.map((c: any) => c.nombre).join(', ') 
                                                    : 'Estándar'}
                                            </td>
                                        ))}
                                    </tr>

                                    {/* Servicios */}
                                    <tr>
                                        <td style={{ padding: '15px', borderBottom: '1px solid #eee', fontWeight: 'bold', color: '#555' }}>Servicios Destacados</td>
                                        {hoteles.map(hotel => (
                                            <td key={`serv-${hotel.id}`} style={{ padding: '15px', borderBottom: '1px solid #eee', verticalAlign: 'top' }}>
                                                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9rem', color: '#555' }}>
                                                    {(hotel as any).servicios && (hotel as any).servicios.slice(0, 5).map((serv: any) => (
                                                        <li key={serv.id} style={{ marginBottom: '5px' }}>{serv.nombre_servicio}</li>
                                                    ))}
                                                </ul>
                                            </td>
                                        ))}
                                    </tr>

                                    {/* Botón de acción */}
                                    <tr>
                                        <td style={{ padding: '15px', fontWeight: 'bold', color: '#555' }}></td>
                                        {hoteles.map(hotel => (
                                            <td key={`btn-${hotel.id}`} style={{ padding: '20px 15px', textAlign: 'center' }}>
                                                <Link 
                                                    href={`/hoteles/${hotel.id}/show`} 
                                                    style={{ display: 'inline-block', backgroundColor: '#008080', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', width: '100%', boxSizing: 'border-box' }}
                                                >
                                                    Ver Hotel
                                                </Link>
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={resultsGridStyle}>
                            {hoteles.map(hotel => (
                                <div key={hotel.id} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <Link href={`/hoteles/${hotel.id}/show`} style={{ textDecoration: 'none', flex: 1 }}>
                                        <HotelCard 
                                            nombre={hotel.nombre_hotel || (hotel as any).nombre}
                                            ciudad={hotel.ciudad}
                                            categoria={hotel.categoria || "Hotel"}
                                            imagen={hotel.images && hotel.images.length > 0 ? `/storage/${hotel.images[0].path}` : null}
                                            precio_final={hotel.precio_min || 0} 
                                            precio_original={hotel.precio_min || 0} 
                                            tiene_oferta={false}
                                            descuento={0}
                                            reviews_avg={(hotel as any).reviews_avg_valoracion || hotel.rating || 0}
                                            reviews_count={(hotel as any).reviews_count || 0}
                                        />
                                    </Link>
                                    
                                    {/* Casilla de comparativa */}
                                    {!filtros.compare_ids && (
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '5px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #ccc' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={compareIds.includes(hotel.id)}
                                                onChange={() => toggleCompare(hotel.id)}
                                            />
                                            <span style={{ fontSize: '0.9rem', color: '#555' }}>Seleccionar para comparar</span>
                                        </label>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
            
            <Footer />
        </div>
    );
}

const pageContainerStyle = { backgroundColor: '#f4f1ea', minHeight: '100vh', color: '#333' };
const mainLayout = { maxWidth: '1200px', margin: '40px auto', display: 'flex', gap: '30px', padding: '0 20px', alignItems: 'flex-start' };
const sidebarStyle = { width: '280px', backgroundColor: 'white', padding: '25px', borderRadius: '15px', height: 'fit-content', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', border: '1px solid #e8e4db' };
const sectionHeadingStyle = { color: '#4A3728', marginBottom: '20px', fontSize: '1.2rem' };
const subHeadingStyle = { color: '#8B4513', marginBottom: '10px', fontSize: '0.9rem', textTransform: 'uppercase' as const };
const filterGroupStyle = { marginBottom: '25px' };
const checkboxStyle = { display: 'block', margin: '8px 0', cursor: 'pointer', color: '#555' };
const rangeLabelsStyle = { display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#777', marginTop: '5px' };
const resultsHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' };
const selectSortStyle = { padding: '8px 12px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: 'white', color: '#333', width: '100%', boxSizing: 'border-box' as const };
const resultsGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' };
const compareBtnStyle = { marginLeft: '15px', padding: '6px 12px', backgroundColor: '#008080', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };