#!/bin/bash

# Script de Verificación de Instalación - NovaCrater Testing Tools
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

log_warning() {
    echo -e "${YELLOW}⚠️  ADVERTENCIA: $1${NC}"
}

echo "================================================================"
log_info "VERIFICACIÓN DE INSTALACIÓN - HERRAMIENTAS DE TESTING"
echo "================================================================"
echo ""

# Contador de verificaciones
TOTAL_CHECKS=0
PASSED_CHECKS=0

check_result() {
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    if [ $1 -eq 0 ]; then
        log_success "$2"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        log_error "$2"
    fi
}

# ========================================
# VERIFICACIONES DE SISTEMA
# ========================================
log_info "VERIFICANDO DEPENDENCIAS DEL SISTEMA..."
echo ""

# Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    check_result 0 "Node.js instalado: $NODE_VERSION"
else
    check_result 1 "Node.js NO está instalado"
fi

# npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    check_result 0 "npm instalado: v$NPM_VERSION"
else
    check_result 1 "npm NO está instalado"
fi

# Java
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1)
    check_result 0 "Java instalado: $JAVA_VERSION"
else
    check_result 1 "Java NO está instalado"
fi

# ========================================
# VERIFICACIONES DE ESTRUCTURA
# ========================================
echo ""
log_info "VERIFICANDO ESTRUCTURA DE DIRECTORIOS..."
echo ""

REQUIRED_DIRS=(
    "cypress"
    "cypress/e2e"
    "cypress/support"
    "cypress/reports"
    "cypress/screenshots"
    "cypress/videos"
    "jmeter-tests"
    "jmeter-tests/results"
    "test-results"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        check_result 0 "Directorio $dir existe"
    else
        check_result 1 "Directorio $dir NO existe"
    fi
done

# ========================================
# VERIFICACIONES DE ARCHIVOS
# ========================================
echo ""
log_info "VERIFICANDO ARCHIVOS DE CONFIGURACIÓN..."
echo ""

REQUIRED_FILES=(
    "package.json"
    "cypress.config.js"
    "cypress/support/commands.js"
    "cypress/support/e2e.js"
    "jmeter-tests/novacrater-performance.jmx"
    ".env.testing"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        check_result 0 "Archivo $file existe"
    else
        check_result 1 "Archivo $file NO existe"
    fi
done

# ========================================
# VERIFICACIONES DE PRUEBAS E2E
# ========================================
echo ""
log_info "VERIFICANDO PRUEBAS E2E..."
echo ""

E2E_TESTS=(
    "cypress/e2e/admin-login.cy.js"
    "cypress/e2e/admin-dashboard.cy.js"
    "cypress/e2e/api-tests.cy.js"
)

for test in "${E2E_TESTS[@]}"; do
    if [ -f "$test" ]; then
        check_result 0 "Prueba E2E $(basename $test) existe"
    else
        check_result 1 "Prueba E2E $(basename $test) NO existe"
    fi
done

# ========================================
# VERIFICACIONES DE SCRIPTS
# ========================================
echo ""
log_info "VERIFICANDO SCRIPTS EJECUTABLES..."
echo ""

SCRIPTS=(
    "instalar-herramientas-testing.sh"
    "ejecutar-cypress.sh"
    "ejecutar-jmeter.sh"
    "verificar-instalacion.sh"
)

for script in "${SCRIPTS[@]}"; do
    if [ -f "$script" ] && [ -x "$script" ]; then
        check_result 0 "Script $script existe y es ejecutable"
    elif [ -f "$script" ]; then
        check_result 1 "Script $script existe pero NO es ejecutable"
    else
        check_result 1 "Script $script NO existe"
    fi
done

# ========================================
# VERIFICACIONES DE CYPRESS
# ========================================
echo ""
log_info "VERIFICANDO INSTALACIÓN DE CYPRESS..."
echo ""

# Verificar node_modules/cypress
if [ -d "node_modules/cypress" ]; then
    check_result 0 "Cypress instalado en node_modules"
else
    check_result 1 "Cypress NO está instalado en node_modules"
fi

# Verificar que Cypress se pueda ejecutar
if npx cypress --version &> /dev/null; then
    CYPRESS_VERSION=$(npx cypress --version 2>/dev/null | head -n 1)
    check_result 0 "Cypress ejecutable: $CYPRESS_VERSION"
else
    check_result 1 "Cypress NO se puede ejecutar"
fi

# Verificar cypress-mochawesome-reporter
if [ -d "node_modules/cypress-mochawesome-reporter" ]; then
    check_result 0 "cypress-mochawesome-reporter instalado"
else
    check_result 1 "cypress-mochawesome-reporter NO está instalado"
fi

# ========================================
# VERIFICACIONES DE JMETER
# ========================================
echo ""
log_info "VERIFICANDO INSTALACIÓN DE JMETER..."
echo ""

# Verificar directorio de JMeter
JMETER_FOUND=false
if [ -d "apache-jmeter-5.6.3" ]; then
    check_result 0 "Directorio JMeter apache-jmeter-5.6.3 existe"
    JMETER_FOUND=true
elif [ -L "jmeter" ]; then
    check_result 0 "Enlace simbólico jmeter existe"
    JMETER_FOUND=true
else
    check_result 1 "JMeter NO está instalado"
fi

# Verificar ejecutable de JMeter
if [ -f "jmeter/bin/jmeter" ] && [ -x "jmeter/bin/jmeter" ]; then
    check_result 0 "JMeter ejecutable encontrado en jmeter/bin/jmeter"
elif [ -f "apache-jmeter-5.6.3/bin/jmeter" ] && [ -x "apache-jmeter-5.6.3/bin/jmeter" ]; then
    check_result 0 "JMeter ejecutable encontrado en apache-jmeter-5.6.3/bin/jmeter"
else
    check_result 1 "JMeter ejecutable NO encontrado o no es ejecutable"
fi

# ========================================
# VERIFICACIONES DE PACKAGE.JSON
# ========================================
echo ""
log_info "VERIFICANDO SCRIPTS EN PACKAGE.JSON..."
echo ""

if [ -f "package.json" ]; then
    # Verificar scripts usando node
    SCRIPTS_CHECK=$(node -e "
    const pkg = require('./package.json');
    const scripts = pkg.scripts || {};
    const requiredScripts = ['cypress', 'cypress:open', 'test:e2e'];
    let missing = [];
    requiredScripts.forEach(script => {
        if (!scripts[script]) missing.push(script);
    });
    console.log(missing.length === 0 ? 'OK' : missing.join(','));
    " 2>/dev/null)
    
    if [ "$SCRIPTS_CHECK" = "OK" ]; then
        check_result 0 "Scripts npm configurados correctamente"
    else
        check_result 1 "Scripts npm faltantes: $SCRIPTS_CHECK"
    fi
else
    check_result 1 "package.json no encontrado"
fi

# ========================================
# VERIFICACIÓN DE CONECTIVIDAD
# ========================================
echo ""
log_info "VERIFICANDO CONECTIVIDAD..."
echo ""

# Verificar si la aplicación está corriendo
if curl -s http://localhost:8000 > /dev/null 2>&1; then
    check_result 0 "Aplicación accesible en http://localhost:8000"
else
    check_result 1 "Aplicación NO está corriendo en http://localhost:8000"
    log_warning "Inicia la aplicación con: php artisan serve"
fi

# ========================================
# RESUMEN FINAL
# ========================================
echo ""
echo "================================================================"
log_info "RESUMEN DE VERIFICACIÓN"
echo "================================================================"
echo ""

# Calcular porcentaje
if [ $TOTAL_CHECKS -gt 0 ]; then
    PERCENTAGE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))
else
    PERCENTAGE=0
fi

echo "📊 ESTADÍSTICAS:"
echo "• Total de verificaciones: $TOTAL_CHECKS"
echo "• Verificaciones exitosas: $PASSED_CHECKS"
echo "• Verificaciones fallidas: $((TOTAL_CHECKS - PASSED_CHECKS))"
echo "• Porcentaje de éxito: $PERCENTAGE%"
echo ""

if [ $PERCENTAGE -eq 100 ]; then
    log_success "¡TODAS LAS VERIFICACIONES PASARON!"
    echo ""
    log_info "TODO ESTÁ LISTO PARA EJECUTAR PRUEBAS:"
    echo "• ./ejecutar-cypress.sh (Pruebas E2E)"
    echo "• ./ejecutar-jmeter.sh (Pruebas de rendimiento)"
    echo "• npm run cypress:open (Interfaz gráfica de Cypress)"
    
elif [ $PERCENTAGE -ge 80 ]; then
    log_warning "VERIFICACIÓN MAYORMENTE EXITOSA ($PERCENTAGE%)"
    echo ""
    log_info "Revisa los errores anteriores y ejecuta:"
    echo "• ./instalar-herramientas-testing.sh (si faltan dependencias)"
    
elif [ $PERCENTAGE -ge 50 ]; then
    log_warning "VERIFICACIÓN PARCIALMENTE EXITOSA ($PERCENTAGE%)"
    echo ""
    log_error "Se requiere atención a los errores mostrados"
    log_info "Ejecuta: ./instalar-herramientas-testing.sh"
    
else
    log_error "VERIFICACIÓN FALLÓ ($PERCENTAGE%)"
    echo ""
    log_error "Se requiere instalación completa"
    log_info "Ejecuta: ./instalar-herramientas-testing.sh"
fi

echo ""
echo "================================================================"

# Salir con código apropiado
if [ $PERCENTAGE -eq 100 ]; then
    exit 0
else
    exit 1
fi 