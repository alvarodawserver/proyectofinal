import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Building2, BedDouble, CalendarDays, Utensils, Users, ChevronRight } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const adminModules = [
        { name: 'Hoteles', icon: Building2, href: '/hoteles', color: 'text-teal-600', bg: 'bg-teal-50', desc: 'Gestionar sedes y ubicaciones' },
        { name: 'Tipos de Habitación', icon: BedDouble, href: '/tipos', color: 'text-amber-700', bg: 'bg-amber-50', desc: 'Precios, fotos y capacidades' },
        { name: 'Actividades', icon: CalendarDays, href: '/actividades', color: 'text-green-600', bg: 'bg-green-50', desc: 'Eventos y tours disponibles' },
        { name: 'Ofertas', icon: CalendarDays, href: '/ofertas', color: 'text-purple-600', bg: 'bg-purple-50', desc: 'Ofertas especiales y promociones' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Panel de Administración" />
            
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* GRID SUPERIOR: ACCESOS RÁPIDOS */}
                <div className="grid gap-4 md:grid-cols-3">
                    {adminModules.map((module) => (
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
                        <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">Actividad Reciente</h2>
                        <div className="mt-4 flex flex-col items-center justify-center py-20 text-neutral-400">
                            <p className="italic">Aquí aparecerán las últimas reservas realizadas...</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}