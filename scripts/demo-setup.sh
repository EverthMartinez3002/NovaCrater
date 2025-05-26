#!/bin/bash

# InvoiceShelf Demo Setup Script
# This script sets up comprehensive demo data for demonstration purposes

echo "🎯 InvoiceShelf Demo Setup"
echo "=========================="
echo ""

# Check if we're in the right directory
if [ ! -f "artisan" ]; then
    echo "❌ Error: Please run this script from the InvoiceShelf root directory"
    exit 1
fi

# Check PHP version
php_version=$(php -v | head -n 1 | cut -d " " -f 2 | cut -d "." -f 1,2)
echo "📋 PHP Version: $php_version"

# Check if composer dependencies are installed
if [ ! -d "vendor" ]; then
    echo "📦 Installing Composer dependencies..."
    composer install --no-dev --optimize-autoloader
fi

# Check database connection
echo "🔍 Checking database connection..."
if ! php artisan migrate:status > /dev/null 2>&1; then
    echo "❌ Database connection failed. Please check your .env configuration."
    exit 1
fi

echo "✅ Database connection successful"
echo ""

# Ask user what they want to do
echo "Choose an option:"
echo "1) Fresh setup (⚠️  DELETES ALL DATA)"
echo "2) Add demo data to existing database"
echo "3) Just show demo credentials"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "⚠️  WARNING: This will delete ALL existing data!"
        read -p "Are you absolutely sure? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            echo "🔄 Running fresh migrations and creating demo data..."
            php artisan demo:create --fresh
        else
            echo "❌ Operation cancelled"
            exit 0
        fi
        ;;
    2)
        echo ""
        echo "📊 Adding demo data to existing database..."
        php artisan demo:create
        ;;
    3)
        echo ""
        echo "🔑 Demo Credentials:"
        echo "==================="
        echo "Email: demo@invoiceshelf.com"
        echo "Password: demo123"
        echo "Company: InvoiceShelf Demo Company"
        echo ""
        exit 0
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "🎉 Demo setup completed!"
echo ""
echo "Next steps:"
echo "1. Start your development server:"
echo "   php artisan serve"
echo ""
echo "2. Visit your application and login with:"
echo "   Email: demo@invoiceshelf.com"
echo "   Password: demo123"
echo ""
echo "3. Explore the dashboard filters:"
echo "   - Try the 'Active Only' filter"
echo "   - Filter invoices by status"
echo "   - Filter estimates by status"
echo "   - Check different date ranges"
echo ""
echo "💡 Tip: The demo data is specifically designed to showcase"
echo "   all filtering capabilities of the dashboard!"
echo "" 