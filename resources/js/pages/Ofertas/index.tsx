import React from 'react';
import { useForm, router, Link } from '@inertiajs/react';
import { Trash2, Power, PlusCircle, Tag } from 'lucide-react';

export default function OfertasIndex({ ofertas, hoteles }: any) {
    const { data, setData, post, reset, errors } = useForm({
        hotel_id: '',
        nombre: '',
        descuento_porcentaje: '',
        fecha_inicio: '',
        fecha_fin: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Corrección: Usar route() para generar la URL correcta si usas nombres de ruta en Laravel
        post('/ofertas/store', { onSuccess: () => reset() });
    };

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-extrabold text-white-900 flex items-center gap-2">
                        <Tag className="text-teal-600" /> Gestión de Ofertas
                        <Link href="/dashboard" className="text-sm text-white-500 hover:text-gray-700 transition">
                            Volver al Dashboard
                        </Link>
                    </h2>
                    <p className="text-sm text-gray-500">Configura los descuentos exclusivos para la Home</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* COLUMNA IZQUIERDA: FORMULARIO */}
                <div className="lg:col-span-1">
                    <form onSubmit={submit} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
                        <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <PlusCircle size={16} className="text-teal-500" /> Nueva Oferta
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">Hotel Destino</label>
                                {/* CORRECCIÓN: Añadida clase text-gray-900 para que el texto seleccionado sea negro */}
                                <select 
                                    className="w-full p-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all text-gray-900"
                                    value={data.hotel_id} 
                                    onChange={e => setData('hotel_id', e.target.value)}
                                >
                                    {/* Estilo para el placeholder (gris) y las opciones (negro) */}
                                    <option value="" className="text-gray-500">Selecciona hotel...</option>
                                    {hoteles.map((h: any) => (
                                        <option key={h.id} value={h.id} className="text-gray-900">
                                            {h.nombre_hotel}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">Nombre Público</label>
                                {/* CORRECCIÓN: Añadida clase text-gray-900 para el texto del input */}
                                <input 
                                    placeholder="Ej: Escapada de Verano" 
                                    className="w-full p-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-gray-900"
                                    value={data.nombre} onChange={e => setData('nombre', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">% Descuento</label>
                                {/* CORRECCIÓN: Añadida clase text-gray-900 para el texto del input */}
                                <input 
                                    type="number" placeholder="Ej: 15" 
                                    className="w-full p-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-gray-900"
                                    value={data.descuento_porcentaje} onChange={e => setData('descuento_porcentaje', e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Inicio</label>
                                    {/* CORRECCIÓN: Añadida clase text-gray-900 para el texto del input de fecha */}
                                    <input 
                                        type="date" className="w-full p-2.5 text-sm border border-gray-200 rounded-lg outline-none text-gray-900"
                                        value={data.fecha_inicio} onChange={e => setData('fecha_inicio', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Fin</label>
                                    {/* CORRECCIÓN: Añadida clase text-gray-900 para el texto del input de fecha */}
                                    <input 
                                        type="date" className="w-full p-2.5 text-sm border border-gray-200 rounded-lg outline-none text-gray-900"
                                        value={data.fecha_fin} onChange={e => setData('fecha_fin', e.target.value)}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 shadow-md shadow-teal-100 transition-all active:scale-95">
                                Crear Oferta
                            </button>
                        </div>
                    </form>
                </div>

                {/* COLUMNA DERECHA: TABLA (Sin cambios, ya que se ve bien) */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase">Detalles</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase">Vigencia</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {ofertas.map((o: any) => (
                                    <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-gray-800 text-sm">{o.nombre}</div>
                                            <div className="text-xs text-gray-500">{o.hotel.nombre_hotel}</div>
                                            <div className="mt-1">
                                                <span className="text-xs font-black text-red-500 bg-red-50 px-2 py-0.5 rounded">
                                                    -{o.descuento_porcentaje}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-xs text-gray-600">Desde: {o.fecha_inicio}</div>
                                            <div className="text-xs text-gray-600">Hasta: {o.fecha_fin}</div>
                                            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${o.activa ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                                                {o.activa ? 'Activa' : 'Inactiva'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <button 
                                                    // Corrección: Usar ruta con nombre si está configurada
                                                    onClick={() => router.patch('ofertas.toggle', o.id)}
                                                    className={`p-2 rounded-lg transition-colors ${o.activa ? 'text-amber-500 hover:bg-amber-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                                                >
                                                    <Power size={16} />
                                                </button>
                                                <button 
                                                    // Corrección: Usar ruta con nombre si está configurada
                                                    onClick={() => confirm('¿Eliminar oferta?') && router.delete('ofertas.destroy', o.id)}
                                                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {ofertas.length === 0 && (
                            <div className="p-10 text-center text-gray-400 text-sm">
                                No hay ofertas creadas todavía.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}