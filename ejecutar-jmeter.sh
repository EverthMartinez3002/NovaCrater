#!/bin/bash

# Script de Ejecución de Pruebas JMeter para NovaCrater
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

echo "=============================================================="
log_info "EJECUTANDO PRUEBAS DE RENDIMIENTO CON JMETER - NOVACRATER"
echo "=============================================================="

# Configuración de pruebas
USERS=${1:-10}
RAMP_UP=${2:-60}
DURATION=${3:-300}
BASE_URL=${4:-http://localhost:8000}

log_info "Configuración de pruebas:"
echo "• Usuarios concurrentes: $USERS"
echo "• Tiempo de rampa: $RAMP_UP segundos"
echo "• Duración: $DURATION segundos"
echo "• URL base: $BASE_URL"

# Verificar que estamos en el directorio correcto
if [[ ! -f "jmeter-tests/novacrater-performance.jmx" ]]; then
    log_error "No se encuentra el plan de pruebas JMeter. ¿Estás en el directorio raíz de NovaCrater?"
    exit 1
fi

# Verificar Java
log_step "Verificando instalación de Java..."
if ! command -v java &> /dev/null; then
    log_error "Java no está instalado. JMeter requiere Java 8 o superior."
    log_info "Instalando OpenJDK 11..."
    sudo apt update
    sudo apt install -y openjdk-11-jdk
    
    if [ $? -ne 0 ]; then
        log_error "Error al instalar Java"
        exit 1
    fi
fi

JAVA_VERSION=$(java -version 2>&1 | head -n 1)
log_success "Java detectado: $JAVA_VERSION"

# Descargar e instalar JMeter si no está disponible
JMETER_VERSION="5.6.3"
JMETER_DIR="apache-jmeter-$JMETER_VERSION"

if [ ! -d "$JMETER_DIR" ] && [ ! -L "jmeter" ]; then
    log_step "Descargando e instalando JMeter $JMETER_VERSION..."
    
    JMETER_TAR="$JMETER_DIR.tgz"
    wget "https://archive.apache.org/dist/jmeter/binaries/$JMETER_TAR"
    
    if [ $? -eq 0 ]; then
        log_info "Extrayendo JMeter..."
        tar -xzf "$JMETER_TAR"
        rm "$JMETER_TAR"
        ln -s "$JMETER_DIR" jmeter
        chmod +x "$JMETER_DIR/bin/jmeter"
        log_success "JMeter instalado correctamente"
    else
        log_error "Error al descargar JMeter"
        exit 1
    fi
fi

# Verificar que JMeter esté disponible
if [ -f "jmeter/bin/jmeter" ]; then
    JMETER_PATH="./jmeter/bin/jmeter"
elif [ -f "$JMETER_DIR/bin/jmeter" ]; then
    JMETER_PATH="./$JMETER_DIR/bin/jmeter"
elif command -v jmeter &> /dev/null; then
    JMETER_PATH="jmeter"
else
    log_error "JMeter no está disponible"
    exit 1
fi

log_success "JMeter encontrado en: $JMETER_PATH"

# Verificar que la aplicación esté corriendo
log_step "Verificando que la aplicación esté corriendo..."
if curl -s $BASE_URL > /dev/null; then
    log_success "Aplicación detectada en $BASE_URL"
else
    log_error "La aplicación no está corriendo en $BASE_URL"
    log_info "Por favor, inicia la aplicación primero con: php artisan serve"
    exit 1
fi

# Crear directorios de resultados
mkdir -p jmeter-tests/results
mkdir -p test-results

# Fecha y hora para los resultados
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
RESULTS_FILE="jmeter-tests/results/jmeter-results-$TIMESTAMP.jtl"
LOG_FILE="jmeter-tests/results/jmeter-log-$TIMESTAMP.log"
HTML_REPORT_DIR="jmeter-tests/results/html-report-$TIMESTAMP"

# Ejecutar pruebas de JMeter
log_step "Ejecutando pruebas de rendimiento de JMeter..."
log_info "Esto puede tomar varios minutos (duración configurada: $DURATION segundos)..."
log_warning "No cierres este script durante la ejecución"

echo ""
log_info "Iniciando ejecución de JMeter..."

$JMETER_PATH -n \
    -t jmeter-tests/novacrater-performance.jmx \
    -l "$RESULTS_FILE" \
    -j "$LOG_FILE" \
    -e \
    -o "$HTML_REPORT_DIR" \
    -JUSERS="$USERS" \
    -JRAMP_UP="$RAMP_UP" \
    -JDURATION="$DURATION" \
    -JBASE_URL="$BASE_URL"

JMETER_EXIT_CODE=$?

echo ""
echo "=============================================================="

if [ $JMETER_EXIT_CODE -eq 0 ]; then
    log_success "PRUEBAS DE RENDIMIENTO COMPLETADAS EXITOSAMENTE"
    
    # Analizar resultados básicos
    if [ -f "$RESULTS_FILE" ]; then
        echo ""
        log_info "RESUMEN DE RESULTADOS:"
        
        # Contar líneas (excluyendo header)
        TOTAL_REQUESTS=$(tail -n +2 "$RESULTS_FILE" | wc -l)
        SUCCESSFUL_REQUESTS=$(tail -n +2 "$RESULTS_FILE" | awk -F',' '$8=="true"' | wc -l)
        FAILED_REQUESTS=$(tail -n +2 "$RESULTS_FILE" | awk -F',' '$8=="false"' | wc -l)
        
        echo "• Total de requests: $TOTAL_REQUESTS"
        echo "• Requests exitosos: $SUCCESSFUL_REQUESTS"
        echo "• Requests fallidos: $FAILED_REQUESTS"
        
        if [ $TOTAL_REQUESTS -gt 0 ]; then
            SUCCESS_RATE=$(echo "scale=2; $SUCCESSFUL_REQUESTS * 100 / $TOTAL_REQUESTS" | bc -l 2>/dev/null || echo "N/A")
            echo "• Tasa de éxito: $SUCCESS_RATE%"
        fi
        
        # Calcular tiempo promedio de respuesta
        AVG_RESPONSE_TIME=$(tail -n +2 "$RESULTS_FILE" | awk -F',' '{sum+=$2; count++} END {if(count>0) print sum/count; else print "N/A"}')
        echo "• Tiempo promedio de respuesta: $AVG_RESPONSE_TIME ms"
    fi
    
    echo ""
    log_info "ARCHIVOS GENERADOS:"
    echo "• Resultados JTL: $RESULTS_FILE"
    echo "• Log de ejecución: $LOG_FILE"
    echo "• Reporte HTML: $HTML_REPORT_DIR/index.html"
    
    echo ""
    log_success "Reporte HTML disponible en: $HTML_REPORT_DIR/index.html"
    log_info "Abre el archivo en tu navegador para ver gráficos y análisis detallado"
    
    # Copiar también a directorio de resultados principal
    cp "$RESULTS_FILE" "test-results/"
    
else
    log_error "ERROR EN LA EJECUCIÓN DE PRUEBAS DE RENDIMIENTO"
    log_info "Revisa el log para más detalles: $LOG_FILE"
    
    if [ -f "$LOG_FILE" ]; then
        echo ""
        log_info "Últimas líneas del log de error:"
        tail -10 "$LOG_FILE"
    fi
fi

echo ""
log_info "PARÁMETROS UTILIZADOS:"
echo "• Usuarios concurrentes: $USERS"
echo "• Tiempo de rampa: $RAMP_UP segundos"
echo "• Duración total: $DURATION segundos"
echo "• URL objetivo: $BASE_URL"

echo ""
log_info "Para ejecutar con parámetros personalizados:"
echo "  ./ejecutar-jmeter.sh [usuarios] [rampa] [duración] [url]"
echo "  Ejemplo: ./ejecutar-jmeter.sh 20 120 600 http://localhost:8000"

echo "=============================================================="
log_info "Ejecución de pruebas de rendimiento finalizada"
echo "=============================================================="

exit $JMETER_EXIT_CODE 