#!/bin/bash

# Lang Match - Script de instalación
echo "🚀 Instalando Lang Match - Chatbot de Práctica de Idiomas"
echo "=================================================="

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js v16 o superior."
    exit 1
fi

# Verificar versión de Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Se requiere Node.js v16 o superior. Versión actual: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"

# Instalar dependencias del proyecto principal
echo "📦 Instalando dependencias del proyecto principal..."
npm install

# Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
cd backend
npm install
cd ..

# Instalar dependencias de la app móvil
echo "📦 Instalando dependencias de la app móvil..."
cd frontend/mobile
npm install
cd ../..

# Instalar dependencias del dashboard
echo "📦 Instalando dependencias del dashboard..."
cd frontend/dashboard
npm install
cd ../..

# Crear archivos de configuración
echo "⚙️  Configurando archivos de entorno..."

# Crear .env para el backend si no existe
if [ ! -f "backend/.env" ]; then
    echo "📝 Creando archivo de configuración del backend..."
    cp backend/env.example backend/.env
    echo "⚠️  IMPORTANTE: Edita backend/.env con tus credenciales de MongoDB y JWT secret"
fi

# Crear .env para la app móvil si no existe
if [ ! -f "frontend/mobile/.env" ]; then
    echo "📝 Creando archivo de configuración de la app móvil..."
    cat > frontend/mobile/.env << EOL
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
EOL
fi

# Crear .env para el dashboard si no existe
if [ ! -f "frontend/dashboard/.env" ]; then
    echo "📝 Creando archivo de configuración del dashboard..."
    cat > frontend/dashboard/.env << EOL
REACT_APP_API_URL=http://localhost:5000/api
EOL
fi

echo ""
echo "✅ Instalación completada exitosamente!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Configura tu base de datos MongoDB en backend/.env"
echo "2. Ejecuta 'npm run dev' para iniciar el proyecto en modo desarrollo"
echo "3. Abre http://localhost:3000 para la app móvil"
echo "4. Abre http://localhost:3001 para el dashboard"
echo "5. El backend estará disponible en http://localhost:5000"
echo ""
echo "🔧 Comandos disponibles:"
echo "  npm run dev          - Ejecutar todo en modo desarrollo"
echo "  npm run backend      - Solo backend"
echo "  npm run mobile       - Solo app móvil"
echo "  npm run dashboard    - Solo dashboard"
echo ""
echo "📚 Lee el README.md para más información"
