import { usePage } from '@inertiajs/react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import HotelCard from '@/components/hotel-card';
import { Settings } from 'lucide-react';
import { Link } from '@inertiajs/react';
import SearchBar from '@/components/search-bar';
interface Hotele{
  id: number;
  nombre: string;
  ciudad: string;
  categoria: string;
  imagen: string | null;
  precio_min: number;
  rating?: number;
}

interface Oferta{
  hotel:{
    images:{path:string, is_primary:boolean};
    nombre_hotel: string;
  }
  id: number;
  nombre: string;
  hotel_id: number;
  descuento_porcentaje: number;
  fecha_inicio: string;
  fecha_fin: string;
  activa: boolean;
}

interface Tipo{
  id: number;
  nombre: string;
}


interface HomePageProps {
  hoteles: Hotele[];
  ofertas: Oferta[];
}

export default function HomePage({ hoteles, ofertas }: HomePageProps) {
    const { auth } = usePage().props as any;
  return (
        <div style={{ backgroundColor: '#f4f1ea', minHeight: '100vh' }}>
            <Header />
            {auth.user?.can_access_admin && (
                <Link
                    href="/dashboard"
                    className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-3 text-white shadow-2xl transition-transform hover:scale-110 dark:bg-white dark:text-black"
                >
                    <Settings size={20} className="animate-spin-slow" />
                    <span className="text-sm font-bold">Panel Admin</span>
                </Link>
            )}
            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
                <SearchBar />
                
                {ofertas.length > 0 && (
                    <section style={{ marginBottom: '50px' }}>
                        <h2 style={{ color: '#8B4513', borderBottom: '2px solid #D2B48C', display: 'inline-block' }}>
                             Ofertas Exclusivas
                        </h2>
                        <div style={ofertasContainerStyle}>
                            {ofertas.map(oferta => (
                                <div key={oferta.id} style={ofertaCardStyle}>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: 0, color: 'black'}}>{oferta.nombre}</h4>
                                        <p style={{ fontSize: '0.9rem', color: '#666' }}>En {oferta.hotel.nombre_hotel}</p>
                                        <span style={discountBadgeStyle}>-{oferta.descuento_porcentaje}%</span>
                                    </div>
                                    <Link href={`/hoteles/${oferta.hotel_id}/show?oferta_id=${oferta.id}`} style={ofertaButtonStyle}>
                                        Ver chollo
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <h2 style={{ color: '#008080', marginBottom: '25px', borderBottom: '2px solid #008080', display: 'inline-block'}}>Explora nuestros hoteles</h2>
                <div style={hotelGridStyle}>
                    {hoteles.map(hotel => (
                        <Link href={`/hoteles/${hotel.id}/show`}>
                            <HotelCard 
                                key={hotel.id}
                                nombre={hotel.nombre}
                                ciudad={hotel.ciudad}
                                categoria={hotel.categoria}
                                imagen={hotel.imagen ? `/storage/${hotel.imagen}` : null}
                                precio_minimo={hotel.precio_min}
                                rating={hotel.rating || 0}
                            />
                        </Link>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}




const hotelGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '25px'
};

const ofertasContainerStyle = {
    display: 'flex',
    gap: '20px',
    overflowX: 'auto' as const,
    padding: '10px 0'
};

const ofertaCardStyle = {
    minWidth: '300px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #D2B48C',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
};

const discountBadgeStyle = {
    backgroundColor: '#e3342f',
    color: 'white',
    padding: '2px 8px',
    borderRadius: '5px',
    fontWeight: 'bold' as const
};

const ofertaButtonStyle = {
    backgroundColor: '#008080',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '8px',
    cursor: 'pointer'
};