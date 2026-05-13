import React from 'react';
import { useForm, router, Link } from '@inertiajs/react';
import { Trash2, Power, PlusCircle, Tag } from 'lucide-react';

export default function OfertasIndex({ ofertas, hoteles }: any) {
    const { data, setData, post, reset, errors, processing } = useForm({
        hotel_id: '',
        nombre: '',
        descuento_porcentaje: '',
        fecha_inicio: '',
        fecha_fin: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/ofertas', { onSuccess: () => reset() });
    };

    return (
        // Quitamos el min-h-screen gris y lo dejamos limpio
        <div className="max-w-5xl mx-auto p-4 sm:p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                        <Tag className="text-teal-400" /> Gestión de Ofertas
                    </h2>
                    <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
                        Volver al Dashboard
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* COLUMNA IZQUIERDA: FORMULARIO */}
                <div className="lg:col-span-1">
                    <form onSubmit={submit} className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-6">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <PlusCircle size={16} className="text-teal-500" /> Nueva Oferta
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1 tracking-wide">Hotel Destino</label>
                                <select 
                                    className="w-full p-2.5 text-sm border border-gray-200 rounded-lg outline-none text-black font-medium focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all"
                                    value={data.hotel_id} 
                                    onChange={e => setData('hotel_id', e.target.value)}
                                >
                                    <option value="">Selecciona hotel...</option>
                                    {hoteles.map((h: any) => (
                                        <option key={h.id} value={h.id}>{h.nombre_hotel}</option>
                                    ))}
                                </select>
                                {errors.hotel_id && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.hotel_id}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1 tracking-wide">Nombre Público</label>
                                <input 
                                    className="w-full p-2.5 text-sm border border-gray-200 rounded-lg outline-none text-black font-medium focus:border-teal-500 transition-all"
                                    value={data.nombre} onChange={e => setData('nombre', e.target.value)}
                                    placeholder="Ej: Promo Verano"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1 tracking-wide">% Descuento</label>
                                <input 
                                    type="number" 
                                    className="w-full p-2.5 text-sm border border-gray-200 rounded-lg outline-none text-black font-bold focus:border-teal-500 transition-all"
                                    value={data.descuento_porcentaje} onChange={e => setData('descuento_porcentaje', e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1 tracking-wide">Inicio</label>
                                    <input 
                                        type="date" className="w-full p-2.5 text-sm border border-gray-200 rounded-lg text-black outline-none"
                                        value={data.fecha_inicio} onChange={e => setData('fecha_inicio', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1 tracking-wide">Fin</label>
                                    <input 
                                        type="date" className="w-full p-2.5 text-sm border border-gray-200 rounded-lg text-black outline-none"
                                        value={data.fecha_fin} onChange={e => setData('fecha_fin', e.target.value)}
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={processing} 
                                className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-100 transition-all active:scale-95 disabled:opacity-50 mt-2"
                            >
                                {processing ? 'Creando...' : 'Crear Oferta'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* COLUMNA DERECHA: TABLA */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 text-[10px] font-black text-gray-400 uppercase">Detalles</th>
                                    <th className="p-4 text-[10px] font-black text-gray-400 uppercase">Vigencia</th>
                                    <th className="p-4 text-[10px] font-black text-gray-400 uppercase text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {ofertas.map((o: any) => (
                                    <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900 text-sm">{o.nombre}</div>
                                            <div className="text-xs text-gray-500 font-medium">{o.hotel?.nombre_hotel}</div>
                                            <div className="mt-1">
                                                <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 shadow-sm">
                                                    -{o.descuento_porcentaje}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-[11px] text-gray-600 font-bold uppercase tracking-tighter">De: {o.fecha_inicio}</div>
                                            <div className="text-[11px] text-gray-600 font-bold uppercase tracking-tighter">Hasta: {o.fecha_fin}</div>
                                            <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${o.activa ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-400 border border-gray-200'}`}>
                                                {o.activa ? 'Activa' : 'Inactiva'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => router.patch(`/ofertas/${o.id}/toggle`)} 
                                                    className={`p-2 rounded-lg border transition-all ${o.activa ? 'text-amber-500 border-amber-100 bg-amber-50 hover:bg-amber-100' : 'text-emerald-600 border-emerald-100 bg-emerald-50 hover:bg-emerald-100'}`}
                                                >
                                                    <Power size={16} />
                                                </button>

                                                <button 
                                                    onClick={() => confirm('¿Eliminar oferta?') && router.delete(`/ofertas/${o.id}`)} 
                                                    className="p-2 text-rose-500 border border-rose-100 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors shadow-sm"
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
                            <div className="p-12 text-center text-gray-400 text-sm font-medium italic">
                                No hay ofertas configuradas. Comienza creando una a la izquierda.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}