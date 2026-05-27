import { Form } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

export default function LoginForm({ onSwitchToRegister, canResetPassword }: any) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-[#004d4d]">Bienvenido de nuevo</h2>
                <p className="text-sm text-gray-600">Accede a tu refugio</p>
            </div>

            <Form {...store.form()} resetOnSuccess={['password']} className="space-y-4">
                {({ processing, errors }) => (
                    <>
                        {/* CORREO ELECTRÓNICO */}
                        <div className="space-y-2 text-left">
                            <Label htmlFor="email" className="text-slate-900 font-bold">Correo Electrónico</Label>
                            <Input 
                                id="email" 
                                type="email" 
                                name="email" 
                                required 
                                placeholder="ejemplo@correo.com" 
                                className="rounded-xl border-gray-300 text-slate-900 placeholder:text-gray-400 focus:border-[#008080] focus:ring-[#008080]" 
                            />
                            <InputError message={errors.email} />
                        </div>

                        {/* CONTRASEÑA */}
                        <div className="space-y-2 text-left">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password" className="text-slate-900 font-bold">Contraseña</Label>
                                {canResetPassword && (
                                    <button 
                                        type="button" 
                                        onClick={() => window.location.href = request().url} 
                                        className="text-xs text-[#008080] font-semibold hover:underline"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </button>
                                )}
                            </div>
                            <Input 
                                id="password" 
                                type="password" 
                                name="password" 
                                required 
                                minLength={8} 
                                placeholder="Tu contraseña"
                                className="rounded-xl border-gray-300 text-slate-900 placeholder:text-gray-400 focus:border-[#008080] focus:ring-[#008080]" 
                            />
                            <InputError message={errors.password} />
                        </div>

                        {/* RECODRARME */}
                        <div className="flex items-center space-x-2 py-2">
                            <Checkbox id="remember" name="remember" className="border-gray-400" />
                            <Label htmlFor="remember" className="text-sm text-slate-700 cursor-pointer">Recordarme en este equipo</Label>
                        </div>

                        <Button type="submit" disabled={processing} className="w-full bg-[#008080] hover:bg-[#006666] h-12 rounded-xl font-bold text-white transition-all shadow-md">
                            {processing && <Spinner className="mr-2" />} Iniciar Sesión
                        </Button>

                        <p className="text-center text-sm text-slate-600 pt-2">
                            ¿No tienes cuenta?{' '}
                            <button type="button" onClick={onSwitchToRegister} className="text-[#008080] font-bold hover:underline">
                                Regístrate gratis
                            </button>
                        </p>
                    </>
                )}
            </Form>
        </div>
    );
}