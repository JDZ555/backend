import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';
import Register from './Register';
import LanguageSelection from './LanguageSelection';
import Chat from './Chat';
import ConversationHistory from './ConversationHistory';
import PracticeSummary from './PracticeSummary';
import { LogOut, User, Settings, History, Plus } from 'lucide-react';

const App = () => {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const [authMode, setAuthMode] = useState('login');
  const [currentView, setCurrentView] = useState('selection');
  const [currentSession, setCurrentSession] = useState(null);

  const handleAuthModeToggle = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
  };

  const handleSessionCreated = (sessionData) => {
    setCurrentSession({
      id: sessionData.session.id,
      language: sessionData.session.language,
      level: sessionData.session.level,
      startedAt: sessionData.session.startedAt,
      isActive: sessionData.session.isActive,
      userId: user.id
    });
    setCurrentView('chat');
  };

  const handleSessionEnd = () => {
    setCurrentView('summary');
  };

  const handleBackToSelection = () => {
    setCurrentView('selection');
    setCurrentSession(null);
  };

  const handleBackToMain = () => {
    setCurrentView('selection');
    setCurrentSession(null);
  };

  const handleStartNewSession = () => {
    setCurrentView('selection');
    setCurrentSession(null);
  };

  const handleViewHistory = () => {
    setCurrentView('history');
  };

  const handleNewConversation = () => {
    setCurrentView('selection');
    setCurrentSession(null);
  };

  const handleSelectSession = (session) => {
    setCurrentSession({
      id: session._id,
      language: session.language,
      level: session.level,
      startedAt: session.startedAt,
      isActive: session.isActive,
      userId: user.id
    });
    setCurrentView('chat');
  };

  const handleLogout = () => {
    logout();
    setCurrentView('selection');
    setCurrentSession(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-gentle">
            <span className="text-2xl font-bold text-white">LM</span>
          </div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        {authMode === 'login' ? (
          <Login onToggleMode={handleAuthModeToggle} />
        ) : (
          <Register onToggleMode={handleAuthModeToggle} />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-sm font-bold text-white">LM</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Lang Match</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{user.name}</span>
              </div>
              
              <button
                onClick={handleViewHistory}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">Historial</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Cerrar sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative">
        {currentView === 'selection' && (
          <LanguageSelection 
            onSessionCreated={handleSessionCreated}
            onViewHistory={handleViewHistory}
          />
        )}
        
        {currentView === 'history' && (
          <div className="h-screen flex flex-col">
            <ConversationHistory 
              onSelectSession={handleSelectSession}
              onBackToMain={handleBackToMain}
              onNewConversation={handleNewConversation}
            />
          </div>
        )}
        
        {currentView === 'chat' && currentSession && (
          <div className="h-screen flex flex-col">
            <Chat 
              session={currentSession} 
              onSessionEnd={handleSessionEnd}
              onBackToMain={handleBackToMain}
            />
          </div>
        )}
        
        {currentView === 'summary' && currentSession && (
          <PracticeSummary 
            session={currentSession}
            onBackToSelection={handleBackToSelection}
            onStartNewSession={handleStartNewSession}
          />
        )}
        
        {/* Floating Action Button for New Conversation */}
        {currentView === 'selection' && (
          <button
            onClick={handleViewHistory}
            className="fixed bottom-6 right-6 bg-primary-500 text-white p-4 rounded-full shadow-lg hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 hover:shadow-xl z-50"
          >
            <History className="h-6 w-6" />
          </button>
        )}
      </main>
    </div>
  );
};

export default App;
