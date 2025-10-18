const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log del error
  console.error('Error:', err);

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = {
      message,
      statusCode: 400
    };
  }

  // Error de duplicado de Mongoose
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} ya existe`;
    error = {
      message,
      statusCode: 400
    };
  }

  // Error de cast de Mongoose
  if (err.name === 'CastError') {
    const message = 'Recurso no encontrado';
    error = {
      message,
      statusCode: 404
    };
  }

  // Error JWT
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token inválido';
    error = {
      message,
      statusCode: 401
    };
  }

  // Error JWT expirado
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expirado';
    error = {
      message,
      statusCode: 401
    };
  }

  // Error de límite de archivo
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'Archivo demasiado grande';
    error = {
      message,
      statusCode: 400
    };
  }

  // Error de conexión a base de datos
  if (err.name === 'MongoNetworkError') {
    const message = 'Error de conexión a la base de datos';
    error = {
      message,
      statusCode: 500
    };
  }

  // Error de timeout
  if (err.name === 'MongoTimeoutError') {
    const message = 'Timeout de conexión a la base de datos';
    error = {
      message,
      statusCode: 500
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
