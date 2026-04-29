export type * from './auth';
export type * from './navigation';
export type * from './ui';

export interface Image {
    id: number;
    path: string;
    is_primary: boolean;
    hotele_id: number;
}

export interface Servicio {
    id: number;
    nombre_servicio: string;
    icono?: string; // Opcional, por si no todos tienen icono
}

export interface Review {
    id: number;
    valoracion: number;
    comentario: string;
    user_id: number;
    created_at: string;
}


export interface SearchFilters {
    lugar: string;
    entrada: string;
    salida: string;
    personas: number;
    categoria?: number; 
    precio_min?: number;
    precio_max?: number;
}


export interface Categoria{
    id: number;
    nombre: string;
}



export interface Hotel {
    id: number;
    nombre_hotel: string;
    descripcion: string;
    direccion: string;
    ciudad: string;
    categoria: string;
    rating: number;
    precio_min: number;
    images: Image[];
    servicios: Servicio[];
    reviews?: Review[]; 
    habitaciones: Habitacione[];
}


export interface Habitacione {
    id: number;
    num_habitacion: number;
    tipo_habitacion: number;
    hotele_id: number;
    tipo: Tipo;
}


export interface Tipo{
    id: number;
    tipo_habitacion: string;
    capacidad: number;
    precio_base: number;
    cantidad_habitaciones: number;
}

export interface Oferta {
    id: number;
    nombre: string;
    descuento_porcentaje: number;
    fecha_fin: string;
    hotel: Hotel;
}