import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { BedDouble, Users, Banknote, Plus, Edit, Trash2 } from 'lucide-react';

export default function Index({ tipos }: any) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Tipos de Habitación', href: '#' }]}>
            <Head title="Tipos de Habitación" />

            <div className="max-w-6xl mx-auto p-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-800">Tipos de Habitación</h1>
                        <p className="text-sm text-neutral-500">Configura el inventario y precios base</p>
                    </div>
                    <Link href={'/tipos/create'} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-200">
                        <Plus size={18} /> Nuevo Tipo
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tipos.map((t: any) => (
                        <div key={t.id} className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <BedDouble size={24} />
                                </div>
                                <div className="flex gap-1">
                                    <Link href={`/tipos/${t.id}/edit`} className="p-2 text-neutral-400 hover:text-indigo-600 transition-colors">
                                        <Edit size={18} />
                                    </Link>
                                    <button onClick={() => confirm('¿Borrar tipo?') && router.delete(`/tipos/${t.id}/destroy`)} className="p-2 text-neutral-400 hover:text-rose-600 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-neutral-800 mb-4">{t.tipo_habitacion}</h3>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-neutral-500 flex items-center gap-2"><Users size={16}/> Capacidad</span>
                                    <span className="font-bold text-neutral-700">{t.capacidad} personas</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-neutral-500 flex items-center gap-2"><Banknote size={16}/> Precio Base</span>
                                    <span className="font-bold text-teal-600">{t.precio_base}€</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-neutral-500 flex items-center gap-2 text-xs uppercase font-bold tracking-wider">Disponibles</span>
                                    <span className="bg-neutral-100 px-2 py-1 rounded text-neutral-600 font-mono text-xs">{t.cantidad_habitacion} unidades</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}