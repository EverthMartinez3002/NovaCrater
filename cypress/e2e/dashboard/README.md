# Dashboard Test Suite - Plan de Pruebas Automatizadas con Cypress

Este directorio contiene un conjunto completo de pruebas automatizadas para el Dashboard de InvoiceShelf, diseñadas para validar todas las funcionalidades críticas con un enfoque en **happy paths** y alta tasa de éxito.

## 📋 Estructura de Pruebas

### 🏗️ Archivos de Configuración

- **`cypress.config.js`** - Configuración principal de Cypress
- **`cypress/support/commands.js`** - Comandos personalizados reutilizables
- **`cypress/support/dashboard-helpers.js`** - Funciones helper específicas del dashboard
- **`cypress/support/e2e.js`** - Configuración global de soporte

### 🧪 Suites de Prueba

#### 1. **01-dashboard-load.cy.js** - Carga y Básicos
- ✅ Carga inicial del dashboard
- ✅ Visualización de métricas de resumen
- ✅ Renderizado de gráficos
- ✅ Carga de tabla de facturas
- ✅ Estados de carga y transiciones
- ✅ Manejo de errores de API
- ✅ Diseño responsive
- ✅ Pruebas de rendimiento

#### 2. **02-date-filtering.cy.js** - Filtrado por Fechas
- ✅ Filtros predefinidos (7 días, 30 días, 90 días, 12 meses, todo el tiempo)
- ✅ Selector de rango personalizado
- ✅ Validación de rangos de fechas
- ✅ Persistencia en localStorage
- ✅ Actualización de componentes al cambiar filtros
- ✅ Casos límite (fechas futuras, muy antiguas, un solo día)

#### 3. **03-table-operations.cy.js** - Operaciones de Tabla
- ✅ Paginación (navegación, información de páginas)
- ✅ Ordenamiento por columnas (número, fecha, monto)
- ✅ Filtrado (estado, cliente, búsqueda de texto)
- ✅ Selección múltiple y acciones en lote
- ✅ Acciones de fila individuales
- ✅ Formato y visualización de datos
- ✅ Estados vacíos
- ✅ Responsividad móvil

#### 4. **04-export-functionality.cy.js** - Funcionalidad de Exportación
- ✅ Menú de exportación y UI
- ✅ Exportación PDF (con/sin secciones, filtros aplicados)
- ✅ Exportación XLSX (múltiples hojas)
- ✅ Exportación CSV (solo facturas)
- ✅ Snapshot del dashboard con gráficos
- ✅ Manejo de errores de exportación
- ✅ Validación de archivos generados
- ✅ Pruebas de rendimiento

#### 5. **05-charts-integration.cy.js** - Integración de Gráficos
- ✅ Carga e inicialización de gráficos
- ✅ Gráfico de facturas pendientes
- ✅ Distribución de estados (pie chart)
- ✅ Flujo de caja predictivo
- ✅ Interactividad y tooltips
- ✅ Actualización con filtros de fecha
- ✅ Manejo de errores de gráficos
- ✅ Precisión de datos
- ✅ Accesibilidad

### 📊 Datos de Prueba

#### **`cypress/fixtures/dashboard-data.json`**
Datos base para las pruebas:
- 5 clientes de ejemplo
- 5 facturas con diferentes estados
- 3 presupuestos
- Métricas esperadas
- Rangos de fechas para filtros

#### **`cypress/fixtures/export-configs.json`**
Configuraciones para pruebas de exportación:
- Configuraciones por formato (PDF, XLSX, CSV)
- Escenarios de prueba
- Reglas de validación
- Casos de error

## 🚀 Cómo Ejecutar las Pruebas

### Prerrequisitos

1. **Docker** debe estar ejecutándose con el proyecto
2. **Node.js** y **npm** instalados
3. **Cypress** ya está configurado en el proyecto

### Comandos de Ejecución

#### 🎯 Ejecutar Suite Completa
```bash
# Desde el directorio raíz del proyecto
node cypress/e2e/dashboard/run-dashboard-tests.js
```

#### 🔧 Opciones Avanzadas
```bash
# Con interfaz gráfica (recomendado para desarrollo)
node cypress/e2e/dashboard/run-dashboard-tests.js --headed

# Navegador específico
node cypress/e2e/dashboard/run-dashboard-tests.js --browser firefox

# Archivo específico
node cypress/e2e/dashboard/run-dashboard-tests.js --spec "01-dashboard-load"

# Ambiente específico
node cypress/e2e/dashboard/run-dashboard-tests.js --env staging

# Modo paralelo (más rápido)
node cypress/e2e/dashboard/run-dashboard-tests.js --parallel
```

#### 🐳 Dentro del Docker
```bash
# Entrar al contenedor
docker exec -it invoiceshelf-app bash

# Ejecutar pruebas
npm run test:cypress:dashboard
# o
node cypress/e2e/dashboard/run-dashboard-tests.js
```

#### 📱 Cypress Interactivo
```bash
# Abrir Cypress en modo interactivo
npx cypress open

# Seleccionar E2E Testing
# Navegar a cypress/e2e/dashboard/
# Ejecutar archivos individuales
```

## 📈 Métricas de Éxito

### 🎯 Objetivos de Calidad
- **Tasa de éxito objetivo: ≥ 95%**
- **Tiempo de ejecución total: < 10 minutos**
- **Cobertura funcional: 100% de happy paths**

### 📊 Criterios de Aceptación por Suite

#### Dashboard Core (01-02)
- ✅ Dashboard carga en < 5 segundos
- ✅ Todas las métricas se muestran correctamente
- ✅ Filtros de fecha funcionan sin errores
- ✅ Datos persisten en localStorage

#### Table Operations (03)
- ✅ Paginación funciona con > 10 elementos
- ✅ Ordenamiento cambia el orden visible
- ✅ Filtros reducen correctamente los resultados
- ✅ Selección múltiple permite acciones en lote

#### Export Functionality (04)
- ✅ Archivos se generan en < 15 segundos
- ✅ Archivos tienen tamaño válido (> 1KB)
- ✅ Formatos contienen datos esperados
- ✅ Filtros se aplican correctamente

#### Charts Integration (05)
- ✅ Todos los gráficos renderizan sin errores
- ✅ Datos coinciden con respuestas de API
- ✅ Gráficos se actualizan con filtros
- ✅ Interactividad funciona (hover, click)

## 🔧 Configuración y Personalización

### 🎛️ Variables de Entorno
```javascript
// cypress.config.js
env: {
  ENVIRONMENT: 'local',    // local, staging, production
  BASE_URL: 'http://invoiceshelf.test',
  API_TIMEOUT: 15000,
  VIEWPORT_WIDTH: 1280,
  VIEWPORT_HEIGHT: 720
}
```

### 👤 Datos de Usuario
```javascript
// cypress/support/commands.js
const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'password'
}
```

### 🏷️ Data-cy Attributes Necesarios

Para que las pruebas funcionen correctamente, los componentes deben tener estos atributos:

#### Dashboard Principal
```html
<div data-cy="dashboard-container">
  <div data-cy="dashboard-summary">
    <div data-cy="metric-total-sales">$1,234.56</div>
    <div data-cy="metric-total-invoices">42</div>
    <div data-cy="metric-total-customers">15</div>
    <div data-cy="metric-amount-due">$567.89</div>
  </div>
</div>
```

#### Filtro de Fechas
```html
<div data-cy="unified-date-picker">
  <div data-cy="date-option-last_7_days">Last 7 days</div>
  <div data-cy="date-option-last_30_days">Last 30 days</div>
  <div data-cy="date-option-custom">Custom</div>
  <input data-cy="custom-start-date" />
  <input data-cy="custom-end-date" />
</div>
```

#### Tabla
```html
<table data-cy="dashboard-table">
  <thead>
    <th data-cy="sort-invoice_number">Invoice #</th>
    <th data-cy="sort-total">Total</th>
  </thead>
  <tbody>
    <tr>
      <td data-cy="table-invoice-number">INV-001</td>
      <td data-cy="table-status">SENT</td>
    </tr>
  </tbody>
</table>
```

#### Gráficos
```html
<div data-cy="outstanding-invoices-chart">
  <canvas></canvas>
</div>
<div data-cy="status-distribution-chart">
  <canvas></canvas>
</div>
<div data-cy="predictive-cashflow-chart">
  <canvas></canvas>
</div>
```

#### Exportación
```html
<div data-cy="export-dropdown">
  <div data-cy="export-pdf">Export as PDF</div>
  <div data-cy="export-xlsx">Export as XLSX</div>
  <div data-cy="export-csv">Export as CSV</div>
</div>
```

## 🐛 Troubleshooting

### Problemas Comunes

#### 1. **Pruebas Fallan - Elementos No Encontrados**
```bash
# Verificar que data-cy attributes estén presentes
# Verificar que el dashboard cargue correctamente en manual
```

#### 2. **Timeouts en Carga de Datos**
```bash
# Aumentar timeouts en cypress.config.js
# Verificar que APIs respondan correctamente
```

#### 3. **Exportaciones Fallan**
```bash
# Verificar permisos de escritura en cypress/downloads
# Verificar que las APIs de exportación funcionen
```

#### 4. **Gráficos No Renderizan**
```bash
# Verificar que Chart.js esté cargado
# Verificar que canvas elements estén presentes
# Verificar datos de APIs de gráficos
```

### 🔍 Debug y Desarrollo

#### Modo Debug
```bash
# Ejecutar con logs detallados
DEBUG=cypress:* npx cypress run --spec "cypress/e2e/dashboard/01-dashboard-load.cy.js"
```

#### Screenshots y Videos
```bash
# Los screenshots se guardan automáticamente en:
cypress/screenshots/

# Los videos se guardan en:
cypress/videos/
```

#### Reportes
```bash
# Reportes JSON se guardan en:
cypress/results/dashboard-summary.json
```

## 📚 Recursos Adicionales

- [Documentación de Cypress](https://docs.cypress.io)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Custom Commands](https://docs.cypress.io/api/cypress-api/custom-commands)
- [Fixtures](https://docs.cypress.io/api/commands/fixture)

## 🔄 Mantenimiento

### Actualización de Datos de Prueba
Los archivos en `cypress/fixtures/` deben actualizarse cuando:
- Cambie la estructura de datos de la API
- Se agreguen nuevos estados de factura
- Se modifiquen los formatos de exportación

### Adición de Nuevas Pruebas
1. Crear nuevo archivo en `cypress/e2e/dashboard/`
2. Seguir convención de nombres: `##-descripcion.cy.js`
3. Agregar al script runner en `run-dashboard-tests.js`
4. Actualizar este README

### Revisión Periódica
- **Semanal**: Verificar que todas las pruebas pasen
- **Mensual**: Revisar métricas de rendimiento
- **Trimestral**: Actualizar datos de prueba y escenarios

---

## ✅ Lista de Verificación Pre-Implementación

Antes de ejecutar las pruebas por primera vez:

- [ ] Docker está ejecutándose
- [ ] Aplicación accesible en http://invoiceshelf.test
- [ ] Usuario admin existe y puede hacer login
- [ ] Dashboard carga correctamente en manual
- [ ] Data-cy attributes agregados a componentes clave
- [ ] APIs de dashboard responden correctamente
- [ ] Funcionalidad de exportación habilitada
- [ ] Cypress instalado y configurado

¡Una vez completada esta lista, las pruebas están listas para ejecutarse con alta probabilidad de éxito! 🎉 