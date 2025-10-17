const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const { MONGODB_URI } = process.env;

    if (!MONGODB_URI || typeof MONGODB_URI !== 'string' || MONGODB_URI.trim() === '') {
      throw new Error('Variable de entorno MONGODB_URI no definida o vacía.');
    }

    // Desde Mongoose v6+, no se necesitan useNewUrlParser/useUnifiedTopology
    const conn = await mongoose.connect(MONGODB_URI);

    console.log(`MongoDB conectado: ${conn.connection.host}`);

    // Configurar eventos de conexión
    mongoose.connection.on('error', (err) => {
      console.error('Error de MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB desconectado');
    });

    // Manejar cierre de la aplicación
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('Conexión a MongoDB cerrada');
      process.exit(0);
    });
  } catch (error) {
    // Mensaje adicional cuando el DNS SRV no se resuelve (mongodb+srv)
    if (error && (error.code === 'ENOTFOUND' || /querySrv ENOTFOUND/i.test(String(error)))) {
      console.error('No se pudo resolver el SRV de MongoDB. Verifica tu MONGODB_URI y tu DNS.');
    }
    console.error('Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
