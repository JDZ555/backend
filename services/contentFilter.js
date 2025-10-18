// Filtro simple de contenido inapropiado
class ContentFilter {
  constructor() {
    // Lista de palabras inapropiadas (ejemplo básico)
    this.inappropriateWords = [
      'odio', 'violencia', 'agresión', 'discriminación',
      'hate', 'violence', 'discrimination', 'racism',
      'haine', 'violence', 'discrimination', 'racisme',
      'hass', 'gewalt', 'diskriminierung', 'rassismus',
      'odio', 'violenza', 'discriminazione', 'razzismo',
      'ódio', 'violência', 'discriminação', 'racismo'
    ];

    // Patrones de contenido inapropiado
    this.patterns = [
      /[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]{5,}/g, // Caracteres especiales excesivos
      /\b\d{10,}\b/g, // Números largos (posibles números de teléfono)
      /https?:\/\/[^\s]+/g, // URLs
      /@\w+/g, // Menciones de usuario
    ];
  }

  // Verificar si el contenido es apropiado
  isAppropriate(text) {
    if (!text || typeof text !== 'string') {
      return false;
    }

    const lowerText = text.toLowerCase();

    // Verificar palabras inapropiadas
    for (const word of this.inappropriateWords) {
      if (lowerText.includes(word.toLowerCase())) {
        return false;
      }
    }

    // Verificar patrones sospechosos
    for (const pattern of this.patterns) {
      if (pattern.test(text)) {
        return false;
      }
    }

    // Verificar longitud excesiva
    if (text.length > 1000) {
      return false;
    }

    return true;
  }

  // Filtrar contenido inapropiado
  filterContent(text) {
    if (!this.isAppropriate(text)) {
      return 'Lo siento, no puedo procesar ese tipo de contenido. Por favor, mantén la conversación educativa y respetuosa.';
    }

    // Limpiar texto básico
    let cleanText = text.trim();
    
    // Remover caracteres especiales excesivos
    cleanText = cleanText.replace(/[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]{3,}/g, '');
    
    // Limitar longitud
    if (cleanText.length > 1000) {
      cleanText = cleanText.substring(0, 1000) + '...';
    }

    return cleanText;
  }

  // Obtener sugerencias de contenido apropiado
  getAppropriateSuggestions(language, level) {
    const suggestions = {
      español: {
        principiante: [
          'Hablemos sobre tu día',
          '¿Qué te gusta hacer en tu tiempo libre?',
          'Cuéntame sobre tu familia',
          '¿Cuál es tu comida favorita?',
          '¿Tienes alguna mascota?'
        ],
        intermedio: [
          '¿Qué opinas sobre la tecnología actual?',
          'Cuéntame sobre un viaje que hayas hecho',
          '¿Cuál es tu libro favorito?',
          '¿Qué haces para relajarte?',
          '¿Tienes algún hobby interesante?'
        ],
        avanzado: [
          '¿Cuál es tu perspectiva sobre el cambio climático?',
          'Hablemos sobre la importancia de la educación',
          '¿Qué opinas sobre la globalización?',
          'Cuéntame sobre una experiencia que te haya marcado',
          '¿Cuál es tu filosofía de vida?'
        ]
      },
      inglés: {
        principiante: [
          'Tell me about your day',
          'What do you like to do in your free time?',
          'Tell me about your family',
          'What\'s your favorite food?',
          'Do you have any pets?'
        ],
        intermedio: [
          'What do you think about current technology?',
          'Tell me about a trip you\'ve taken',
          'What\'s your favorite book?',
          'What do you do to relax?',
          'Do you have any interesting hobbies?'
        ],
        avanzado: [
          'What\'s your perspective on climate change?',
          'Let\'s talk about the importance of education',
          'What do you think about globalization?',
          'Tell me about an experience that marked you',
          'What\'s your life philosophy?'
        ]
      }
    };

    return suggestions[language]?.[level] || suggestions.español.principiante;
  }
}

module.exports = ContentFilter;
