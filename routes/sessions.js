const express = require('express');
const Session = require('../models/Session');
const Message = require('../models/Message');
const { auth } = require('../middleware/auth');
const BotResponseService = require('../services/botResponses');
const ChatGPTService = require('../services/chatgptService');
const router = express.Router();

// POST /api/sessions - Crear nueva sesión
router.post('/', auth, async (req, res) => {
  try {
    const { language, level } = req.body;
    const userId = req.user._id;

    // Validaciones
    if (!language || !level) {
      return res.status(400).json({
        success: false,
        message: 'Idioma y nivel son requeridos'
      });
    }

    const availableLanguages = BotResponseService.getAvailableLanguages();
    const availableLevels = BotResponseService.getAvailableLevels();

    if (!availableLanguages.includes(language)) {
      return res.status(400).json({
        success: false,
        message: 'Idioma no soportado',
        availableLanguages
      });
    }

    if (!availableLevels.includes(level)) {
      return res.status(400).json({
        success: false,
        message: 'Nivel no válido',
        availableLevels
      });
    }

    // Terminar sesiones activas previas del usuario
    await Session.updateMany(
      { userId, isActive: true },
      { isActive: false, endedAt: new Date() }
    );

    // Crear nueva sesión
    const session = new Session({
      userId,
      language,
      level
    });

    await session.save();

    // Crear mensaje de bienvenida del bot con reglas claras
    let welcomeText;
    
    if (process.env.OPENAI_API_KEY) {
      // Usar ChatGPT para un saludo más inteligente
      try {
        welcomeText = await ChatGPTService.generateResponse(
          `Inicia una conversación de práctica de ${language} nivel ${level} con el usuario ${req.user.name || ''}. Saluda de forma amable y explica brevemente que practicaremos conversación en ${language}. Mantén un tono educativo y motivador, sin mencionar las correcciones.`,
          language,
          level,
          []
        );
      } catch (error) {
        console.error('Error con ChatGPT en bienvenida:', error);
        welcomeText = `Hola ${req.user.name || ''}! Soy tu compañero de práctica.
Idioma seleccionado: ${language}. Nivel: ${level}.
- Te saludaré y mantendré una conversación coherente y relacionada a lo que digas.
- Si escribes una palabra mal en el idioma, te corregiré brevemente en español.
- Puedes pedirme temas (viajes, trabajo, etc.). ¡Empecemos!`;
      }
    } else {
      welcomeText = `Hola ${req.user.name || ''}! Soy tu compañero de práctica.
Idioma seleccionado: ${language}. Nivel: ${level}.
- Te saludaré y mantendré una conversación coherente y relacionada a lo que digas.
- Si escribes una palabra mal en el idioma, te corregiré brevemente en español.
- Puedes pedirme temas (viajes, trabajo, etc.). ¡Empecemos!`;
    }

    const welcomeMessage = new Message({
      sessionId: session._id,
      role: 'bot',
      text: welcomeText,
      language,
      level
    });

    await welcomeMessage.save();

    res.status(201).json({
      success: true,
      message: 'Sesión creada exitosamente',
      data: {
        session: {
          id: session._id,
          language: session.language,
          level: session.level,
          startedAt: session.startedAt,
          isActive: session.isActive
        },
        welcomeMessage: {
          id: welcomeMessage._id,
          role: welcomeMessage.role,
          text: welcomeMessage.text,
          timestamp: welcomeMessage.timestamp
        }
      }
    });

  } catch (error) {
    console.error('Error creando sesión:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/sessions - Obtener sesiones del usuario
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, status = 'all' } = req.query;

    const query = { userId };
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'completed') {
      query.isActive = false;
    }

    const sessions = await Session.find(query)
      .sort({ startedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await Session.countDocuments(query);

    res.json({
      success: true,
      data: {
        sessions,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo sesiones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/sessions/:id - Obtener sesión específica
router.get('/:id', auth, async (req, res) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user._id;

    const session = await Session.findOne({ _id: sessionId, userId });
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Sesión no encontrada'
      });
    }

    res.json({
      success: true,
      data: { session }
    });

  } catch (error) {
    console.error('Error obteniendo sesión:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// PUT /api/sessions/:id/end - Terminar sesión
router.put('/:id/end', auth, async (req, res) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user._id;

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
        message: 'La sesión ya está terminada'
      });
    }

    await session.endSession();

    res.json({
      success: true,
      message: 'Sesión terminada exitosamente',
      data: {
        session: {
          id: session._id,
          duration: session.duration,
          messageCount: session.messageCount,
          endedAt: session.endedAt
        }
      }
    });

  } catch (error) {
    console.error('Error terminando sesión:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// DELETE /api/sessions/:id - Eliminar sesión y todos sus mensajes
router.delete('/:id', auth, async (req, res) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user._id;

    // Verificar que la sesión existe y pertenece al usuario
    const session = await Session.findOne({ _id: sessionId, userId });
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Sesión no encontrada'
      });
    }

    // Eliminar todos los mensajes de la sesión
    const deletedMessages = await Message.deleteMany({ sessionId });
    
    // Eliminar la sesión
    await Session.findByIdAndDelete(sessionId);

    res.json({
      success: true,
      message: 'Sesión eliminada exitosamente',
      data: {
        deletedSession: sessionId,
        deletedMessages: deletedMessages.deletedCount
      }
    });

  } catch (error) {
    console.error('Error eliminando sesión:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/sessions/available - Obtener idiomas y niveles disponibles
router.get('/available', (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        languages: BotResponseService.getAvailableLanguages(),
        levels: BotResponseService.getAvailableLevels(),
        topics: BotResponseService.getAvailableTopics()
      }
    });
  } catch (error) {
    console.error('Error obteniendo opciones disponibles:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
