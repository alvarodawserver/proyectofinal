import Header from '@/components/header';
import ActividadCard from '@/components/activity-card'; // <-- Asegúrate de que la ruta y las mayúsculas coincidan con tu archivo
import { Head } from '@inertiajs/react';

interface Actividad {
    id: number;
    nombre_actividad: string;
    descripcion: string;
}

interface Props {
    actividades: Actividad[];
}

export default function Experiencias({ actividades }: Props) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            
            <Header />
            <Head title="Nuestras Experiencias" />
            
            <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                            Descubre Nuestras Actividades
                        </h1>
                        <p className="mt-4 text-xl text-gray-500">
                            Haz de tu estancia una experiencia inolvidable con todo lo que nuestro hotel puede ofrecerte.
                        </p>
                    </div>

                    {/* Cuadrícula de tarjetas con tu nuevo componente reutilizable */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {actividades?.map((actividad) => (
                            <ActividadCard 
                                key={actividad.id} 
                                actividad={actividad} 
                            />
                        ))}
                    </div>
                    
                    {actividades?.length === 0 && (
                        <div className="text-center text-gray-500 mt-10">
                            Próximamente añadiremos nuevas experiencias...
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}