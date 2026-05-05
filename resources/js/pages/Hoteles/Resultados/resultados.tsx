import { Link, router } from '@inertiajs/react'; 
import Header from '@/components/header';
import Footer from '@/components/footer';
import HotelCard from '@/components/hotel-card';
import SearchBar from '@/components/search-bar';
import { Hotel, SearchFilters, Categoria } from '@/types';
import { useState, useEffect, useCallback } from 'react';

interface Props {
    hoteles: Hotel[];
    filtros: any; 
    categorias: Categoria[];
}

export default function ResultsPage({ hoteles, filtros, categorias }: Props) {


    const handleFilterChange = (key: string, value: any) => {
        const newFilters = { ...filtros, [key]: value };
        
        
        Object.keys(newFilters).forEach(k => (newFilters[k] == null || newFilters[k] === '') && delete newFilters[k]);

        router.get('/busqueda', newFilters, {
            preserveState: true, 
            replace: true,        
        });
    };

    const [localPrecioMax, setLocalPrecioMax] = useState(filtros.precio_max || 1000);

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
        if (localPrecioMax !== filtros.precio_max) {
            const timeoutId = setTimeout(() => {
                updateQuery('precio_max', localPrecioMax);
            }, 400);
            return () => clearTimeout(timeoutId);
        }
    }, [localPrecioMax]);


    return (
        <div style={pageContainerStyle}>
            <Header />
            
            <div style={{ padding: '20px 0' }}>
                <SearchBar />
            </div>

            <main style={mainLayout}>
                <aside style={sidebarStyle}>
                    <h3 style={sectionHeadingStyle}>Filtrar por</h3>
                    
                    <div style={filterGroupStyle}>
                        <h4 style={subHeadingStyle}>Categorías</h4>
                        {categorias?.map(cat => (
                            <label key={cat.id} style={checkboxStyle}>
                                <input 
                                    type="checkbox" 
                                    style={{ marginRight: '10px' }} 
                                    // Comprobamos si está seleccionada en los filtros
                                    checked={filtros.categoria_id == cat.id}
                                    onChange={(e) => handleFilterChange('categoria_id', e.target.checked ? cat.id : '')}
                                /> 
                                {cat.nombre || (cat as any).nombre}
                            </label>
                        ))}
                    </div>

                    <div style={filterGroupStyle}>
                        <h4 style={subHeadingStyle}>Precio máximo: {filtros.precio_max ? `${filtros.precio_max}€` : 'Sin límite'}</h4>
                        <input 
                            type="range" 
                            min="50" 
                            max="1000" 
                            step="10"
                            value={filtros.precio_max || 1000}
                            onChange={(e) => handleFilterChange('precio_max', e.target.value)}
                            style={{ width: '100%', marginTop: '10px', accentColor: '#008080' }} 
                        />
                        <div style={rangeLabelsStyle}>
                            <span>50€</span>
                            <span>1000€</span>
                        </div>
                    </div>

                    {/* Botón para limpiar filtros */}
                    <button 
                        onClick={() => router.get('/busqueda')}
                        className="text-sm text-teal-600 font-bold hover:underline"
                    >
                        Limpiar filtros
                    </button>
                </aside>

                {/* RESULTADOS */}
                <section style={{ flex: 1 }}>
                    <div style={resultsHeaderStyle}>
                        <h2 style={{ color: '#2C3E50', margin: 0 }}>
                            Hoteles encontrados ({hoteles.length})
                        </h2>
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
                    </div>

                    <div style={resultsGridStyle}>
                        {hoteles.map(hotel => (
                            <Link href={`/hoteles/${hotel.id}/show`} key={hotel.id} style={{ textDecoration: 'none' }}>
                                <HotelCard 
                                    nombre={hotel.nombre_hotel}
                                    ciudad={hotel.ciudad}
                                    categoria={hotel.categoria || "Hotel"}
                                    imagen={hotel.images && hotel.images.length > 0 ? `/storage/${hotel.images[0].path}` : null}
                                    precio_minimo={hotel.precio_min || 0}
                                    rating={hotel.rating || 0}
                                />
                            </Link>
                        ))}
                    </div>
                </section>
            </main>
            
            <Footer />
        </div>
    );
}

// --- ESTILOS ---

const pageContainerStyle = { backgroundColor: '#f4f1ea', minHeight: '100vh', color: '#333' };
const mainLayout = { maxWidth: '1200px', margin: '40px auto', display: 'flex', gap: '30px', padding: '0 20px' };

const sidebarStyle = {
    width: '280px',
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '15px',
    height: 'fit-content',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
    border: '1px solid #e8e4db'
};

const sectionHeadingStyle = { color: '#4A3728', marginBottom: '20px', fontSize: '1.2rem' };
const subHeadingStyle = { color: '#8B4513', marginBottom: '10px', fontSize: '0.9rem', textTransform: 'uppercase' as const };
const filterGroupStyle = { marginBottom: '25px' };
const checkboxStyle = { display: 'block', margin: '8px 0', cursor: 'pointer', color: '#555' };

// Nuevo estilo para las etiquetas del rango
const rangeLabelsStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    color: '#777',
    marginTop: '5px'
};

const resultsHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };

const selectSortStyle = { 
    padding: '8px 12px', 
    borderRadius: '8px', 
    border: '1px solid #ccc',
    backgroundColor: 'white',
    color: '#333'
};

const resultsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '25px'
};