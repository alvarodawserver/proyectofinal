<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; }
        .badge { background: #f59e0b; color: white; padding: 4px 8px; border-radius: 5px; font-size: 12px; font-weight: bold; }
        .price-box { background-color: #f3f4f6; padding: 15px; border-left: 4px solid #0d9488; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Solicitud de Cancelación y Reembolso</h2>
        <p>El cliente ha solicitado cancelar su reserva. Al hacerse con <strong>{{ $diasAntelacion }} días</strong> de antelación, se ha aplicado la política del hotel.</p>
        
        <div class="price-box">
            <p><strong>Hotel:</strong> {{ $reserva->hotel->nombre_hotel }}</p>
            <p><strong>ID de Reserva:</strong> #{{ $reserva->id }}</p>
            <p><strong>Precio Total Pagado:</strong> {{ $reserva->precio }}€</p>
            <hr>
            <p style="font-size: 18px;"><strong>Monto a Reembolsar en Stripe:</strong> <span style="color: #0d9488; font-weight: bold;">{{ $montoReembolso }}€</span></p>
        </div>

        <p><strong>Pasos para el Administrador:</strong></p>
        <ol>
            <li>Ve a tu Dashboard de Stripe.</li>
            <li>Busca el pago asociado a esta reserva o al email del cliente ({{ $reserva->user->email ?? 'N/A' }}).</li>
            <li>Haz un reembolso parcial o total por la cantidad de <strong>{{ $montoReembolso }}€</strong>.</li>
        </ol>
        
        <p><em>Nota: El estado de la reserva ha cambiado automáticamente a "Cancelada / Reembolso Pendiente" en tu sistema.</em></p>
    </div>
</body>
</html>