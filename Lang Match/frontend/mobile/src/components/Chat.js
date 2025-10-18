import React, { useState, useEffect, useRef } from 'react';
import { messageService } from '../services/api';
import socketService from '../services/socket';
import { Send, Bot, User, Clock, MessageSquare, Loader2, ArrowLeft, Home } from 'lucide-react';
import toast from 'react-hot-toast';

const Chat = ({ session, onSessionEnd, onBackToMain }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    loadMessages();
    connectToSession();
    
    return () => {
      if (session?.id) {
        socketService.leaveSession(session.id);
      }
    };
  }, [session?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const response = await messageService.getBySession(session.id);
      if (response.success) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      toast.error('Error cargando mensajes');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectToSession = () => {
    if (session?.id) {
      socketService.joinSession(session.id);
      
      // Escuchar nuevos mensajes
      socketService.onNewMessage((data) => {
        if (data.sessionId === session.id) {
          setMessages(prev => [...prev, data.message]);
        }
      });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || isSending) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setIsSending(true);

    try {
      const response = await messageService.send({
        sessionId: session.id,
        text: messageText
      });

      if (response.success) {
        // Agregar mensaje del usuario
        setMessages(prev => [...prev, response.data.userMessage]);
        
        // Agregar respuesta del bot
        setTimeout(() => {
          setMessages(prev => [...prev, response.data.botMessage]);
        }, 1000);
      } else {
        toast.error(response.message || 'Error enviando mensaje');
        setNewMessage(messageText); // Restaurar mensaje
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error enviando mensaje';
      toast.error(message);
      setNewMessage(messageText); // Restaurar mensaje
      console.error('Error:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-primary-500 mx-auto mb-4" />
          <p className="text-gray-600">Cargando conversación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          {/* Left side - Back button */}
          <button
            onClick={onBackToMain}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary-500 transition-colors p-2 -m-2 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Regresar</span>
          </button>
          
          {/* Center - Language info */}
          <div className="flex items-center space-x-3">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <span className="text-2xl">{getLanguageFlag(session.language)}</span>
                <h2 className="font-semibold text-gray-900 capitalize text-lg">
                  {session.language}
                </h2>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(session.level)}`}>
                {session.level}
              </span>
            </div>
          </div>
          
          {/* Right side - Message count */}
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <MessageSquare className="h-4 w-4" />
            <span className="font-medium">{messages.length}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.role === 'bot' && (
                  <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
                )}
                {message.role === 'user' && (
                  <User className="h-4 w-4 mt-1 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <div className="flex items-center mt-1 space-x-1">
                    <Clock className="h-3 w-3 opacity-70" />
                    <span className="text-xs opacity-70">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isSending && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-3 rounded-2xl">
              <div className="flex items-center space-x-2">
                <Bot className="h-4 w-4" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje aquí..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              rows="1"
              style={{ minHeight: '48px', maxHeight: '120px' }}
              disabled={isSending}
            />
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="bg-primary-500 text-white p-3 rounded-xl hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
        
        <div className="mt-2 text-xs text-gray-500 text-center">
          Presiona Enter para enviar, Shift+Enter para nueva línea
        </div>
      </div>
    </div>
  );
};

export default Chat;
