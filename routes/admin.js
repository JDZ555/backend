const express = require('express');
const Session = require('../models/Session');
const Message = require('../models/Message');
const { auth, ensureAdmin } = require('../middleware/auth');

const router = express.Router();

// Todas las rutas de este archivo requieren auth + admin
router.use(auth, ensureAdmin);

// GET /api/admin/sessions - listar sesiones de todos los usuarios con filtros
router.get('/sessions', async (req, res) => {
  try {
    const { page = 1, limit = 20, language, level, status = 'all' } = req.query;

    const query = {};
    if (language) query.language = language;
    if (level) query.level = level;
    if (status === 'active') query.isActive = true;
    if (status === 'completed') query.isActive = false;

    const sessions = await Session.find(query)
      .populate('userId', 'name email')
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
    console.error('Error admin obteniendo sesiones:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// GET /api/admin/messages - listar mensajes de todos los usuarios con filtros
router.get('/messages', async (req, res) => {
  try {
    const { page = 1, limit = 50, role, language, level, startDate, endDate } = req.query;

    const sessionQuery = {};
    if (language) sessionQuery.language = language;
    if (level) sessionQuery.level = level;
    const sessions = await Session.find(sessionQuery).select('_id');
    const sessionIds = sessions.map(s => s._id);

    const messageQuery = { sessionId: { $in: sessionIds } };
    if (role) messageQuery.role = role;
    if (startDate || endDate) {
      messageQuery.timestamp = {};
      if (startDate) messageQuery.timestamp.$gte = new Date(startDate);
      if (endDate) messageQuery.timestamp.$lte = new Date(endDate);
    }

    const messages = await Message.find(messageQuery)
      .populate('sessionId', 'language level startedAt userId')
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
    console.error('Error admin obteniendo mensajes:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

module.exports = router;
