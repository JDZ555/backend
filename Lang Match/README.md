# Lang Match - Chatbot de Práctica de Idiomas

Un sistema completo de práctica de idiomas con chatbot inteligente, desarrollado con la stack MERN (MongoDB, Express.js, React, Node.js).

## 🚀 Características

### App Móvil (React SPA Responsiva)
- **Autenticación**: Registro e inicio de sesión de usuarios
- **Selección de idioma y nivel**: Soporte para múltiples idiomas (español, inglés, francés, alemán, italiano, portugués)
- **Chat interactivo**: Conversación en tiempo real con el bot
- **Resumen de práctica**: Estadísticas y métricas de progreso
- **Diseño responsivo**: Optimizado para dispositivos móviles

### Backend (Node.js + Express)
- **API RESTful**: Endpoints para autenticación, sesiones, mensajes y estadísticas
- **Autenticación JWT**: Sistema seguro de autenticación
- **Base de datos MongoDB**: Almacenamiento de usuarios, sesiones y mensajes
- **Socket.IO**: Comunicación en tiempo real (opcional)
- **Sistema de respuestas del bot**: Respuestas simuladas inteligentes por idioma y nivel

### Dashboard Web (React)
- **Administración de sesiones**: Visualización y gestión de todas las sesiones
- **Explorador de mensajes**: Revisión de conversaciones por sesión
- **Métricas globales**: Estadísticas detalladas del sistema
- **Filtros avanzados**: Por idioma, nivel, fecha, etc.

## 📁 Estructura del Proyecto

```
lang-match-chatbot/
├── backend/                    # Backend (Node.js + Express)
│   ├── models/                # Modelos de MongoDB
│   ├── routes/                # Rutas de la API
│   ├── middleware/            # Middlewares personalizados
│   ├── services/              # Lógica de negocio
│   ├── utils/                 # Utilidades
│   ├── config/                # Configuraciones
│   └── package.json
├── frontend/                   # Frontend (React)
│   ├── mobile/                # App móvil (React SPA)
│   │   ├── src/
│   │   │   ├── components/    # Componentes React
│   │   │   ├── contexts/      # Contextos de React
│   │   │   ├── services/      # Servicios de API
│   │   │   └── utils/         # Utilidades
│   │   └── package.json
│   └── dashboard/             # Dashboard web (React)
│       ├── src/
│       │   ├── components/    # Componentes del dashboard
│       │   └── services/      # Servicios de API
│       └── package.json
├── docs/                      # Documentación
├── scripts/                   # Scripts de utilidad
├── docker-compose.yml         # Configuración Docker
└── package.json               # Configuración principal
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **Socket.IO** - Comunicación en tiempo real
- **bcryptjs** - Encriptación de contraseñas

### Frontend (App Móvil)
- **React** - Biblioteca de UI
- **React Router** - Enrutamiento
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Framework de CSS
- **Lucide React** - Iconos
- **React Hot Toast** - Notificaciones

### Dashboard
- **React** - Biblioteca de UI
- **Recharts** - Gráficos y visualizaciones
- **Tailwind CSS** - Framework de CSS
- **Lucide React** - Iconos

## 📦 Instalación

### Prerrequisitos
- Node.js (v16 o superior)
- MongoDB (local o MongoDB Atlas)
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd lang-match-chatbot
```

### 2. Instalación automática (Recomendada)
```bash
# Linux/Mac
chmod +x scripts/install.sh
./scripts/install.sh

# Windows
scripts\install.bat
```

### 3. Instalación manual
```bash
# Instalar dependencias del proyecto principal
npm install

# Instalar dependencias del backend
cd backend
npm install
cd ..

# Instalar dependencias de la app móvil
cd frontend/mobile
npm install
cd ../..

# Instalar dependencias del dashboard
cd frontend/dashboard
npm install
cd ../..
```

### 4. Configurar variables de entorno
Crear archivo `.env` en la carpeta `backend`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lang-match
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
NODE_ENV=development
```

## 🚀 Ejecución

### Desarrollo
Para ejecutar todo el proyecto en modo desarrollo:

```bash
# Desde la raíz del proyecto
npm run dev
```

Esto ejecutará:
- Backend en http://localhost:5000
- App móvil en http://localhost:3000
- Dashboard en http://localhost:3001

### Comandos individuales
```bash
# Solo backend
npm run backend

# Solo app móvil
npm run mobile

# Solo dashboard
npm run dashboard
```

### Producción
```bash
# Backend
cd backend
npm start

# App móvil
cd frontend/mobile
npm run build
# Servir archivos estáticos

# Dashboard
cd frontend/dashboard
npm run build
# Servir archivos estáticos
```

## 📱 Uso de la Aplicación

### App Móvil
1. **Registro/Login**: Crea una cuenta o inicia sesión
2. **Selección**: Elige idioma y nivel de dificultad
3. **Chat**: Conversa con el bot en el idioma seleccionado
4. **Resumen**: Revisa tu progreso y estadísticas

### Dashboard
1. **Dashboard**: Visualiza métricas globales del sistema
2. **Sesiones**: Gestiona todas las sesiones de práctica
3. **Mensajes**: Explora las conversaciones de los usuarios

## 🔧 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/me` - Perfil del usuario actual

### Sesiones
- `POST /api/sessions` - Crear nueva sesión
- `GET /api/sessions` - Obtener sesiones del usuario
- `GET /api/sessions/:id` - Obtener sesión específica
- `PUT /api/sessions/:id/end` - Terminar sesión
- `GET /api/sessions/available` - Idiomas y niveles disponibles

### Mensajes
- `POST /api/messages` - Enviar mensaje
- `GET /api/messages/:sessionId` - Obtener mensajes de una sesión
- `GET /api/messages` - Obtener todos los mensajes (con filtros)

### Estadísticas
- `GET /api/stats/user/:id` - Métricas por usuario
- `GET /api/stats/global` - Métricas globales

## 🗄️ Modelos de Datos

### User
```javascript
{
  name: String,
  email: String,
  passwordHash: String,
  createdAt: Date,
  lastLogin: Date
}
```

### Session
```javascript
{
  userId: ObjectId,
  language: String,
  level: String,
  startedAt: Date,
  endedAt: Date,
  isActive: Boolean,
  messageCount: Number,
  duration: Number
}
```

### Message
```javascript
{
  sessionId: ObjectId,
  role: String, // 'user' | 'bot'
  text: String,
  timestamp: Date,
  language: String,
  level: String
}
```

## 🌍 Idiomas Soportados

- **Español** 🇪🇸
- **Inglés** 🇺🇸
- **Francés** 🇫🇷
- **Alemán** 🇩🇪
- **Italiano** 🇮🇹
- **Portugués** 🇵🇹

## 📊 Niveles Disponibles

- **Principiante**: Frases básicas y vocabulario simple
- **Intermedio**: Conversaciones más complejas y temas diversos
- **Avanzado**: Debates profundos y expresiones idiomáticas

## 🔒 Seguridad

- Contraseñas encriptadas con bcryptjs
- Autenticación JWT con expiración
- Validación de datos en frontend y backend
- Rate limiting para prevenir abuso
- Headers de seguridad con Helmet

## 🚀 Despliegue

### Backend (Heroku/Railway/DigitalOcean)
1. Configurar variables de entorno
2. Conectar a MongoDB Atlas
3. Desplegar aplicación Node.js

### Frontend (Vercel/Netlify)
1. Build de la aplicación React
2. Configurar variables de entorno
3. Desplegar archivos estáticos

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Autores

- **Tu Nombre** - *Desarrollo inicial* - [tu-github](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- React y la comunidad de desarrolladores
- MongoDB por la base de datos
- Tailwind CSS por el framework de estilos
- Todos los contribuidores del proyecto
