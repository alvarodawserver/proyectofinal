import React, { useState, useEffect } from 'react';
import { useForm, router, Link } from '@inertiajs/react';
import { Trash2, Edit3, PlusCircle, Activity, Euro, Users, X, Save } from 'lucide-react';

export default function ActivitiesIndex({ activities, hoteles }: any) {
    // Estado para saber si estamos editando
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, patch, reset, errors, processing } = useForm({
        nombre_actividad: '',
        descripcion: '',
        precio: '',
        capacidad: '',
        hoteles_ids: [] as number[],
    });

    // Función para cargar los datos en el formulario al querer editar
    const startEdit = (activity: any) => {
        setEditingId(activity.id);
        setData({
            nombre_actividad: activity.nombre_actividad,
            descripcion: activity.descripcion,
            precio: activity.precio,
            capacidad: activity.capacidad,
            hoteles_ids: activity.hoteles.map((h: any) => h.id),
        });
    };

    // Función para cancelar edición
    const cancelEdit = () => {
        setEditingId(null);
        reset();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            // Ruta manual para UPDATE
            patch(`/actividades/${editingId}`, {
                onSuccess: () => cancelEdit(),
            });
        } else {
            post('/actividades', {
                onSuccess: () => reset(),
            });
        }
    };

    const handleHotelToggle = (hotelId: number) => {
        const currentIds = [...data.hoteles_ids];
        if (currentIds.includes(hotelId)) {
            setData('hoteles_ids', currentIds.filter(id => id !== hotelId));
        } else {
            setData('hoteles_ids', [...currentIds, hotelId]);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                        <Activity className="text-indigo-400" /> Gestión de Actividades
                    </h2>
                    <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">Volver al Dashboard</Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* FORMULARIO DINÁMICO (Crear/Editar) */}
                <div className="lg:col-span-4">
                    <form onSubmit={submit} className={`p-6 rounded-2xl shadow-xl border transition-all sticky top-6 ${editingId ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-100'}`}>
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                                {editingId ? <Edit3 size={16} className="text-amber-500" /> : <PlusCircle size={16} className="text-indigo-500" />}
                                {editingId ? 'Editando Actividad' : 'Nueva Actividad'}
                            </h3>
                            {editingId && (
                                <button type="button" onClick={cancelEdit} className="text-gray-400 hover:text-gray-600">
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Nombre</label>
                                <input 
                                    className="w-full p-2.5 text-sm border border-gray-200 rounded-lg outline-none text-black font-medium focus:border-indigo-500"
                                    value={data.nombre_actividad} onChange={e => setData('nombre_actividad', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Descripción</label>
                                <textarea 
                                    className="w-full p-2.5 text-sm border border-gray-200 rounded-lg outline-none text-black h-20 resize-none focus:border-indigo-500"
                                    value={data.descripcion} onChange={e => setData('descripcion', e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Precio (€)</label>
                                    <input type="number" step="0.01" className="w-full p-2.5 text-sm border border-gray-200 rounded-lg text-black font-bold" value={data.precio} onChange={e => setData('precio', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Capacidad</label>
                                    <input type="number" className="w-full p-2.5 text-sm border border-gray-200 rounded-lg text-black font-bold" value={data.capacidad} onChange={e => setData('capacidad', e.target.value)} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Asignar a Hoteles:</label>
                                <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1 bg-white">
                                    {hoteles.map((h: any) => (
                                        <label key={h.id} className="flex items-center gap-2 cursor-pointer hover:bg-indigo-50 p-1 rounded transition-colors">
                                            <input 
                                                type="checkbox" 
                                                className="rounded text-indigo-600 focus:ring-indigo-500"
                                                checked={data.hoteles_ids.includes(h.id)}
                                                onChange={() => handleHotelToggle(h.id)}
                                            />
                                            <span className="text-xs text-gray-700">{h.nombre_hotel}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={processing} 
                                className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2 ${editingId ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-100' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'}`}
                            >
                                {editingId ? <Save size={14}/> : <PlusCircle size={14}/>}
                                {editingId ? 'Guardar Cambios' : 'Crear Actividad'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* TABLA (8 columnas) */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 text-[10px] font-black text-gray-400 uppercase">Actividad</th>
                                    <th className="p-4 text-[10px] font-black text-gray-400 uppercase text-center">Datos</th>
                                    <th className="p-4 text-[10px] font-black text-gray-400 uppercase">Hoteles</th>
                                    <th className="p-4 text-[10px] font-black text-gray-400 uppercase text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {activities.map((a: any) => (
                                    <tr key={a.id} className={`transition-colors ${editingId === a.id ? 'bg-indigo-50/50' : 'hover:bg-gray-50/30'}`}>
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900 text-sm">{a.nombre_actividad}</div>
                                            <div className="text-[10px] text-gray-400 line-clamp-1 w-40">{a.descripcion}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col items-center">
                                                <span className="text-indigo-600 font-bold text-xs">{a.precio}€</span>
                                                <span className="text-gray-400 text-[10px]">{a.capacidad} pax</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-1">
                                                {a.hoteles?.map((h: any) => (
                                                    <span key={h.id} className="px-1.5 py-0.5 bg-white text-gray-600 text-[9px] font-bold rounded border border-gray-200">
                                                        {h.nombre_hotel}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <button onClick={() => startEdit(a)} className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-100">
                                                    <Edit3 size={16} />
                                                </button>
                                                <button onClick={() => confirm('¿Eliminar?') && router.delete(`/activities/${a.id}`)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}