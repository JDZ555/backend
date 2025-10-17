const express = require('express');
const Message = require('../models/Message');
const Session = require('../models/Session');
const { auth } = require('../middleware/auth');
const BotResponseService = require('../services/botResponses');
const ChatGPTService = require('../services/chatgptService');
const router = express.Router();

// POST /api/messages - Enviar mensaje
router.post('/', auth, async (req, res) => {
  try {
    const { sessionId, text } = req.body;
    const userId = req.user._id;

    // Validaciones
    if (!sessionId || !text) {
      return res.status(400).json({
        success: false,
        message: 'ID de sesión y texto son requeridos'
      });
    }

    if (text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El mensaje no puede estar vacío'
      });
    }

    if (text.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'El mensaje no puede exceder 1000 caracteres'
      });
    }

    // Verificar que la sesión existe y pertenece al usuario
    const session = await Session.findOne({ _id: sessionId, userId });
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Sesión no encontrada'
      });
    }

    if (!session.isActive) {
      return res.status(400).json({
        success: false,
        message: 'La sesión no está activa'
      });
    }

    // Crear mensaje del usuario
    const userMessage = new Message({
      sessionId,
      role: 'user',
      text: text.trim(),
      language: session.language,
      level: session.level
    });

    await userMessage.save();

    // Generar respuesta del bot usando ChatGPT si está disponible
    const recentMessages = await Message.find({ sessionId })
      .sort({ timestamp: -1 })
      .limit(10)
      .lean();

    // Convertir historial al formato de ChatGPT
    const conversationHistory = recentMessages
      .reverse()
      .map(msg => ({
        role: msg.role === 'bot' ? 'assistant' : 'user',
        content: msg.text
      }));

    let botResponseText;
    
    // Intentar usar ChatGPT primero
    if (process.env.OPENAI_API_KEY) {
      try {
        botResponseText = await ChatGPTService.generateResponse(
          text,
          session.language,
          session.level,
          conversationHistory
        );
      } catch (error) {
        console.error('Error con ChatGPT, usando fallback:', error);
        botResponseText = BotResponseService.getContextualResponse(
          text,
          session.language,
          session.level,
          recentMessages
        );
      }
    } else {
      // Fallback a respuestas básicas si no hay API key
      botResponseText = BotResponseService.getContextualResponse(
        text,
        session.language,
        session.level,
        recentMessages
      );
    }

    // Crear mensaje del bot
    const botMessage = new Message({
      sessionId,
      role: 'bot',
      text: botResponseText,
      language: session.language,
      level: session.level
    });

    await botMessage.save();

    // Actualizar contador de mensajes en la sesión
    await session.incrementMessageCount();

    res.status(201).json({
      success: true,
      message: 'Mensaje enviado exitosamente',
      data: {
        userMessage: {
          id: userMessage._id,
          role: userMessage.role,
          text: userMessage.text,
          timestamp: userMessage.timestamp
        },
        botMessage: {
          id: botMessage._id,
          role: botMessage.role,
          text: botMessage.text,
          timestamp: botMessage.timestamp
        }
      }
    });

  } catch (error) {
    console.error('Error enviando mensaje:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/messages/:sessionId - Obtener mensajes de una sesión
router.get('/:sessionId', auth, async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const userId = req.user._id;
    const { page = 1, limit = 50 } = req.query;

    // Verificar que la sesión existe y pertenece al usuario
    const session = await Session.findOne({ _id: sessionId, userId });
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Sesión no encontrada'
      });
    }

    // Obtener mensajes
    const messages = await Message.find({ sessionId })
      .sort({ timestamp: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await Message.countDocuments({ sessionId });

    res.json({
      success: true,
      data: {
        messages,
        session: {
          id: session._id,
          language: session.language,
          level: session.level,
          isActive: session.isActive,
          messageCount: session.messageCount
        },
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo mensajes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/messages - Obtener todos los mensajes del usuario (con filtros)
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { 
      page = 1, 
      limit = 20, 
      language, 
      level, 
      role,
      startDate,
      endDate 
    } = req.query;

    // Construir query para sesiones del usuario
    const sessionQuery = { userId };
    if (language) sessionQuery.language = language;
    if (level) sessionQuery.level = level;

    const userSessions = await Session.find(sessionQuery).select('_id');
    const sessionIds = userSessions.map(session => session._id);

    // Construir query para mensajes
    const messageQuery = { sessionId: { $in: sessionIds } };
    if (role) messageQuery.role = role;
    
    if (startDate || endDate) {
      messageQuery.timestamp = {};
      if (startDate) messageQuery.timestamp.$gte = new Date(startDate);
      if (endDate) messageQuery.timestamp.$lte = new Date(endDate);
    }

    const messages = await Message.find(messageQuery)
      .populate('sessionId', 'language level startedAt')
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await Message.countDocuments(messageQuery);

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo mensajes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
