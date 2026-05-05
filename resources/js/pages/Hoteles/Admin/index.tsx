import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';

interface Hotel {
    id: number;
    nombre_hotel: string;
    ciudad: string;
    habitaciones_count: number;
}

export default function Index({ hoteles }: { hoteles: Hotel[] }) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Hoteles', href: '/admin/hoteles' }]}>
            <Head title="Gestión de Hoteles" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Hoteles registrados</h1>
                    <Link 
                        href="/hoteles/create" 
                        className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 transition"
                    >
                        <Plus size={18} /> Añadir Hotel
                    </Link>
                </div>

                <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-neutral-50 dark:bg-neutral-800/50">
                            <tr>
                                <th className="p-4 font-semibold text-neutral-600 dark:text-neutral-400">Hotel</th>
                                <th className="p-4 font-semibold text-neutral-600 dark:text-neutral-400">Ubicación</th>
                                <th className="p-4 font-semibold text-neutral-600 dark:text-neutral-400 text-center">Habitaciones</th>
                                <th className="p-4 font-semibold text-neutral-600 dark:text-neutral-400 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                            {hoteles.map((hotel) => (
                                <tr key={hotel.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition">
                                    <td className="p-4 font-medium text-neutral-800 dark:text-neutral-200">{hotel.nombre_hotel}</td>
                                    <td className="p-4 text-neutral-500 dark:text-neutral-400">
                                        <div className="flex items-center gap-1">
                                            <MapPin size={14} /> {hotel.ciudad}
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="rounded-full bg-teal-100 px-2 py-1 text-xs font-bold text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">
                                            {hotel.habitaciones_count}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/hoteles/${hotel.id}/edit`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg dark:hover:bg-blue-900/20">
                                                <Edit2 size={18} />
                                            </Link>
                                            <Link 
                                            href={`/hoteles/${hotel.id}`} 
                                            method="delete" 
                                            as="button" 
                                            onBefore={() => confirm('¿Estás seguro de que deseas eliminar este hotel? Esta acción no se puede deshacer.')}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:hover:bg-red-900/20"
                                        >
                                            <Trash2 size={18} />
                                        </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}