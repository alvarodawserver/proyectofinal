import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
    onClose?: () => void;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
    onClose, 
}: Props) {
    return (
        <AuthLayout
            title="Bienvenido de nuevo"
            description="Introduce tus credenciales para acceder a tu refugio"
        >
            <Head title="Iniciar Sesión" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                onSuccess={() => {
                    if (onClose) onClose(); 
                }}
                className="flex flex-col gap-6"
            >
                
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-[#000000] font-bold">Correo Electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@ejemplo.com"
                                    className="focus-visible:ring-[#008080]"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password" className="text-[#004d4d] font-bold">Contraseña</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-sm text-[#008080] hover:underline"
                                            tabIndex={5}
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Tu contraseña"
                                    className="focus-visible:ring-[#008080]"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="border-gray-300 data-[state=checked]:bg-[#008080] data-[state=checked]:border-[#008080]"
                                />
                                <Label htmlFor="remember" className="text-sm text-gray-600">Recordarme en este equipo</Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full bg-[#008080] hover:bg-[#006666] text-white font-bold h-11 transition-all shadow-md"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner className="mr-2" />}
                                Iniciar Sesión
                            </Button>
                        </div>

                        {canRegister && (
                            <div className="text-center text-sm text-muted-foreground mt-2">
                                ¿Aún no tienes cuenta?{' '}
                                <TextLink href={register()} tabIndex={5} className="text-[#008080] font-bold hover:underline">
                                    Regístrate gratis
                                </TextLink>
                            </div>
                        )}
                    </>
                )}
            </Form>

            {status && (
                <div className="mt-4 text-center text-sm font-medium text-green-600 bg-green-50 p-2 rounded-lg">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}