import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function FlashMessages() {
    const { flash } = usePage().props as any;
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    if (!visible) return null;

    return (
        <div className="fixed bottom-5 right-5 z-50 max-w-md space-y-2">
            {flash?.success && (
                <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-bounce">
                    <span>✅ {flash.success}</span>
                </div>
            )}
            {flash?.error && (
                <div className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-bounce">
                    <span>❌ {flash.error}</span>
                </div>
            )}
        </div>
    );
}