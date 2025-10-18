@echo off
REM Lang Match - Script de instalación para Windows
echo 🚀 Instalando Lang Match - Chatbot de Práctica de Idiomas
echo ==================================================

REM Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado. Por favor instala Node.js v16 o superior.
    pause
    exit /b 1
)

echo ✅ Node.js detectado
node --version

REM Instalar dependencias del proyecto principal
echo 📦 Instalando dependencias del proyecto principal...
call npm install

REM Instalar dependencias del backend
echo 📦 Instalando dependencias del backend...
cd backend
call npm install
cd ..

REM Instalar dependencias de la app móvil
echo 📦 Instalando dependencias de la app móvil...
cd frontend\mobile
call npm install
cd ..\..

REM Instalar dependencias del dashboard
echo 📦 Instalando dependencias del dashboard...
cd frontend\dashboard
call npm install
cd ..\..

REM Crear archivos de configuración
echo ⚙️  Configurando archivos de entorno...

REM Crear .env para el backend si no existe
if not exist "backend\.env" (
    echo 📝 Creando archivo de configuración del backend...
    copy "backend\env.example" "backend\.env"
    echo ⚠️  IMPORTANTE: Edita backend\.env con tus credenciales de MongoDB y JWT secret
)

REM Crear .env para la app móvil si no existe
if not exist "frontend\mobile\.env" (
    echo 📝 Creando archivo de configuración de la app móvil...
    (
        echo REACT_APP_API_URL=http://localhost:5000/api
        echo REACT_APP_SOCKET_URL=http://localhost:5000
    ) > frontend\mobile\.env
)

REM Crear .env para el dashboard si no existe
if not exist "frontend\dashboard\.env" (
    echo 📝 Creando archivo de configuración del dashboard...
    (
        echo REACT_APP_API_URL=http://localhost:5000/api
    ) > frontend\dashboard\.env
)

echo.
echo ✅ Instalación completada exitosamente!
echo.
echo 📋 Próximos pasos:
echo 1. Configura tu base de datos MongoDB en backend\.env
echo 2. Ejecuta 'npm run dev' para iniciar el proyecto en modo desarrollo
echo 3. Abre http://localhost:3000 para la app móvil
echo 4. Abre http://localhost:3001 para el dashboard
echo 5. El backend estará disponible en http://localhost:5000
echo.
echo 🔧 Comandos disponibles:
echo   npm run dev          - Ejecutar todo en modo desarrollo
echo   npm run backend      - Solo backend
echo   npm run mobile       - Solo app móvil
echo   npm run dashboard    - Solo dashboard
echo.
echo 📚 Lee el README.md para más información
pause
