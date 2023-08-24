const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI  ||  "mongodb://127.0.0.1:27017/test"

mongoose.connect(MONGODB_URI);

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('Error de conexión a la base de datos:', error);
});

db.once('open', () => {
  console.log('Conexión exitosa a la base de datos');
});

module.exports = db;
