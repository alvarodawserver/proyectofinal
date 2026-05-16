import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout'; // Usa tu layout por defecto
import type { BreadcrumbItem } from '@/types';
import { Building2, User, Mail, MessageSquare, Send } from 'lucide-react';
import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';


export default function PropietarioForm() {
    // 1. Usamos el hook de formulario de Inertia para controlar los inputs y errores de Laravel
    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
        nombre: '',
        email: '',
        nombre_hotel: '',
        mensaje: '',
    });

    // 2. Procesar el envío por POST a la ruta de Laravel
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contacto-propietario', {
            onSuccess: () => reset(), // Limpia el formulario si se envía bien
        });
    };

    return (
        <>  
            <Header/>

            <Head title="Solicitud de Alta - Propietario" />

            <div className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
                
                {/* Cabecera informativa */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-neutral-800 dark:text-neutral-100">
                        ¿Quieres registrar tu Hotel?
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400">
                        Rellena este formulario con tus datos y los de tu alojamiento. El equipo de administración revisará tu solicitud y se pondrá en contacto contigo para darte de alta como propietario.
                    </p>
                </div>

                {/* Alerta de Éxito con Flash Message */}
                {wasSuccessful && (
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900/30 dark:bg-green-950/20 dark:text-green-400">
                        ✨ ¡Solicitud enviada con éxito! Revisaremos tu caso y te enviaremos un correo electrónico muy pronto.
                    </div>
                )}

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-sidebar-border/70 bg-white p-6 shadow-sm dark:bg-neutral-900">
                    
                    {/* Campo: Nombre */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                            <User className="size-4 text-neutral-400" /> Nombre Completo
                        </label>
                        <input
                            type="text"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-all dark:bg-neutral-950 ${
                                errors.nombre 
                                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                                    : 'border-neutral-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-neutral-800'
                            }`}
                            placeholder="Ej: Juan Pérez"
                        />
                        {errors.nombre && <p className="text-xs font-medium text-red-500">{errors.nombre}</p>}
                    </div>

                    {/* Campo: Email */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                            <Mail className="size-4 text-neutral-400" /> Correo Electrónico
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-all dark:bg-neutral-950 ${
                                errors.email 
                                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                                    : 'border-neutral-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-neutral-800'
                            }`}
                            placeholder="juan@ejemplo.com"
                        />
                        {errors.email && <p className="text-xs font-medium text-red-500">{errors.email}</p>}
                    </div>

                    {/* Campo: Nombre del Hotel */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                            <Building2 className="size-4 text-neutral-400" /> Nombre de tu Hotel
                        </label>
                        <input
                            type="text"
                            value={data.nombre_hotel}
                            onChange={(e) => setData('nombre_hotel', e.target.value)}
                            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-all dark:bg-neutral-950 ${
                                errors.nombre_hotel 
                                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                                    : 'border-neutral-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-neutral-800'
                            }`}
                            placeholder="Ej: Hotel Paraíso Beach"
                        />
                        {errors.nombre_hotel && <p className="text-xs font-medium text-red-500">{errors.nombre_hotel}</p>}
                    </div>

                    {/* Campo: Mensaje / Comentarios */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                            <MessageSquare className="size-4 text-neutral-400" /> Cuéntanos más sobre el hotel
                        </label>
                        <textarea
                            value={data.mensaje}
                            rows={4}
                            onChange={(e) => setData('mensaje', e.target.value)}
                            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-all dark:bg-neutral-950 resize-none ${
                                errors.mensaje 
                                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                                    : 'border-neutral-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-neutral-800'
                            }`}
                            placeholder="Escribe aquí el número de habitaciones, ubicación exacta o cualquier duda..."
                        />
                        {errors.mensaje && <p className="text-xs font-medium text-red-500">{errors.mensaje}</p>}
                    </div>

                    {/* Botón de Enviar */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-teal-700 dark:hover:bg-teal-600"
                    >
                        {processing ? (
                            <span>Enviando solicitud...</span>
                        ) : (
                            <>
                                <Send className="size-4" />
                                Enviar Solicitud de Alta
                            </>
                        )}
                    </button>
                    
                </form>
            </div>
            <Footer/>
        </>
    );
}