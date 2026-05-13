import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Save, ArrowLeft, BedDouble, Users, Euro, Hash } from 'lucide-react';

export default function Create() {
    // Valores iniciales vacíos o por defecto
    const { data, setData, post, processing, errors } = useForm({
        tipo_habitacion: '',
        capacidad: 1,
        precio_base: 0,
        cantidad_habitacion: 1,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // URL Manual para el recurso según tu web.php
        post('/tipos'); 
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-8 px-4">
            <Head title="Crear Tipo de Habitación" />

            <div className="max-w-xl mx-auto">
                <Link href="/tipos" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors font-bold text-xs mb-4 uppercase tracking-tight">
                    <ArrowLeft size={14} /> Cancelar y volver
                </Link>

                <form onSubmit={submit} className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
                    {/* Cabecera */}
                    <div className="bg-white border-b border-gray-100 p-5 flex items-center gap-3">
                        <div className="bg-green-50 p-2 rounded-lg text-green-600">
                            <BedDouble size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-gray-800">Nuevo Tipo de Habitación</h2>
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
                                placeholder="Ej: Habitación Estándar"
                            />
                            {errors.tipo_habitacion && <p className="text-red-500 text-[10px] font-bold">{errors.tipo_habitacion}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Capacidad con Icono blindado */}
                            <div className="space-y-1">
                                <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Capacidad (Personas)</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        min="1"
                                        value={data.capacidad}
                                        onChange={e => setData('capacidad', parseInt(e.target.value))}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 pl-12 text-sm text-black font-bold focus:bg-white focus:border-indigo-500 transition-all outline-none"
                                    />
                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                </div>
                                {errors.capacidad && <p className="text-red-500 text-[10px] font-bold">{errors.capacidad}</p>}
                            </div>

                            {/* Unidades Totales con Icono blindado */}
                            <div className="space-y-1">
                                <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Stock (Unidades)</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        min="1"
                                        value={data.cantidad_habitacion}
                                        onChange={e => setData('cantidad_habitacion', parseInt(e.target.value))}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 pl-12 text-sm text-black font-bold focus:bg-white focus:border-indigo-500 transition-all outline-none"
                                    />
                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                </div>
                                {errors.cantidad_habitacion && <p className="text-red-500 text-[10px] font-bold">{errors.cantidad_habitacion}</p>}
                            </div>
                        </div>

                        {/* Precio Base con Texto Negro Real y Euro blindado */}
                        <div className="space-y-1">
                            <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Precio Base por Noche</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    step="0.01"
                                    value={data.precio_base}
                                    onChange={e => setData('precio_base', parseFloat(e.target.value) || 0)}
                                    className="w-full bg-indigo-50/50 border border-indigo-200 rounded-xl px-3 py-3 pl-12 text-lg font-black text-black focus:bg-white focus:border-indigo-500 transition-all outline-none"
                                />
                                <Euro className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600" size={20} />
                            </div>
                            {errors.precio_base && <p className="text-red-500 text-[10px] font-bold">{errors.precio_base}</p>}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex justify-end gap-3">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="bg-indigo-600 text-black px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            <Save size={16} /> {processing ? 'Creando...' : 'Crear Habitación'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}