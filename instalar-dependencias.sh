#!/bin/bash

# Script de Instalación de Dependencias PHP - NovaCrater
# Maneja PHP 8.4 y resuelve problemas de extensiones faltantes

set -e  # Terminar en caso de error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Función para verificar si el comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo "================================================================"
echo "    Instalación de Dependencias PHP - NovaCrater"
echo "================================================================"

# Detectar versión de PHP
PHP_VERSION=$(php -v | head -n1 | cut -d" " -f2 | cut -d"." -f1,2)
log_info "Versión de PHP detectada: $PHP_VERSION"

# Verificar si es PHP 8.4
if [[ "$PHP_VERSION" == "8.4" ]]; then
    log_warning "PHP 8.4 detectado. Las extensiones pueden no estar disponibles en repositorios estándar."
    log_info "Intentando agregar repositorio PPA para PHP..."
    
    # Agregar repositorio PPA de Ondrej para PHP
    sudo apt-get update
    sudo apt-get install -y software-properties-common
    sudo add-apt-repository ppa:ondrej/php -y
    sudo apt-get update
fi

log_info "[PASO 1] Actualizando repositorios..."
sudo apt-get update

log_info "[PASO 2] Instalando extensiones PHP para versión $PHP_VERSION..."

# Lista de extensiones requeridas
PHP_EXTENSIONS=""

# Verificar disponibilidad de cada extensión y agregarla si está disponible
check_and_add_extension() {
    local ext="$1"
    local package="php${PHP_VERSION}-${ext}"
    
    if apt-cache show "$package" >/dev/null 2>&1; then
        PHP_EXTENSIONS="$PHP_EXTENSIONS $package"
        log_info "✓ Extensión $ext disponible"
    else
        log_warning "✗ Extensión $ext no disponible para PHP $PHP_VERSION"
        
        # Intentar con versión genérica
        generic_package="php-${ext}"
        if apt-cache show "$generic_package" >/dev/null 2>&1; then
            PHP_EXTENSIONS="$PHP_EXTENSIONS $generic_package"
            log_info "✓ Usando versión genérica de $ext"
        fi
    fi
}

# Verificar extensiones una por una
check_and_add_extension "zip"
check_and_add_extension "bcmath"
check_and_add_extension "curl"
check_and_add_extension "gd"
check_and_add_extension "intl"
check_and_add_extension "mbstring"
check_and_add_extension "mysql"
check_and_add_extension "sqlite3"
check_and_add_extension "xml"

# Instalar extensiones disponibles
if [[ -n "$PHP_EXTENSIONS" ]]; then
    log_info "Instalando extensiones disponibles..."
    sudo apt-get install -y $PHP_EXTENSIONS
else
    log_error "No se encontraron extensiones PHP disponibles"
fi

# Verificar si zip está disponible después de la instalación
log_info "[PASO 3] Verificando instalación de extensión ZIP..."
if php -m | grep -q "zip"; then
    log_success "Extensión ZIP está instalada"
else
    log_warning "Extensión ZIP no detectada. Intentando instalación alternativa..."
    
    # Intentar instalar libzip-dev y recompilar si es necesario
    sudo apt-get install -y libzip-dev pkg-config
    
    # Si aún no funciona, intentar con extensión PECL
    if command_exists pecl; then
        log_info "Intentando instalar ZIP via PECL..."
        sudo pecl install zip || log_warning "No se pudo instalar ZIP via PECL"
    fi
fi

log_info "[PASO 4] Verificando extensiones instaladas..."
php -m | grep -E "(zip|bcmath|curl|gd|intl|mbstring|pdo_mysql|pdo_sqlite|xml)" || true

log_info "[PASO 5] Verificando e instalando Composer..."
if ! command_exists composer; then
    log_info "Instalando Composer..."
    curl -sS https://getcomposer.org/installer | php
    sudo mv composer.phar /usr/local/bin/composer
    sudo chmod +x /usr/local/bin/composer
fi

log_info "[PASO 6] Instalando dependencias PHP con Composer..."
# Intentar instalación normal primero
if composer install --no-dev --optimize-autoloader; then
    log_success "Dependencias instaladas correctamente"
else
    log_warning "Instalación normal falló. Intentando ignorar requisitos de plataforma..."
    
    # Intentar con --ignore-platform-reqs para extensiones faltantes
    if composer install --no-dev --optimize-autoloader --ignore-platform-req=ext-zip --ignore-platform-req=ext-bcmath; then
        log_warning "Dependencias instaladas ignorando algunos requisitos de plataforma"
        log_warning "Nota: Algunas funcionalidades pueden estar limitadas"
    else
        log_error "No se pudieron instalar las dependencias"
        log_info "Intentando con composer update..."
        composer update --ignore-platform-reqs || log_error "Composer update también falló"
    fi
fi

log_info "[PASO 7] Configurando variables de entorno..."
if [[ ! -f .env ]]; then
    cp .env.example .env
    log_success "Archivo .env creado desde .env.example"
else
    log_info "Archivo .env ya existe"
fi

# Verificar si vendor/autoload.php existe antes de ejecutar artisan
if [[ -f "vendor/autoload.php" ]]; then
    log_info "[PASO 8] Generando application key..."
    php artisan key:generate --no-interaction
    
    log_info "[PASO 9] Configurando base de datos para pruebas..."
    php artisan migrate:fresh --seed --env=testing --no-interaction || log_warning "No se pudo configurar la base de datos de pruebas"
else
    log_error "vendor/autoload.php no existe. Las dependencias no se instalaron correctamente."
    log_info "Intentando composer install una vez más..."
    composer install --ignore-platform-reqs --no-scripts
fi

# Instalar Node.js y npm si no están presentes
log_info "[PASO 10] Verificando Node.js y npm..."
if ! command_exists node; then
    log_info "Instalando Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

if [[ -f "package.json" ]]; then
    log_info "[PASO 11] Instalando dependencias frontend..."
    npm install --silent
    log_info "Compilando assets frontend..."
    npm run build --silent || npm run dev --silent || log_warning "No se pudieron compilar los assets frontend"
fi

echo "================================================================"
echo "        Resumen de Instalación"
echo "================================================================"

log_info "Verificación final del sistema:"
echo "- PHP Version: $(php -v | head -n1)"
echo "- Composer: $(composer --version 2>/dev/null || echo 'No instalado')"
echo "- Node.js: $(node --version 2>/dev/null || echo 'No instalado')"
echo "- NPM: $(npm --version 2>/dev/null || echo 'No instalado')"

log_info "Extensiones PHP instaladas:"
php -m | grep -E "(zip|bcmath|curl|gd|intl|mbstring|pdo_mysql|pdo_sqlite|xml|dom)" | sed 's/^/  - /' || echo "  - Ninguna extensión crítica detectada"

if [[ -f "vendor/autoload.php" ]]; then
    log_success "✅ Instalación completada exitosamente"
    log_info "🚀 Puedes ejecutar las pruebas con: ./ejecutar-pruebas.sh"
else
    log_error "❌ Instalación falló. Revisar errores arriba."
    exit 1
fi 