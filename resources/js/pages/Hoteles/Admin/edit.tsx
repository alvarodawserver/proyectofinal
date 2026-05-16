import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import * as Icons from 'lucide-react';
import { CheckCircle2, Layers, Hash, Plus } from 'lucide-react';

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
    servicios_ids: number[];
}

interface Servicio {
    id: number;
    nombre_servicio: string;
    icono: string | null;
}


interface TipoHabitacion {
    id: number;
    tipo_habitacion: string;
    precio: number;
    habitaciones_count: number;
}

interface Props {
    hotel: Hotel;
    propietarios: { id: number; name: string }[];
    servicios: Servicio[];
    tipos_habitacion: TipoHabitacion[]; 
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


export default function Edit({ hotel, propietarios, servicios, tipos_habitacion }: Props) {
    const { auth } = usePage().props as any;
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT', 
        nombre_hotel: hotel.nombre_hotel || '',
        propietario_id: hotel.propietario_id || '',
        descripcion: hotel.descripcion || '',
        direccion: hotel.direccion || '',
        estado: hotel.estado || '',
        ciudad: hotel.ciudad || '',
        latitud: hotel.latitud || '',
        longitud: hotel.longitud || '',
        imagen_principal: null as File | null,
        servicios: hotel.servicios_ids || [],
    });

    const toggleServicio = (id: number) => {
        const current = [...data.servicios];
        const index = current.indexOf(id);
        if (index > -1) current.splice(index, 1);
        else current.push(id);
        setData('servicios', current);
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
                </h1>

                {/* FORMULARIO PRINCIPAL DEL HOTEL */}
                <form onSubmit={submit} className="space-y-8">

                    {/* BLOQUE 1: IDENTIDAD Y PORTADA */}
                    <div className="bg-white p-8 rounded-xl border border-neutral-200 shadow-sm dark:bg-neutral-900 dark:border-neutral-800 space-y-6">
                        <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                            <span className="w-2 h-6 bg-teal-500 rounded-full inline-block"></span>
                            Información Básica
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

                            {/* IMAGEN PRINCIPAL */}
                            <div className="md:col-span-2 bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-xl border-2 border-dashed border-neutral-200 dark:border-neutral-700">
                                <label className="block text-xs font-bold text-neutral-500 mb-4 uppercase">Imagen de Portada (Homepage)</label>
                                <div className="flex flex-wrap items-center gap-6">
                                    {(hotel.imagen_url || data.imagen_principal) && (
                                        <div className="relative">
                                            <img
                                                src={data.imagen_principal ? URL.createObjectURL(data.imagen_principal) : hotel.imagen_url}
                                                alt="Vista previa"
                                                className="w-40 h-24 object-cover rounded-lg shadow-md border-2 border-white dark:border-neutral-700"
                                            />
                                            <span className="absolute -top-2 -left-2 bg-teal-500 text-white text-[10px] px-2 py-1 rounded-full uppercase font-bold">Actual</span>
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            onChange={e => setData('imagen_principal', e.target.files ? e.target.files[0] : null)}
                                            className="hidden"
                                            id="upload-image"
                                            accept="image/*"
                                        />
                                        <label htmlFor="upload-image" className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl cursor-pointer hover:bg-teal-700 transition-all text-sm font-bold shadow-lg shadow-teal-500/20">
                                            <Icons.ImagePlus size={18} />
                                            Subir nueva foto
                                        </label>
                                        <p className="text-xs text-neutral-400 mt-3 italic text-balance">Formatos: JPG, PNG o WEBP. Tamaño recomendado 1200x800px.</p>
                                    </div>
                                </div>
                                {errors.imagen_principal && <p className="text-red-500 text-xs mt-1">{errors.imagen_principal}</p>}
                            </div>
                            
                            {auth.user?.can_access_admin && (
                                <div>
                                    <label className="text-xs font-bold text-neutral-500 uppercase">Propietario Responsable</label>
                                    <select
                                        value={data.propietario_id}
                                        onChange={e => setData('propietario_id', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100 shadow-sm"
                                    >
                                        <option value="">Selecciona un propietario</option>
                                        {propietarios?.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
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
                            </div>

                            <div>
                                <label className="text-xs font-bold text-neutral-500 uppercase">Latitud</label>
                                <input
                                    type="number" step="any"
                                    value={data.latitud}
                                    onChange={e => setData('latitud', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-neutral-500 uppercase">Longitud</label>
                                <input
                                    type="number" step="any"
                                    value={data.longitud}
                                    onChange={e => setData('longitud', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100"
                                />
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
                            </div>
                        </div>
                    </div>

                    {/* BLOQUE 3: SERVICIOS */}
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

                {/* ========================================================================= */}
                {/* NUEVO BLOQUE: SECCIÓN DE INVENTARIO Y ASIGNACIÓN MASIVA (EXCLUSIVO ADMIN) */}
                {/* ========================================================================= */}
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
                                    {/* Info Detallada del Tipo */}
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-black text-neutral-800 dark:text-neutral-200 uppercase tracking-tight">
                                            {tipo.tipo_habitacion}
                                        </h4>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                                            Precio base: <span className="text-teal-600 dark:text-teal-400 font-bold">{tipo.precio}€</span>
                                            <span className="mx-2 text-neutral-300 dark:text-neutral-700">|</span> 
                                            Habitaciones operativas: <span className="bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-400 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wide">{tipo.habitaciones_count} unidades</span>
                                        </p>
                                    </div>

                                    {/* Controles de Entrada Masiva */}
                                    <div className="flex flex-wrap items-center gap-3">
                                        {/* Input: Cantidad */}
                                        <div className="w-full sm:w-32 relative">
                                            <input 
                                                type="number" 
                                                name="cantidad"
                                                min="1"
                                                max="200"
                                                required
                                                className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-2 py-2 pl-8 text-xs font-bold text-neutral-800 dark:text-neutral-100 outline-none focus:border-teal-500 transition-all"
                                                placeholder="Cantidad"
                                            />
                                            <Layers className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" size={13} />
                                        </div>

                                        {/* Input: Nº Inicial */}
                                        <div className="w-full sm:w-36 relative">
                                            <input 
                                                type="number" 
                                                name="numero_inicio"
                                                min="1"
                                                required
                                                className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-2 py-2 pl-8 text-xs font-bold text-neutral-800 dark:text-neutral-100 outline-none focus:border-teal-500 transition-all"
                                                placeholder="Nº Inicial (Ej: 101)"
                                            />
                                            <Hash className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" size={13} />
                                        </div>

                                        {/* Botón de Inyección (Maneja el submit automáticamente) */}
                                        <button 
                                            type="submit"
                                            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shadow-md shadow-purple-500/10"
                                        >
                                            <Plus size={14} strokeWidth={2.5} /> Generar Masa
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