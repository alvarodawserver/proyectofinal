import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

interface Hotel {
    id: number;
    nombre_hotel: string;
    propietario_id: number;
    descripcion: string;
    direccion: string;
    ciudad: string;
    latitud: number;
    longitud: number;
}

interface Props {
    hotel: Hotel;
    propietarios: { id: number; name: string }[];
}

export default function Edit({ hotel, propietarios }: Props) {
    // Inicializamos con los datos que vienen del servidor
    const { data, setData, put, processing, errors } = useForm({
        nombre_hotel: hotel.nombre_hotel || '',
        propietario_id: hotel.propietario_id || '',
        descripcion: hotel.descripcion || '',
        direccion: hotel.direccion || '',
        ciudad: hotel.ciudad || '',
        latitud: hotel.latitud || '',
        longitud: hotel.longitud || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Usamos PUT para actualizar
        put(`/admin/hoteles/${hotel.id}`);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Hoteles', href: '/admin/hoteles' }, { title: 'Editar Hotel', href: '#' }]}>
            <Head title={`Editando ${hotel.nombre_hotel}`} />

            <div className="max-w-4xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                        Editar: <span className="text-teal-600">{hotel.nombre_hotel}</span>
                    </h1>
                </div>

                <form onSubmit={submit} className="bg-white p-8 rounded-xl border border-neutral-200 shadow-sm dark:bg-neutral-900 dark:border-neutral-800 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Nombre del Hotel</label>
                            <input 
                                type="text" 
                                value={data.nombre_hotel}
                                onChange={e => setData('nombre_hotel', e.target.value)}
                                className="mt-1 block w-full rounded-md border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700 focus:ring-teal-500"
                            />
                            {errors.nombre_hotel && <p className="text-red-500 text-xs mt-1">{errors.nombre_hotel}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Propietario</label>
                            <select 
                                value={data.propietario_id}
                                onChange={e => setData('propietario_id', e.target.value)}
                                className="mt-1 block w-full rounded-md border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700"
                            >
                                {propietarios.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Ciudad</label>
                            <input 
                                type="text" 
                                value={data.ciudad}
                                onChange={e => setData('ciudad', e.target.value)}
                                className="mt-1 block w-full rounded-md border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Dirección</label>
                            <input 
                                type="text" 
                                value={data.direccion}
                                onChange={e => setData('direccion', e.target.value)}
                                className="mt-1 block w-full rounded-md border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Latitud</label>
                            <input 
                                type="number" step="any"
                                value={data.latitud}
                                onChange={e => setData('latitud', e.target.value)}
                                className="mt-1 block w-full rounded-md border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Longitud</label>
                            <input 
                                type="number" step="any"
                                value={data.longitud}
                                onChange={e => setData('longitud', e.target.value)}
                                className="mt-1 block w-full rounded-md border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Descripción</label>
                            <textarea 
                                rows={4}
                                value={data.descripcion}
                                onChange={e => setData('descripcion', e.target.value)}
                                className="mt-1 block w-full rounded-md border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                        <button 
                            type="button"
                            onClick={() => window.history.back()}
                            className="px-6 py-2 text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="bg-teal-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-teal-700 transition disabled:opacity-50"
                        >
                            {processing ? 'Actualizando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}