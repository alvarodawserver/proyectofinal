import { Link } from '@inertiajs/react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import HotelCard from '@/components/hotel-card';
import SearchBar from '@/components/search-bar';
import { Hotel, SearchFilters, Categoria } from '@/types';

interface Props {
    hoteles: Hotel[];
    filtros: SearchFilters;
    categorias: Categoria[];
}

export default function ResultsPage({ hoteles, filtros, categorias }: Props) {
    return (
        <div style={pageContainerStyle}>
            <Header />
            
            <SearchBar />

            <main style={mainLayout}>
                <aside style={sidebarStyle}>
                    <h3 style={sectionHeadingStyle}>Filtrar por</h3>
                    
                    <div style={filterGroupStyle}>
                        <h4 style={subHeadingStyle}>Categorías</h4>
                        {categorias?.map(cat => (
                            <label key={cat.id} style={checkboxStyle}>
                                <input type="checkbox" style={{ marginRight: '10px' }} /> {cat.nombre}
                            </label>
                        ))}
                    </div>

                    <div style={filterGroupStyle}>
                        <h4 style={subHeadingStyle}>Precio por noche</h4>
                        <input type="range" min="80" max="700" style={{ width: '100%', marginTop: '10px' }} />
                        <div style={rangeLabelsStyle}>
                            <span>80€</span>
                            <span>700€</span>
                        </div>
                    </div>
                </aside>

                {/* RESULTADOS */}
                <section style={{ flex: 1 }}>
                    <div style={resultsHeaderStyle}>
                        <h2 style={{ color: '#2C3E50', margin: 0 }}>
                            Hoteles encontrados ({hoteles.length})
                        </h2>
                        <select name="sort" style={selectSortStyle} defaultValue="">
                            <option value="" disabled>Ordenar por...</option>
                            <option value="recomendados">Recomendados</option>
                            <option value="precio_asc">Precio: Menor a mayor</option>
                        </select>
                    </div>

                    <div style={resultsGridStyle}>
                        {hoteles.map(hotel => (
                            <Link href={`/hoteles/${hotel.id}`} key={hotel.id} style={{ textDecoration: 'none' }}>
                                <HotelCard 
                                    nombre={hotel.nombre_hotel}
                                    ciudad={hotel.ciudad}
                                    categoria={hotel.categoria}
                                    imagen={hotel.images.length > 0 ? `/storage/${hotel.images[0].path}` : null}
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