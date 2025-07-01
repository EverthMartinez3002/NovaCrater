#!/bin/bash

# Script de Instalación de Cypress y JMeter para NovaCrater
# Autor: Equipo de QA NovaCrater
# Fecha: 30 de Diciembre, 2024

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Funciones de logging
log_info() {
    echo -e "${BLUE}ℹ️  INFO: $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ ÉXITO: $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  ADVERTENCIA: $1${NC}"
}

log_error() {
    echo -e "${RED}❌ ERROR: $1${NC}"
}

log_step() {
    echo -e "${CYAN}🔧 $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [[ ! -f "package.json" ]] || [[ ! -f "composer.json" ]]; then
    log_error "No se encuentra package.json o composer.json. ¿Estás en el directorio raíz de NovaCrater?"
    exit 1
fi

log_info "Iniciando instalación de herramientas de prueba para NovaCrater"
echo "=============================================================="

# Crear directorios necesarios
log_step "Creando directorios necesarios..."
mkdir -p cypress/downloads
mkdir -p cypress/screenshots
mkdir -p cypress/videos
mkdir -p cypress/reports
mkdir -p jmeter-tests/results
mkdir -p test-results

# Verificar Node.js y npm
log_step "Verificando instalación de Node.js..."
if ! command -v node &> /dev/null; then
    log_error "Node.js no está instalado. Por favor instala Node.js primero."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    log_error "npm no está instalado. Por favor instala npm primero."
    exit 1
fi

NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
log_info "Node.js versión: $NODE_VERSION"
log_info "npm versión: $NPM_VERSION"

# Instalar dependencias de Cypress
log_step "Instalando Cypress y dependencias..."
npm install --save-dev cypress@13.6.0
npm install --save-dev cypress-mochawesome-reporter@3.8.0
npm install --save-dev @cypress/code-coverage@3.12.0

if [ $? -eq 0 ]; then
    log_success "Cypress instalado correctamente"
else
    log_error "Error al instalar Cypress"
    exit 1
fi

# Verificar instalación de Java para JMeter
log_step "Verificando instalación de Java..."
if ! command -v java &> /dev/null; then
    log_warning "Java no está instalado. Instalando Java..."
    
    # Actualizar repositorios
    sudo apt update
    
    # Instalar OpenJDK 11
    sudo apt install -y openjdk-11-jdk
    
    if [ $? -eq 0 ]; then
        log_success "Java instalado correctamente"
    else
        log_error "Error al instalar Java"
        exit 1
    fi
else
    JAVA_VERSION=$(java -version 2>&1 | head -n 1)
    log_info "Java versión: $JAVA_VERSION"
fi

# Instalar JMeter
log_step "Instalando Apache JMeter..."
JMETER_VERSION="5.6.3"
JMETER_DIR="apache-jmeter-$JMETER_VERSION"
JMETER_TAR="$JMETER_DIR.tgz"

# Descargar JMeter si no existe
if [ ! -d "$JMETER_DIR" ]; then
    log_info "Descargando JMeter $JMETER_VERSION..."
    wget "https://archive.apache.org/dist/jmeter/binaries/$JMETER_TAR"
    
    if [ $? -eq 0 ]; then
        log_info "Extrayendo JMeter..."
        tar -xzf "$JMETER_TAR"
        rm "$JMETER_TAR"
        log_success "JMeter descargado y extraído correctamente"
    else
        log_error "Error al descargar JMeter"
        exit 1
    fi
else
    log_info "JMeter ya está descargado"
fi

# Crear enlace simbólico para JMeter
if [ ! -L "jmeter" ]; then
    ln -s "$JMETER_DIR" jmeter
    log_success "Enlace simbólico a JMeter creado"
fi

# Hacer ejecutable el script de JMeter
chmod +x "$JMETER_DIR/bin/jmeter"

# Actualizar package.json con scripts de prueba
log_step "Actualizando package.json con scripts de prueba..."

# Crear backup del package.json
cp package.json package.json.backup

# Usar jq para agregar scripts si está disponible, sino usar sed
if command -v jq &> /dev/null; then
    jq '.scripts.cypress = "cypress run"' package.json > package.json.tmp && mv package.json.tmp package.json
    jq '.scripts."cypress:open" = "cypress open"' package.json > package.json.tmp && mv package.json.tmp package.json
    jq '.scripts."test:e2e" = "npm run cypress"' package.json > package.json.tmp && mv package.json.tmp package.json
    jq '.scripts."test:performance" = "./jmeter/bin/jmeter -n -t jmeter-tests/novacrater-performance.jmx -l test-results/jmeter-results.jtl"' package.json > package.json.tmp && mv package.json.tmp package.json
else
    log_warning "jq no está disponible. Los scripts se deben agregar manualmente a package.json"
fi

# Configurar variables de entorno
log_step "Configurando variables de entorno..."
echo "# Variables de entorno para pruebas" > .env.testing
echo "CYPRESS_BASE_URL=http://localhost:8000" >> .env.testing
echo "CYPRESS_API_URL=http://localhost:8000/api/v1" >> .env.testing
echo "CYPRESS_ADMIN_EMAIL=admin@invoiceshelf.com" >> .env.testing
echo "CYPRESS_ADMIN_PASSWORD=admin@123" >> .env.testing

# Verificar instalaciones
log_step "Verificando instalaciones..."
echo "--------------------------------------"

# Verificar Cypress
if npx cypress --version &> /dev/null; then
    CYPRESS_VERSION=$(npx cypress --version 2>/dev/null | head -n 1)
    log_success "Cypress: $CYPRESS_VERSION"
else
    log_error "Cypress no se instaló correctamente"
fi

# Verificar JMeter
if [ -f "$JMETER_DIR/bin/jmeter" ]; then
    JMETER_VERSION_CHECK=$(./$JMETER_DIR/bin/jmeter --version 2>/dev/null | head -n 1)
    log_success "JMeter: $JMETER_VERSION_CHECK"
else
    log_error "JMeter no se instaló correctamente"
fi

# Mostrar resumen
echo "=============================================================="
log_success "INSTALACIÓN COMPLETADA EXITOSAMENTE"
echo "=============================================================="
echo ""
log_info "HERRAMIENTAS INSTALADAS:"
echo "• Cypress v13.6.0 - Pruebas E2E"
echo "• JMeter v5.6.3 - Pruebas de rendimiento"
echo "• cypress-mochawesome-reporter - Reportes HTML"
echo ""
log_info "ESTRUCTURA DE DIRECTORIOS CREADA:"
echo "• cypress/ - Configuración y pruebas de Cypress"
echo "• jmeter-tests/ - Planes de prueba de JMeter"
echo "• test-results/ - Resultados de todas las pruebas"
echo ""
log_info "ARCHIVOS DE CONFIGURACIÓN:"
echo "• cypress.config.js - Configuración de Cypress"
echo "• .env.testing - Variables de entorno para pruebas"
echo ""
log_info "COMANDOS DISPONIBLES:"
echo "• npm run cypress - Ejecutar pruebas E2E en modo headless"
echo "• npm run cypress:open - Abrir interfaz gráfica de Cypress"
echo "• npm run test:e2e - Ejecutar todas las pruebas E2E"
echo "• npm run test:performance - Ejecutar pruebas de rendimiento"
echo ""
log_info "PRÓXIMOS PASOS:"
echo "1. Asegúrate de que la aplicación esté corriendo en http://localhost:8000"
echo "2. Ejecuta: npm run cypress:open (para modo interactivo)"
echo "3. O ejecuta: npm run test:e2e (para modo headless)"
echo "4. Para pruebas de rendimiento: npm run test:performance"
echo ""
log_warning "IMPORTANTE: Asegúrate de tener la aplicación Laravel corriendo antes de ejecutar las pruebas"
echo "=============================================================="

log_success "¡Instalación completada! Ahora puedes ejecutar pruebas E2E y de rendimiento." 