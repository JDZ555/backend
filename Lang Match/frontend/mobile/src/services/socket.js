import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://54.221.176.45:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        autoConnect: true,
      });

      this.socket.on('connect', () => {
        console.log('Conectado al servidor Socket.IO');
        this.isConnected = true;
      });

      this.socket.on('disconnect', () => {
        console.log('Desconectado del servidor Socket.IO');
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Error de conexión Socket.IO:', error);
        this.isConnected = false;
      });
    }

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinSession(sessionId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-session', sessionId);
    }
  }

  leaveSession(sessionId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave-session', sessionId);
    }
  }

  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('new-message', callback);
    }
  }

  offNewMessage(callback) {
    if (this.socket) {
      this.socket.off('new-message', callback);
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('user-typing', callback);
    }
  }

  offUserTyping(callback) {
    if (this.socket) {
      this.socket.off('user-typing', callback);
    }
  }

  emitUserTyping(sessionId, isTyping) {
    if (this.socket && this.isConnected) {
      this.socket.emit('user-typing', { sessionId, isTyping });
    }
  }
}

// Crear instancia singleton
const socketService = new SocketService();

export default socketService;
