# Guía de Contribución - Lang Match

¡Gracias por tu interés en contribuir a Lang Match! Este documento te guiará a través del proceso de contribución.

## 🚀 Cómo Contribuir

### 1. Fork del Repositorio
1. Haz fork del repositorio en GitHub
2. Clona tu fork localmente:
```bash
git clone https://github.com/tu-usuario/lang-match-chatbot.git
cd lang-match-chatbot
```

### 2. Configurar el Entorno de Desarrollo
1. Instala las dependencias:
```bash
# Instalación automática
chmod +x scripts/install.sh
./scripts/install.sh

# O instalación manual
npm install
cd backend && npm install
cd ../frontend/mobile && npm install
cd ../dashboard && npm install
```

2. Configura las variables de entorno:
```bash
# Copia el archivo de ejemplo
cp backend/env.example backend/.env

# Edita las variables necesarias
nano backend/.env
```

3. Inicia la base de datos MongoDB (local o Atlas)

### 3. Crear una Rama
```bash
git checkout -b feature/nombre-de-tu-feature
# o
git checkout -b fix/descripcion-del-bug
```

### 4. Hacer Cambios
- Sigue las convenciones de código existentes
- Añade comentarios cuando sea necesario
- Escribe tests para nuevas funcionalidades
- Actualiza la documentación si es necesario

### 5. Commit y Push
```bash
git add .
git commit -m "feat: añadir nueva funcionalidad de exportación"
git push origin feature/nombre-de-tu-feature
```

### 6. Crear Pull Request
1. Ve a tu fork en GitHub
2. Haz clic en "New Pull Request"
3. Describe los cambios realizados
4. Asigna revisores si es necesario

## 📝 Convenciones de Código

### Estructura de Commits
Usa el formato conventional commits:
```
tipo(scope): descripción

Descripción más detallada si es necesario

Closes #123
```

Tipos disponibles:
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (espacios, etc.)
- `refactor`: Refactorización de código
- `test`: Añadir o modificar tests
- `chore`: Cambios en herramientas, configuración, etc.

### Estructura de Archivos
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
│   │   ├── src/
│   │   │   ├── components/    # Componentes React
│   │   │   ├── contexts/      # Contextos de React
│   │   │   ├── services/      # Servicios de API
│   │   │   └── utils/         # Utilidades
│   └── dashboard/             # Dashboard web (React)
│       ├── src/
│       │   ├── components/    # Componentes del dashboard
│       │   └── services/      # Servicios de API
├── docs/                      # Documentación
└── scripts/                   # Scripts de utilidad
```

### Nomenclatura
- **Variables y funciones**: camelCase (`userName`, `getUserData`)
- **Componentes React**: PascalCase (`UserProfile`, `ChatMessage`)
- **Archivos**: kebab-case (`user-service.js`, `chat-component.js`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_MESSAGE_LENGTH`)

## 🧪 Testing

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend/mobile
npm test
```

### E2E Testing
```bash
npm run test:e2e
```

## 🐛 Reportar Bugs

### Antes de Reportar
1. Verifica que el bug no haya sido reportado ya
2. Actualiza a la última versión
3. Revisa la documentación

### Información Necesaria
- Descripción clara del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots si aplica
- Información del sistema (OS, Node.js version, etc.)

## ✨ Sugerir Mejoras

### Antes de Sugerir
1. Verifica que la mejora no haya sido sugerida
2. Considera si encaja con los objetivos del proyecto
3. Piensa en la implementación

### Información Necesaria
- Descripción clara de la mejora
- Casos de uso
- Alternativas consideradas
- Impacto en usuarios existentes

## 📋 Checklist para Pull Requests

### Antes de Enviar
- [ ] Código sigue las convenciones del proyecto
- [ ] Tests pasan localmente
- [ ] Documentación actualizada si es necesario
- [ ] Commits siguen conventional commits
- [ ] No hay conflictos con la rama principal

### Para Revisores
- [ ] Código es legible y bien comentado
- [ ] Lógica es correcta y eficiente
- [ ] Tests cubren los casos necesarios
- [ ] No introduce vulnerabilidades de seguridad
- [ ] Performance es aceptable

## 🔒 Seguridad

### Reportar Vulnerabilidades
Si encuentras una vulnerabilidad de seguridad, NO abras un issue público. En su lugar:

1. Envía un email a security@langmatch.com
2. Incluye detalles del problema
3. Espera confirmación antes de hacer público

### Mejores Prácticas
- Nunca commitees credenciales o tokens
- Valida todas las entradas del usuario
- Usa HTTPS en producción
- Mantén dependencias actualizadas

## 📚 Recursos Adicionales

### Documentación
- [README.md](README.md) - Información general del proyecto
- [API.md](docs/API.md) - Documentación de la API
- [DEPLOYMENT.md](docs/DEPLOYMENT.md) - Guía de despliegue

### Herramientas Recomendadas
- **Editor**: VS Code con extensiones de React y Node.js
- **Git**: GitKraken o SourceTree para GUI
- **API Testing**: Postman o Insomnia
- **Database**: MongoDB Compass

### Comunidad
- [Discord](https://discord.gg/langmatch) - Chat de la comunidad
- [GitHub Discussions](https://github.com/langmatch/chatbot/discussions) - Foro de discusión
- [Twitter](https://twitter.com/langmatch) - Actualizaciones

## 🤝 Reconocimientos

Los contribuidores serán reconocidos en:
- README.md del proyecto
- Release notes
- Página de contribuidores del sitio web

## 📄 Licencia

Al contribuir, aceptas que tu código será licenciado bajo la [MIT License](LICENSE).

---

¡Gracias por contribuir a Lang Match! 🎉
