// Sistema de respuestas simuladas del bot por idioma y nivel
const ContentFilter = require('./contentFilter');

const responses = {
  español: {
    principiante: [
      "¡Hola! ¿Cómo estás hoy?",
      "Me gusta mucho practicar contigo.",
      "¿Qué te gusta hacer en tu tiempo libre?",
      "El clima está muy bonito hoy, ¿verdad?",
      "¿Tienes alguna mascota?",
      "Me encanta aprender nuevas palabras contigo.",
      "¿Cuál es tu comida favorita?",
      "¿Has visto alguna película interesante últimamente?",
      "¿Te gusta viajar?",
      "¿Qué haces para relajarte?"
    ],
    intermedio: [
      "Es fascinante cómo cada idioma tiene su propia personalidad.",
      "¿Has notado cómo cambia tu forma de pensar cuando cambias de idioma?",
      "La práctica constante es clave para dominar cualquier idioma.",
      "¿Cuál crees que es el aspecto más desafiante de aprender idiomas?",
      "Me parece interesante cómo la cultura influye en el lenguaje.",
      "¿Has tenido alguna experiencia divertida comunicándote en otro idioma?",
      "La comunicación no verbal también es muy importante, ¿no crees?",
      "¿Qué estrategias usas para recordar vocabulario nuevo?",
      "Cada conversación es una oportunidad de aprender algo nuevo.",
      "¿Te gustaría que hablemos de algún tema específico?"
    ],
    avanzado: [
      "La riqueza del lenguaje español radica en su diversidad cultural.",
      "¿Has explorado las diferencias entre el español de diferentes regiones?",
      "La literatura en español tiene una tradición extraordinaria.",
      "¿Qué opinas sobre la evolución del lenguaje en la era digital?",
      "La poesía en español tiene una musicalidad única.",
      "¿Has notado cómo el contexto social influye en el uso del lenguaje?",
      "La traducción es un arte que va más allá de las palabras.",
      "¿Cuál es tu perspectiva sobre el futuro de los idiomas?",
      "La comunicación efectiva requiere tanto técnica como empatía.",
      "¿Te interesa explorar algún aspecto específico de la lingüística?"
    ]
  },
  inglés: {
    principiante: [
      "Hello! How are you today?",
      "I really enjoy practicing with you.",
      "What do you like to do in your free time?",
      "The weather is very nice today, isn't it?",
      "Do you have any pets?",
      "I love learning new words with you.",
      "What's your favorite food?",
      "Have you seen any interesting movies lately?",
      "Do you like to travel?",
      "What do you do to relax?"
    ],
    intermedio: [
      "It's fascinating how each language has its own personality.",
      "Have you noticed how your thinking changes when you switch languages?",
      "Consistent practice is key to mastering any language.",
      "What do you think is the most challenging aspect of learning languages?",
      "I find it interesting how culture influences language.",
      "Have you had any funny experiences communicating in another language?",
      "Non-verbal communication is also very important, don't you think?",
      "What strategies do you use to remember new vocabulary?",
      "Every conversation is an opportunity to learn something new.",
      "Would you like to talk about any specific topic?"
    ],
    avanzado: [
      "The richness of the English language lies in its global diversity.",
      "Have you explored the differences between English varieties worldwide?",
      "English literature has an extraordinary tradition.",
      "What's your perspective on language evolution in the digital age?",
      "English poetry has a unique musicality.",
      "Have you noticed how social context influences language use?",
      "Translation is an art that goes beyond words.",
      "What's your view on the future of languages?",
      "Effective communication requires both technique and empathy.",
      "Are you interested in exploring any specific aspect of linguistics?"
    ]
  },
  francés: {
    principiante: [
      "Bonjour! Comment allez-vous aujourd'hui?",
      "J'aime beaucoup pratiquer avec vous.",
      "Que aimez-vous faire pendant votre temps libre?",
      "Le temps est très beau aujourd'hui, n'est-ce pas?",
      "Avez-vous des animaux de compagnie?",
      "J'adore apprendre de nouveaux mots avec vous.",
      "Quel est votre plat préféré?",
      "Avez-vous vu des films intéressants récemment?",
      "Aimez-vous voyager?",
      "Que faites-vous pour vous détendre?"
    ],
    intermedio: [
      "C'est fascinant comment chaque langue a sa propre personnalité.",
      "Avez-vous remarqué comment votre façon de penser change quand vous changez de langue?",
      "La pratique constante est la clé pour maîtriser n'importe quelle langue.",
      "Quel aspect de l'apprentissage des langues trouvez-vous le plus difficile?",
      "Je trouve intéressant comment la culture influence le langage.",
      "Avez-vous eu des expériences amusantes en communiquant dans une autre langue?",
      "La communication non verbale est aussi très importante, ne pensez-vous pas?",
      "Quelles stratégies utilisez-vous pour mémoriser le nouveau vocabulaire?",
      "Chaque conversation est une opportunité d'apprendre quelque chose de nouveau.",
      "Aimeriez-vous parler d'un sujet spécifique?"
    ],
    avanzado: [
      "La richesse de la langue française réside dans sa diversité culturelle.",
      "Avez-vous exploré les différences entre le français de différentes régions?",
      "La littérature française a une tradition extraordinaire.",
      "Que pensez-vous de l'évolution du langage à l'ère numérique?",
      "La poésie française a une musicalité unique.",
      "Avez-vous remarqué comment le contexte social influence l'usage du langage?",
      "La traduction est un art qui va au-delà des mots.",
      "Quelle est votre perspective sur l'avenir des langues?",
      "La communication efficace nécessite à la fois technique et empathie.",
      "Êtes-vous intéressé par l'exploration d'un aspect spécifique de la linguistique?"
    ]
  },
  portugués: {
    principiante: [
      "Olá! Como você está hoje?",
      "Eu gosto muito de praticar com você.",
      "O que você gosta de fazer no seu tempo livre?",
      "O tempo está muito bonito hoje, não é?",
      "Você tem algum animal de estimação?",
      "Eu adoro aprender novas palavras com você.",
      "Qual é a sua comida favorita?",
      "Você assistiu algum filme interessante ultimamente?",
      "Você gosta de viajar?",
      "O que você faz para relaxar?"
    ],
    intermedio: [
      "É fascinante como cada idioma tem sua própria personalidade.",
      "Você já notou como sua forma de pensar muda quando você muda de idioma?",
      "A prática constante é a chave para dominar qualquer idioma.",
      "Qual aspecto do aprendizado de idiomas você acha mais desafiador?",
      "Eu acho interessante como a cultura influencia a linguagem.",
      "Você já teve alguma experiência engraçada se comunicando em outro idioma?",
      "A comunicação não verbal também é muito importante, você não acha?",
      "Que estratégias você usa para lembrar novo vocabulário?",
      "Cada conversa é uma oportunidade de aprender algo novo.",
      "Você gostaria de falar sobre algum tópico específico?"
    ],
    avanzado: [
      "A riqueza da língua portuguesa reside em sua diversidade cultural.",
      "Você já explorou as diferenças entre o português de diferentes regiões?",
      "A literatura portuguesa tem uma tradição extraordinária.",
      "O que você pensa sobre a evolução da linguagem na era digital?",
      "A poesia portuguesa tem uma musicalidade única.",
      "Você já notou como o contexto social influencia o uso da linguagem?",
      "A tradução é uma arte que vai além das palavras.",
      "Qual é sua perspectiva sobre o futuro dos idiomas?",
      "A comunicação eficaz requer tanto técnica quanto empatia.",
      "Você está interessado em explorar algum aspecto específico da linguística?"
    ]
  },
  alemán: {
    principiante: [
      "Hallo! Wie geht es dir heute?",
      "Ich übe gerne mit dir.",
      "Was machst du gerne in deiner Freizeit?",
      "Das Wetter ist heute sehr schön, nicht wahr?",
      "Hast du Haustiere?",
      "Ich lerne gerne neue Wörter mit dir.",
      "Was ist dein Lieblingsessen?",
      "Hast du kürzlich interessante Filme gesehen?",
      "Reist du gerne?",
      "Was machst du zum Entspannen?"
    ],
    intermedio: [
      "Es ist faszinierend, wie jede Sprache ihre eigene Persönlichkeit hat.",
      "Hast du bemerkt, wie sich dein Denken ändert, wenn du die Sprache wechselst?",
      "Kontinuierliche Übung ist der Schlüssel zum Beherrschen jeder Sprache.",
      "Welchen Aspekt des Sprachenlernens findest du am herausforderndsten?",
      "Ich finde es interessant, wie die Kultur die Sprache beeinflusst.",
      "Hattest du schon lustige Erfahrungen beim Kommunizieren in einer anderen Sprache?",
      "Nonverbale Kommunikation ist auch sehr wichtig, findest du nicht?",
      "Welche Strategien verwendest du, um neues Vokabular zu behalten?",
      "Jedes Gespräch ist eine Gelegenheit, etwas Neues zu lernen.",
      "Möchtest du über ein bestimmtes Thema sprechen?"
    ],
    avanzado: [
      "Der Reichtum der deutschen Sprache liegt in ihrer kulturellen Vielfalt.",
      "Hast du die Unterschiede zwischen dem Deutschen verschiedener Regionen erkundet?",
      "Die deutsche Literatur hat eine außergewöhnliche Tradition.",
      "Was denkst du über die Sprachentwicklung im digitalen Zeitalter?",
      "Die deutsche Poesie hat eine einzigartige Musikalität.",
      "Hast du bemerkt, wie der soziale Kontext den Sprachgebrauch beeinflusst?",
      "Übersetzung ist eine Kunst, die über Worte hinausgeht.",
      "Wie ist deine Perspektive auf die Zukunft der Sprachen?",
      "Effektive Kommunikation erfordert sowohl Technik als auch Empathie.",
      "Interessierst du dich für die Erforschung eines bestimmten Aspekts der Linguistik?"
    ]
  },
  italiano: {
    principiante: [
      "Ciao! Come stai oggi?",
      "Mi piace molto praticare con te.",
      "Cosa ti piace fare nel tuo tempo libero?",
      "Il tempo è molto bello oggi, non è vero?",
      "Hai animali domestici?",
      "Adoro imparare nuove parole con te.",
      "Qual è il tuo cibo preferito?",
      "Hai visto film interessanti ultimamente?",
      "Ti piace viaggiare?",
      "Cosa fai per rilassarti?"
    ],
    intermedio: [
      "È affascinante come ogni lingua abbia la sua personalità.",
      "Hai notato come cambia il tuo modo di pensare quando cambi lingua?",
      "La pratica costante è la chiave per padroneggiare qualsiasi lingua.",
      "Quale aspetto dell'apprendimento delle lingue trovi più impegnativo?",
      "Trovo interessante come la cultura influenzi il linguaggio.",
      "Hai mai avuto esperienze divertenti comunicando in un'altra lingua?",
      "La comunicazione non verbale è anche molto importante, non credi?",
      "Che strategie usi per ricordare nuovo vocabolario?",
      "Ogni conversazione è un'opportunità per imparare qualcosa di nuovo.",
      "Ti piacerebbe parlare di un argomento specifico?"
    ],
    avanzado: [
      "La ricchezza della lingua italiana risiede nella sua diversità culturale.",
      "Hai esplorato le differenze tra l'italiano di diverse regioni?",
      "La letteratura italiana ha una tradizione straordinaria.",
      "Cosa pensi dell'evoluzione del linguaggio nell'era digitale?",
      "La poesia italiana ha una musicalità unica.",
      "Hai notato come il contesto sociale influenza l'uso del linguaggio?",
      "La traduzione è un'arte che va oltre le parole.",
      "Qual è la tua prospettiva sul futuro delle lingue?",
      "La comunicazione efficace richiede sia tecnica che empatia.",
      "Sei interessato ad esplorare qualche aspetto specifico della linguistica?"
    ]
  }
};

// Temas predefinidos para conversaciones
const topics = {
  viajes: {
    español: {
      principiante: [
        "¿A dónde te gustaría viajar?",
        "¿Cuál es tu destino favorito?",
        "¿Prefieres la playa o la montaña?",
        "¿Has viajado en avión alguna vez?"
      ],
      intermedio: [
        "¿Qué aspectos consideras al planificar un viaje?",
        "¿Has tenido alguna experiencia cultural interesante viajando?",
        "¿Cómo prefieres conocer un nuevo lugar?"
      ],
      avanzado: [
        "¿Cómo crees que el turismo afecta a las culturas locales?",
        "¿Qué opinas sobre el turismo sostenible?"
      ]
    },
    inglés: {
      principiante: [
        "Where would you like to travel?",
        "What's your favorite destination?",
        "Do you prefer beach or mountains?",
        "Have you ever traveled by plane?"
      ],
      intermedio: [
        "What aspects do you consider when planning a trip?",
        "Have you had any interesting cultural experiences while traveling?",
        "How do you prefer to explore a new place?"
      ],
      avanzado: [
        "How do you think tourism affects local cultures?",
        "What's your opinion on sustainable tourism?"
      ]
    }
  },
  trabajo: {
    español: {
      principiante: [
        "¿En qué trabajas?",
        "¿Te gusta tu trabajo?",
        "¿Qué haces en tu trabajo?",
        "¿Trabajas en una oficina?"
      ],
      intermedio: [
        "¿Cuáles son los desafíos más grandes en tu profesión?",
        "¿Cómo mantienes un equilibrio entre trabajo y vida personal?",
        "¿Qué habilidades consideras más importantes en el trabajo?"
      ],
      avanzado: [
        "¿Cómo crees que la tecnología está cambiando tu industria?",
        "¿Qué opinas sobre el trabajo remoto y sus implicaciones?"
      ]
    }
  }
};

class BotResponseService {
  static contentFilter = new ContentFilter();

  static getRandomResponse(language, level, topic = null) {
    if (topic && topics[topic] && topics[topic][language] && topics[topic][language][level]) {
      const topicResponses = topics[topic][language][level];
      return topicResponses[Math.floor(Math.random() * topicResponses.length)];
    }
    
    if (responses[language] && responses[language][level]) {
      const languageResponses = responses[language][level];
      return languageResponses[Math.floor(Math.random() * languageResponses.length)];
    }
    
    // Fallback a español principiante
    return responses.español.principiante[Math.floor(Math.random() * responses.español.principiante.length)];
  }

  static getContextualResponse(userMessage, language, level, history = []) {
    // Filtrar contenido inapropiado
    const filteredMessage = this.contentFilter.filterContent(userMessage);
    
    // Si el contenido fue filtrado, devolver sugerencia apropiada
    if (filteredMessage !== userMessage) {
      const suggestions = this.contentFilter.getAppropriateSuggestions(language, level);
      return suggestions[Math.floor(Math.random() * suggestions.length)];
    }

    const message = filteredMessage.toLowerCase();

    // Corrección simple de ortografía básica por idioma (demo)
    const correctionsEs = {
      ingles: 'inglés',
      fraces: 'francés',
      aléman: 'alemán',
      portugez: 'portugués'
    };
    for (const wrong in correctionsEs) {
      if (message.includes(wrong)) {
        return `Creo que quisiste decir "${correctionsEs[wrong]}". ¡Sigamos practicando en ${language}!`;
      }
    }
    
    // Coherencia simple: si el último mensaje del bot fue pregunta, intenta seguir en ese tema
    const lastBot = [...history].reverse().find(m => m.role === 'bot');
    if (lastBot && /\?|¿/.test(lastBot.text)) {
      // Si el usuario responde corto tipo "yes/no", pide detalle
      if (/^(yes|no|sí|nope|ajá|ok)$/i.test(message.trim())) {
        return 'Cuéntame un poco más, por favor. ¿Por qué piensas eso?';
      }
    }

    // Respuestas contextuales básicas
    if (message.includes('hola') || message.includes('hello') || message.includes('bonjour')) {
      return this.getRandomResponse(language, level);
    }
    
    if (message.includes('gracias') || message.includes('thank') || message.includes('merci')) {
      const thankResponses = {
        español: {
          principiante: ["¡De nada! Me gusta ayudarte.", "¡Es un placer!", "¡No hay problema!"],
          intermedio: ["Es un placer practicar contigo.", "Me alegra poder ayudarte.", "¡De nada! Siempre es un gusto."],
          avanzado: ["El placer es mío, siempre es enriquecedor conversar contigo.", "Me complace poder contribuir a tu aprendizaje."]
        }
      };
      
      if (thankResponses[language] && thankResponses[language][level]) {
        const responses = thankResponses[language][level];
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
    
    if (message.includes('adiós') || message.includes('bye') || message.includes('au revoir')) {
      const goodbyeResponses = {
        español: {
          principiante: ["¡Hasta luego! Fue genial practicar contigo.", "¡Nos vemos pronto!", "¡Que tengas un buen día!"],
          intermedio: ["Ha sido un placer conversar contigo. ¡Hasta la próxima!", "¡Que tengas un excelente día!"],
          avanzado: ["Ha sido una conversación muy enriquecedora. ¡Hasta pronto!"]
        }
      };
      
      if (goodbyeResponses[language] && goodbyeResponses[language][level]) {
        const responses = goodbyeResponses[language][level];
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
    
    // Si no hay respuesta contextual, devolver una aleatoria del idioma y nivel seleccionados
    return this.getRandomResponse(language, level);
  }

  static getAvailableLanguages() {
    return Object.keys(responses);
  }

  static getAvailableLevels() {
    return ['principiante', 'intermedio', 'avanzado'];
  }

  static getAvailableTopics() {
    return Object.keys(topics);
  }
}

module.exports = BotResponseService;
