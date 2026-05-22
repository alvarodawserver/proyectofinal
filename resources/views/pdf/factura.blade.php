<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Factura de Reserva #{{ $reserva->id }}</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.5; }
        .invoice-box { max-width: 800px; margin: auto; padding: 10px; }
        table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; }
        table td { padding: 8px; vertical-align: top; }
        table tr td:nth-child(2) { text-align: right; }
        .top table td.title { font-size: 28px; color: #4f46e5; font-weight: bold; }
        .heading { background: #f3f4f6; font-weight: bold; border-bottom: 2px solid #e5e7eb; }
        .item { border-bottom: 1px solid #f3f4f6; }
        .total { font-size: 18px; font-weight: bold; border-top: 2px solid #e5e7eb; }
    </style>
</head>
<body>
    <div class="invoice-box">
        <table>
            <tr class="top">
                <td colspan="2">
                    <table>
                        <tr>
                            <td class="title">FACTURA</td>
                            <td>
                                Reserva #: {{ $reserva->id }}<br>
                                Fecha Emisión: {{ now()->format('d/m/Y') }}<br>
                                Estado Pago: <strong>{{ strtoupper($reserva->estado) }}</strong>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <tr>
                <td colspan="2" style="padding-top: 40px; padding-bottom: 40px;">
                    <table>
                        <tr>
                            <td>
                                <strong>Alojamiento:</strong><br>
                                {{ $hotel->nombre_hotel ?? 'Nombre del Hotel' }}<br>
                                {{ $hotel->direccion ?? '' }}, {{ $hotel->ciudad ?? '' }}
                            </td>
                            <td>
                                <strong>Cliente:</strong><br>
                                {{ $reserva->user->name }}<br>
                                {{ $reserva->user->email }}
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <tr class="heading">
                <td>Concepto</td>
                <td>Detalles / Fechas</td>
            </tr>
            <tr class="item">
                <td>Estancia en Hotel (Entrada / Salida)</td>
                <td>
                    {{ \Carbon\Carbon::parse($reserva->fecha_entrada)->format('d/m/Y') }} al 
                    {{ \Carbon\Carbon::parse($reserva->fecha_salida)->format('d/m/Y') }}
                </td>
            </tr>
            <tr class="item">
                <td>Habitaciones Reservadas</td>
                <td>
                    @foreach($reserva->habitaciones as $hab)
                        Nº {{ $hab->num_habitacion }} ({{ $hab->tipo->tipo_habitacion }}){{ !$loop->last ? ', ' : '' }}
                    @endforeach
                </td>
            </tr>

            <tr class="total">
                <td></td>
                <td style="padding-top: 20px;">Total Pagado: {{ number_format($reserva->precio_total ?? 0, 2) }}€</td>
            </tr>
        </table>
    </div>
</body>
</html>