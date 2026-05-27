import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Building2, BedDouble, CalendarDays, Users, ChevronRight } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {

    const { auth } = usePage().props as any;
    const isAdmin = auth.user.roles?.includes('admin') || auth.user.role === 'admin';
    const isPropietario = auth.user.roles?.includes('propietario') || auth.user.role === 'propietario';

    // 2. Definimos los módulos base de la aplicación
    const allModules = [
        { 
            name: isAdmin ? 'Hoteles' : 'Mi Hotel', 
            icon: Building2, 
            href: '/hoteles', 
            color: 'text-teal-600', 
            bg: 'bg-teal-50', 
            desc: isAdmin ? 'Gestionar sedes y ubicaciones globales' : 'Gestionar la información de tu hotel',
            roles: ['admin', 'propietario'] 
        },
        { 
            name: 'Tipos de Habitación', 
            icon: BedDouble, 
            href: '/tipos', 
            color: 'text-amber-700', 
            bg: 'bg-amber-50', 
            desc: isAdmin ? 'Precios, fotos y capacidades generales' : 'Configurar las habitaciones de tu hotel',
            roles: ['admin'] 
        },
        { 
            name: 'Actividades', 
            icon: CalendarDays, 
            href: '/actividades', 
            color: 'text-green-600', 
            bg: 'bg-green-50', 
            desc: 'Eventos y tours disponibles',
            roles: ['admin'] // El propietario las linkea desde su hotel, no hace falta que vea el CRUD global
        },
        { 
            name: 'Ofertas', 
            icon: CalendarDays, 
            href: '/ofertas', 
            color: 'text-purple-600', 
            bg: 'bg-purple-50', 
            desc: isAdmin ? 'Ofertas especiales globales' : 'Crear promociones para tus huéspedes',
            roles: ['admin', 'propietario'] 
        },
        { 
            name: 'Usuarios', 
            icon: Users, 
            href: '/usuarios', 
            color: 'text-blue-600', 
            bg: 'bg-blue-50', 
            desc: 'Gestionar usuarios y permisos del sistema',
            roles: ['admin'] // Solo accesible por el Súper Admin
        },

        { 
            name: 'Categorias', 
            icon: CalendarDays, 
            href: '/categorias', 
            color: 'text-orange-600', 
            bg: 'bg-orange-50', 
            desc: 'Gestionar categorías de productos o servicios',
            roles: ['admin'] // Solo accesible por el Súper Admin
        },
    ];

    // 3. Filtramos los módulos para mostrar solo los permitidos para el rol actual
    const activeModules = allModules.filter(module => {
        if (isAdmin && module.roles.includes('admin')) return true;
        if (isPropietario && module.roles.includes('propietario')) return true;
        return false;
    });

    return (
        <>
            <Head title={isAdmin ? "Panel de Administración" : "Panel de Propietario"} />
            
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                
                {/* Saludo dinámico */}
                <div className="mb-2">
                    <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                        Bienvenido, {auth.user.name} 👋
                    </h1>
                    <p className="text-sm text-neutral-500">
                        Tienes acceso como <span className="font-bold text-teal-600 uppercase">{isAdmin ? 'Administrador' : 'Propietario'}</span>
                    </p>
                    <Link
                        href={'/'}>
                            Volver a la página principal
                    </Link>
                </div>

                {/* GRID SUPERIOR: ACCESOS RÁPIDOS FILTRADOS */}
                <div className="grid gap-4 md:grid-cols-3">
                    {activeModules.map((module) => (
                        <Link 
                            key={module.name} 
                            href={module.href}
                            className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-sidebar-border/70 bg-white p-6 transition-all hover:shadow-md dark:bg-neutral-900"
                        >
                            <div className="flex items-start justify-between">
                                <div className={`rounded-lg ${module.bg} p-3 dark:bg-opacity-10`}>
                                    <module.icon className={`size-6 ${module.color}`} />
                                </div>
                                <ChevronRight className="size-5 text-neutral-400 transition-transform group-hover:translate-x-1" />
                            </div>
                            <div className="mt-4">
                                <h3 className="font-bold text-neutral-800 dark:text-neutral-200">{module.name}</h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">{module.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="relative min-h-[50vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-white dark:bg-neutral-900">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                            {isAdmin ? 'Actividad Reciente Global' : 'Reservas de tu Hotel'}
                        </h2>
                        <div className="mt-4 flex flex-col items-center justify-center py-20 text-neutral-400">
                            <p className="italic">Aquí aparecerán las últimas reservas realizadas...</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}