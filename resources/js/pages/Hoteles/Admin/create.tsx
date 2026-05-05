import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

interface Propietario {
    id: number;
    name: string;
}

export default function Form({ propietarios }: { propietarios: Propietario[] }) {
    const { data, setData, post, processing, errors } = useForm({
        nombre_hotel: '',
        propietario_id: '',
        descripcion: '',
        direccion: '',
        ciudad: '',
        latitud: '',
        longitud: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/hoteles/store');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Hoteles', href: '/hoteles' }, { title: 'Nuevo Hotel', href: '#' }]}>
            <Head title="Añadir Nuevo Hotel" />

            <div className="max-w-4xl p-6">
                <h1 className="text-2xl font-bold mb-6 text-neutral-800 dark:text-neutral-100">Registrar nuevo hotel</h1>

                <form onSubmit={submit} className="bg-white p-8 rounded-xl border border-neutral-200 shadow-sm dark:bg-neutral-900 dark:border-neutral-800 space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Nombre del Hotel</label>
                            <input 
                                type="text" 
                                value={data.nombre_hotel}
                                onChange={e => setData('nombre_hotel', e.target.value)}
                                className="mt-1 block w-full rounded-md border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700"
                            />
                            {errors.nombre_hotel && <p className="text-red-500 text-xs mt-1">{errors.nombre_hotel}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Asignar Propietario</label>
                            <select 
                                value={data.propietario_id}
                                onChange={e => setData('propietario_id', e.target.value)}
                                className="mt-1 block w-full rounded-md border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700"
                            >
                                <option value="">Selecciona un propietario</option>
                                {propietarios?.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                            {errors.propietario_id && <p className="text-red-500 text-xs mt-1">{errors.propietario_id}</p>}
                        </div>

                        {/* CIUDAD */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Ciudad</label>
                            <input 
                                type="text" 
                                value={data.ciudad}
                                onChange={e => setData('ciudad', e.target.value)}
                                className="mt-1 block w-full rounded-md border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700"
                            />
                            {errors.ciudad && <p className="text-red-500 text-xs mt-1">{errors.ciudad}</p>}
                        </div>


                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Dirección Completa</label>
                            <input 
                                type="text" 
                                value={data.direccion}
                                onChange={e => setData('direccion', e.target.value)}
                                className="mt-1 block w-full rounded-md border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700"
                            />
                            {errors.direccion && <p className="text-red-500 text-xs mt-1">{errors.direccion}</p>}
                        </div>

                        {/* LATITUD */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Latitud</label>
                            <input 
                                type="number" step="any"
                                value={data.latitud}
                                onChange={e => setData('latitud', e.target.value)}
                                className="mt-1 block w-full rounded-md border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700"
                                placeholder="Ej: 40.4167"
                            />
                            {errors.latitud && <p className="text-red-500 text-xs mt-1">{errors.latitud}</p>}
                        </div>

                        {/* LONGITUD */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Longitud</label>
                            <input 
                                type="number" step="any"
                                value={data.longitud}
                                onChange={e => setData('longitud', e.target.value)}
                                className="mt-1 block w-full rounded-md border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700"
                                placeholder="Ej: -3.7037"
                            />
                            {errors.longitud && <p className="text-red-500 text-xs mt-1">{errors.longitud}</p>}
                        </div>

                        {/* DESCRIPCIÓN */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Descripción</label>
                            <textarea 
                                rows={4}
                                value={data.descripcion}
                                onChange={e => setData('descripcion', e.target.value)}
                                className="mt-1 block w-full rounded-md border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700"
                            />
                            {errors.descripcion && <p className="text-red-500 text-xs mt-1">{errors.descripcion}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="bg-teal-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-teal-700 transition disabled:opacity-50"
                        >
                            {processing ? 'Guardando...' : 'Crear Hotel'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}