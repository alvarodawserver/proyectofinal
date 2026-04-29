import * as LucideIcons from 'lucide-react';

interface Props {
    name: string;
    size?: number;
    color?: string;
}

export const DynamicIcon = ({ name, size = 20, color = '#008080' }: Props) => {
    const IconComponent = (LucideIcons as any)[name];
    if (!IconComponent) {
        return <LucideIcons.HelpCircle size={size} color={color} />;
    }

    return <IconComponent size={size} color={color} />;
};