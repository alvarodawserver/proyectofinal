import React, { useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { X, Lock, Mail } from 'lucide-react';

export default function LoginModal({ isOpen, onClose }: any) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const { auth } = usePage<any>().props;
    useEffect(() => {
        if (auth.user && isOpen) {
            onClose();
        }
    }, [auth.user]);

    if (!isOpen) return null;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login'), {
            onFinish: () => reset('password'),
            onSuccess: () => onClose(),
        };
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border-t-8 border-[#008080]">
                <div className="p-8">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>

                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-[#333]">Bienvenido de nuevo</h2>
                        <p className="text-gray-500 text-sm mt-1">Accede a tu cuenta de Refugio del mar</p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                <input 
                                    type="email" 
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#008080] outline-none text-gray-800"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                <input 
                                    type="password" 
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#008080] outline-none text-gray-800"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                />
                            </div>
                        </div>

                        <button 
                            disabled={processing}
                            className="w-full bg-[#F4A460] hover:bg-[#e09550] text-white font-bold py-2.5 rounded-lg transition-colors mt-2"
                        >
                            {processing ? 'Cargando...' : 'Iniciar Sesión'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}