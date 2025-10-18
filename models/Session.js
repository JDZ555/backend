const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El ID del usuario es requerido']
  },
  language: {
    type: String,
    required: [true, 'El idioma es requerido'],
    enum: {
      values: ['español', 'inglés', 'francés', 'alemán', 'italiano', 'portugués'],
      message: 'Idioma no soportado'
    }
  },
  level: {
    type: String,
    required: [true, 'El nivel es requerido'],
    enum: {
      values: ['principiante', 'intermedio', 'avanzado'],
      message: 'Nivel no válido'
    }
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  endedAt: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  messageCount: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number, // en minutos
    default: 0
  }
});

// Middleware para calcular duración cuando se termina la sesión
sessionSchema.pre('save', function(next) {
  if (this.endedAt && this.isActive) {
    this.duration = Math.round((this.endedAt - this.startedAt) / (1000 * 60)); // en minutos
    this.isActive = false;
  }
  next();
});

// Método para terminar la sesión
sessionSchema.methods.endSession = function() {
  this.endedAt = new Date();
  this.isActive = false;
  return this.save();
};

// Método para incrementar contador de mensajes
sessionSchema.methods.incrementMessageCount = function() {
  this.messageCount += 1;
  return this.save();
};

module.exports = mongoose.model('Session', sessionSchema);
