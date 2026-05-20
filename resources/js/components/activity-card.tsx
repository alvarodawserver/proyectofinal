import React from 'react';

interface Actividad {
    nombre_actividad: string;
    descripcion: string;
}

interface Props {
    actividad: Actividad;
}

export default function ActividadCard({ actividad }: Props) {
    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 p-6 flex flex-col">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {actividad.nombre_actividad}
            </h3>
            <p className="text-gray-600 flex-grow leading-relaxed">
                {actividad.descripcion}
            </p>
            <div className="mt-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Disponible
                </span>
            </div>
        </div>
    );
}