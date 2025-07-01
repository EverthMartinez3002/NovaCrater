#!/bin/bash

# Script Maestro de Instalación - Cypress y JMeter para NovaCrater
# Autor: Equipo de QA NovaCrater
# Fecha: 30 de Diciembre, 2024

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}ℹ️  INFO: $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ ÉXITO: $1${NC}"
}

log_error() {
    echo -e "${RED}❌ ERROR: $1${NC}"
}

log_step() {
    echo -e "${CYAN}🔧 $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  ADVERTENCIA: $1${NC}"
}

echo "================================================================"
log_info "INSTALACIÓN DE HERRAMIENTAS DE TESTING - NOVACRATER"
echo "================================================================"
echo ""
log_info "Este script instalará:"
echo "• Cypress v13.6.0 - Pruebas E2E automatizadas"
echo "• JMeter v5.6.3 - Pruebas de rendimiento y carga"
echo "• Dependencias y configuraciones necesarias"
echo ""

# Verificar que estamos en el directorio correcto
if [[ ! -f "package.json" ]] || [[ ! -f "composer.json" ]]; then
    log_error "No se encuentra package.json o composer.json. ¿Estás en el directorio raíz de NovaCrater?"
    exit 1
fi

log_success "Directorio correcto detectado: $(pwd)"
echo ""

# Crear estructura de directorios
log_step "Creando estructura de directorios..."
mkdir -p cypress/{downloads,screenshots,videos,reports,e2e,support}
mkdir -p jmeter-tests/results
mkdir -p test-results
log_success "Directorios creados correctamente"

# ========================================
# INSTALACIÓN DE NODE.JS Y NPM
# ========================================
log_step "Verificando Node.js y npm..."

if ! command -v node &> /dev/null; then
    log_warning "Node.js no está instalado. Instalando Node.js..."
    
    # Instalar Node.js via NodeSource
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    
    if [ $? -eq 0 ]; then
        log_success "Node.js instalado correctamente"
    else
        log_error "Error al instalar Node.js"
        exit 1
    fi
fi

NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
log_success "Node.js $NODE_VERSION y npm $NPM_VERSION disponibles"

# ========================================
# INSTALACIÓN DE CYPRESS
# ========================================
echo ""
log_step "Instalando Cypress y dependencias..."

# Instalar dependencias de desarrollo para Cypress
npm install --save-dev \
    cypress@13.6.0 \
    cypress-mochawesome-reporter@3.8.0 \
    @cypress/code-coverage@3.12.0

if [ $? -eq 0 ]; then
    log_success "Cypress instalado correctamente"
else
    log_error "Error al instalar Cypress"
    exit 1
fi

# Verificar instalación de Cypress
if npx cypress --version &> /dev/null; then
    CYPRESS_VERSION=$(npx cypress --version 2>/dev/null | head -n 1)
    log_success "Cypress verificado: $CYPRESS_VERSION"
else
    log_warning "Cypress instalado pero no se puede verificar la versión"
fi

# ========================================
# INSTALACIÓN DE JAVA (PARA JMETER)
# ========================================
echo ""
log_step "Verificando Java para JMeter..."

if ! command -v java &> /dev/null; then
    log_warning "Java no está instalado. Instalando OpenJDK 11..."
    
    sudo apt update
    sudo apt install -y openjdk-11-jdk
    
    if [ $? -eq 0 ]; then
        log_success "Java instalado correctamente"
    else
        log_error "Error al instalar Java"
        exit 1
    fi
fi

JAVA_VERSION=$(java -version 2>&1 | head -n 1)
log_success "Java disponible: $JAVA_VERSION"

# ========================================
# INSTALACIÓN DE JMETER
# ========================================
echo ""
log_step "Instalando Apache JMeter..."

JMETER_VERSION="5.6.3"
JMETER_DIR="apache-jmeter-$JMETER_VERSION"
JMETER_TAR="$JMETER_DIR.tgz"

if [ ! -d "$JMETER_DIR" ] && [ ! -L "jmeter" ]; then
    log_info "Descargando JMeter $JMETER_VERSION..."
    
    # Descargar JMeter
    wget -q --show-progress "https://archive.apache.org/dist/jmeter/binaries/$JMETER_TAR"
    
    if [ $? -eq 0 ]; then
        log_info "Extrayendo JMeter..."
        tar -xzf "$JMETER_TAR"
        rm "$JMETER_TAR"
        
        # Crear enlace simbólico
        ln -s "$JMETER_DIR" jmeter
        
        # Hacer ejecutable
        chmod +x "$JMETER_DIR/bin/jmeter"
        
        log_success "JMeter instalado correctamente"
    else
        log_error "Error al descargar JMeter"
        exit 1
    fi
else
    log_info "JMeter ya está instalado"
fi

# Verificar JMeter
if [ -f "jmeter/bin/jmeter" ] || [ -f "$JMETER_DIR/bin/jmeter" ]; then
    log_success "JMeter verificado correctamente"
else
    log_error "JMeter no se pudo verificar"
    exit 1
fi

# ========================================
# CONFIGURACIÓN DE PACKAGE.JSON
# ========================================
echo ""
log_step "Actualizando package.json con scripts de prueba..."

# Crear backup
cp package.json package.json.backup

# Agregar scripts usando Node.js si jq no está disponible
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts = pkg.scripts || {};
pkg.scripts['cypress'] = 'cypress run';
pkg.scripts['cypress:open'] = 'cypress open';
pkg.scripts['test:e2e'] = 'npm run cypress';
pkg.scripts['test:e2e:open'] = 'npm run cypress:open';
pkg.scripts['test:performance'] = './ejecutar-jmeter.sh';
pkg.scripts['test:cypress'] = './ejecutar-cypress.sh';
pkg.scripts['test:all'] = 'npm run test:e2e && npm run test:performance';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

log_success "Scripts agregados a package.json"

# ========================================
# CONFIGURACIÓN DE VARIABLES DE ENTORNO
# ========================================
log_step "Configurando variables de entorno..."

cat > .env.testing << EOL
# Variables de entorno para pruebas E2E y de rendimiento
CYPRESS_BASE_URL=http://localhost:8000
CYPRESS_API_URL=http://localhost:8000/api/v1
CYPRESS_ADMIN_EMAIL=admin@invoiceshelf.com
CYPRESS_ADMIN_PASSWORD=admin@123

# Configuración de JMeter
JMETER_USERS=10
JMETER_RAMP_UP=60
JMETER_DURATION=300
JMETER_BASE_URL=http://localhost:8000
EOL

log_success "Archivo .env.testing creado"

# ========================================
# HACER EJECUTABLES LOS SCRIPTS
# ========================================
log_step "Configurando permisos de scripts..."

chmod +x ejecutar-cypress.sh
chmod +x ejecutar-jmeter.sh
chmod +x instalar-herramientas-testing.sh

log_success "Scripts configurados como ejecutables"

# ========================================
# VERIFICACIONES FINALES
# ========================================
echo ""
log_step "Ejecutando verificaciones finales..."

# Verificar estructura de directorios
DIRECTORIES=("cypress/e2e" "cypress/support" "jmeter-tests" "test-results")
for dir in "${DIRECTORIES[@]}"; do
    if [ -d "$dir" ]; then
        log_success "Directorio $dir ✓"
    else
        log_error "Directorio $dir ✗"
    fi
done

# Verificar archivos de configuración
FILES=("cypress.config.js" "cypress/support/e2e.js" "cypress/support/commands.js" "jmeter-tests/novacrater-performance.jmx")
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        log_success "Archivo $file ✓"
    else
        log_error "Archivo $file ✗"
    fi
done

# Contar pruebas E2E
E2E_TESTS=$(find cypress/e2e -name "*.cy.js" 2>/dev/null | wc -l)
log_info "Pruebas E2E detectadas: $E2E_TESTS archivos"

# ========================================
# RESUMEN FINAL
# ========================================
echo ""
echo "================================================================"
log_success "INSTALACIÓN COMPLETADA EXITOSAMENTE"
echo "================================================================"
echo ""

log_info "HERRAMIENTAS INSTALADAS:"
echo "✅ Cypress v13.6.0 - Pruebas E2E automatizadas"
echo "✅ JMeter v5.6.3 - Pruebas de rendimiento y carga"
echo "✅ cypress-mochawesome-reporter - Reportes HTML detallados"
echo "✅ @cypress/code-coverage - Cobertura de código"
echo ""

log_info "ESTRUCTURA CREADA:"
echo "📁 cypress/ - Configuración y pruebas E2E"
echo "   ├── e2e/ - Archivos de prueba (.cy.js)"
echo "   ├── support/ - Comandos y configuración"
echo "   ├── reports/ - Reportes de ejecución"
echo "   ├── screenshots/ - Capturas en errores"
echo "   └── videos/ - Videos de ejecución"
echo ""
echo "📁 jmeter-tests/ - Planes y resultados de JMeter"
echo "   ├── novacrater-performance.jmx - Plan principal"
echo "   └── results/ - Resultados de ejecución"
echo ""
echo "📁 test-results/ - Resultados consolidados"
echo ""

log_info "SCRIPTS DISPONIBLES:"
echo "🚀 ./ejecutar-cypress.sh - Ejecutar pruebas E2E"
echo "🚀 ./ejecutar-jmeter.sh - Ejecutar pruebas de rendimiento"
echo "📦 npm run cypress:open - Abrir interfaz gráfica de Cypress"
echo "📦 npm run test:e2e - Ejecutar pruebas E2E desde npm"
echo "📦 npm run test:performance - Ejecutar pruebas de rendimiento"
echo "📦 npm run test:all - Ejecutar todas las pruebas"
echo ""

log_info "PRUEBAS E2E DISPONIBLES:"
echo "• admin-login.cy.js - Pruebas de autenticación"
echo "• admin-dashboard.cy.js - Pruebas del dashboard"
echo "• api-tests.cy.js - Pruebas de endpoints API"
echo ""

log_info "CONFIGURACIÓN DE JMETER:"
echo "• Plan: jmeter-tests/novacrater-performance.jmx"
echo "• Usuarios por defecto: 10 concurrentes"
echo "• Duración por defecto: 5 minutos"
echo "• APIs probadas: Login, Dashboard, Invoices, Customers"
echo ""

log_warning "ANTES DE EJECUTAR PRUEBAS:"
echo "1. Asegúrate de que la aplicación esté corriendo:"
echo "   php artisan serve"
echo ""
echo "2. Verifica que la base de datos tenga datos de prueba"
echo ""
echo "3. Para pruebas E2E:"
echo "   ./ejecutar-cypress.sh"
echo ""
echo "4. Para pruebas de rendimiento:"
echo "   ./ejecutar-jmeter.sh [usuarios] [rampa] [duración]"
echo ""

log_success "¡Todo listo para ejecutar pruebas E2E y de rendimiento!"
echo "================================================================" 