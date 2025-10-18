const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: [true, 'El ID de la sesión es requerido']
  },
  role: {
    type: String,
    required: [true, 'El rol es requerido'],
    enum: {
      values: ['user', 'bot'],
      message: 'El rol debe ser "user" o "bot"'
    }
  },
  text: {
    type: String,
    required: [true, 'El texto del mensaje es requerido'],
    trim: true,
    maxlength: [1000, 'El mensaje no puede exceder 1000 caracteres']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  language: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  // Para futuras funcionalidades de análisis
  sentiment: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    default: 'neutral'
  },
  topic: {
    type: String,
    default: 'general'
  }
});

// Índices para optimizar consultas
messageSchema.index({ sessionId: 1, timestamp: 1 });
messageSchema.index({ role: 1, timestamp: 1 });
messageSchema.index({ language: 1, level: 1 });

// Middleware para actualizar contador de mensajes en la sesión
messageSchema.post('save', async function() {
  try {
    const Session = mongoose.model('Session');
    await Session.findByIdAndUpdate(
      this.sessionId,
      { $inc: { messageCount: 1 } }
    );
  } catch (error) {
    console.error('Error actualizando contador de mensajes:', error);
  }
});

module.exports = mongoose.model('Message', messageSchema);
