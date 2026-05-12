import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Header from '@/components/header';
import Footer from '@/components/footer';

interface Props {
    url: string;
}

export default function Redirigiendo({ url }: Props) {
    
    useEffect(() => {
        //Esto redirige al usuario a la URL de Stripe
        if (url) {
            window.location.href = url;
        }
    }, [url]);

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f9f9f9' }}>
            <Header />
            <Head title="Redirigiendo al pago..." />

            <main className="flex-grow flex items-center justify-center p-6">
                <div className="text-center bg-white p-12 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full">
                    <div className="inline-block w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                    
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Preparando el pago seguro</h2>
                    <p className="text-gray-500">
                        Te estamos redirigiendo a la plataforma de Stripe para finalizar tu reserva.
                    </p>
                    
                    <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400 font-semibold uppercase tracking-widest">
                        <span className="bg-gray-100 px-3 py-1 rounded">SSL Secure</span>
                        <span className="bg-gray-100 px-3 py-1 rounded">Stripe Certified</span>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}