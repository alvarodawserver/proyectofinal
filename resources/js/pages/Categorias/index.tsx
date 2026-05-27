// resources/js/Pages/Categorias/Index.tsx

import React from 'react';
import { useForm, router, Link } from '@inertiajs/react';
import { Trash2, PlusCircle, Bookmark } from 'lucide-react';

export default function CategoriasIndex({ categorias }: any) {
    const { data, setData, post, reset, errors, processing } = useForm({
        nombre: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/categorias', { onSuccess: () => reset() });
    };

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                        <Bookmark className="text-teal-400" /> Gestión de Categorías
                    </h2>
                    <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
                        Volver al Dashboard
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* COLUMNA IZQUIERDA: FORMULARIO DE CREACIÓN */}
                <div className="lg:col-span-1">
                    <form onSubmit={submit} className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-6">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <PlusCircle size={16} className="text-teal-500" /> Nueva Categoría
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1 tracking-wide">Nombre de la Categoría</label>
                                <input 
                                    className="w-full p-2.5 text-sm border border-gray-200 rounded-lg outline-none text-black font-medium focus:border-teal-500 transition-all"
                                    value={data.nombre} 
                                    onChange={e => setData('nombre', e.target.value)}
                                    placeholder="Ej: Resort, Boutique, Rural..."
                                />
                                {errors.nombre && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.nombre}</p>}
                            </div>

                            <button 
                                type="submit" 
                                disabled={processing} 
                                className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-100 transition-all active:scale-95 disabled:opacity-50 mt-2"
                            >
                                {processing ? 'Creando...' : 'Añadir Categoría'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* COLUMNA DERECHA: TABLA DE CATEGORÍAS */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 text-[10px] font-black text-gray-400 uppercase">Nombre</th>
                                    <th className="p-4 text-[10px] font-black text-gray-400 uppercase text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {categorias?.map((c: any) => (
                                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900 text-sm">{c.nombre}</div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => confirm(`¿Eliminar la categoría "${c.nombre}"? Esto podría afectar a los hoteles que la tengan asignada.`) && router.delete(`/categorias/${c.id}`)} 
                                                    className="p-2 text-rose-500 border border-rose-100 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors shadow-sm"
                                                    title="Eliminar categoría"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {categorias?.length === 0 && (
                            <div className="p-12 text-center text-gray-400 text-sm font-medium italic">
                                No hay categorías configuradas. Comienza creando una a la izquierda.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}