# API Documentation - Lang Match

## Base URL
```
http://localhost:5000/api
```

## Estructura del Proyecto
```
lang-match-chatbot/
├── backend/                    # Backend (Node.js + Express)
│   ├── models/                # Modelos de MongoDB
│   ├── routes/                # Rutas de la API
│   ├── middleware/            # Middlewares personalizados
│   ├── services/              # Lógica de negocio
│   ├── utils/                 # Utilidades
│   └── config/                # Configuraciones
├── frontend/                   # Frontend (React)
│   ├── mobile/                # App móvil (React SPA)
│   └── dashboard/             # Dashboard web (React)
└── docs/                      # Documentación
```

## Autenticación
La API utiliza JWT (JSON Web Tokens) para la autenticación. Incluye el token en el header `Authorization`:

```
Authorization: Bearer <token>
```

## Endpoints

### Autenticación

#### POST /auth/register
Registra un nuevo usuario.

**Request Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": "64a1b2c3d4e5f6789abcdef0",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "createdAt": "2023-07-01T10:00:00.000Z",
      "lastLogin": null
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST /auth/login
Inicia sesión de un usuario.

**Request Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": "64a1b2c3d4e5f6789abcdef0",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "createdAt": "2023-07-01T10:00:00.000Z",
      "lastLogin": "2023-07-01T12:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### GET /auth/me
Obtiene el perfil del usuario actual.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64a1b2c3d4e5f6789abcdef0",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "createdAt": "2023-07-01T10:00:00.000Z",
      "lastLogin": "2023-07-01T12:00:00.000Z"
    }
  }
}
```

### Sesiones

#### POST /sessions
Crea una nueva sesión de práctica.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "language": "español",
  "level": "intermedio"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sesión creada exitosamente",
  "data": {
    "session": {
      "id": "64a1b2c3d4e5f6789abcdef1",
      "language": "español",
      "level": "intermedio",
      "startedAt": "2023-07-01T12:00:00.000Z",
      "isActive": true
    },
    "welcomeMessage": {
      "id": "64a1b2c3d4e5f6789abcdef2",
      "role": "bot",
      "text": "¡Hola! ¿Cómo estás hoy?",
      "timestamp": "2023-07-01T12:00:00.000Z"
    }
  }
}
```

#### GET /sessions
Obtiene las sesiones del usuario.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Número de página (default: 1)
- `limit` (optional): Elementos por página (default: 10)
- `status` (optional): Filtro por estado ('all', 'active', 'completed')

**Response:**
```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "_id": "64a1b2c3d4e5f6789abcdef1",
        "userId": "64a1b2c3d4e5f6789abcdef0",
        "language": "español",
        "level": "intermedio",
        "startedAt": "2023-07-01T12:00:00.000Z",
        "endedAt": null,
        "isActive": true,
        "messageCount": 5,
        "duration": 0
      }
    ],
    "pagination": {
      "current": 1,
      "pages": 1,
      "total": 1
    }
  }
}
```

#### GET /sessions/:id
Obtiene una sesión específica.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "session": {
      "_id": "64a1b2c3d4e5f6789abcdef1",
      "userId": "64a1b2c3d4e5f6789abcdef0",
      "language": "español",
      "level": "intermedio",
      "startedAt": "2023-07-01T12:00:00.000Z",
      "endedAt": null,
      "isActive": true,
      "messageCount": 5,
      "duration": 0
    }
  }
}
```

#### PUT /sessions/:id/end
Termina una sesión activa.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Sesión terminada exitosamente",
  "data": {
    "session": {
      "id": "64a1b2c3d4e5f6789abcdef1",
      "duration": 15,
      "messageCount": 10,
      "endedAt": "2023-07-01T12:15:00.000Z"
    }
  }
}
```

#### GET /sessions/available
Obtiene los idiomas y niveles disponibles.

**Response:**
```json
{
  "success": true,
  "data": {
    "languages": ["español", "inglés", "francés", "alemán", "italiano", "portugués"],
    "levels": ["principiante", "intermedio", "avanzado"],
    "topics": ["viajes", "trabajo", "salud"]
  }
}
```

### Mensajes

#### POST /messages
Envía un mensaje en una sesión.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "sessionId": "64a1b2c3d4e5f6789abcdef1",
  "text": "Hola, ¿cómo estás?"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mensaje enviado exitosamente",
  "data": {
    "userMessage": {
      "id": "64a1b2c3d4e5f6789abcdef3",
      "role": "user",
      "text": "Hola, ¿cómo estás?",
      "timestamp": "2023-07-01T12:05:00.000Z"
    },
    "botMessage": {
      "id": "64a1b2c3d4e5f6789abcdef4",
      "role": "bot",
      "text": "¡Hola! Estoy muy bien, gracias por preguntar. ¿Y tú cómo estás?",
      "timestamp": "2023-07-01T12:05:01.000Z"
    }
  }
}
```

#### GET /messages/:sessionId
Obtiene los mensajes de una sesión específica.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Número de página (default: 1)
- `limit` (optional): Elementos por página (default: 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "_id": "64a1b2c3d4e5f6789abcdef3",
        "sessionId": "64a1b2c3d4e5f6789abcdef1",
        "role": "user",
        "text": "Hola, ¿cómo estás?",
        "timestamp": "2023-07-01T12:05:00.000Z",
        "language": "español",
        "level": "intermedio"
      },
      {
        "_id": "64a1b2c3d4e5f6789abcdef4",
        "sessionId": "64a1b2c3d4e5f6789abcdef1",
        "role": "bot",
        "text": "¡Hola! Estoy muy bien, gracias por preguntar. ¿Y tú cómo estás?",
        "timestamp": "2023-07-01T12:05:01.000Z",
        "language": "español",
        "level": "intermedio"
      }
    ],
    "session": {
      "id": "64a1b2c3d4e5f6789abcdef1",
      "language": "español",
      "level": "intermedio",
      "isActive": true,
      "messageCount": 2
    },
    "pagination": {
      "current": 1,
      "pages": 1,
      "total": 2
    }
  }
}
```

#### GET /messages
Obtiene todos los mensajes del usuario con filtros.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Número de página (default: 1)
- `limit` (optional): Elementos por página (default: 20)
- `language` (optional): Filtrar por idioma
- `level` (optional): Filtrar por nivel
- `role` (optional): Filtrar por rol ('user' o 'bot')
- `startDate` (optional): Fecha de inicio (ISO string)
- `endDate` (optional): Fecha de fin (ISO string)

### Estadísticas

#### GET /stats/user/:id
Obtiene las estadísticas de un usuario específico.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64a1b2c3d4e5f6789abcdef0",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "joinedAt": "2023-07-01T10:00:00.000Z",
      "lastLogin": "2023-07-01T12:00:00.000Z"
    },
    "overview": {
      "totalSessions": 5,
      "activeSessions": 1,
      "completedSessions": 4,
      "totalDuration": 120,
      "averageDuration": 30,
      "totalMessages": 50,
      "userMessages": 25,
      "botMessages": 25
    },
    "languageStats": {
      "español": {
        "sessions": 3,
        "duration": 90,
        "messages": 30
      },
      "inglés": {
        "sessions": 2,
        "duration": 30,
        "messages": 20
      }
    },
    "levelStats": {
      "principiante": {
        "sessions": 2,
        "duration": 60,
        "messages": 20
      },
      "intermedio": {
        "sessions": 3,
        "duration": 60,
        "messages": 30
      }
    },
    "dailyActivity": [
      {
        "date": "2023-07-01",
        "messages": 10
      }
    ]
  }
}
```

#### GET /stats/global
Obtiene las estadísticas globales del sistema.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 100,
      "totalSessions": 500,
      "totalMessages": 5000,
      "activeSessions": 10,
      "newUsers": 5,
      "averageSessionDuration": 25.5
    },
    "languageStats": [
      {
        "language": "español",
        "sessions": 200,
        "totalDuration": 5000,
        "averageDuration": 25
      }
    ],
    "levelStats": [
      {
        "level": "principiante",
        "sessions": 150,
        "totalDuration": 3000,
        "averageDuration": 20
      }
    ],
    "dailyMessages": [
      {
        "date": "2023-07-01",
        "messages": 100
      }
    ],
    "mostActiveUsers": [
      {
        "userId": "64a1b2c3d4e5f6789abcdef0",
        "name": "Juan Pérez",
        "email": "juan@example.com",
        "messageCount": 100
      }
    ]
  }
}
```

### Health Check

#### GET /health
Verifica el estado del servidor.

**Response:**
```json
{
  "success": true,
  "message": "Servidor funcionando correctamente",
  "timestamp": "2023-07-01T12:00:00.000Z",
  "uptime": 3600
}
```

## Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - Token inválido o expirado |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no encontrado |
| 429 | Too Many Requests - Límite de requests excedido |
| 500 | Internal Server Error - Error interno del servidor |

## Ejemplos de Uso

### Flujo completo de una sesión

1. **Registro/Login del usuario**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan Pérez","email":"juan@example.com","password":"password123"}'
```

2. **Crear sesión**
```bash
curl -X POST http://localhost:5000/api/sessions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"language":"español","level":"intermedio"}'
```

3. **Enviar mensaje**
```bash
curl -X POST http://localhost:5000/api/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"sessionId":"<session-id>","text":"Hola, ¿cómo estás?"}'
```

4. **Terminar sesión**
```bash
curl -X PUT http://localhost:5000/api/sessions/<session-id>/end \
  -H "Authorization: Bearer <token>"
```

5. **Ver estadísticas**
```bash
curl -X GET http://localhost:5000/api/stats/user/<user-id> \
  -H "Authorization: Bearer <token>"
```
