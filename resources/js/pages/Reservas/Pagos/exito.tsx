import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { CheckCircle, Calendar, ArrowRight } from 'lucide-react';

interface Props {
    mensaje: string;
    total: number;
}

export default function Exito({ mensaje, total }: Props) {
    return (
        <div className="min-h-screen flex flex-col bg-[#f9f9f9]">
            <Header />
            <Head title="Reserva Confirmada" />

            <main className="flex-grow flex items-center justify-center p-6">
                <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-[#008080] p-10 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
                            <CheckCircle size={48} color="white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">{mensaje}</h1>
                        <p className="text-teal-50">Tu estancia en Refugio del Mar ha sido bloqueada con éxito.</p>
                    </div>

                    <div className="p-10">
                        <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-500 font-medium">Estado del Pago</span>
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Completado</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-800 font-bold text-xl">Total Pagado</span>
                                <span className="text-[#008080] font-black text-2xl">{total?.toFixed(2)}€</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link 
                                href="/mis-reservas" 
                                className="flex items-center justify-center gap-2 bg-[#008080] text-white py-4 rounded-xl font-bold hover:bg-[#006666] transition-all shadow-md"
                            >
                                <Calendar size={18} />
                                Ver Mis Reservas
                            </Link>
                            <Link 
                                href="/" 
                                className="flex items-center justify-center gap-2 bg-white text-gray-700 border-2 border-gray-100 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all"
                            >
                                Volver al Inicio
                                <ArrowRight size={18} />
                            </Link>
                        </div>

                        <p className="text-center text-gray-400 text-xs mt-8 italic">
                            Se ha enviado un correo de confirmación con los detalles de tu entrada y política de cancelación.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}