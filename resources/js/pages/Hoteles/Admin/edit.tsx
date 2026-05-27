import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage, router, Link } from '@inertiajs/react';
import React from 'react';
import * as Icons from 'lucide-react';
import { CheckCircle2, Layers, Hash, Plus, Trash2, ImagePlus, X } from 'lucide-react';

interface PoliticaCancelacion {
    dias_antes: number;
    porcentaje: number;
}

interface HotelImagen {
    id: number;
    imagen_url: string;
}

interface Hotel {
    id: number;
    nombre_hotel: string;
    propietario_id: number;
    descripcion: string;
    direccion: string;
    estado: string;
    ciudad: string;
    latitud: number;
    longitud: number;
    imagen_url?: string;
    imagenes?: HotelImagen[]; 
    servicios_ids: number[];
    categorias_ids?: number[]; 
    politica_cancelacion?: PoliticaCancelacion[] | string;
}

interface Servicio {
    id: number;
    nombre_servicio: string;
    icono: string | null;
}

interface TipoHabitacion {
    id: number;
    tipo_habitacion: string;
    precio_base: number;
    habitaciones_count: number;
}

interface Categoria {
    id: number;
    nombre: string;
}

interface Props {
    hotel: Hotel;
    propietarios: { id: number; name: string }[];
    servicios: Servicio[];
    tipos_habitacion: TipoHabitacion[]; 
    categorias: Categoria[];
}

const DynamicIcon = ({ iconName, isSelected }: { iconName: string | null; isSelected: boolean }) => {
    if (!iconName) return <Icons.Circle size={24} className="opacity-20" />;

    const IconComponent = (Icons as any)[iconName];

    if (!IconComponent) {
        console.warn(`Icono no encontrado en Lucide: ${iconName}`);
        return <Icons.HelpCircle size={24} className="text-amber-500 opacity-50" />;
    }

    return (
        <IconComponent
            size={28}
            className={isSelected ? 'text-teal-600' : 'text-neutral-400'}
            strokeWidth={1.5}
        />
    );
};

export default function Edit({ hotel, propietarios, servicios, tipos_habitacion, categorias }: Props) { 
    const { auth } = usePage().props as any;
    
    // Previsualización de la portada principal
    const [imagenPreview, setImagenPreview] = React.useState<string | null>(null);
    
    // Gestión de imágenes secundarias (existentes y nuevas)
    const [imagenesExistentes, setImagenesExistentes] = React.useState<HotelImagen[]>(hotel.imagenes ?? []);
    const [previewsAdicionales, setPreviewsAdicionales] = React.useState<string[]>([]);

    const obtenerPoliticasIniciales = (): PoliticaCancelacion[] => {
        if (!hotel.politica_cancelacion) return [];
        if (Array.isArray(hotel.politica_cancelacion)) return hotel.politica_cancelacion;
        try {
            return JSON.parse(hotel.politica_cancelacion);
        } catch (e) {
            return [];
        }
    };

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT', 
        nombre_hotel: hotel.nombre_hotel ?? '',
        propietario_id: hotel.propietario_id ?? '',
        descripcion: hotel.descripcion ?? '',
        direccion: hotel.direccion ?? '',
        estado: hotel.estado ?? '',
        ciudad: hotel.ciudad ?? '',
        latitud: hotel.latitud ?? '',
        longitud: hotel.longitud ?? '',
        imagen_principal: null as File | null,
        imagenes_adicionales: [] as File[],
        imagenes_eliminadas: [] as number[], 
        servicios: hotel.servicios_ids ?? [],
        categorias: hotel.categorias_ids ?? [], 
        politica_cancelacion: obtenerPoliticasIniciales(),
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setData('imagen_principal', file);
        
        if (file) {
            setImagenPreview(URL.createObjectURL(file));
        } else {
            setImagenPreview(null);
        }
    };

    // Manejador para añadir múltiples imágenes a la galería
    const handleMultipleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        if (files.length === 0) return;

        const nuevosArchivos = [...data.imagenes_adicionales, ...files];
        setData('imagenes_adicionales', nuevosArchivos);

        const nuevasPreviews = files.map(file => URL.createObjectURL(file));
        setPreviewsAdicionales(prev => [...prev, ...nuevasPreviews]);
    };

    // Eliminar una foto NUEVA seleccionada antes de subirla
    const removeNuevaImagen = (index: number) => {
        if (previewsAdicionales[index]) {
            URL.revokeObjectURL(previewsAdicionales[index]);
        }
        
        const nuevosArchivos = data.imagenes_adicionales.filter((_, i) => i !== index);
        const nuevasPreviews = previewsAdicionales.filter((_, i) => i !== index);
        
        setData('imagenes_adicionales', nuevosArchivos);
        setPreviewsAdicionales(nuevasPreviews);
    };

    const removeExistingImage = (id: number) => {
        setImagenesExistentes(prev => prev.filter(img => img.id !== id));
        setData('imagenes_eliminadas', [...data.imagenes_eliminadas, id]);
    };

    // Limpieza de URLs de previsualización para evitar Memory Leaks
    React.useEffect(() => {
        return () => {
            if (imagenPreview) URL.revokeObjectURL(imagenPreview);
            previewsAdicionales.forEach(url => URL.revokeObjectURL(url));
        };
    }, [imagenPreview, previewsAdicionales]);

    const toggleServicio = (id: number) => {
        const current = [...data.servicios];
        const index = current.indexOf(id);
        if (index > -1) current.splice(index, 1);
        else current.push(id);
        setData('servicios', current);
    };

    // NUEVO: Función para alternar las categorías seleccionadas de la relación pivote
    const toggleCategoria = (id: number) => {
        const current = [...data.categorias];
        const index = current.indexOf(id);
        if (index > -1) current.splice(index, 1);
        else current.push(id);
        setData('categorias', current);
    };

    const addPoliticaTramo = () => {
        setData('politica_cancelacion', [
            ...data.politica_cancelacion,
            { dias_antes: 7, porcentaje: 100 }
        ]);
    };

    const removePoliticaTramo = (index: number) => {
        const filtrados = data.politica_cancelacion.filter((_, i) => i !== index);
        setData('politica_cancelacion', filtrados);
    };

    const handlePoliticaChange = (index: number, field: keyof PoliticaCancelacion, val: number) => {
        const modificados = data.politica_cancelacion.map((item, i) => {
            if (i === index) {
                return { ...item, [field]: val };
            }
            return item;
        });
        setData('politica_cancelacion', modificados);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/hoteles/${hotel.id}`);
    };

    const handleGenerarMasa = (e: React.FormEvent<HTMLFormElement>, tipoId: number) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const formElement = e.currentTarget; 
        
        router.post('/hoteles/generar-habitaciones-masa', {
            hotele_id: hotel.id, 
            tipo_habitacion: tipoId, 
            cantidad: parseInt(formData.get('cantidad') as string) || 0,
            numero_inicio: parseInt(formData.get('numero_inicio') as string) || 0,
        }, {
            preserveScroll: true, 
            onSuccess: () => {
                formElement.reset(); 
            }
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Hoteles', href: '/admin/hoteles' }, { title: 'Editar Hotel', href: '#' }]}>
            <Head title={`Editando ${hotel.nombre_hotel}`} />

            <div className="max-w-5xl p-6 pb-20 space-y-8">
                <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                    Configuración de: <span className="text-teal-600">{hotel.nombre_hotel}</span>
                    <Link href={`/`}>
                        <button className="ml-4 bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-lg transition duration-200">
                            Volver a la Página Principal
                        </button>
                    </Link>
                </h1>

                {/* FORMULARIO PRINCIPAL DEL HOTEL */}
                <form onSubmit={submit} className="space-y-8">

                    {/* BLOQUE 1: IDENTIDAD Y PORTADA */}
                    <div className="bg-white p-8 rounded-xl border border-neutral-200 shadow-sm dark:bg-neutral-900 dark:border-neutral-800 space-y-6">
                        <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                            <span className="w-2 h-6 bg-teal-500 rounded-full inline-block"></span>
                            Información Básica e Imágenes
                        </h2> 

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="text-xs font-bold text-neutral-500 uppercase">Nombre del Hotel</label>
                                <input
                                    type="text"
                                    value={data.nombre_hotel}
                                    onChange={e => setData('nombre_hotel', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-neutral-300 focus:ring-teal-500 focus:border-teal-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100"
                                />
                                {errors.nombre_hotel && <p className="text-red-500 text-xs mt-1">{errors.nombre_hotel}</p>}
                            </div>

                            {/* IMAGEN PRINCIPAL (PORTADA) */}
                            <div className="md:col-span-2 bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-xl border-2 border-dashed border-neutral-200 dark:border-neutral-700">
                                <label className="block text-xs font-bold text-neutral-500 mb-4 uppercase">Imagen de Portada (Homepage)</label>
                                <div className="flex flex-wrap items-center gap-6">
                                    {(hotel.imagen_url || imagenPreview) && (
                                        <div className="relative">
                                            <img
                                                src={imagenPreview || hotel.imagen_url}
                                                alt="Vista previa"
                                                className="w-40 h-24 object-cover rounded-lg shadow-md border-2 border-white dark:border-neutral-700"
                                            />
                                            <span className="absolute -top-2 -left-2 bg-teal-500 text-white text-[10px] px-2 py-1 rounded-full uppercase font-bold">
                                                {imagenPreview ? 'Nueva' : 'Actual'}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="upload-image"
                                            accept="image/*"
                                        />
                                        <label htmlFor="upload-image" className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl cursor-pointer hover:bg-teal-700 transition-all text-sm font-bold shadow-lg shadow-teal-500/20">
                                            <ImagePlus size={18} />
                                            Cambiar foto principal
                                        </label>
                                        <p className="text-xs text-neutral-400 mt-3 italic">Formatos: JPG, PNG o WEBP. Tamaño recomendado 1200x800px.</p>
                                    </div>
                                </div>
                                {errors.imagen_principal && <p className="text-red-500 text-xs mt-1">{errors.imagen_principal}</p>}
                            </div>

                            {/* NUEVA SECCIÓN: GALERÍA DE IMÁGENES SECUNDARIAS */}
                            <div className="md:col-span-2 bg-neutral-50 dark:bg-neutral-800/30 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase">Galería de Fotos del Hotel</label>
                                    <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">Sube múltiples imágenes para mostrar en el carrusel de detalles.</p>
                                </div>

                                {/* Zona de drop/upload múltiple */}
                                <div className="flex items-center justify-start gap-4">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleMultipleFilesChange}
                                        className="hidden"
                                        id="upload-gallery"
                                        accept="image/*"
                                    />
                                    <label htmlFor="upload-gallery" className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-800 dark:bg-neutral-700 text-white rounded-xl cursor-pointer hover:bg-neutral-700 dark:hover:bg-neutral-600 transition-all text-xs font-bold shadow-md">
                                        <Plus size={16} />
                                        Añadir fotos a la galería
                                    </label>
                                </div>

                                {/* Grid de visualización y eliminación de imágenes */}
                                {((imagenesExistentes && imagenesExistentes.length > 0) || previewsAdicionales.length > 0) && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 pt-2">
                                        
                                        {/* Fotos ya guardadas en el servidor */}
                                        {imagenesExistentes.map((img) => (
                                            <div key={img.id} className="relative group aspect-[4/3] rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
                                                <img src={img.imagen_url} alt="Galería" className="w-full h-full object-cover" />
                                                <span className="absolute bottom-1.5 left-1.5 bg-neutral-900/70 text-white text-[9px] px-1.5 py-0.5 rounded font-medium">Guardada</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingImage(img.id)}
                                                    className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity duration-200 font-bold text-xs"
                                                >
                                                    <Trash2 size={16} /> Eliminar
                                                </button>
                                            </div>
                                        ))}

                                        {/* Previsualización de Fotos Nuevas (Cola de subida) */}
                                        {previewsAdicionales.map((url, index) => (
                                            <div key={index} className="relative group aspect-[4/3] rounded-lg overflow-hidden border-2 border-teal-500/50 bg-neutral-100 dark:bg-neutral-800等">
                                                <img src={url} alt="Previsualización nueva" className="w-full h-full object-cover" />
                                                <span className="absolute bottom-1.5 left-1.5 bg-teal-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shadow-sm">Cola</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeNuevaImagen(index)}
                                                    className="absolute top-1.5 right-1.5 p-1.5 bg-neutral-900/80 hover:bg-red-600 text-white rounded-full transition-colors"
                                                    title="Quitar de la lista"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {errors.imagenes_adicionales && <p className="text-red-500 text-xs mt-1">{errors.imagenes_adicionales}</p>}
                            </div>
                            
                            {auth.user?.can_access_admin && (
                                <div>
                                    <label className="text-xs font-bold text-neutral-500 uppercase">Propietario Responsable</label>
                                    <select
                                        value={data.propietario_id}
                                        onChange={e => setData('propietario_id', parseInt(e.target.value))}
                                        className="mt-1 block w-full rounded-lg border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100 shadow-sm"
                                    >
                                        <option value="">Selecciona un propietario</option>
                                        {propietarios?.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                    {errors.propietario_id && <p className="text-red-500 text-xs mt-1">{errors.propietario_id}</p>}
                                </div>
                            )}
                            
                            <div>
                                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Ciudad</label>
                                <input
                                    type="text"
                                    value={data.ciudad}
                                    onChange={e => setData('ciudad', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100 shadow-sm"
                                />
                                {errors.ciudad && <p className="text-red-500 text-xs mt-1">{errors.ciudad}</p>}
                            </div>

                            {/* COMPONENTE DE ESTADO (OCULTO / DISPONIBLE) */}
                            <div className="md:col-span-2 bg-neutral-50 dark:bg-neutral-800/30 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
                                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">Estado de Visibilidad</label>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setData('estado', 'oculto')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm border-2 transition-all ${data.estado === 'oculto'
                                                ? 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 shadow-sm'
                                                : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-500 hover:border-neutral-300'
                                        }`}
                                    >
                                        <Icons.EyeOff size={16} />
                                        Oculto (Borrador)
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setData('estado', 'disponible')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm border-2 transition-all ${data.estado === 'disponible'
                                                ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950/30 dark:text-teal-400 shadow-sm'
                                                : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-500 hover:border-neutral-300'
                                        }`}
                                    >
                                        <Icons.Eye size={16} />
                                        Disponible (Público)
                                    </button>
                                </div>
                                <p className="text-[11px] text-neutral-400 mt-2 italic">
                                    {data.estado === 'oculto'
                                        ? 'Este hotel NO aparecerá en los resultados de búsqueda ni en la página principal.'
                                        : '¡Listo para recibir reservas! El hotel será visible para todos los usuarios.'}
                                </p>
                                {errors.estado && <p className="text-red-500 text-xs mt-1">{errors.estado}</p>}
                            </div>
                        </div>
                    </div>

                    {/* BLOQUE 2: UBICACIÓN Y DESCRIPCIÓN */}
                    <div className="bg-white p-8 rounded-xl border border-neutral-200 shadow-sm dark:bg-neutral-900 dark:border-neutral-800 space-y-6">
                        <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                            <span className="w-2 h-6 bg-amber-500 rounded-full inline-block"></span>
                            Ubicación y Detalles
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="text-xs font-bold text-neutral-500 uppercase">Dirección Exacta</label>
                                <div className="relative">
                                    <Icons.MapPin className="absolute left-3 top-3.5 text-neutral-400" size={18} />
                                    <input
                                        type="text"
                                        value={data.direccion}
                                        onChange={e => setData('direccion', e.target.value)}
                                        className="mt-1 block w-full pl-10 rounded-lg border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100 shadow-sm"
                                        placeholder="Ej: Av. del Mar, 123"
                                    />
                                </div>
                                {errors.direccion && <p className="text-red-500 text-xs mt-1">{errors.direccion}</p>}
                            </div>

                            <div>
                                <label className="text-xs font-bold text-neutral-500 uppercase">Latitud</label>
                                <input
                                    type="number" step="any"
                                    value={data.latitud}
                                    onChange={e => setData('latitud', parseFloat(e.target.value))}
                                    className="mt-1 block w-full rounded-lg border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100"
                                />
                                {errors.latitud && <p className="text-red-500 text-xs mt-1">{errors.latitud}</p>}
                            </div>

                            <div>
                                <label className="text-xs font-bold text-neutral-500 uppercase">Longitud</label>
                                <input
                                    type="number" step="any"
                                    value={data.longitud}
                                    onChange={e => setData('longitud', parseFloat(e.target.value))}
                                    className="mt-1 block w-full rounded-lg border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100"
                                />
                                {errors.longitud && <p className="text-red-500 text-xs mt-1">{errors.longitud}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-xs font-bold text-neutral-500 uppercase">Descripción del Hotel</label>
                                <textarea
                                    rows={5}
                                    value={data.descripcion}
                                    onChange={e => setData('descripcion', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100"
                                    placeholder="Describe la experiencia en el hotel..."
                                />
                                {errors.descripcion && <p className="text-red-500 text-xs mt-1">{errors.descripcion}</p>}
                            </div>
                        </div>
                    </div>

                    {/* BLOQUE 3: POLÍTICA DE CANCELACIÓN PERSONALIZADA */}
                    <div className="bg-white p-8 rounded-xl border border-neutral-200 shadow-sm dark:bg-neutral-900 dark:border-neutral-800 space-y-6">
                        <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                            <span className="w-2 h-6 bg-orange-500 rounded-full inline-block"></span>
                            Políticas de Cancelación (Tramos de Reembolso)
                        </h2>
                        <p className="text-xs text-neutral-400 dark:text-neutral-500">
                            Añade las reglas de devolución basándote en la antelación de la solicitud. El sistema cruzará estos valores automáticamente al procesar cancelaciones de clientes.
                        </p>

                        <div className="space-y-3">
                            {data.politica_cancelacion.map((item, index) => (
                                <div key={index} className="flex items-center gap-4 bg-neutral-50 dark:bg-neutral-800/40 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Días de antelación mínimos</label>
                                            <div className="relative">
                                                <input 
                                                    type="number"
                                                    min="1"
                                                    value={item.dias_antes}
                                                    onChange={e => handlePoliticaChange(index, 'dias_antes', parseInt(e.target.value) || 0)}
                                                    className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs font-bold text-neutral-800 dark:text-neutral-100 focus:ring-orange-500"
                                                    placeholder="Ej: 7"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400 font-bold uppercase">Días</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Porcentaje de Reembolso</label>
                                            <div className="relative">
                                                <input 
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={item.porcentaje}
                                                    onChange={e => handlePoliticaChange(index, 'porcentaje', parseInt(e.target.value) || 0)}
                                                    className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs font-bold text-neutral-800 dark:text-neutral-100 focus:ring-orange-500"
                                                    placeholder="Ej: 100"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400 font-bold uppercase">%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removePoliticaTramo(index)}
                                        className="p-2 text-neutral-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors self-end"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addPoliticaTramo}
                                className="w-full py-3 border-2 border-dashed border-neutral-200 dark:border-neutral-800 hover:border-orange-500 dark:hover:border-orange-500 rounded-xl text-xs font-bold text-neutral-500 hover:text-orange-600 dark:hover:text-orange-400 transition-all flex items-center justify-center gap-2 bg-neutral-50/20"
                            >
                                <Icons.PlusCircle size={14} /> Añadir nueva regla de tramo
                            </button>
                        </div>
                        {errors.politica_cancelacion && <p className="text-red-500 text-xs mt-1">{errors.politica_cancelacion}</p>}
                    </div>

                    {/* BLOQUE 4: SERVICIOS */}
                    <div className="bg-white p-8 rounded-xl border border-neutral-200 shadow-sm dark:bg-neutral-900 dark:border-neutral-800">
                        <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200 mb-6 flex items-center gap-2">
                            <span className="w-2 h-6 bg-indigo-500 rounded-full inline-block"></span>
                            Servicios Disponibles
                        </h2> 

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {servicios && servicios.length > 0 ? (
                                servicios.map((s) => {
                                    const isSelected = data.servicios.map(Number).includes(Number(s.id));

                                    return (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => toggleServicio(s.id)}
                                            className={`group flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all min-h-[110px] relative ${isSelected
                                                    ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-900/20 shadow-sm'
                                                    : 'border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/20 hover:border-neutral-300'
                                            }`}
                                        >
                                            <div className={`mb-2 p-3 rounded-xl transition-colors ${isSelected ? 'bg-white dark:bg-neutral-800 shadow-sm' : 'bg-transparent'}`}>
                                                <DynamicIcon iconName={s.icono} isSelected={isSelected} />
                                            </div>

                                            <span className={`text-[11px] font-bold uppercase tracking-wider text-center px-1 ${isSelected ? 'text-teal-700 dark:text-teal-400' : 'text-neutral-500 dark:text-neutral-400'}`}>
                                                {s.nombre_servicio || `Servicio ${s.id}`}
                                            </span>

                                            {isSelected && (
                                                <div className="absolute top-2 right-2">
                                                    <CheckCircle2 className="text-teal-600 fill-white dark:fill-neutral-900" size={18} />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="col-span-full p-8 text-center border-2 border-dashed border-neutral-200 rounded-2xl text-neutral-400 italic">
                                    No hay servicios cargados. Revisa el controlador.
                                </div>
                            )}
                        </div>
                        {errors.servicios && <p className="text-red-500 text-xs mt-1">{errors.servicios}</p>}
                    </div>
                    <div className="bg-white p-8 rounded-xl border border-neutral-200 shadow-sm dark:bg-neutral-900 dark:border-neutral-800">
                        <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200 mb-6 flex items-center gap-2">
                            <span className="w-2 h-6 bg-sky-500 rounded-full inline-block"></span>
                            Categorías del Hotel
                        </h2> 

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {categorias && categorias.length > 0 ? (
                                categorias.map((c) => {
                                    const isSelected = data.categorias.map(Number).includes(Number(c.id));

                                    return (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => toggleCategoria(c.id)}
                                            className={`group flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all min-h-[110px] relative ${isSelected
                                                ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-900/20 shadow-sm'
                                                : 'border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/20 hover:border-neutral-300'
                                            }`}
                                        >
                                            <div className={`mb-2 p-3 rounded-xl transition-colors ${isSelected ? 'bg-white dark:bg-neutral-800 shadow-sm' : 'bg-transparent'}`}>
                                                <DynamicIcon iconName={c.nombre} isSelected={isSelected} />
                                            </div>

                                            <span className={`text-[11px] font-bold uppercase tracking-wider text-center px-1 ${isSelected ? 'text-sky-700 dark:text-sky-400' : 'text-neutral-500 dark:text-neutral-400'}`}>
                                                {c.nombre || `Categoría ${c.id}`}
                                            </span>

                                            {isSelected && (
                                                <div className="absolute top-2 right-2">
                                                    <CheckCircle2 className="text-sky-600 fill-white dark:fill-neutral-900" size={18} />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="col-span-full p-8 text-center border-2 border-dashed border-neutral-200 rounded-2xl text-neutral-400 italic">
                                    No hay categorías cargadas. Revisa el controlador.
                                </div>
                            )}
                        </div>
                        {errors.categorias && <p className="text-red-500 text-xs mt-1">{errors.categorias}</p>}
                    </div>



                    {/* PIE DE FORMULARIO: BOTONES */}
                    <div className="flex justify-end gap-4 p-6 bg-neutral-100 dark:bg-neutral-800/40 rounded-2xl">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="px-8 py-3 text-neutral-500 font-bold hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
                        >
                            Descartar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-teal-600 text-white px-12 py-3 rounded-xl font-bold hover:bg-teal-700 transition shadow-xl shadow-teal-500/30 disabled:opacity-50 flex items-center gap-2"
                        >
                            {processing ? 'Guardando...' : 'Guardar Hotel'}
                        </button>
                    </div>
                </form>

                {/* INVENTARIO Y ASIGNACIÓN MASIVA (COMPLETADO Y CERRADO CORRECTAMENTE) */}
                <div className="bg-white p-8 rounded-xl border border-neutral-200 shadow-sm dark:bg-neutral-900 dark:border-neutral-800 space-y-6">
                    <div>
                        <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                            <span className="w-2 h-6 bg-purple-500 rounded-full inline-block"></span>
                            Inventario de Habitaciones Físicas
                        </h2>
                        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                            Como Administrador global, puedes inyectar de manera masiva números de habitaciones reales a las categorías de este hotel.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {!tipos_habitacion || tipos_habitacion.length === 0 ? (
                            <div className="p-6 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl text-neutral-400 dark:text-neutral-500 italic text-sm">
                                No hay tipos de habitación cargados.
                            </div>
                        ) : (
                            tipos_habitacion.map((tipo) => (
                                <form 
                                    key={tipo.id} 
                                    onSubmit={(e) => handleGenerarMasa(e, tipo.id)}
                                    className="p-4 border border-neutral-100 dark:border-neutral-800/80 rounded-xl bg-neutral-50/50 dark:bg-neutral-800/20 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                                >
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-black text-neutral-800 dark:text-neutral-200 uppercase tracking-tight">
                                            {tipo.tipo_habitacion}
                                        </h4>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                                            Precio base: <span className="text-teal-600 dark:text-teal-400 font-bold">{tipo.precio_base}€</span>
                                            <span className="mx-2 text-neutral-300 dark:text-neutral-700">|</span> 
                                            Habitaciones operativas: <span className="bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-400 font-bold px-2 py-0.5 rounded-md text-[11px]">{tipo.habitaciones_count}</span>
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="flex items-center gap-2">
                                            <label className="text-[11px] font-bold uppercase text-neutral-400">Cantidad:</label>
                                            <input 
                                                type="number" 
                                                name="cantidad" 
                                                min="1" 
                                                placeholder="Ej: 10" 
                                                className="w-20 px-3 py-1.5 text-xs rounded-lg border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100"
                                                required 
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className="text-[11px] font-bold uppercase text-neutral-400">Nº Inicio:</label>
                                            <input 
                                                type="number" 
                                                name="numero_inicio" 
                                                min="1" 
                                                placeholder="Ej: 101" 
                                                className="w-20 px-3 py-1.5 text-xs rounded-lg border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100"
                                                required 
                                            />
                                        </div>
                                        <button 
                                            type="submit" 
                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 transition shadow-sm"
                                        >
                                            Generar Bloque
                                        </button>
                                    </div>
                                </form>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}