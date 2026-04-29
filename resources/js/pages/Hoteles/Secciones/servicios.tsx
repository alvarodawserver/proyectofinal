import { Servicio } from "@/types";
import { DynamicIcon } from "@/components/dynamic-icon";
interface Props{
    servicios: Servicio[];
}    


export default function ServicesSection({ servicios }: Props) {
    return (
        <div>
            <h2>Este hotel ofrece:</h2>
            <div style={serviciosGridStyle}>
                {servicios.map(srv => (
                    <div key={srv.id} style={servicioCardStyle}>
                        <DynamicIcon name={srv.icono || 'HelpCircle'} />
                        {srv.nombre_servicio}
                    </div>
                ))}
            </div>
        </div>
    );
}


const serviciosGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px', marginTop: '20px' };
const servicioCardStyle = { backgroundColor: 'white', padding: '15px', borderRadius: '12px', border: '1px solid #D2B48C', display: 'flex', flexDirection: 'column' as const, alignItems: 'center' as const, gap: '10px', fontSize: '0.9rem', color: '#008080', fontWeight: 'bold', textAlign: 'center' as const, boxShadow: '0 4px 10px rgba(0,0,0,0.05)' };
