#!/bin/bash

# Script de Ejecución de Pruebas Cypress para NovaCrater
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

echo "=============================================================="
log_info "EJECUTANDO PRUEBAS E2E CON CYPRESS - NOVACRATER"
echo "=============================================================="

# Verificar que estamos en el directorio correcto
if [[ ! -f "package.json" ]]; then
    log_error "No se encuentra package.json. ¿Estás en el directorio raíz de NovaCrater?"
    exit 1
fi

# Verificar si Cypress está instalado
if ! command -v npx &> /dev/null; then
    log_error "npx no está disponible. ¿Está Node.js instalado?"
    exit 1
fi

# Verificar que la aplicación esté corriendo
log_step "Verificando que la aplicación esté corriendo..."
if curl -s http://localhost:8000 > /dev/null; then
    log_success "Aplicación detectada en http://localhost:8000"
else
    log_error "La aplicación no está corriendo en http://localhost:8000"
    log_info "Por favor, inicia la aplicación primero con: php artisan serve"
    exit 1
fi

# Crear directorio de reportes si no existe
mkdir -p cypress/reports

# Instalar Cypress si no está instalado
if [ ! -d "node_modules/cypress" ]; then
    log_step "Instalando Cypress..."
    npm install --save-dev cypress cypress-mochawesome-reporter
fi

# Ejecutar pruebas de Cypress
log_step "Ejecutando pruebas E2E de Cypress..."
log_info "Esto puede tomar varios minutos..."

# Fecha y hora para el reporte
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_DIR="cypress/reports/cypress-report-$TIMESTAMP"

# Ejecutar Cypress en modo headless
npx cypress run \
    --config baseUrl=http://localhost:8000 \
    --reporter cypress-mochawesome-reporter \
    --reporter-options reportDir=$REPORT_DIR,overwrite=false,html=true,json=true \
    --env apiUrl=http://localhost:8000/api/v1,adminEmail=admin@invoiceshelf.com,adminPassword=admin@123

CYPRESS_EXIT_CODE=$?

echo ""
echo "=============================================================="

if [ $CYPRESS_EXIT_CODE -eq 0 ]; then
    log_success "PRUEBAS E2E COMPLETADAS EXITOSAMENTE"
    
    # Mostrar resumen de archivos generados
    echo ""
    log_info "ARCHIVOS GENERADOS:"
    echo "• Reportes HTML: $REPORT_DIR/"
    echo "• Screenshots: cypress/screenshots/"
    echo "• Videos: cypress/videos/"
    
    # Contar archivos de prueba ejecutados
    SPEC_COUNT=$(find cypress/e2e -name "*.cy.js" | wc -l)
    log_info "Total de archivos de prueba E2E: $SPEC_COUNT"
    
    # Mostrar ubicación del reporte principal
    if [ -f "$REPORT_DIR/index.html" ]; then
        echo ""
        log_success "Reporte principal disponible en: $REPORT_DIR/index.html"
        log_info "Abre el archivo en tu navegador para ver los resultados detallados"
    fi
    
else
    log_error "ALGUNAS PRUEBAS E2E FALLARON"
    log_info "Revisa los reportes y logs para más detalles"
    
    # Mostrar ubicaciones útiles para debugging
    echo ""
    log_info "ARCHIVOS PARA DEBUGGING:"
    echo "• Screenshots de errores: cypress/screenshots/"
    echo "• Videos de ejecución: cypress/videos/"
    echo "• Reportes: $REPORT_DIR/"
fi

echo "=============================================================="
log_info "Ejecución de pruebas E2E finalizada"
echo "=============================================================="

exit $CYPRESS_EXIT_CODE 