import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { UserPlus, Trash2, ShieldCheck, User as UserIcon, Edit2, X } from 'lucide-react';

export default function UsuariosIndex({ usuarios, roles }: any) {
    // Estado para saber si estamos editando
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, reset, errors, processing } = useForm({
        name: '',
        email: '',
        password: '', // Opcional en edición
        role: '',
    });

    // Función para cargar datos en el formulario
    const startEdit = (u: any) => {
        setEditingId(u.id);
        setData({
            name: u.name,
            email: u.email,
            password: '', // La dejamos vacía por seguridad
            role: u.roles?.[0]?.name || '',
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        reset();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            // Ruta para UPDATE
            put(`/usuarios/${editingId}`, {
                onSuccess: () => {
                    setEditingId(null);
                    reset();
                }
            });
        } else {
            // Ruta para STORE
            post('/usuarios/store', { 
                onSuccess: () => reset() 
            });
        }
    };

    const getRoleBadge = (roles: any) => {
        const roleName = (roles && roles.length > 0) ? roles[0].name : 'sin rol';
        const styles: any = {
            admin: 'bg-purple-100 text-purple-700',
            mantenimiento: 'bg-orange-100 text-orange-700',
            propietario: 'bg-blue-100 text-blue-700',
            cliente: 'bg-gray-100 text-gray-700',
        };

        return (
            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${styles[roleName] || styles.cliente}`}>
                {roleName}
            </span>
        );
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <ShieldCheck className="text-teal-600" /> Gestión de Personal y Usuarios
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* FORMULARIO ÚNICO (CREATE/EDIT) */}
                <div className="lg:col-span-1">
                    <form onSubmit={submit} className={`bg-white p-5 rounded-2xl shadow-sm border transition-all space-y-4 ${editingId ? 'border-amber-200 ring-2 ring-amber-50' : 'border-gray-100'}`}>
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-gray-700 flex items-center gap-2 text-sm">
                                {editingId ? <Edit2 size={16} className="text-amber-500" /> : <UserPlus size={16} />}
                                {editingId ? 'Editar Usuario' : 'Alta de Usuario'}
                            </h3>
                            {editingId && (
                                <button type="button" onClick={cancelEdit} className="text-gray-400 hover:text-gray-600">
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Nombre Completo</label>
                            <input className="w-full p-2 border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-teal-500 outline-none" 
                                value={data.name} onChange={e => setData('name', e.target.value)} />
                            {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Email</label>
                            <input type="email" className="w-full p-2 border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-teal-500 outline-none" 
                                value={data.email} onChange={e => setData('email', e.target.value)} />
                            {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">
                                {editingId ? 'Contraseña (vacía para no cambiar)' : 'Contraseña'}
                            </label>
                            <input type="password" placeholder={editingId ? '••••••••' : ''} className="w-full p-2 border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-teal-500 outline-none" 
                                value={data.password} onChange={e => setData('password', e.target.value)} />
                            {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Rol de Acceso</label>
                            <select 
                                className="w-full p-2 border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-teal-500 outline-none" 
                                value={data.role} 
                                onChange={e => setData('role', e.target.value)}
                                required
                            >
                                <option value="">-- Selecciona un Rol --</option>
                                {roles.map((rol: any) => (
                                    <option key={rol.id} value={rol.name}>{rol.name}</option>
                                ))}
                            </select>
                        </div>

                        <button 
                            disabled={processing}
                            className={`w-full py-2 text-white rounded-lg font-bold transition shadow-md ${
                                editingId ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200' : 'bg-teal-600 hover:bg-teal-700 shadow-teal-200'
                            }`}
                        >
                            {processing ? 'Procesando...' : editingId ? 'Actualizar Datos' : 'Crear Usuario'}
                        </button>
                    </form>
                </div>

                {/* TABLA */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b text-gray-400">
                                    <th className="p-4 text-xs font-bold uppercase">Usuario</th>
                                    <th className="p-4 text-xs font-bold uppercase text-center">Rol</th>
                                    <th className="p-4 text-xs font-bold uppercase text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {usuarios.map((u: any) => (
                                    <tr key={u.id} className={`hover:bg-gray-50/50 transition-colors ${editingId === u.id ? 'bg-amber-50/50' : ''}`}>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-full ${editingId === u.id ? 'bg-amber-100 text-amber-600' : 'bg-teal-50 text-teal-600'}`}>
                                                    <UserIcon size={16} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800 text-sm">{u.name}</div>
                                                    <div className="text-xs text-gray-500">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">{getRoleBadge(u.roles)}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <button 
                                                    onClick={() => startEdit(u)}
                                                    className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => confirm('¿Seguro que deseas eliminar este usuario?') && router.delete(`/usuarios/${u.id}`)}
                                                    className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
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