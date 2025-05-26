# 🎯 InvoiceShelf Demo Setup Guide

Este documento explica cómo configurar datos de demostración para InvoiceShelf, específicamente diseñados para mostrar todas las funcionalidades de filtrado del dashboard.

## 🚀 Configuración Rápida

### Opción 1: Comando Personalizado (Recomendado)

```bash
# Para una base de datos nueva (elimina todos los datos existentes)
php artisan demo:create --fresh

# Para agregar datos demo a una base de datos existente
php artisan demo:create
```

### Opción 2: Seeder Directo

```bash
# Asegúrate de que la base de datos tenga los datos básicos
php artisan db:seed --class=CurrenciesTableSeeder
php artisan db:seed --class=CountriesTableSeeder

# Ejecuta el seeder de demo
php artisan db:seed --class=DemoDataSeeder
```

## 📊 Datos Creados

El script de demostración crea:

### 👤 Usuario y Empresa
- **Email:** `demo@invoiceshelf.com`
- **Contraseña:** `demo123`
- **Empresa:** InvoiceShelf Demo Company
- **Rol:** Super Admin

### 👥 Clientes (15 total)
- **5 clientes principales** con nombres realistas y portal habilitado
- **10 clientes adicionales** (algunos con portal habilitado, otros sin él)
- Datos completos: email, teléfono, sitio web

### 📄 Facturas (~25 total)
Distribuidas estratégicamente para demostrar filtros:

| Estado | Estado de Pago | Cantidad | Propósito |
|--------|----------------|----------|-----------|
| SENT | UNPAID | 3 | Facturas activas recientes |
| VIEWED | UNPAID | 2 | Facturas vistas sin pagar |
| VIEWED | PARTIALLY_PAID | 2 | Facturas parcialmente pagadas |
| COMPLETED | PAID | 9 | Facturas completadas |
| DRAFT | UNPAID | 2 | Borradores |
| SENT | UNPAID (vencidas) | 3 | Facturas vencidas |

### 📋 Presupuestos (~15 total)
| Estado | Cantidad | Propósito |
|--------|----------|-----------|
| SENT | 3 | Presupuestos activos |
| VIEWED | 2 | Presupuestos vistos |
| ACCEPTED | 4 | Presupuestos aceptados |
| REJECTED | 2 | Presupuestos rechazados |
| DRAFT | 2 | Borradores |
| EXPIRED | 2 | Presupuestos expirados |

### 💰 Pagos
- Pagos automáticos para todas las facturas pagadas/parcialmente pagadas
- 5 pagos independientes (anticipos)
- Diferentes métodos de pago: Efectivo, Tarjeta, Transferencia, PayPal

### 💼 Gastos (8 total)
- Categorías: Suministros de oficina, Viajes, Software, Marketing
- Distribuidos en los últimos 40 días

### 🛍️ Productos/Servicios (5 total)
- Desarrollo Web
- Servicios de Consultoría
- Diseño de Logo
- Optimización SEO
- Desarrollo de App Móvil

## 🎯 Funcionalidades de Demo

### Dashboard Principal
1. **Filtro "Active Only"**: 
   - Sin filtro: Muestra todas las facturas/presupuestos
   - Con filtro: Solo muestra elementos activos (SENT/VIEWED con pagos pendientes)

2. **Estadísticas**:
   - Monto total pendiente
   - Conteo de facturas, presupuestos, pagos
   - Clientes activos

3. **Gráficos**:
   - Ingresos vs gastos por mes
   - Tendencias de ventas

### Filtros de Facturas
- **Por estado**: DRAFT, SENT, VIEWED, COMPLETED, etc.
- **Por estado de pago**: UNPAID, PARTIALLY_PAID, PAID
- **Por cliente**: Todos los clientes creados
- **Por fechas**: Facturas distribuidas en los últimos 60 días
- **Por número**: Números secuenciales generados automáticamente

### Filtros de Presupuestos
- **Por estado**: DRAFT, SENT, VIEWED, ACCEPTED, REJECTED, EXPIRED
- **Por cliente**: Mismos clientes que las facturas
- **Por fechas**: Presupuestos distribuidos en los últimos 60 días

## 🔍 Escenarios de Demostración

### 1. Filtro Activo en Dashboard
```
1. Ve al dashboard sin filtros → Muestra todos los datos
2. Activa "Active Only" → Muestra solo elementos activos
3. Compara las diferencias en conteos y listas
```

### 2. Gestión de Facturas
```
1. Ve a Facturas → Muestra todas las facturas
2. Filtra por "SENT" → Muestra facturas enviadas
3. Filtra por "UNPAID" → Muestra facturas sin pagar
4. Combina filtros de fecha → Muestra facturas del último mes
```

### 3. Análisis de Presupuestos
```
1. Ve a Presupuestos → Muestra todos los presupuestos
2. Filtra por "ACCEPTED" → Muestra presupuestos aceptados
3. Filtra por cliente específico → Muestra presupuestos de ese cliente
```

### 4. Portal del Cliente
```
1. Algunos clientes tienen portal habilitado
2. Pueden ver sus facturas y presupuestos
3. El filtro activo también funciona en el portal
```

## 🛠️ Personalización

### Modificar Cantidades
Edita `database/seeders/DemoDataSeeder.php` y ajusta los arrays de configuración:

```php
// Ejemplo: Más facturas SENT
['status' => 'SENT', 'paid_status' => 'UNPAID', 'days_ago' => 5, 'count' => 10],
```

### Agregar Nuevos Clientes
```php
// En el método createCustomers()
[
    'name' => 'Tu Empresa',
    'email' => 'contacto@tuempresa.com',
    'enable_portal' => true,
    'phone' => '+1-555-0199',
    'website' => 'https://tuempresa.com',
],
```

### Cambiar Fechas
```php
// Modificar el rango de días en los arrays de configuración
'days_ago' => 30, // Cambia este valor
```

## 🔧 Solución de Problemas

### Error de Base de Datos
```bash
# Verifica la configuración de la base de datos
php artisan config:cache
php artisan migrate:status
```

### Error de Permisos
```bash
# En sistemas Unix/Linux
chmod -R 775 storage/
chmod -R 775 bootstrap/cache/
```

### Datos Duplicados
```bash
# Para limpiar y recrear
php artisan demo:create --fresh
```

## 📝 Notas Importantes

1. **Backup**: Siempre haz backup de tu base de datos antes de ejecutar `--fresh`
2. **Producción**: Nunca ejecutes estos comandos en producción
3. **Personalización**: Los datos son realistas pero ficticios
4. **Performance**: El seeder está optimizado para crear datos rápidamente

## 🎉 ¡Listo para la Demo!

Una vez ejecutado el script, tendrás:
- ✅ Usuario de demo configurado
- ✅ Datos realistas y variados
- ✅ Todos los filtros funcionando
- ✅ Escenarios de demostración listos
- ✅ Portal de cliente funcional

¡Perfecto para mostrar todas las capacidades de InvoiceShelf! 