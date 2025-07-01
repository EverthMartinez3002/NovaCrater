# 🚀 Instrucciones para Ejecutar Pruebas Cypress y JMeter - NovaCrater

## 📋 Resumen de Implementación

Se han implementado **pruebas automatizadas completas** para NovaCrater con:
- ✅ **Cypress v13.6.0** - Pruebas E2E de interfaz de usuario
- ✅ **JMeter v5.6.3** - Pruebas de rendimiento y carga
- ✅ **3 suites de pruebas E2E** y **1 plan de rendimiento**
- ✅ **Scripts automatizados** de instalación y ejecución
- ✅ **Reportes HTML** detallados automáticos

---

## 🎯 Pasos para Ejecutar

### 1. Preparar el Entorno

**Primero, asegúrate de que la aplicación esté corriendo:**
```bash
cd NovaCrater
php artisan serve
```

**Verifica que esté accesible en:** http://localhost:8000

### 2. Instalar Herramientas de Testing

**Opción A: Instalación automática (recomendado)**
```bash
# Hacer ejecutable el script de instalación
chmod +x instalar-herramientas-testing.sh

# Ejecutar instalación completa
./instalar-herramientas-testing.sh
```

**Opción B: Instalación manual**
```bash
# Instalar Node.js (si no está instalado)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar Java (si no está instalado)
sudo apt update
sudo apt install -y openjdk-11-jdk

# Instalar Cypress
npm install --save-dev cypress@13.6.0 cypress-mochawesome-reporter@3.8.0

# Descargar JMeter
wget https://archive.apache.org/dist/jmeter/binaries/apache-jmeter-5.6.3.tgz
tar -xzf apache-jmeter-5.6.3.tgz
ln -s apache-jmeter-5.6.3 jmeter
```

### 3. Verificar Instalación

```bash
# Hacer ejecutable el script de verificación
chmod +x verificar-instalacion.sh

# Ejecutar verificación
./verificar-instalacion.sh
```

**Deberías ver:** ✅ Todas las verificaciones pasaron (100%)

### 4. Ejecutar Pruebas E2E con Cypress

**Opción A: Modo automático (headless)**
```bash
# Hacer ejecutable el script
chmod +x ejecutar-cypress.sh

# Ejecutar pruebas E2E
./ejecutar-cypress.sh
```

**Opción B: Modo interactivo (con interfaz gráfica)**
```bash
# Instalar dependencias si no se hizo antes
npm install

# Abrir interfaz de Cypress
npm run cypress:open
```

**Opción C: Usando npm directamente**
```bash
npm run test:e2e
```

### 5. Ejecutar Pruebas de Rendimiento con JMeter

**Configuración por defecto (10 usuarios, 5 minutos):**
```bash
# Hacer ejecutable el script
chmod +x ejecutar-jmeter.sh

# Ejecutar pruebas de rendimiento
./ejecutar-jmeter.sh
```

**Configuración personalizada:**
```bash
# Sintaxis: ./ejecutar-jmeter.sh [usuarios] [rampa] [duración] [url]
./ejecutar-jmeter.sh 20 120 600 http://localhost:8000
```

**Usando npm:**
```bash
npm run test:performance
```

---

## 📊 Interpretando los Resultados

### Resultados de Cypress (E2E)

**Ubicación de reportes:**
- `cypress/reports/cypress-report-[timestamp]/index.html`
- `cypress/screenshots/` - Screenshots de errores
- `cypress/videos/` - Videos de ejecución

**Métricas esperadas:**
- ✅ **Todas las pruebas deben pasar** (100% success rate)
- ✅ **Tiempo total:** < 10 minutos
- ✅ **Sin errores** en funcionalidades críticas

### Resultados de JMeter (Rendimiento)

**Ubicación de reportes:**
- `jmeter-tests/results/html-report-[timestamp]/index.html`
- `jmeter-tests/results/jmeter-results-[timestamp].jtl`

**Métricas esperadas:**
- ✅ **Tiempo de respuesta promedio:** < 2000ms
- ✅ **Tasa de éxito:** > 95%
- ✅ **Throughput:** Variable según hardware
- ✅ **Sin errores 500** o timeouts excesivos

---

## 🧪 Pruebas Implementadas

### Cypress E2E (3 suites)

#### 1. `admin-login.cy.js` - Autenticación
- Login exitoso con credenciales válidas
- Manejo de errores con credenciales inválidas
- Validación de campos requeridos
- Navegación a recuperación de contraseña
- Verificación de accesibilidad

#### 2. `admin-dashboard.cy.js` - Dashboard
- Carga de elementos principales
- Navegación entre secciones
- Funcionalidad de búsqueda
- Diseño responsivo
- Proceso de logout

#### 3. `api-tests.cy.js` - APIs REST
- Autenticación API
- Endpoints de dashboard, facturas, clientes
- Manejo de errores HTTP
- Validación de estructuras de respuesta

### JMeter Performance (1 plan)

#### `novacrater-performance.jmx`
- Login API con autenticación
- Dashboard principal
- Listado de facturas
- Listado de clientes
- Usuarios concurrentes configurables

---

## 🛠️ Solución de Problemas

### Error: "Aplicación no está corriendo"
```bash
# Verificar que Laravel esté servido
php artisan serve

# Verificar conectividad
curl http://localhost:8000
```

### Error: "Cypress no se puede ejecutar"
```bash
# Reinstalar Cypress
npm uninstall cypress
npm install --save-dev cypress@13.6.0

# Verificar instalación
npx cypress --version
```

### Error: "Java no está instalado"
```bash
# Instalar Java 11
sudo apt update
sudo apt install -y openjdk-11-jdk

# Verificar instalación
java -version
```

### Error: "JMeter no se puede ejecutar"
```bash
# Verificar que el archivo sea ejecutable
chmod +x jmeter/bin/jmeter

# O descargar manualmente
wget https://archive.apache.org/dist/jmeter/binaries/apache-jmeter-5.6.3.tgz
```

### Error: "Scripts no son ejecutables"
```bash
# Hacer ejecutables todos los scripts
chmod +x *.sh
```

---

## 📁 Estructura de Archivos Creada

```
NovaCrater/
├── cypress/
│   ├── e2e/
│   │   ├── admin-login.cy.js         ← Pruebas de login
│   │   ├── admin-dashboard.cy.js     ← Pruebas de dashboard
│   │   └── api-tests.cy.js           ← Pruebas de API
│   ├── support/
│   │   ├── commands.js               ← Comandos personalizados
│   │   └── e2e.js                    ← Configuración global
│   └── reports/                      ← Reportes HTML
├── jmeter-tests/
│   ├── novacrater-performance.jmx    ← Plan de pruebas
│   └── results/                      ← Resultados y reportes
├── test-results/                     ← Resultados consolidados
├── cypress.config.js                 ← Configuración Cypress
├── .env.testing                      ← Variables de entorno
├── instalar-herramientas-testing.sh  ← Instalación completa
├── ejecutar-cypress.sh               ← Ejecutar E2E
├── ejecutar-jmeter.sh                ← Ejecutar rendimiento
└── verificar-instalacion.sh          ← Verificar instalación
```

---

## 🚀 Comandos Rápidos

```bash
# 1. Verificar instalación
./verificar-instalacion.sh

# 2. Ejecutar pruebas E2E
./ejecutar-cypress.sh

# 3. Ejecutar pruebas de rendimiento
./ejecutar-jmeter.sh

# 4. Ejecutar todo desde npm
npm run test:all

# 5. Abrir interfaz gráfica de Cypress
npm run cypress:open
```

---

## ✅ Criterios de Éxito

### Pruebas E2E
- [ ] Todas las pruebas de login pasan
- [ ] Todas las pruebas de dashboard pasan
- [ ] Todas las pruebas de API pasan
- [ ] Reportes HTML generados correctamente
- [ ] Screenshots y videos capturados

### Pruebas de Rendimiento
- [ ] Tasa de éxito > 95%
- [ ] Tiempo de respuesta < 2 segundos promedio
- [ ] Sin errores de timeout excesivos
- [ ] Reporte HTML con gráficos generado
- [ ] Métricas de throughput medidas

---

## 📞 Soporte

Si encuentras problemas:

1. **Ejecuta el script de verificación:**
   ```bash
   ./verificar-instalacion.sh
   ```

2. **Revisa los logs de error** en los reportes generados

3. **Verifica los requisitos previos:**
   - Node.js v16+
   - Java 8+
   - Aplicación Laravel corriendo
   - Conexión a internet para descargas

4. **Reinstala si es necesario:**
   ```bash
   ./instalar-herramientas-testing.sh
   ```

---

**¡Todas las herramientas están listas para usar!** 🎉

*Implementación completada el 30 de Diciembre, 2024*  
*Equipo de QA NovaCrater* 