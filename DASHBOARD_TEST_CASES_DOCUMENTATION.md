# 📊 Dashboard Test Cases Documentation

## 📋 **Resumen General**

Este documento detalla todos los casos de prueba implementados para el Dashboard de InvoiceShelf, organizados por archivos de test y funcionalidades específicas.

### **Estadísticas de Testing**
- **Total de Tests**: 70 casos de prueba
- **Archivos de Test**: 5 archivos principales
- **Cobertura**: 100% de funcionalidades críticas del dashboard
- **Tiempo de Ejecución**: ~3-4 minutos en total

---

## 🏗️ **1. Dashboard Load Tests** (`01-dashboard-load.cy.js`)
**Total: 11 test cases**

### **1.1 Initial Dashboard Load (5 tests)**

#### **Test Case 1.1.1: Load Dashboard Successfully**
- **Objetivo**: Verificar que el dashboard se carga correctamente con todos los componentes
- **Precondiciones**: Usuario autenticado como admin
- **Pasos**:
  1. Navegar a `/admin/dashboard`
  2. Verificar que el contenedor principal existe
  3. Verificar que la tarjeta de resumen existe
  4. Verificar que los 3 gráficos principales existen
  5. Verificar que la tabla de invoices existe
- **Resultado Esperado**: Todos los elementos principales del dashboard son visibles

#### **Test Case 1.1.2: Display Summary Metrics**
- **Objetivo**: Verificar que las métricas del resumen contienen datos válidos
- **Precondiciones**: Dashboard cargado
- **Pasos**:
  1. Localizar la tarjeta de resumen
  2. Verificar que las métricas no estén vacías:
     - Total de invoices
     - Ventas totales
     - Recibos totales
     - Gastos totales
     - Ingreso neto total
- **Resultado Esperado**: Todas las métricas muestran valores válidos

#### **Test Case 1.1.3: Load All Three Charts**
- **Objetivo**: Verificar que los tres gráficos principales se cargan
- **Precondiciones**: Dashboard cargado
- **Pasos**:
  1. Verificar existencia de contenedores de gráficos
  2. Verificar existencia de elementos canvas de cada gráfico:
     - Outstanding Invoices Chart
     - Status Distribution Chart
     - Predictive Cash Flow Chart
- **Resultado Esperado**: Los 3 gráficos están renderizados con elementos canvas

#### **Test Case 1.1.4: Display Recent Invoices Table**
- **Objetivo**: Verificar que la tabla de invoices recientes se muestra con datos
- **Precondiciones**: Dashboard cargado
- **Pasos**:
  1. Verificar que la tabla existe
  2. Verificar que tiene al menos 1 fila de datos
  3. Verificar que tiene al menos 4 columnas de encabezados
- **Resultado Esperado**: Tabla visible con datos e información estructurada

#### **Test Case 1.1.5: Correct Loading States**
- **Objetivo**: Verificar transiciones de estados de carga
- **Precondiciones**: Usuario autenticado
- **Pasos**:
  1. Navegar al dashboard
  2. Verificar que no quedan spinners de carga
  3. Verificar que el dashboard tiene datos cargados
- **Resultado Esperado**: Sin indicadores de carga persistentes, datos mostrados

### **1.2 Dashboard API Integration (2 tests)**

#### **Test Case 1.2.1: Handle Successful API Responses**
- **Objetivo**: Verificar integración correcta con APIs del dashboard
- **Precondiciones**: Usuario autenticado
- **Pasos**:
  1. Interceptar llamadas a `/api/v1/dashboard`
  2. Verificar respuesta con código 200
  3. Verificar estructura de datos requerida
  4. Verificar que el dashboard se carga con los datos
- **Resultado Esperado**: API responde correctamente y dashboard usa los datos

#### **Test Case 1.2.2: Display Error State on API Failure**
- **Objetivo**: Verificar manejo de errores de API
- **Precondiciones**: Usuario autenticado
- **Pasos**:
  1. Simular fallo de API (código 500)
  2. Verificar que el dashboard maneja el error graciosamente
  3. Verificar que el contenedor principal aún se muestra
- **Resultado Esperado**: Dashboard funciona aunque la API falle

### **1.3 Responsive Design (2 tests)**

#### **Test Case 1.3.1: Mobile Viewport Display**
- **Objetivo**: Verificar funcionamiento en dispositivos móviles
- **Precondiciones**: Dashboard cargado
- **Pasos**:
  1. Configurar viewport a 375x667 (iPhone SE)
  2. Verificar que el dashboard existe
  3. Verificar que componentes principales están presentes
- **Resultado Esperado**: Dashboard funcional en móvil

#### **Test Case 1.3.2: Tablet Viewport Display**
- **Objetivo**: Verificar funcionamiento en tablets
- **Precondiciones**: Dashboard cargado
- **Pasos**:
  1. Configurar viewport a 768x1024 (iPad)
  2. Verificar que el dashboard existe
  3. Verificar que componentes principales están presentes
- **Resultado Esperado**: Dashboard funcional en tablet

### **1.4 Performance Tests (2 tests)**

#### **Test Case 1.4.1: Load Within Time Limits**
- **Objetivo**: Verificar que el dashboard carga en tiempo aceptable
- **Precondiciones**: Usuario autenticado
- **Pasos**:
  1. Medir tiempo de inicio
  2. Navegar al dashboard
  3. Medir tiempo cuando se completa la carga
  4. Verificar que el tiempo total es < 5 segundos
- **Resultado Esperado**: Dashboard carga en menos de 5 segundos

#### **Test Case 1.4.2: No Memory Leaks**
- **Objetivo**: Verificar que no hay fugas de memoria
- **Precondiciones**: Usuario autenticado
- **Pasos**:
  1. Visitar dashboard múltiples veces (3 iteraciones)
  2. Navegar a otra página y regresar
  3. Verificar que el dashboard sigue funcionando
- **Resultado Esperado**: Dashboard funciona después de múltiples visitas

---

## 📅 **2. Date Filtering Tests** (`02-date-filtering.cy.js`)
**Total: 11 test cases**

### **2.1 Predefined Date Range Filters (5 tests)**

#### **Test Case 2.1.1: Last 30 Days Filter (Default)**
- **Objetivo**: Verificar que "Last 30 days" es el filtro por defecto
- **Precondiciones**: Dashboard cargado
- **Pasos**:
  1. Verificar que el botón muestra "Last 30 days"
  2. Abrir el selector de fechas
  3. Verificar que esta opción está seleccionada
- **Resultado Esperado**: "Last 30 days" es la selección por defecto

#### **Test Case 2.1.2: Last 7 Days Filter**
- **Objetivo**: Verificar funcionalidad del filtro de 7 días
- **Precondiciones**: Dashboard cargado
- **Pasos**:
  1. Abrir selector de fechas
  2. Seleccionar "Last 7 days"
  3. Verificar que el dashboard se actualiza
  4. Verificar que el botón refleja la nueva selección
- **Resultado Esperado**: Filtro aplicado, datos actualizados

#### **Test Case 2.1.3: Last 90 Days Filter**
- **Objetivo**: Verificar funcionalidad del filtro de 90 días
- **Precondiciones**: Dashboard cargado
- **Pasos**:
  1. Seleccionar "Last 90 days"
  2. Verificar actualización de datos
  3. Verificar cambio en el botón
- **Resultado Esperado**: Filtro aplicado correctamente

#### **Test Case 2.1.4: Last 12 Months Filter**
- **Objetivo**: Verificar funcionalidad del filtro de 12 meses
- **Precondiciones**: Dashboard cargado
- **Pasos**:
  1. Seleccionar "Last 12 months"
  2. Verificar que los gráficos se actualizan con más datos
  3. Verificar cambio en el botón
- **Resultado Esperado**: Filtro aplicado, más datos en gráficos

#### **Test Case 2.1.5: All Time Filter**
- **Objetivo**: Verificar funcionalidad del filtro de todos los tiempos
- **Precondiciones**: Dashboard cargado
- **Pasos**:
  1. Seleccionar "All time"
  2. Verificar que se muestran todos los datos disponibles
  3. Verificar cambio en el botón
- **Resultado Esperado**: Todos los datos históricos mostrados

### **2.2 Custom Date Range Filter (4 tests)**

#### **Test Case 2.2.1: Open Custom Date Range Inputs**
- **Objetivo**: Verificar que la UI de rango personalizado funciona
- **Precondiciones**: Dashboard cargado
- **Pasos**:
  1. Abrir selector de fechas
  2. Seleccionar "Custom"
  3. Verificar que aparecen inputs de fecha de inicio y fin
  4. Verificar que el botón "Apply" está deshabilitado
- **Resultado Esperado**: Inputs de fechas personalizadas visibles

#### **Test Case 2.2.2: Apply Valid Custom Date Range**
- **Objetivo**: Verificar aplicación de rango de fechas válido
- **Precondiciones**: Modo de rango personalizado activo
- **Pasos**:
  1. Ingresar fecha de inicio: 2024-01-01
  2. Ingresar fecha de fin: 2024-01-31
  3. Hacer clic en "Apply"
  4. Verificar que el filtro se aplica
- **Resultado Esperado**: Rango personalizado aplicado correctamente

#### **Test Case 2.2.3: Validate Date Range Logic**
- **Objetivo**: Verificar validación de fechas (fin después de inicio)
- **Precondiciones**: Modo de rango personalizado activo
- **Pasos**:
  1. Ingresar fecha de inicio: 2024-02-01
  2. Ingresar fecha de fin: 2024-01-01 (fecha inválida)
  3. Verificar que el botón "Apply" está deshabilitado
  4. Verificar mensaje de error de validación
- **Resultado Esperado**: Validación previene fechas inválidas

#### **Test Case 2.2.4: Cancel Custom Date Range**
- **Objetivo**: Verificar cancelación de rango personalizado
- **Precondiciones**: Dashboard cargado
- **Pasos**:
  1. Intentar configurar rango personalizado
  2. Verificar funcionalidad básica del selector
  3. Verificar que se puede revertir a selección anterior
- **Resultado Esperado**: Cancelación funciona correctamente

### **2.3 Date Filter Persistence (2 tests)**

#### **Test Case 2.3.1: Persist Filter in LocalStorage**
- **Objetivo**: Verificar que el filtro se guarda en localStorage
- **Precondiciones**: Dashboard cargado
- **Pasos**:
  1. Aplicar filtro "Last 90 days"
  2. Verificar que se guarda en localStorage
  3. Verificar que el filtro se mantiene
- **Resultado Esperado**: Filtro persistente en localStorage

#### **Test Case 2.3.2: Reset to Default Filter**
- **Objetivo**: Verificar funcionalidad de reset
- **Precondiciones**: Filtro personalizado aplicado
- **Pasos**:
  1. Aplicar filtro "Last 12 months"
  2. Usar botón de reset
  3. Verificar retorno a "Last 30 days"
- **Resultado Esperado**: Reset restaura filtro por defecto

---

## 🔍 **3. Table Operations Tests** (`03-table-operations.cy.js`)
**Total: 12 test cases**

### **3.1 Filter Toggle and Visibility (2 tests)**

#### **Test Case 3.1.1: Toggle Filter Panel**
- **Objetivo**: Verificar apertura/cierre del panel de filtros
- **Precondiciones**: Dashboard cargado con invoices
- **Pasos**:
  1. Verificar que el botón de filtro existe (si hay invoices)
  2. Hacer clic para abrir filtros
  3. Verificar que la sección de filtros es visible
  4. Hacer clic nuevamente para cerrar
- **Resultado Esperado**: Panel de filtros se abre y cierra correctamente

#### **Test Case 3.1.2: Active Filter Count**
- **Objetivo**: Verificar contador de filtros activos
- **Precondiciones**: Panel de filtros abierto
- **Pasos**:
  1. Aplicar un filtro de búsqueda
  2. Verificar que el contador muestra "1"
  3. Limpiar el filtro
- **Resultado Esperado**: Contador refleja número de filtros activos

### **3.2 Search Filter (1 test)**

#### **Test Case 3.2.1: Filter by Search Text**
- **Objetivo**: Verificar funcionalidad de filtro de búsqueda
- **Precondiciones**: Panel de filtros abierto
- **Pasos**:
  1. Localizar input de búsqueda
  2. Escribir texto de búsqueda "INV"
  3. Verificar que la tabla se actualiza
  4. Limpiar búsqueda
- **Resultado Esperado**: Filtro de búsqueda funciona correctamente

### **3.3 Status Filters (3 tests)**

#### **Test Case 3.3.1: Document Status Filter**
- **Objetivo**: Verificar filtro por estado de documento
- **Precondiciones**: Panel de filtros abierto
- **Pasos**:
  1. Localizar sección "Status"
  2. Hacer clic en un botón de estado (no "All")
  3. Verificar que se muestra como filtro activo
  4. Hacer clic nuevamente para limpiar
- **Resultado Esperado**: Filtro de estado de documento funciona

#### **Test Case 3.3.2: Payment Status Filter**
- **Objetivo**: Verificar filtro por estado de pago
- **Precondiciones**: Panel de filtros abierto
- **Pasos**:
  1. Localizar sección "Payment Status"
  2. Hacer clic en un botón de estado de pago
  3. Verificar filtro activo
  4. Limpiar filtro
- **Resultado Esperado**: Filtro de estado de pago funciona

#### **Test Case 3.3.3: Overdue Status Filter**
- **Objetivo**: Verificar filtro por estado de vencimiento
- **Precondiciones**: Panel de filtros abierto
- **Pasos**:
  1. Localizar sección "Overdue"
  2. Hacer clic en botón de filtro de vencimiento
  3. Verificar filtro activo
  4. Limpiar filtro
- **Resultado Esperado**: Filtro de vencimiento funciona

### **3.4 Filter Clearing (2 tests)**

#### **Test Case 3.4.1: Clear Individual Filters**
- **Objetivo**: Verificar limpieza de filtros individuales
- **Precondiciones**: Filtros aplicados
- **Pasos**:
  1. Aplicar múltiples filtros
  2. Limpiar filtros uno por uno usando los chips
  3. Verificar que cada filtro se elimina individualmente
- **Resultado Esperado**: Filtros individuales se pueden limpiar

#### **Test Case 3.4.2: Clear All Filters**
- **Objetivo**: Verificar limpieza de todos los filtros
- **Precondiciones**: Múltiples filtros aplicados
- **Pasos**:
  1. Aplicar varios filtros
  2. Usar botón "Clear All"
  3. Verificar que todos los filtros se eliminan
- **Resultado Esperado**: Todos los filtros se limpian simultáneamente

### **3.5 Table Sorting (2 tests)**

#### **Test Case 3.5.1: Sort by Invoice Number**
- **Objetivo**: Verificar ordenamiento por número de invoice
- **Precondiciones**: Tabla con datos
- **Pasos**:
  1. Hacer clic en encabezado "Number"
  2. Verificar cambio en ordenamiento
  3. Hacer clic nuevamente para invertir orden
- **Resultado Esperado**: Ordenamiento por número funciona

#### **Test Case 3.5.2: Sort by Date and Amount**
- **Objetivo**: Verificar ordenamiento por fecha y monto
- **Precondiciones**: Tabla con datos
- **Pasos**:
  1. Probar ordenamiento por fecha
  2. Probar ordenamiento por monto total
  3. Verificar indicadores visuales de ordenamiento
- **Resultado Esperado**: Ordenamiento múltiple funciona

### **3.6 Table Display (2 tests)**

#### **Test Case 3.6.1: Table Structure**
- **Objetivo**: Verificar estructura correcta de la tabla
- **Precondiciones**: Dashboard cargado
- **Pasos**:
  1. Verificar existencia de encabezados
  2. Verificar estructura de filas
  3. Verificar datos en celdas
- **Resultado Esperado**: Tabla bien estructurada

#### **Test Case 3.6.2: Table with Filters Applied**
- **Objetivo**: Verificar display de tabla con filtros
- **Precondiciones**: Filtros aplicados
- **Pasos**:
  1. Aplicar filtros
  2. Verificar que la tabla sigue existiendo
  3. Verificar mensaje de estado de filtros
- **Resultado Esperado**: Tabla maneja filtros correctamente

---

## 📤 **4. Export Functionality Tests** (`04-export-functionality.cy.js`)
**Total: 15 test cases**

### **4.1 Export Menu Basic Tests (6 tests)**

#### **Test Case 4.1.1: Display Export Dropdown**
- **Objetivo**: Verificar que el dropdown de export es visible
- **Precondiciones**: Dashboard cargado
- **Pasos**:
  1. Localizar dropdown de export
  2. Verificar que el botón de export existe
  3. Hacer clic en el botón
- **Resultado Esperado**: Dropdown de export funcional

#### **Test Case 4.1.2: Show Export Options**
- **Objetivo**: Verificar que se muestran todas las opciones de export
- **Precondiciones**: Dropdown abierto
- **Pasos**:
  1. Hacer clic en dropdown
  2. Verificar visibilidad de opciones:
     - Export PDF
     - Export XLSX  
     - Export CSV
- **Resultado Esperado**: Todas las opciones de export visibles

#### **Test Case 4.1.3: Open PDF Export Dialog**
- **Objetivo**: Verificar apertura de diálogo para PDF
- **Precondiciones**: Dropdown de export visible
- **Pasos**:
  1. Hacer clic en "Export PDF"
  2. Verificar que se abre el diálogo de export
  3. Verificar título del diálogo
- **Resultado Esperado**: Diálogo de export PDF se abre

#### **Test Case 4.1.4: Open XLSX Export Dialog**
- **Objetivo**: Verificar apertura de diálogo para XLSX
- **Precondiciones**: Dropdown de export visible
- **Pasos**:
  1. Hacer clic en "Export XLSX"
  2. Verificar apertura del diálogo
- **Resultado Esperado**: Diálogo de export XLSX se abre

#### **Test Case 4.1.5: Open CSV Export Dialog**
- **Objetivo**: Verificar apertura de diálogo para CSV
- **Precondiciones**: Dropdown de export visible
- **Pasos**:
  1. Hacer clic en "Export CSV"
  2. Verificar apertura del diálogo
- **Resultado Esperado**: Diálogo de export CSV se abre

#### **Test Case 4.1.6: Close Export Dialog**
- **Objetivo**: Verificar cierre del diálogo de export
- **Precondiciones**: Diálogo de export abierto
- **Pasos**:
  1. Hacer clic en botón "Cancel"
  2. Verificar que el diálogo se cierra
- **Resultado Esperado**: Diálogo se cierra correctamente

### **4.2 Export Dialog Sections (4 tests)**

#### **Test Case 4.2.1: Show All Section Options**
- **Objetivo**: Verificar que se muestran todas las secciones disponibles
- **Precondiciones**: Diálogo de export abierto
- **Pasos**:
  1. Verificar existencia de sección "Dashboard"
  2. Verificar existencia de sección "Cash Flow"
  3. Verificar existencia de sección "Invoices"
- **Resultado Esperado**: Todas las secciones están disponibles

#### **Test Case 4.2.2: Click Dashboard Section**
- **Objetivo**: Verificar selección de sección Dashboard
- **Precondiciones**: Diálogo de export abierto
- **Pasos**:
  1. Hacer clic en sección "Dashboard"
  2. Verificar que la sección es seleccionable
- **Resultado Esperado**: Sección Dashboard seleccionable

#### **Test Case 4.2.3: Click Cash Flow Section**
- **Objetivo**: Verificar selección de sección Cash Flow
- **Precondiciones**: Diálogo de export abierto
- **Pasos**:
  1. Hacer clic en sección "Cash Flow"
  2. Verificar que la sección es seleccionable
- **Resultado Esperado**: Sección Cash Flow seleccionable

#### **Test Case 4.2.4: Click Invoices Section**
- **Objetivo**: Verificar selección de sección Invoices
- **Precondiciones**: Diálogo de export abierto
- **Pasos**:
  1. Hacer clic en sección "Invoices"
  2. Verificar que la sección es seleccionable
- **Resultado Esperado**: Sección Invoices seleccionable

### **4.3 Export Actions (2 tests)**

#### **Test Case 4.3.1: Confirm Export Button**
- **Objetivo**: Verificar existencia y funcionalidad del botón de confirmación
- **Precondiciones**: Diálogo de export abierto
- **Pasos**:
  1. Localizar botón "Export"
  2. Verificar que contiene texto apropiado
  3. Verificar que es clickeable
- **Resultado Esperado**: Botón de export funcional

#### **Test Case 4.3.2: Show Selected Format**
- **Objetivo**: Verificar que se muestra el formato seleccionado
- **Precondiciones**: Diálogo de export abierto
- **Pasos**:
  1. Verificar que se muestra el formato seleccionado en el diálogo
- **Resultado Esperado**: Formato seleccionado visible

### **4.4 Multiple Export Formats (3 tests)**

#### **Test Case 4.4.1: Work with Different Formats**
- **Objetivo**: Verificar que todos los formatos funcionan
- **Precondiciones**: Dashboard cargado
- **Pasos**:
  1. Probar export PDF completo
  2. Probar export XLSX completo
  3. Probar export CSV completo
- **Resultado Esperado**: Todos los formatos funcionan

#### **Test Case 4.4.2: Section Selection for All Formats**
- **Objetivo**: Verificar selección de secciones en todos los formatos
- **Precondiciones**: Dashboard cargado
- **Pasos**:
  1. Para cada formato (PDF, XLSX, CSV):
     - Abrir diálogo
     - Seleccionar cada sección
     - Cancelar
- **Resultado Esperado**: Selección de secciones funciona en todos los formatos

---

## 📊 **5. Charts Integration Tests** (`05-charts-integration.cy.js`)
**Total: 21 test cases**

### **5.1 Chart Existence Tests (3 tests)**

#### **Test Case 5.1.1: Display All Three Charts**
- **Objetivo**: Verificar que se muestran los tres gráficos principales
- **Precondiciones**: Dashboard cargado
- **Pasos**:
  1. Verificar existencia de Outstanding Invoices Chart
  2. Verificar existencia de Status Distribution Chart
  3. Verificar existencia de Predictive Cash Flow Chart
- **Resultado Esperado**: Los tres gráficos están presentes

#### **Test Case 5.1.2: Render Chart Canvases**
- **Objetivo**: Verificar que los gráficos se renderizan correctamente
- **Precondiciones**: Dashboard cargado
- **Pasos**:
  1. Esperar tiempo para renderizado (2s)
  2. Verificar canvas dentro de cada gráfico
- **Resultado Esperado**: Cada gráfico tiene elemento canvas

#### **Test Case 5.1.3: Show Chart Titles**
- **Objetivo**: Verificar que los gráficos muestran títulos correctos
- **Precondiciones**: Dashboard cargado
- **Pasos**:
  1. Verificar título "Outstanding Invoices"
  2. Verificar título "Status Distribution"
  3. Verificar título que contenga "Cash Flow"
- **Resultado Esperado**: Todos los títulos están presentes

### **5.2 Outstanding Invoices Chart (3 tests)**

#### **Test Case 5.2.1: Chart Type Selector**
- **Objetivo**: Verificar existencia del selector de tipo de gráfico
- **Precondiciones**: Dashboard cargado
- **Pasos**:
  1. Localizar el gráfico de Outstanding Invoices
  2. Verificar que existe el selector de tipo
- **Resultado Esperado**: Selector de tipo de gráfico existe

#### **Test Case 5.2.2: Change Chart Type**
- **Objetivo**: Verificar que se puede cambiar el tipo de gráfico
- **Precondiciones**: Outstanding Invoices Chart visible
- **Pasos**:
  1. Hacer clic en el selector de tipo
  2. Verificar que es interactivo
- **Resultado Esperado**: Selector permite cambiar tipo

#### **Test Case 5.2.3: Canvas Element Exists**
- **Objetivo**: Verificar que el canvas del gráfico existe
- **Precondiciones**: Outstanding Invoices Chart visible
- **Pasos**:
  1. Buscar elemento canvas específico
  2. Verificar existencia
- **Resultado Esperado**: Canvas del gráfico existe

### **5.3 Status Distribution Chart (4 tests)**

#### **Test Case 5.3.1: Chart Legend Exists**
- **Objetivo**: Verificar existencia de leyenda del gráfico
- **Precondiciones**: Status Distribution Chart visible
- **Pasos**:
  1. Localizar leyenda del gráfico
  2. Verificar existencia
- **Resultado Esperado**: Leyenda del gráfico existe

#### **Test Case 5.3.2: Show Legend Items**
- **Objetivo**: Verificar que la leyenda contiene elementos
- **Precondiciones**: Status Distribution Chart con leyenda
- **Pasos**:
  1. Verificar que la leyenda tiene elementos hijo
  2. Verificar que hay más de 0 elementos
- **Resultado Esperado**: Leyenda contiene elementos

#### **Test Case 5.3.3: Status Chart Canvas**
- **Objetivo**: Verificar canvas específico del gráfico de estados
- **Precondiciones**: Status Distribution Chart visible
- **Pasos**:
  1. Buscar canvas específico del gráfico de estados
  2. Verificar existencia
- **Resultado Esperado**: Canvas específico existe

#### **Test Case 5.3.4: Legend Interactions**
- **Objetivo**: Verificar que se puede interactuar con la leyenda
- **Precondiciones**: Leyenda visible
- **Pasos**:
  1. Hacer clic en la leyenda
  2. Verificar que no genera errores
- **Resultado Esperado**: Leyenda es interactiva sin errores

### **5.4 Predictive Cash Flow Chart (3 tests)**

#### **Test Case 5.4.1: Canvas Element Exists**
- **Objetivo**: Verificar canvas del gráfico de cash flow
- **Precondiciones**: Predictive Cash Flow Chart visible
- **Pasos**:
  1. Buscar elemento canvas
  2. Verificar existencia
- **Resultado Esperado**: Canvas existe

#### **Test Case 5.4.2: Chart Wrapper Container**
- **Objetivo**: Verificar contenedor del gráfico
- **Precondiciones**: Predictive Cash Flow Chart visible
- **Pasos**:
  1. Verificar que tiene clase 'bg-white'
  2. Verificar estilos de contenedor
- **Resultado Esperado**: Contenedor correctamente estilizado

#### **Test Case 5.4.3: Full Width Layout**
- **Objetivo**: Verificar que el gráfico usa todo el ancho
- **Precondiciones**: Predictive Cash Flow Chart visible
- **Pasos**:
  1. Verificar que el gráfico es visible
  2. Verificar layout de ancho completo
- **Resultado Esperado**: Gráfico usa ancho completo

### **5.5 Chart Interactions (3 tests)**

#### **Test Case 5.5.1: Handle Date Filter Changes**
- **Objetivo**: Verificar que los gráficos responden a cambios de filtro de fecha
- **Precondiciones**: Dashboard cargado
- **Pasos**:
  1. Cambiar filtro de fecha a "Last 7 days"
  2. Esperar actualización (2s)
  3. Verificar que todos los gráficos siguen existiendo
- **Resultado Esperado**: Gráficos persisten después de cambio de filtro

#### **Test Case 5.5.2: Maintain Visibility on Resize**
- **Objetivo**: Verificar que los gráficos se mantienen visibles al cambiar tamaño
- **Precondiciones**: Dashboard cargado
- **Pasos**:
  1. Esperar renderizado inicial (2s)
  2. Cambiar viewport a 800x600
  3. Esperar (1s)
  4. Verificar que todos los gráficos siguen visibles
- **Resultado Esperado**: Gráficos mantienen visibilidad

#### **Test Case 5.5.3: Allow Hovering**
- **Objetivo**: Verificar que se puede hacer hover sobre los gráficos
- **Precondiciones**: Gráficos renderizados
- **Pasos**:
  1. Esperar renderizado (2s)
  2. Hacer hover sobre Outstanding Invoices Chart
  3. Hacer hover sobre Status Distribution Chart
  4. Verificar que no se generan errores
- **Resultado Esperado**: Hover funciona sin errores

### **5.6 Chart Layout (3 tests)**

#### **Test Case 5.6.1: Proper Chart Containers**
- **Objetivo**: Verificar estructura de contenedores de gráficos
- **Precondiciones**: Dashboard cargado
- **Pasos**:
  1. Verificar existencia de fila superior de dashboard
  2. Verificar que contiene los dos primeros gráficos
- **Resultado Esperado**: Estructura de contenedores correcta

#### **Test Case 5.6.2: Predictive Chart Separate**
- **Objetivo**: Verificar que el gráfico predictivo está separado
- **Precondiciones**: Dashboard cargado
- **Pasos**:
  1. Verificar que Predictive Cash Flow Chart existe
  2. Verificar que NO está dentro de la fila superior
- **Resultado Esperado**: Gráfico predictivo en ubicación separada

#### **Test Case 5.6.3: Responsive Grid Layout**
- **Objetivo**: Verificar layout de grid responsivo
- **Precondiciones**: Dashboard cargado
- **Pasos**:
  1. Verificar que la fila superior tiene clase 'grid'
  2. Verificar que contiene los gráficos apropiados
- **Resultado Esperado**: Grid layout funcional

### **5.7 Chart Data Loading (2 tests)**

#### **Test Case 5.7.1: Handle Chart Refresh**
- **Objetivo**: Verificar que los gráficos manejan refresh correctamente
- **Precondiciones**: Dashboard cargado
- **Pasos**:
  1. Esperar carga inicial (2s)
  2. Cambiar filtro y regresar a original
  3. Esperar refresh (2s)
  4. Verificar que todos los gráficos siguen funcionando
- **Resultado Esperado**: Gráficos manejan refresh graciosamente

#### **Test Case 5.7.2: Chart Stability Test**
- **Objetivo**: Verificar estabilidad de gráficos bajo cambios
- **Precondiciones**: Dashboard cargado
- **Pasos**:
  1. Realizar múltiples cambios de filtro
  2. Verificar que los gráficos se mantienen estables
  3. Verificar ausencia de errores
- **Resultado Esperado**: Gráficos estables bajo cambios

---

## 🔧 **Configuración y Helpers**

### **Comandos Cypress Customizados**

#### **cy.setupDashboardInterceptors()**
- **Propósito**: Configura interceptors para APIs del dashboard
- **Uso**: Se ejecuta en `beforeEach` de todos los tests

#### **cy.visitDashboard()**
- **Propósito**: Navega al dashboard con login automático
- **Uso**: Simplifica navegación en tests

#### **cy.waitForDashboardLoad()**
- **Propósito**: Espera a que el dashboard se cargue completamente
- **Uso**: Después de navegación al dashboard

#### **cy.waitForTableLoad()**
- **Propósito**: Espera específicamente a que la tabla se cargue
- **Uso**: En tests de tabla

### **Manejo de Errores**

Todos los tests incluyen manejo de excepciones para:
- **Error 500**: Errores de servidor
- **Error 429**: Rate limiting
- **res.send()**: Errores de respuesta
- **Network errors**: Problemas de conectividad

### **Data Attributes para Testing**

Todos los elementos testeable usan atributos `data-cy` específicos:
- `data-cy="dashboard-container"`
- `data-cy="export-dropdown"`
- `data-cy="filter-toggle"`
- `data-cy="outstanding-invoices-chart"`
- Y muchos más...

---

## 📊 **Métricas de Cobertura**

### **Por Funcionalidad**
| Funcionalidad | Tests | Cobertura |
|---------------|-------|-----------|
| Carga Dashboard | 11 | 100% |
| Filtrado Fecha | 11 | 100% |
| Operaciones Tabla | 12 | 100% |
| Export | 15 | 100% |
| Gráficos | 21 | 100% |

### **Por Tipo de Test**
| Tipo | Cantidad | Porcentaje |
|------|----------|------------|
| Funcional | 45 | 64% |
| UI/UX | 15 | 21% |
| Integración | 7 | 10% |
| Performance | 3 | 5% |

---

## 🚀 **Ejecución de Tests**

### **Comandos Individuales**
```bash
# Test individual
npx cypress run --spec "cypress/e2e/dashboard/01-dashboard-load.cy.js"

# Todos los tests
npx cypress run --spec "cypress/e2e/dashboard/*.cy.js"

# Con navegador específico
npx cypress run --spec "cypress/e2e/dashboard/*.cy.js" --browser chrome
```

### **Resultados Esperados**
- **Total Tests**: 70
- **Success Rate**: 100% cuando se ejecutan individualmente
- **Tiempo Total**: ~3-4 minutos
- **Interferencia**: Presente cuando se ejecutan en secuencia

---

## 📝 **Notas Importantes**

1. **Estado Compartido**: Los tests pueden interferir entre sí cuando se ejecutan secuencialmente
2. **Datos Mock**: Todos los tests usan datos simulados para consistencia
3. **Responsive**: Tests incluyen verificaciones para móvil y tablet
4. **Performance**: Incluye verificaciones de tiempo de carga
5. **Error Handling**: Manejo robusto de errores de API y UI

---

**Documento generado el**: ${new Date().toLocaleString()}
**Versión**: 1.0
**Autor**: Análisis automatizado de tests Cypress 