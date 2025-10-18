import React, { useState, useEffect } from 'react';
import { statsService } from '../services/api';
import { 
  Clock, 
  MessageSquare, 
  Globe, 
  TrendingUp, 
  Calendar,
  BarChart3,
  Loader2,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';

const PracticeSummary = ({ session, onBackToSelection, onStartNewSession }) => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      setIsLoading(true);
      const response = await statsService.getUserStats(session.userId);
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${Math.round(minutes)} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}min`;
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
      'principiante': 'bg-green-100 text-green-800',
      'intermedio': 'bg-yellow-100 text-yellow-800',
      'avanzado': 'bg-red-100 text-red-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-primary-500 mx-auto mb-4" />
          <p className="text-gray-600">Cargando resumen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Excelente práctica!
          </h1>
          <p className="text-gray-600 text-lg">
            Aquí tienes un resumen de tu sesión y progreso
          </p>
        </div>

        {/* Session Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-primary-500" />
            Resumen de la sesión
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <span className="text-3xl">{getLanguageFlag(session.language)}</span>
              </div>
              <h3 className="font-semibold text-gray-900 capitalize">{session.language}</h3>
              <p className="text-sm text-gray-600">Idioma practicado</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(session.level)}`}>
                  {session.level}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900">Nivel</h3>
              <p className="text-sm text-gray-600">Dificultad</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-500 mb-2">
                {formatDuration(session.duration || 0)}
              </div>
              <h3 className="font-semibold text-gray-900">Duración</h3>
              <p className="text-sm text-gray-600">Tiempo total</p>
            </div>
          </div>
        </div>

        {/* Overall Stats */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Total Sessions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary-500" />
                Sesiones totales
              </h3>
              <div className="text-3xl font-bold text-primary-500 mb-2">
                {stats.overview.totalSessions}
              </div>
              <p className="text-gray-600">
                {stats.overview.activeSessions} activas, {stats.overview.completedSessions} completadas
              </p>
            </div>

            {/* Total Messages */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-primary-500" />
                Mensajes totales
              </h3>
              <div className="text-3xl font-bold text-primary-500 mb-2">
                {stats.overview.totalMessages}
              </div>
              <p className="text-gray-600">
                {stats.overview.userMessages} tuyos, {stats.overview.botMessages} del bot
              </p>
            </div>
          </div>
        )}

        {/* Language Stats */}
        {stats && stats.languageStats && Object.keys(stats.languageStats).length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Globe className="h-5 w-5 mr-2 text-primary-500" />
              Práctica por idioma
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.languageStats).map(([language, data]) => (
                <div key={language} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getLanguageFlag(language)}</span>
                    <div>
                      <h4 className="font-medium text-gray-900 capitalize">{language}</h4>
                      <p className="text-sm text-gray-600">
                        {data.sessions} sesiones • {data.messages} mensajes
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-primary-500">
                      {formatDuration(data.duration)}
                    </div>
                    <p className="text-xs text-gray-500">tiempo total</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Daily Activity */}
        {stats && stats.dailyActivity && stats.dailyActivity.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary-500" />
              Actividad reciente (últimos 7 días)
            </h3>
            <div className="grid grid-cols-7 gap-2">
              {stats.dailyActivity.slice(-7).map((day, index) => (
                <div key={day.date} className="text-center">
                  <div className="text-xs text-gray-500 mb-1">
                    {new Date(day.date).toLocaleDateString('es-ES', { weekday: 'short' })}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-8 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-700">
                      {day.messages}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onBackToSelection}
            className="flex-1 bg-white text-gray-700 py-4 px-6 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Cambiar idioma/nivel
          </button>
          
          <button
            onClick={onStartNewSession}
            className="flex-1 bg-primary-500 text-white py-4 px-6 rounded-xl font-semibold hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Nueva sesión
          </button>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Consejos para mejorar</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Practica regularmente para mantener el progreso</li>
            <li>• Intenta usar nuevas palabras en cada conversación</li>
            <li>• No tengas miedo de cometer errores, es parte del aprendizaje</li>
            <li>• Varía los temas de conversación para ampliar tu vocabulario</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PracticeSummary;
