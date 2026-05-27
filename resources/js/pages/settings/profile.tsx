import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { Form } from '@inertiajs/react'; 
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout'; 

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<any>().props;

    return (
        <AppLayout>
            <Head title="Mi Perfil | Refugio del Mar" />

            <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-md rounded-2xl p-5 sm:p-8 space-y-8 sm:space-y-10 border border-[#e8e4db]">
                    
                    <div className="space-y-6 border-b border-[#e8e4db] pb-8 sm:pb-10">
                        <Heading
                            variant="small"
                            title="Información de Perfil"
                            description="Actualiza tu nombre y correo electrónico."
                        />

                        <Form
                            {...ProfileController.update.form()}
                            options={{ preserveScroll: true }}
                            className="space-y-6 max-w-xl"
                        >
                            {({ processing, recentlySuccessful, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="name" className="text-slate-900 font-bold">Nombre Completo</Label>
                                        <Input
                                            id="name"
                                            className="mt-1 block w-full rounded-xl border-gray-300 focus:border-[#008080] focus:ring-[#008080]"
                                            defaultValue={auth.user.name}
                                            name="name"
                                            required
                                            autoComplete="name"
                                            placeholder="Tu nombre completo"
                                        />
                                        <InputError className="mt-2" message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email" className="text-slate-900 font-bold">Correo Electrónico</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            className="mt-1 block w-full rounded-xl border-gray-300 focus:border-[#008080] focus:ring-[#008080]"
                                            defaultValue={auth.user.email}
                                            name="email"
                                            required
                                            autoComplete="username"
                                            placeholder="correo@ejemplo.com"
                                        />
                                        <InputError className="mt-2" message={errors.email} />
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
                                        <Button 
                                            disabled={processing} 
                                            data-test="update-profile-button"
                                            className="w-full sm:w-auto bg-[#008080] hover:bg-[#006666] h-11 rounded-xl font-bold text-white transition-all shadow-md"
                                        >
                                            Guardar Cambios
                                        </Button>

                                        <Link
                                            href={'/'}
                                            className="w-full sm:w-auto bg-[#008080] hover:bg-[#006666] h-11 rounded-xl font-bold text-white transition-all shadow-md"
                                        >
                                            Volver a la Página Principal
                                        </Link>

                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-in-out duration-300"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out duration-300"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm font-medium text-[#008080]">
                                                ¡Guardado correctamente!
                                            </p>
                                        </Transition>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>

                    <div className="pt-2">
                        <DeleteUser />
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}