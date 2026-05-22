import React from 'react';
import { Head,Link,router} from '@inertiajs/react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Calendar, MapPin, CreditCard, CheckCircle, XCircle } from 'lucide-react';

interface Props {
    reservas: any[];
    errors: any;
}

export default function MisReservas({ reservas, errors }: Props) {
   const handleCancelar = (id: number) => {
        if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {    
            router.post(`/reservas/cancelar/${id}`, {}, {
                onSuccess: () => {
                alert("Tu solicitud de cancelación se ha procesado correctamente.");
            },
                onError: (errors) => {
                    alert("Hubo un error al cancelar");
                    console.error(errors);
                }
            });
        }
    };
    React.useEffect(() => {
        if (errors && errors.error) {
            alert("Error de Stripe: " + errors.error);
        }
    }, [errors]);


    return (
        <div className="min-h-screen flex flex-col bg-[#f9f9f9]">
            <Header />
            <Head title="Mis Reservas" />

            <main className="flex-grow max-w-5xl mx-auto p-6 w-full">
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-gray-800" style={{ color: '#004d4d' }}>
                        Mis Estancias
                    </h1>
                    <p className="text-gray-500 mt-2">Gestiona tus próximas visitas al paraíso.</p>
                </div>

                {reservas.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Calendar size={40} className="text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-700">No tienes reservas activas</h2>
                        <p className="text-gray-400 mt-2">¿A qué esperas para planear tu próxima escapada?</p>
                        <a href="/" className="mt-8 inline-block bg-[#008080] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#006666] transition-all">
                            Explorar Hoteles
                        </a>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {reservas.map((reserva) => (
                            <div key={reserva.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col md:flex-row">
                                <div className={`w-2 ${reserva.estado === 'pagada' ? 'bg-green-500' : 'bg-red-400'}`}></div>
                                
                                <div className="p-6 flex-grow flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${
                                                reserva.estado === 'pagada' 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-red-100 text-red-700'
                                            }`}>
                                                {reserva.estado}
                                            </span>
                                            <span className="text-gray-400 text-xs">Ref: #RDN-{reserva.id}</span>
                                        </div>
                                        
                                        <h3 className="text-xl font-bold text-gray-800">
                                            {reserva.habitaciones[0]?.hotele?.nombre_hotel || 'Hotel Refugio'}
                                        </h3>
                                        
                                        <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} className="text-[#008080]" />
                                                <span><strong>{reserva.fecha_entrada}</strong> — <strong>{reserva.fecha_salida}</strong></span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} className="text-[#008080]" />
                                                <span>{reserva.habitaciones[0]?.hotele?.ubicacion || 'Costa del Mar'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-3 w-full md:w-auto border-t md:border-none pt-4 md:pt-0">
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Pagado</p>
                                            <p className="text-2xl font-black text-gray-800">{parseFloat(reserva.precio_total).toFixed(2)}€</p>
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            <a href={`/reservas/${reserva.id}/descargar-factura`} 
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                                                Descargar Factura
                                            </a>
                                            {reserva.estado === 'pagada' && (
                                                <button 
                                                    className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                                    onClick={() => handleCancelar(reserva.id)}
                                                >
                                                    Cancelar Reserva
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}