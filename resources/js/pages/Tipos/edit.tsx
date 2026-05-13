import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Save, ArrowLeft, BedDouble, Users, Euro, Hash } from 'lucide-react';

export default function Edit({ tipo }: any) {
    const { data, setData, put, processing, errors } = useForm({
        tipo_habitacion: tipo.tipo_habitacion || '',
        capacidad: tipo.capacidad || 1,
        precio_base: tipo.precio_base || 0,
        cantidad_habitacion: tipo.cantidad_habitacion || 1,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/tipos/${tipo.id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-8 px-4">
            <Head title={`Editar ${tipo.tipo_habitacion}`} />

            <div className="max-w-xl mx-auto">
                <Link href="/tipos" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors font-bold text-xs mb-4 uppercase tracking-tight">
                    <ArrowLeft size={14} /> Volver al listado
                </Link>

                <form onSubmit={submit} className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
                    <div className="bg-white border-b border-gray-100 p-5 flex items-center gap-3">
                        <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                            <BedDouble size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-gray-800">Editar Tipo de Habitación</h2>
                    </div>

                    <div className="p-6 space-y-5">
                        {/* Nombre del Tipo */}
                        <div className="space-y-1">
                            <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Nombre del Tipo</label>
                            <input
                                type="text"
                                value={data.tipo_habitacion}
                                onChange={e => setData('tipo_habitacion', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:bg-white focus:border-indigo-500 transition-all outline-none"
                            />
                            {errors.tipo_habitacion && <p className="text-red-500 text-[10px] font-bold">{errors.tipo_habitacion}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Capacidad - CORREGIDO EL PADDING IZQUIERDO */}
                            <div className="space-y-1">
                                <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Capacidad</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={data.capacidad}
                                        onChange={e => setData('capacidad', parseInt(e.target.value))}

                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 pl-10 text-sm text-gray-700 focus:bg-white focus:border-indigo-500 transition-all outline-none font-bold"
                                    />
                                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                </div>
                            </div>

                            {/* Cantidad Disponible - CORREGIDO EL PADDING IZQUIERDO */}
                            <div className="space-y-1">
                                <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Unidades</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={data.cantidad_habitacion}
                                        onChange={e => setData('cantidad_habitacion', parseInt(e.target.value))}

                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 pl-10 text-sm text-gray-700 focus:bg-white focus:border-indigo-500 transition-all outline-none font-bold"
                                    />
                                    <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                </div>
                            </div>
                        </div>

                        {/* Precio Base - CORREGIDO COLOR DE TEXTO Y ESPACIADO */}
                        <div className="space-y-1">
                            <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                                Precio Base por Noche
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.precio_base}
                                    onChange={e => setData('precio_base', e.target.value)}
                                    /* CAMBIO CLAVE: text-black para negro puro y pl-12 para alejarlo más del icono */
                                    className="w-full bg-indigo-50/50 border border-indigo-200 rounded-xl px-3 py-3 pl-12 text-lg font-black text-black focus:bg-white focus:border-indigo-500 transition-all outline-none"
                                />
                                <Euro className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600" size={20} />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex justify-end gap-3">
                        <Link
                            href="/tipos"
                            className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-indigo-600 text-black px-6 py-2 rounded-xl font-bold text-sm hover:bg-indigo-700 shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            <Save size={16} /> {processing ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}