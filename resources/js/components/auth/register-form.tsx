import { Form } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/register';

export default function RegisterForm({ onSwitchToLogin }: any) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-[#004d4d]">Únete al paraíso</h2>
                <p className="text-sm text-gray-600">Crea tu cuenta en Refugio del Mar</p>
            </div>

            <Form {...store.form()} resetOnSuccess={['password', 'password_confirmation']} className="space-y-4 text-left">
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-slate-900 font-bold">Nombre Completo</Label>
                            <Input 
                                id="name" 
                                name="name" 
                                required 
                                placeholder="Nombre y apellidos" 
                                className="rounded-xl border-gray-300 text-slate-900 placeholder:text-gray-400" 
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-900 font-bold">Correo Electrónico</Label>
                            <Input 
                                id="email" 
                                type="email" 
                                name="email" 
                                required 
                                placeholder="tu@email.com" 
                                className="rounded-xl border-gray-300 text-slate-900 placeholder:text-gray-400" 
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-900 font-bold">Contraseña</Label>
                                <Input 
                                    id="password" 
                                    type="password" 
                                    name="password" 
                                    required 
                                    placeholder="8+ caracteres"
                                    className="rounded-xl border-gray-300 text-slate-900 placeholder:text-gray-400" 
                                />
                                <InputError message={errors.password} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation" className="text-slate-900 font-bold">Confirmar</Label>
                                <Input 
                                    id="password_confirmation" 
                                    type="password" 
                                    name="password_confirmation" 
                                    required 
                                    placeholder="Repite contraseña"
                                    className="rounded-xl border-gray-300 text-slate-900 placeholder:text-gray-400" 
                                />
                            </div>
                        </div>

                        <Button type="submit" disabled={processing} className="w-full bg-[#008080] hover:bg-[#006666] h-12 rounded-xl font-bold text-white mt-4 shadow-md">
                            {processing && <Spinner className="mr-2" />} Crear cuenta
                        </Button>

                        <p className="text-center text-sm text-slate-600 pt-2">
                            ¿Ya tienes cuenta?{' '}
                            <button type="button" onClick={onSwitchToLogin} className="text-[#008080] font-bold hover:underline">
                                Inicia sesión
                            </button>
                        </p>
                    </>
                )}
            </Form>
        </div>
    );
}