import React from 'react';
import { Head, router } from '@inertiajs/react';
import Header from '@/components/header';
import Footer from '@/components/footer';

interface Props {
    items: any[];
}

export default function Carrito({ items }: Props) {
    
    const handleEliminar = (id: number) => {
        if (confirm('¿Seguro que quieres quitar esta reserva del carrito?')) {
            router.delete(`/reservas/${id}`);
        }
    };

    const totalCarrito = items.reduce((acc: number, item: any) => acc + parseFloat(item.precio_total), 0);

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f9f9f9', color: '#333' }}>
            <Header />
            <Head title="Mi Carrito" />

            <main className="flex-grow max-w-4xl mx-auto p-6 w-full">
                <h1 className="text-3xl font-bold mb-8 text-gray-800" style={{ color: '#8B4513' }}>
                    Tu Carrito de Reservas
                </h1>

                {items.length === 0 ? (
                    <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-200">
                        <p className="text-gray-500 text-lg">El carrito está vacío.</p>
                        <a href="/" className="text-teal-600 hover:underline mt-4 inline-block font-semibold">
                            Volver a buscar hoteles
                        </a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {items.map((reserva: any) => (
                            <div key={reserva.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between gap-4 transition-hover hover:shadow-md">
                                <div>
                                    <h2 className="text-xl font-bold text-teal-700">
                                        {/* Ajustado a nombre_hotel que es como está en tu DB */}
                                        Reserva en {reserva.habitaciones[0]?.hotele?.nombre_hotel || 'Hotel'}
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                                        <span>📅</span> <strong>{reserva.fecha_entrada}</strong> al <strong>{reserva.fecha_salida}</strong>
                                    </p>
                                    
                                    <div className="mt-4">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Habitaciones seleccionadas:</p>
                                        <ul className="mt-2 space-y-1">
                                            {reserva.habitaciones.map((hab: any) => (
                                                <li key={hab.id} className="text-sm text-gray-700 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
                                                    {hab.tipo?.tipo_habitacion} (Hab. {hab.id})
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="text-right flex flex-col justify-between items-end">
                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 min-w-[120px]">
                                        <p className="text-2xl font-black text-gray-800">
                                            {parseFloat(reserva.precio_total).toFixed(2)}€
                                        </p>
                                        {reserva.oferta && (
                                            <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase block mt-1 text-center">
                                                Oferta Aplicada
                                            </span>
                                        )}
                                    </div>
                                    <button 
                                        onClick={() => handleEliminar(reserva.id)}
                                        className="text-red-400 hover:text-red-600 text-xs font-semibold underline underline-offset-4 mt-4 transition-colors"
                                    >
                                        Eliminar reserva
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* RESUMEN FINAL */}
                        <div className="bg-white p-8 rounded-2xl border-2 border-teal-600 mt-10 shadow-lg">
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-bold text-gray-700">Total acumulado:</span>
                                <span className="text-4xl font-black text-teal-700">{totalCarrito.toFixed(2)}€</span>
                            </div>
                            <button 
                                className="w-full bg-teal-600 text-white py-4 rounded-xl mt-8 font-bold text-xl hover:bg-teal-700 transition-all shadow-md active:scale-[0.98]"
                                onClick={() => router.post('/pago', { items })}
                            >
                                Confirmar y Pagar
                            </button>
                            <p className="text-center text-gray-400 text-xs mt-4 italic">
                                Pago seguro procesado mediante encriptación SSL
                            </p>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}