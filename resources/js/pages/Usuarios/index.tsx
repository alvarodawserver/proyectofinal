import React from 'react';
import { useForm, router } from '@inertiajs/react';
import { UserPlus, Trash2, ShieldCheck, User as UserIcon } from 'lucide-react';

export default function UsuariosIndex({ usuarios, roles }: any) {
    const { data, setData,put, post, reset, errors } = useForm({
        name: '',
        email: '',
        password: '',
        role: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/usuarios/store', { onSuccess: () => reset() });
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
                {/* FORMULARIO */}
                <div className="lg:col-span-1">
                    <form onSubmit={submit} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="font-bold text-gray-700 flex items-center gap-2 text-sm">
                            <UserPlus size={16} /> Alta de Usuario
                        </h3>
                        
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Nombre Completo</label>
                            <input className="w-full p-2 border rounded-lg text-sm text-gray-900" 
                                value={data.name} onChange={e => setData('name', e.target.value)} />
                                {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Email</label>
                            <input type="email" className="w-full p-2 border rounded-lg text-sm text-gray-900" 
                                value={data.email} onChange={e => setData('email', e.target.value)} />
                                {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Contraseña</label>
                            <input type="password" className="w-full p-2 border rounded-lg text-sm text-gray-900" 
                                value={data.password} onChange={e => setData('password', e.target.value)} />
                                {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Rol de Acceso</label>
                            <select 
                                className="w-full p-2 border rounded-lg text-sm text-gray-900" 
                                value={data.role} 
                                onChange={e => setData('role', e.target.value)}
                                required
                            >
                                <option value="">-- Selecciona un Rol Real --</option>
                                {/* MAPEAMOS LOS ROLES DE LA BASE DE DATOS */}
                                {roles.map((rol: any) => (
                                    <option key={rol.id} value={rol.name}>
                                        {rol.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button className="w-full py-2 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 transition">
                            Crear Usuario
                        </button>
                    </form>
                </div>

                {/* TABLA */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b">
                                    <th className="p-4 text-xs font-bold text-gray-400">Usuario</th>
                                    <th className="p-4 text-xs font-bold text-gray-400">Rol</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {usuarios.map((u: any) => (
                                    <tr key={u.id} className="hover:bg-gray-50/50">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-teal-50 text-teal-600 rounded-full">
                                                    <UserIcon size={16} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800 text-sm">{u.name}</div>
                                                    <div className="text-xs text-gray-500">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">{getRoleBadge(u.roles)}</td>
                                        <td className="p-4 text-right">
                                            <button 
                                                onClick={() => confirm('¿Eliminar?') && router.delete(`usuarios.destroy`, { data: { id: u.id } })}
                                                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                                                <Trash2 size={16} />
                                            </button>
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