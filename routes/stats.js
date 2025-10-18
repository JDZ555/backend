const express = require('express');
const Session = require('../models/Session');
const Message = require('../models/Message');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const router = express.Router();

// GET /api/stats/user/:id - Métricas por usuario
router.get('/user/:id', auth, async (req, res) => {
  try {
    const userId = req.params.id;
    const requestingUserId = req.user._id;

    // Verificar que el usuario solo puede ver sus propias estadísticas
    if (userId !== requestingUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver estas estadísticas'
      });
    }

    // Verificar que el usuario existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Obtener estadísticas de sesiones
    const sessions = await Session.find({ userId });
    const activeSessions = sessions.filter(s => s.isActive);
    const completedSessions = sessions.filter(s => !s.isActive);

    // Calcular métricas de sesiones
    const totalSessions = sessions.length;
    const totalDuration = completedSessions.reduce((sum, session) => sum + (session.duration || 0), 0);
    const averageDuration = completedSessions.length > 0 ? totalDuration / completedSessions.length : 0;

    // Obtener estadísticas de mensajes
    const sessionIds = sessions.map(s => s._id);
    const messages = await Message.find({ sessionId: { $in: sessionIds } });
    
    const userMessages = messages.filter(m => m.role === 'user');
    const botMessages = messages.filter(m => m.role === 'bot');
    const totalMessages = messages.length;

    // Estadísticas por idioma
    const languageStats = {};
    sessions.forEach(session => {
      if (!languageStats[session.language]) {
        languageStats[session.language] = {
          sessions: 0,
          duration: 0,
          messages: 0
        };
      }
      languageStats[session.language].sessions += 1;
      languageStats[session.language].duration += session.duration || 0;
    });

    // Contar mensajes por idioma
    const messagesByLanguage = await Message.aggregate([
      { $match: { sessionId: { $in: sessionIds } } },
      { $lookup: { from: 'sessions', localField: 'sessionId', foreignField: '_id', as: 'session' } },
      { $unwind: '$session' },
      { $group: { _id: '$session.language', count: { $sum: 1 } } }
    ]);

    messagesByLanguage.forEach(item => {
      if (languageStats[item._id]) {
        languageStats[item._id].messages = item.count;
      }
    });

    // Estadísticas por nivel
    const levelStats = {};
    sessions.forEach(session => {
      if (!levelStats[session.level]) {
        levelStats[session.level] = {
          sessions: 0,
          duration: 0,
          messages: 0
        };
      }
      levelStats[session.level].sessions += 1;
      levelStats[session.level].duration += session.duration || 0;
    });

    // Contar mensajes por nivel
    const messagesByLevel = await Message.aggregate([
      { $match: { sessionId: { $in: sessionIds } } },
      { $lookup: { from: 'sessions', localField: 'sessionId', foreignField: '_id', as: 'session' } },
      { $unwind: '$session' },
      { $group: { _id: '$session.level', count: { $sum: 1 } } }
    ]);

    messagesByLevel.forEach(item => {
      if (levelStats[item._id]) {
        levelStats[item._id].messages = item.count;
      }
    });

    // Actividad por día (últimos 30 días)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyActivity = await Message.aggregate([
      { 
        $match: { 
          sessionId: { $in: sessionIds },
          timestamp: { $gte: thirtyDaysAgo }
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' }
          },
          messages: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          joinedAt: user.createdAt,
          lastLogin: user.lastLogin
        },
        overview: {
          totalSessions,
          activeSessions: activeSessions.length,
          completedSessions: completedSessions.length,
          totalDuration: Math.round(totalDuration),
          averageDuration: Math.round(averageDuration * 100) / 100,
          totalMessages,
          userMessages: userMessages.length,
          botMessages: botMessages.length
        },
        languageStats,
        levelStats,
        dailyActivity: dailyActivity.map(day => ({
          date: new Date(day._id.year, day._id.month - 1, day._id.day).toISOString().split('T')[0],
          messages: day.messages
        }))
      }
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas del usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/stats/global - Métricas globales
router.get('/global', auth, async (req, res) => {
  try {
    // Verificar que el usuario es admin (opcional - por ahora permitir a todos)
    // En producción, deberías verificar roles de administrador

    // Estadísticas generales
    const totalUsers = await User.countDocuments();
    const totalSessions = await Session.countDocuments();
    const totalMessages = await Message.countDocuments();
    const activeSessions = await Session.countDocuments({ isActive: true });

    // Usuarios registrados en los últimos 30 días
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    // Estadísticas por idioma
    const languageStats = await Session.aggregate([
      {
        $group: {
          _id: '$language',
          sessions: { $sum: 1 },
          totalDuration: { $sum: '$duration' },
          averageDuration: { $avg: '$duration' }
        }
      },
      { $sort: { sessions: -1 } }
    ]);

    // Estadísticas por nivel
    const levelStats = await Session.aggregate([
      {
        $group: {
          _id: '$level',
          sessions: { $sum: 1 },
          totalDuration: { $sum: '$duration' },
          averageDuration: { $avg: '$duration' }
        }
      },
      { $sort: { sessions: -1 } }
    ]);

    // Mensajes por día (últimos 30 días)
    const dailyMessages = await Message.aggregate([
      {
        $match: {
          timestamp: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' }
          },
          messages: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Usuarios más activos (por número de mensajes)
    const mostActiveUsers = await Message.aggregate([
      {
        $lookup: {
          from: 'sessions',
          localField: 'sessionId',
          foreignField: '_id',
          as: 'session'
        }
      },
      { $unwind: '$session' },
      {
        $group: {
          _id: '$session.userId',
          messageCount: { $sum: 1 }
        }
      },
      { $sort: { messageCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          userId: '$_id',
          name: '$user.name',
          email: '$user.email',
          messageCount: 1
        }
      }
    ]);

    // Duración promedio de sesiones
    const completedSessions = await Session.find({ isActive: false, duration: { $gt: 0 } });
    const averageSessionDuration = completedSessions.length > 0 
      ? completedSessions.reduce((sum, session) => sum + session.duration, 0) / completedSessions.length 
      : 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalSessions,
          totalMessages,
          activeSessions,
          newUsers,
          averageSessionDuration: Math.round(averageSessionDuration * 100) / 100
        },
        languageStats: languageStats.map(lang => ({
          language: lang._id,
          sessions: lang.sessions,
          totalDuration: Math.round(lang.totalDuration || 0),
          averageDuration: Math.round((lang.averageDuration || 0) * 100) / 100
        })),
        levelStats: levelStats.map(level => ({
          level: level._id,
          sessions: level.sessions,
          totalDuration: Math.round(level.totalDuration || 0),
          averageDuration: Math.round((level.averageDuration || 0) * 100) / 100
        })),
        dailyMessages: dailyMessages.map(day => ({
          date: new Date(day._id.year, day._id.month - 1, day._id.day).toISOString().split('T')[0],
          messages: day.messages
        })),
        mostActiveUsers
      }
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas globales:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
