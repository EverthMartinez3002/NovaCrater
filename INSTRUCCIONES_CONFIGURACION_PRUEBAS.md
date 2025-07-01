# Instrucciones de Configuración y Ejecución de Pruebas
## Proyecto NovaCrater

---

## 📋 Resumen

Esta guía proporciona instrucciones paso a paso para configurar el entorno de desarrollo, instalar dependencias y ejecutar la suite completa de pruebas del proyecto NovaCrater.

---

## 🛠️ Prerrequisitos del Sistema

### Requisitos Mínimos

- **Sistema Operativo**: Ubuntu 22.04+ / Windows 11 con WSL2 / macOS 12+
- **PHP**: Versión 8.2 o superior
- **Composer**: Última versión estable
- **Memoria**: Mínimo 2GB RAM disponible
- **Espacio en Disco**: 1GB libre para dependencias y datos de prueba

### Extensiones PHP Requeridas

```bash
# Extensiones críticas para el funcionamiento
php-zip           # Para manejo de archivos comprimidos
php-bcmath        # Para cálculos de precisión decimal
php-curl          # Para comunicación HTTP/API
php-gd            # Para procesamiento de imágenes
php-intl          # Para internacionalización
php-mbstring      # Para manejo de strings multibyte
php-sqlite3       # Para base de datos de pruebas
php-xml           # Para procesamiento XML
php-dom           # Para manipulación DOM
php-xmlreader     # Para lectura XML
php-xmlwriter     # Para escritura XML
php-simplexml     # Para XML simple
php-fileinfo      # Para detección de tipos de archivo
php-tokenizer     # Para análisis de tokens PHP
php-ctype         # Para validación de tipos de caracteres
```

---

## 🚀 Guía de Instalación Rápida

### Paso 1: Instalar Dependencias del Sistema

```bash
# Para Ubuntu/Debian
sudo apt update
sudo apt install -y php8.2-cli php8.2-zip php8.2-bcmath php8.2-curl \
    php8.2-gd php8.2-intl php8.2-mbstring php8.2-sqlite3 php8.2-xml \
    php8.2-dom php8.2-xmlreader php8.2-xmlwriter php8.2-simplexml \
    php8.2-fileinfo php8.2-tokenizer php8.2-ctype composer

# Verificar instalación
php --version
composer --version
```

### Paso 2: Clonar y Configurar el Proyecto

```bash
# Navegar al directorio del proyecto
cd /mnt/c/Users/luism/Desktop/ACA/NovaCrater

# Hacer ejecutables los scripts de instalación
chmod +x install-dependencies.sh
chmod +x ejecutar-pruebas.sh

# Ejecutar instalación automatizada de dependencias
./install-dependencies.sh
```

### Paso 3: Ejecutar Suite de Pruebas

```bash
# Ejecutar todas las pruebas con cobertura
./ejecutar-pruebas.sh

# O ejecutar manualmente con Pest
./vendor/bin/pest --parallel --coverage --min=85
```

---

## 🔧 Instalación Manual Detallada

### 1. Verificación del Entorno

```bash
# Verificar versión de PHP
php --version

# Verificar extensiones instaladas
php -m | grep -E "(zip|bcmath|curl|gd|intl|mbstring|sqlite|xml|dom)"

# Verificar Composer
composer --version
```

### 2. Instalación de Dependencias PHP

```bash
# Instalar dependencias del proyecto
composer install --dev --optimize-autoloader

# Verificar que Pest está instalado
./vendor/bin/pest --version
```

### 3. Configuración del Entorno

```bash
# Copiar archivo de configuración
cp .env.example .env

# Generar clave de aplicación
php artisan key:generate

# Configurar variables específicas para pruebas
echo "APP_ENV=testing" >> .env
echo "DB_CONNECTION=sqlite" >> .env
echo "DB_DATABASE=:memory:" >> .env
```

### 4. Limpieza y Preparación

```bash
# Limpiar cachés
php artisan config:clear
php artisan cache:clear
php artisan view:clear

# Verificar configuración
php artisan config:show database.connections.sqlite
```

---

## 🧪 Ejecución de Pruebas

### Comandos Básicos

```bash
# Ejecutar todas las pruebas
./vendor/bin/pest

# Ejecutar con cobertura de código
./vendor/bin/pest --coverage

# Ejecutar en paralelo (más rápido)
./vendor/bin/pest --parallel

# Ejecutar con cobertura mínima del 85%
./vendor/bin/pest --coverage --min=85
```

### Ejecución por Categorías

```bash
# Solo pruebas unitarias
./vendor/bin/pest tests/Unit

# Solo pruebas de funcionalidad
./vendor/bin/pest tests/Feature

# Pruebas específicas de administrador
./vendor/bin/pest tests/Feature/Admin

# Pruebas específicas de cliente
./vendor/bin/pest tests/Feature/Customer
```

### Opciones Avanzadas

```bash
# Ejecutar con salida detallada
./vendor/bin/pest --verbose

# Ejecutar con reporte de tiempo
./vendor/bin/pest --profile

# Ejecutar solo pruebas fallidas
./vendor/bin/pest --retry

# Ejecutar con filtro específico
./vendor/bin/pest --filter=InvoiceTest
```

---

## 📊 Generación de Reportes

### Reportes de Cobertura

```bash
# Generar reporte HTML de cobertura
./vendor/bin/pest --coverage-html=storage/coverage

# Generar reporte XML para CI/CD
./vendor/bin/pest --coverage-xml=storage/coverage/xml

# Generar reporte de texto simple
./vendor/bin/pest --coverage-text
```

### Visualización de Reportes

```bash
# Abrir reporte HTML (si Firefox está disponible)
firefox storage/coverage/index.html

# O ubicar el reporte manualmente
ls -la storage/coverage/
```

---

## 🔍 Resolución de Problemas

### Problemas Comunes y Soluciones

#### Error: "ext-zip is missing"

```bash
# Solución
sudo apt install php8.2-zip
# O para otras versiones de PHP
sudo apt install php-zip
```

#### Error: "Class not found"

```bash
# Regenerar autoloader
composer dump-autoload

# Limpiar cachés
php artisan config:clear
php artisan cache:clear
```

#### Error: "Permission denied"

```bash
# Dar permisos a scripts
chmod +x install-dependencies.sh
chmod +x ejecutar-pruebas.sh

# Dar permisos a directorios de storage
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/
```

#### Error: "Memory limit exceeded"

```bash
# Aumentar límite de memoria temporalmente
php -d memory_limit=512M ./vendor/bin/pest

# O modificar php.ini permanentemente
echo "memory_limit = 512M" | sudo tee -a /etc/php/8.2/cli/php.ini
```

#### Error: "Database connection failed"

```bash
# Verificar configuración SQLite
php -m | grep sqlite

# Instalar si falta
sudo apt install php8.2-sqlite3

# Verificar archivo .env
grep DB_ .env
```

---

## 📈 Métricas de Rendimiento Esperadas

### Tiempos de Ejecución Normales

```yaml
Suite Completa de Pruebas:
  Tiempo Total: ~25-35 segundos
  Pruebas Unitarias: ~10-15 segundos
  Pruebas de Funcionalidad: ~15-20 segundos
  Preparación/Limpieza: ~2-3 segundos

Por Categoría:
  Pruebas de Usuario: ~0.5-1.0 segundos
  Pruebas de Factura: ~2.0-3.0 segundos
  Pruebas de API: ~1.5-2.5 segundos
  Pruebas de Dashboard: ~1.0-2.0 segundos
```

### Uso de Recursos

```yaml
Memoria:
  Mínimo: 128MB
  Recomendado: 256MB
  Máximo observado: 180MB

CPU:
  Uso promedio: 60-80% durante ejecución
  Picos: 90-100% en pruebas paralelas

Base de Datos:
  Tamaño en memoria: ~50MB
  Registros de prueba: ~10,000
  Tiempo de setup: <1 segundo
```

---

## 🔒 Verificación de Seguridad

### Auditoría de Dependencias

```bash
# Verificar vulnerabilidades en dependencias PHP
composer audit

# Verificar vulnerabilidades en dependencias NPM (si aplica)
npm audit

# Actualizar dependencias con parches de seguridad
composer update --with-dependencies
```

### Validación de Configuración

```bash
# Verificar que las pruebas usan entorno aislado
grep -r "APP_ENV=testing" .

# Verificar base de datos en memoria
grep -r ":memory:" .

# Verificar que no hay credenciales hardcoded
grep -r "password.*=" tests/ || echo "✅ No hay credenciales hardcoded"
```

---

## 📝 Documentación de Resultados

### Interpretación de Salida

```bash
# Ejemplo de salida exitosa
✓ PASS  Tests\Unit\UserTest > user creation
✓ PASS  Tests\Unit\InvoiceTest > invoice calculation
✓ PASS  Tests\Feature\Admin\DashboardTest > dashboard access

Tests:  325 passed
Time:   28.45s
```

### Métricas de Cobertura

```bash
# Interpretación de cobertura
Code Coverage: 89.23%
  Lines:   2,150 / 2,409 (89.25%)
  Functions: 645 / 698 (92.39%)
  Classes:   85 / 92 (92.39%)
```

---

## 🎯 Validación de Éxito

### Criterios de Aceptación

Para considerar la instalación y ejecución exitosa, verifique:

- ✅ **Todas las pruebas pasan**: 0 fallos reportados
- ✅ **Cobertura >= 85%**: Cumple estándar mínimo
- ✅ **Sin errores de memoria**: No memory limit exceeded
- ✅ **Tiempo razonable**: < 60 segundos para suite completa
- ✅ **Sin warnings críticos**: Solo notices menores permitidos

### Comando de Validación Final

```bash
# Ejecutar validación completa
./ejecutar-pruebas.sh && echo "🎉 ¡INSTALACIÓN Y PRUEBAS EXITOSAS!"
```

---

## 📞 Soporte y Contacto

### Obtener Ayuda

Si encuentra problemas no cubiertos en esta guía:

1. **Verificar logs**: `storage/logs/laravel.log`
2. **Revisar configuración**: `php artisan config:show`
3. **Validar extensiones**: `php -m`
4. **Consultar documentación**: `docs/`

### Recursos Adicionales

- **Documentación de Laravel Testing**: https://laravel.com/docs/testing
- **Documentación de Pest PHP**: https://pestphp.com/
- **Documentación de PHPUnit**: https://phpunit.de/

---

**© 2024 Proyecto NovaCrater | Instrucciones de Configuración v1.0** 