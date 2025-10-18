import React, { useState, useEffect } from 'react';
import { sessionService } from '../services/api';
import { Clock, MessageSquare, Play, Calendar, Flag, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ConversationHistory = ({ onSelectSession, onBackToMain, onNewConversation }) => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, completed

  useEffect(() => {
    loadSessions();
  }, [filter]);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const response = await sessionService.getAll({ status: filter });
      if (response.success) {
        setSessions(response.data.sessions);
      }
    } catch (error) {
      toast.error('Error cargando historial');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId, e) => {
    e.stopPropagation(); // Evitar que se active el click de la tarjeta
    
    if (window.confirm('¿Estás seguro de que quieres eliminar esta conversación? Esta acción no se puede deshacer.')) {
      try {
        const response = await sessionService.deleteSession(sessionId);
        if (response.success) {
          toast.success('Conversación eliminada exitosamente');
          // Recargar la lista de sesiones
          loadSessions();
        } else {
          toast.error(response.message || 'Error eliminando conversación');
        }
      } catch (error) {
        toast.error('Error eliminando conversación');
        console.error('Error:', error);
      }
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
      'principiante': 'bg-green-100 text-green-800',
      'intermedio': 'bg-yellow-100 text-yellow-800',
      'avanzado': 'bg-red-100 text-red-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDuration = (session) => {
    if (session.isActive) return 'En curso';
    if (session.endedAt) {
      const duration = new Date(session.endedAt) - new Date(session.startedAt);
      const minutes = Math.floor(duration / 60000);
      return `${minutes} min`;
    }
    return 'N/A';
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando historial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-lg font-semibold text-gray-900">Historial de Conversaciones</h1>
          </div>
          
          {/* New Conversation Button */}
          <button
            onClick={onNewConversation}
            className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-full hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm font-medium">Nueva</span>
          </button>
        </div>
        
        {/* Filters */}
        <div className="flex space-x-2 mt-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-primary-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filter === 'active' 
                ? 'bg-primary-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Activas
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filter === 'completed' 
                ? 'bg-primary-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Completadas
          </button>
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-4">
        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay conversaciones</h3>
            <p className="text-gray-500 mb-6">
              {filter === 'all' 
                ? 'Aún no has iniciado ninguna conversación'
                : `No hay conversaciones ${filter === 'active' ? 'activas' : 'completadas'}`
              }
            </p>
            <button
              onClick={onNewConversation}
              className="flex items-center space-x-2 bg-primary-500 text-white px-6 py-3 rounded-full hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md mx-auto"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Iniciar nueva conversación</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session._id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onSelectSession(session)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getLanguageFlag(session.language)}</span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900 capitalize">
                          {session.language}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(session.level)}`}>
                          {session.level}
                        </span>
                        {session.isActive && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Activa
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{session.messageCount || 0} mensajes</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{getDuration(session)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-sm text-gray-500 mb-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(session.startedAt)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSession(session);
                        }}
                        className="flex items-center space-x-1 text-primary-500 hover:text-primary-600 transition-colors"
                      >
                        <Play className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {session.isActive ? 'Continuar' : 'Ver'}
                        </span>
                      </button>
                      <button
                        onClick={(e) => handleDeleteSession(session._id, e)}
                        className="flex items-center space-x-1 text-red-500 hover:text-red-600 transition-colors"
                        title="Eliminar conversación"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationHistory;
