// Validadores personalizados para la aplicación

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // Mínimo 6 caracteres, al menos una letra y un número
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
  return passwordRegex.test(password);
};

const validateName = (name) => {
  // Solo letras, espacios y algunos caracteres especiales
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/;
  return nameRegex.test(name);
};

const validateLanguage = (language) => {
  const validLanguages = ['español', 'inglés', 'francés', 'alemán', 'italiano', 'portugués'];
  return validLanguages.includes(language);
};

const validateLevel = (level) => {
  const validLevels = ['principiante', 'intermedio', 'avanzado'];
  return validLevels.includes(level);
};

const validateMessage = (message) => {
  if (!message || typeof message !== 'string') {
    return false;
  }
  
  const trimmedMessage = message.trim();
  
  // Verificar longitud
  if (trimmedMessage.length < 1 || trimmedMessage.length > 1000) {
    return false;
  }
  
  // Verificar que no sea solo espacios o caracteres especiales
  const hasContent = /[a-zA-ZÀ-ÿ0-9]/.test(trimmedMessage);
  if (!hasContent) {
    return false;
  }
  
  return true;
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return input;
  }
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remover caracteres HTML básicos
    .replace(/\s+/g, ' '); // Normalizar espacios
};

const validateSessionData = (data) => {
  const errors = [];
  
  if (!data.language || !validateLanguage(data.language)) {
    errors.push('Idioma no válido');
  }
  
  if (!data.level || !validateLevel(data.level)) {
    errors.push('Nivel no válido');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateUserData = (data) => {
  const errors = [];
  
  if (!data.name || !validateName(data.name)) {
    errors.push('Nombre no válido (2-50 caracteres, solo letras)');
  }
  
  if (!data.email || !validateEmail(data.email)) {
    errors.push('Email no válido');
  }
  
  if (!data.password || !validatePassword(data.password)) {
    errors.push('Contraseña no válida (mínimo 6 caracteres, al menos una letra y un número)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateLoginData = (data) => {
  const errors = [];
  
  if (!data.email || !validateEmail(data.email)) {
    errors.push('Email no válido');
  }
  
  if (!data.password || data.password.length < 6) {
    errors.push('Contraseña requerida (mínimo 6 caracteres)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateName,
  validateLanguage,
  validateLevel,
  validateMessage,
  sanitizeInput,
  validateSessionData,
  validateUserData,
  validateLoginData
};
