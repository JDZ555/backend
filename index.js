const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/auth');
const sessionRoutes = require('./routes/sessions');
const messageRoutes = require('./routes/messages');
const statsRoutes = require('./routes/stats');
const adminRoutes = require('./routes/admin');

const app = express();
const server = http.createServer(app);

// Configurar Socket.IO con múltiples orígenes
const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://localhost:3000,http://localhost:3001,http://mi-proyecto-dashboard-jda-2025.s3-website-us-east-1.amazonaws.com,http://mi-proyecto-mobile-jda-2025.s3-website-us-east-1.amazonaws.com")
  .split(',')
  .map(o => o.trim());

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

// Middleware de seguridad
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP cada 15 minutos
  message: {
    success: false,
    message: 'Demasiadas solicitudes, intenta de nuevo más tarde'
  }
});
app.use('/api/', limiter);

// CORS para múltiples orígenes
app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (Postman, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origen no permitido por CORS: ' + origin), false);
  },
  credentials: true
}));

// Middleware para parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/admin', adminRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API del Chatbot de Práctica de Idiomas',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      sessions: '/api/sessions',
      messages: '/api/messages',
      stats: '/api/stats',
      health: '/api/health'
    }
  });
});

// Importar middleware de manejo de errores
const errorHandler = require('./middleware/errorHandler');

// Middleware de manejo de errores
app.use(errorHandler);

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Configurar Socket.IO para notificaciones en tiempo real
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);
  
  // Unirse a una sala de sesión específica
  socket.on('join-session', (sessionId) => {
    socket.join(sessionId);
    console.log(`Usuario ${socket.id} se unió a la sesión ${sessionId}`);
  });
  
  // Dejar una sala de sesión
  socket.on('leave-session', (sessionId) => {
    socket.leave(sessionId);
    console.log(`Usuario ${socket.id} dejó la sesión ${sessionId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

// Hacer io disponible globalmente para usar en las rutas
app.set('io', io);

// Importar configuración de base de datos
const connectDB = require('./config/database');

// Iniciar servidor
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  
  server.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
    console.log(`📱 API disponible en: http://localhost:${PORT}`);
    console.log(`🔗 Socket.IO habilitado para notificaciones en tiempo real`);
  });
};

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

startServer();

module.exports = { app, io };