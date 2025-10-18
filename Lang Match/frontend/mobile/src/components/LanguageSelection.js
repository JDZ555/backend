import React, { useState, useEffect } from 'react';
import { sessionService } from '../services/api';
import { Globe, Star, ArrowRight, Loader2, History } from 'lucide-react';
import toast from 'react-hot-toast';

const LanguageSelection = ({ onSessionCreated, onViewHistory }) => {
  const [languages, setLanguages] = useState([]);
  const [levels, setLevels] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadAvailableOptions();
  }, []);

  const loadAvailableOptions = async () => {
    try {
      const response = await sessionService.getAvailable();
      if (response.success) {
        setLanguages(response.data.languages);
        setLevels(response.data.levels);
      }
    } catch (error) {
      // Fallback silencioso para permitir selección aun si la API falla
      setLanguages(['español', 'inglés', 'francés', 'alemán', 'italiano', 'portugués']);
      setLevels(['principiante', 'intermedio', 'avanzado']);
      console.warn('Opciones por defecto cargadas (no se pudo contactar el API):', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
  };

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
  };

  const handleStartSession = async () => {
    if (!selectedLanguage || !selectedLevel) {
      toast.error('Por favor selecciona un idioma y nivel');
      return;
    }

    try {
      setIsCreating(true);
      const response = await sessionService.create({
        language: selectedLanguage,
        level: selectedLevel
      });

      if (response.success) {
        toast.success('¡Sesión iniciada!');
        onSessionCreated(response.data);
      } else {
        toast.error(response.message || 'Error iniciando sesión');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error iniciando sesión';
      toast.error(message);
      console.error('Error:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const getLanguageFlag = (language) => {
    const flags = {
      'español': '🇪🇸',
      'inglés': '🇺🇸',
      'francés': '🇫🇷',
      'alemán': '🇩🇪',
      'italiano': '🇮🇹',
      'portugués': '🇵🇹'
    };
    return flags[language] || '🌍';
  };

  const getLevelColor = (level) => {
    const colors = {
      'principiante': 'bg-green-100 text-green-800 border-green-200',
      'intermedio': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'avanzado': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[level] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getLevelDescription = (level) => {
    const descriptions = {
      'principiante': 'Frases básicas y vocabulario simple',
      'intermedio': 'Conversaciones más complejas y temas diversos',
      'avanzado': 'Debates profundos y expresiones idiomáticas'
    };
    return descriptions[level] || '';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-primary-500 mx-auto mb-4" />
          <p className="text-gray-600">Cargando opciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Globe className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Comencemos a practicar!
          </h1>
          <p className="text-gray-600 text-lg">
            Selecciona el idioma y nivel que quieres practicar
          </p>
        </div>

        {/* Language Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Globe className="h-5 w-5 mr-2 text-primary-500" />
            Selecciona un idioma
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {languages.map((language) => (
              <button
                key={language}
                onClick={() => handleLanguageSelect(language)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedLanguage === language
                    ? 'border-primary-500 bg-primary-50 text-primary-900'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{getLanguageFlag(language)}</span>
                  <span className="font-medium capitalize">{language}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Level Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Star className="h-5 w-5 mr-2 text-primary-500" />
            Selecciona tu nivel
          </h2>
          <div className="space-y-3">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => handleLevelSelect(level)}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedLevel === level
                    ? 'border-primary-500 bg-primary-50 text-primary-900'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center mb-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getLevelColor(level)}`}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{getLevelDescription(level)}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedLevel === level
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-gray-300'
                  }`} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Start Session Button */}
        <div className="space-y-3">
          <button
            onClick={handleStartSession}
            disabled={!selectedLanguage || !selectedLevel || isCreating}
            className="w-full bg-primary-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            {isCreating ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Iniciando sesión...
              </>
            ) : (
              <>
                Comenzar práctica
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </button>
        </div>

        {/* Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Puedes cambiar de idioma y nivel en cualquier momento
          </p>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;
