# Controles y Evidencia de Pruebas E2E y Rendimiento - NovaCrater

## 📋 Información General

**Proyecto:** NovaCrater (Fork de InvoiceShelf)  
**Framework de Aplicación:** Laravel 10.x  
**Herramientas de Testing:** Cypress v13.6.0 + JMeter v5.6.3  
**Fecha de Implementación:** 30 de Diciembre, 2024  
**Responsable:** Equipo de QA NovaCrater  

---

## 🎯 Objetivo

Implementar y documentar un conjunto completo de pruebas automatizadas que incluyen:
- **Pruebas E2E (End-to-End)** con Cypress para validar funcionalidad de interfaz de usuario
- **Pruebas de Rendimiento** con JMeter para evaluar comportamiento bajo carga
- **Pruebas de API** para verificar endpoints REST
- **Documentación y reportes** detallados de todos los resultados

---

## 🛠️ Herramientas Implementadas

### Cypress v13.6.0
- **Propósito:** Pruebas End-to-End automatizadas
- **Características:**
  - Ejecución en navegador real (Electron, Chrome, Firefox)
  - Grabación de videos automática
  - Screenshots en errores
  - Reportes HTML detallados con cypress-mochawesome-reporter
  - Comandos personalizados para NovaCrater

### Apache JMeter v5.6.3
- **Propósito:** Pruebas de rendimiento y carga
- **Características:**
  - Simulación de usuarios concurrentes
  - Medición de tiempos de respuesta
  - Análisis de throughput
  - Reportes HTML con gráficos
  - Configuración parameterizable

---

## 📁 Estructura de Archivos

```
NovaCrater/
├── cypress/                           # Configuración Cypress
│   ├── e2e/                          # Archivos de prueba E2E
│   │   ├── admin-login.cy.js         # Pruebas de autenticación
│   │   ├── admin-dashboard.cy.js     # Pruebas del dashboard
│   │   └── api-tests.cy.js           # Pruebas de API REST
│   ├── support/                      # Archivos de soporte
│   │   ├── commands.js               # Comandos personalizados
│   │   └── e2e.js                    # Configuración global
│   ├── downloads/                    # Descargas durante pruebas
│   ├── screenshots/                  # Screenshots automáticos
│   ├── videos/                       # Videos de ejecución
│   └── reports/                      # Reportes de resultados
├── jmeter-tests/                     # Configuración JMeter
│   ├── novacrater-performance.jmx    # Plan principal de pruebas
│   └── results/                      # Resultados de ejecución
├── test-results/                     # Resultados consolidados
├── cypress.config.js                 # Configuración principal Cypress
├── .env.testing                      # Variables de entorno para pruebas
├── instalar-herramientas-testing.sh  # Script maestro de instalación
├── ejecutar-cypress.sh               # Script de ejecución E2E
└── ejecutar-jmeter.sh                # Script de ejecución rendimiento
```

---

## 🧪 Tipos de Pruebas Implementadas

### 1. Pruebas E2E de Interfaz de Usuario

#### A. Pruebas de Autenticación (`admin-login.cy.js`)
- ✅ Visualización de elementos del formulario de login
- ✅ Login exitoso con credenciales válidas
- ✅ Manejo de errores con credenciales inválidas
- ✅ Validación de campos requeridos
- ✅ Navegación a recuperación de contraseña
- ✅ Verificación de accesibilidad del formulario

#### B. Pruebas del Dashboard (`admin-dashboard.cy.js`)
- ✅ Carga y visualización de elementos principales
- ✅ Verificación de datos del dashboard vía API
- ✅ Navegación a sección de facturas
- ✅ Navegación a sección de clientes
- ✅ Navegación a sección de estimaciones
- ✅ Funcionalidad de búsqueda global
- ✅ Visualización de actividades recientes
- ✅ Diseño responsivo en diferentes dispositivos
- ✅ Proceso de logout
- ✅ Presencia de gráficos o visualizaciones

### 2. Pruebas de API REST (`api-tests.cy.js`)

#### A. Autenticación API
- ✅ Login exitoso vía API con retorno de token
- ✅ Fallo de login con credenciales inválidas

#### B. Dashboard API
- ✅ Obtención de datos del dashboard
- ✅ Aplicación de filtro activo

#### C. Facturas API
- ✅ Listado de facturas
- ✅ Creación de nueva factura
- ✅ Consulta de factura específica
- ✅ Filtrado por estado

#### D. Clientes API
- ✅ Listado de clientes
- ✅ Creación de nuevo cliente

#### E. Estimaciones API
- ✅ Listado de estimaciones

#### F. Configuración API
- ✅ Obtención de configuración de idiomas
- ✅ Obtención de configuración de años fiscales

#### G. Manejo de Errores
- ✅ Respuesta 401 para requests no autorizados
- ✅ Respuesta 404 para endpoints inexistentes
- ✅ Manejo de requests malformados

### 3. Pruebas de Rendimiento con JMeter

#### A. Configuración de Carga
- **Usuarios Concurrentes:** 10 (configurable)
- **Tiempo de Rampa:** 60 segundos (configurable)
- **Duración Total:** 300 segundos (configurable)
- **Think Time:** 1 segundo entre requests

#### B. Endpoints Probados
- ✅ `POST /api/v1/auth/login` - Autenticación
- ✅ `GET /api/v1/dashboard` - Dashboard principal
- ✅ `GET /api/v1/invoices` - Listado de facturas
- ✅ `GET /api/v1/customers` - Listado de clientes

#### C. Métricas Evaluadas
- ✅ Tiempo de respuesta promedio
- ✅ Throughput (requests por segundo)
- ✅ Tasa de éxito/error
- ✅ Tiempo de conexión
- ✅ Latencia
- ✅ Percentiles de tiempo de respuesta

---

## 🔧 Comandos Personalizados de Cypress

### Comandos de Autenticación
```javascript
cy.login(email, password)          // Login admin
cy.loginCustomer(email, password)  // Login cliente
cy.apiLogin()                      // Login vía API
```

### Comandos de API
```javascript
cy.apiRequest(method, endpoint, body, token)  // Request genérico
```

### Comandos de Utilidad
```javascript
cy.waitForPageLoad()      // Esperar carga completa
cy.cleanupTestData()      // Limpiar datos de sesión
cy.createInvoice(customer) // Crear factura de prueba
```

---

## 📊 Configuración de Reportes

### Cypress
- **Formato:** HTML con cypress-mochawesome-reporter
- **Incluye:** Screenshots, videos, detalles de errores
- **Ubicación:** `cypress/reports/cypress-report-[timestamp]/`

### JMeter
- **Formato:** HTML con gráficos dinámicos
- **Incluye:** Estadísticas, gráficos de rendimiento, tendencias
- **Ubicación:** `jmeter-tests/results/html-report-[timestamp]/`

---

## 🚀 Instrucciones de Ejecución

### Instalación Inicial
```bash
# Ejecutar script maestro de instalación
./instalar-herramientas-testing.sh
```

### Ejecución de Pruebas E2E
```bash
# Modo headless (sin interfaz gráfica)
./ejecutar-cypress.sh

# Modo interactivo (con interfaz gráfica)
npm run cypress:open
```

### Ejecución de Pruebas de Rendimiento
```bash
# Configuración por defecto (10 usuarios, 5 minutos)
./ejecutar-jmeter.sh

# Configuración personalizada
./ejecutar-jmeter.sh [usuarios] [rampa] [duración] [url]
# Ejemplo: ./ejecutar-jmeter.sh 20 120 600 http://localhost:8000
```

### Scripts NPM Disponibles
```bash
npm run cypress              # Ejecutar E2E headless
npm run cypress:open         # Abrir interfaz de Cypress
npm run test:e2e            # Ejecutar pruebas E2E
npm run test:performance    # Ejecutar pruebas de rendimiento
npm run test:all            # Ejecutar todas las pruebas
```

---

## 📋 Requisitos Previos

### Sistema
- ✅ Node.js v16+ y npm
- ✅ Java 8+ (para JMeter)
- ✅ Ubuntu/Linux (recomendado)
- ✅ Navegador Chromium/Chrome

### Aplicación
- ✅ Laravel servido en `http://localhost:8000`
- ✅ Base de datos con datos de prueba
- ✅ Usuario admin: `admin@invoiceshelf.com` / `admin@123`

---

## 🔍 Validaciones y Aserciones

### Pruebas E2E
- **Visuales:** Presencia de elementos UI
- **Funcionales:** Comportamiento esperado
- **De navegación:** URLs correctas
- **De datos:** Contenido apropiado
- **De accesibilidad:** Atributos HTML correctos

### Pruebas de API
- **Códigos de estado:** 200, 401, 404, 422
- **Estructura de respuesta:** Propiedades requeridas
- **Tipos de datos:** Validación de tipos
- **Autenticación:** Tokens válidos
- **Paginación:** Metadatos correctos

### Pruebas de Rendimiento
- **Tiempo de respuesta:** < 2000ms promedio
- **Tasa de éxito:** > 95%
- **Throughput:** Medición de requests/segundo
- **Estabilidad:** Sin degradación durante prueba

---

## 📈 Métricas de Calidad Esperadas

### Criterios de Aceptación E2E
- ✅ **100% de pruebas pasando** en ambiente limpio
- ✅ **Tiempo de ejecución** < 10 minutos total
- ✅ **Cobertura de funcionalidad** crítica: 100%
- ✅ **Reportes generados** automáticamente

### Criterios de Aceptación Rendimiento
- ✅ **Tiempo de respuesta promedio** < 2 segundos
- ✅ **Tasa de éxito** > 95%
- ✅ **Estabilidad** sin memoria leaks o errores 500
- ✅ **Concurrencia** mínima de 10 usuarios simultáneos

---

## 🔄 Integración Continua

### Recomendaciones para CI/CD
```yaml
# Ejemplo para GitHub Actions
- name: Run E2E Tests
  run: |
    npm install
    ./ejecutar-cypress.sh

- name: Run Performance Tests
  run: |
    ./ejecutar-jmeter.sh 5 30 180
```

### Archivos de Configuración
- `.env.testing` - Variables específicas para testing
- `cypress.config.js` - Configuración detallada de Cypress
- `package.json` - Scripts npm automatizados

---

## 📝 Mantenimiento y Evolución

### Actualización de Pruebas
- **Frecuencia:** Con cada nueva funcionalidad
- **Revisión:** Mensual de estabilidad
- **Optimización:** Trimestral de rendimiento

### Nuevas Pruebas Recomendadas
- Pruebas de regresión automatizadas
- Pruebas de seguridad con OWASP ZAP
- Pruebas de accesibilidad con axe-core
- Pruebas móviles con dispositivos reales

---

## ✅ Certificación Final

Este documento certifica que el proyecto **NovaCrater** cuenta con:

- ✅ **Suite completa de pruebas E2E** con Cypress
- ✅ **Suite completa de pruebas de rendimiento** con JMeter  
- ✅ **Pruebas de API REST** exhaustivas
- ✅ **Scripts automatizados** de instalación y ejecución
- ✅ **Documentación detallada** de configuración y uso
- ✅ **Reportes automatizados** HTML con métricas
- ✅ **Configuración para CI/CD** preparada

**Total de archivos de prueba:** 3 suites E2E + 1 plan JMeter  
**Cobertura funcional:** Autenticación, Dashboard, API, Rendimiento  
**Herramientas:** Cypress v13.6.0 + JMeter v5.6.3  

---

**Equipo de QA NovaCrater**  
*Implementación completada el 30 de Diciembre, 2024* 