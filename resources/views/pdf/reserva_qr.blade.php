<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Pase de Check-in</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333333;
            background-color: #ffffff;
            margin: 0;
            padding: 40px;
            text-align: center;
        }
        .card {
            border: 2px solid #e8e4db;
            border-radius: 20px;
            padding: 30px;
            max-width: 450px;
            margin: 0 auto;
            background-color: #fffcf5;
        }
        h1 {
            color: #004d4d;
            font-size: 24px;
            margin-bottom: 5px;
        }
        .subtitle {
            color: #8b4513;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 30px;
        }
        .qr-container {
            margin: 20px 0;
        }
        .qr-container img {
            width: 200px;
            height: 200px;
        }
        .details {
            margin-top: 30px;
            text-align: left;
            border-top: 1px dashed #d2b48c;
            padding-top: 20px;
        }
        .row {
            margin-bottom: 12px;
            font-size: 14px;
        }
        .label {
            font-weight: bold;
            color: #008080;
        }
    </style>
</head>
<body>

    <div class="card">
        <h1>Refugio del Mar</h1>
        <div class="subtitle">Pase Digital de Check-in</div>

        <div class="qr-container">
            <img src="data:image/png+base64,{{ $qrCodeBase64 }}" alt="Código QR de Reserva">
        </div>

        <div class="details">
            <div class="row"><span class="label">Referencia:</span> #RDN-{{ $reserva->id }}</div>
            <div class="row"><span class="label">Titular:</span> {{ $reserva->user->name }}</div>
            <div class="row"><span class="label">Hotel:</span> {{ $reserva->habitaciones[0]->hotele->nombre_hotel ?? 'Refugio del Mar' }}</div>
            <div class="row"><span class="label">Estancia:</span> {{ $reserva->fecha_entrada }} al {{ $reserva->fecha_salida }}</div>
        </div>
    </div>

</body>
</html>