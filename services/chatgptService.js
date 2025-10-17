const OpenAI = require('openai');

class ChatGPTService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateResponse(userMessage, language, level, conversationHistory = []) {
    try {
      // Detectar si el mensaje está en español
      const isSpanish = this.isSpanishMessage(userMessage);
      
      // Construir el contexto del sistema
      const systemPrompt = this.buildSystemPrompt(language, level);
      
      // Preparar mensajes para la API
      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-10), // Últimos 10 mensajes para contexto
        { role: 'user', content: userMessage }
      ];

      // Si es español, agregar instrucción específica
      if (isSpanish) {
        messages[messages.length - 1].content = `[USUARIO ESCRIBIÓ EN ESPAÑOL] ${userMessage}`;
      }

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 200, // Aumentado para permitir respuestas bilingües
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      return completion.choices[0].message.content.trim();

    } catch (error) {
      console.error('Error con ChatGPT:', error);
      
      // Fallback a respuestas básicas si ChatGPT falla
      return this.getFallbackResponse(language, level);
    }
  }

  buildSystemPrompt(language, level) {
    const languageMap = {
      'español': 'Spanish',
      'inglés': 'English', 
      'francés': 'French',
      'alemán': 'German',
      'italiano': 'Italian',
      'portugués': 'Portuguese'
    };

    const levelMap = {
      'principiante': 'beginner',
      'intermedio': 'intermediate', 
      'avanzado': 'advanced'
    };

    const targetLanguage = languageMap[language] || 'English';
    const proficiencyLevel = levelMap[level] || 'intermediate';

    return `Eres un chatbot profesor de idiomas especializado en la práctica conversacional y corrección lingüística. Tu función es ayudar a los usuarios a practicar seis idiomas: español, inglés, alemán, francés, portugués e italiano.

Reglas de comportamiento:
1. Siempre inicia la conversación en español, explicando brevemente la práctica o actividad que realizará el usuario.
2. Cuando el usuario responda, analiza su respuesta y:
   - Corrige sus errores primero en español.
   - Luego, da la versión corregida o explicada en el idioma que se está practicando.
3. No debes responder ni dar información sobre temas fuera del aprendizaje y práctica de idiomas. 
4. No debes hablar sobre ti mismo, sobre tecnología, ni sobre otros temas distintos a la práctica.
5. Mantén un tono educativo, amable y paciente, como un profesor nativo que motiva al estudiante.
6. Si el usuario no especifica el idioma de práctica, asume que es español y sugiere escoger uno de los seis idiomas disponibles.
7. Usa ejemplos cortos y naturales, evitando tecnicismos innecesarios.

Objetivo: ser un asistente que corrige, guía y enseña únicamente dentro del contexto de práctica de idiomas. Nada fuera de ese propósito.

Sesión actual: Practicando ${targetLanguage} nivel ${proficiencyLevel}.`;
  }

  getFallbackResponse(language, level) {
    const responses = {
      'español': {
        'principiante': ['¡Hola! ¿Cómo estás hoy?', '¿Qué te gusta hacer en tu tiempo libre?', '¿Tienes mascotas?'],
        'intermedio': ['¿Has viajado a algún país hispanohablante?', '¿Cuál es tu comida española favorita?', '¿Qué opinas del clima hoy?'],
        'avanzado': ['¿Crees que la tecnología está cambiando la forma de comunicarnos?', '¿Cuál es tu perspectiva sobre la globalización?', '¿Qué desafíos enfrenta la sociedad moderna?']
      },
      'inglés': {
        'principiante': ['Hello! How are you today?', 'What do you like to do?', 'Do you have any pets?'],
        'intermedio': ['Have you traveled to any English-speaking countries?', 'What\'s your favorite English food?', 'What do you think about today\'s weather?'],
        'avanzado': ['Do you think technology is changing how we communicate?', 'What\'s your perspective on globalization?', 'What challenges does modern society face?']
      },
      'francés': {
        'principiante': ['Bonjour! Comment allez-vous?', 'Qu\'est-ce que vous aimez faire?', 'Avez-vous des animaux?'],
        'intermedio': ['Avez-vous voyagé dans des pays francophones?', 'Quel est votre plat français préféré?', 'Que pensez-vous du temps aujourd\'hui?'],
        'avanzado': ['Pensez-vous que la technologie change notre façon de communiquer?', 'Quelle est votre perspective sur la mondialisation?', 'Quels défis la société moderne affronte-t-elle?']
      }
    };

    const languageResponses = responses[language] || responses['inglés'];
    const levelResponses = languageResponses[level] || languageResponses['intermedio'];
    
    return levelResponses[Math.floor(Math.random() * levelResponses.length)];
  }

  // Método para detectar si el mensaje está en español
  isSpanishMessage(message) {
    const spanishWords = [
      'hola', 'gracias', 'por favor', 'sí', 'no', 'buenos', 'días', 'tarde', 'noche',
      'cómo', 'estás', 'qué', 'cuándo', 'dónde', 'por qué', 'quién', 'cuál',
      'me', 'te', 'le', 'nos', 'os', 'les', 'mi', 'tu', 'su', 'nuestro', 'vuestro',
      'soy', 'eres', 'es', 'somos', 'sois', 'son', 'tengo', 'tienes', 'tiene',
      'quiero', 'quieres', 'quiere', 'puedo', 'puedes', 'puede', 'voy', 'vas', 'va',
      'estoy', 'estás', 'está', 'estamos', 'estáis', 'están', 'hago', 'haces', 'hace',
      'gusta', 'gustan', 'mejor', 'peor', 'bueno', 'malo', 'grande', 'pequeño',
      'mucho', 'poco', 'más', 'menos', 'muy', 'bastante', 'demasiado'
    ];
    
    const messageLower = message.toLowerCase();
    const spanishCount = spanishWords.filter(word => messageLower.includes(word)).length;
    const totalWords = messageLower.split(/\s+/).length;
    
    // Si más del 30% de las palabras son españolas, considerarlo español
    return spanishCount > 0 && (spanishCount / totalWords) > 0.3;
  }

  // Método para detectar errores comunes y sugerir correcciones
  detectAndCorrectErrors(userMessage, targetLanguage) {
    const commonErrors = {
      'español': {
        'fraces': 'frases',
        'aléman': 'alemán', 
        'grasias': 'gracias',
        'kiero': 'quiero',
        'ablamos': 'hablamos',
        'escribir': 'escribir',
        'hola': 'hola'
      },
      'inglés': {
        'helo': 'hello',
        'thaks': 'thanks',
        'writting': 'writing',
        'speking': 'speaking',
        'recieve': 'receive',
        'occured': 'occurred'
      },
      'francés': {
        'bonjoure': 'bonjour',
        'merci': 'merci',
        'ecrire': 'écrire',
        'parler': 'parler'
      },
      'portugués': {
        'ola': 'olá',
        'obrigado': 'obrigado',
        'escrever': 'escrever',
        'falar': 'falar',
        'voce': 'você'
      },
      'alemán': {
        'hallo': 'hallo',
        'danke': 'danke',
        'schreiben': 'schreiben',
        'sprechen': 'sprechen'
      },
      'italiano': {
        'ciao': 'ciao',
        'grazie': 'grazie',
        'scrivere': 'scrivere',
        'parlare': 'parlare'
      }
    };

    const errors = commonErrors[targetLanguage] || {};
    const message = userMessage.toLowerCase();
    
    for (const [error, correction] of Object.entries(errors)) {
      if (message.includes(error) && error !== correction) {
        return `Creo que quisiste decir "${correction}". ¡Sigue practicando!`;
      }
    }
    
    return null;
  }
}

module.exports = new ChatGPTService();
