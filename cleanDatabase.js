const mongoose = require('mongoose');
require('dotenv').config();

// Obtener la cadena de conexión desde .env
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("La variable de entorno MONGO_URI no está definida.");
  process.exit(1); // Detener el script si no hay URI
}

// Conectar a MongoDB Atlas
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("Conexión exitosa a MongoDB Atlas");

    // Eliminar campos innecesarios
    const result = await mongoose.connection.db.collection('products').updateMany(
      {}, // Filtro: todos los documentos
      { $unset: { id: "", code: "", status: "" } } // Elimina los campos
    );

    console.log(`Campos eliminados de ${result.modifiedCount} documentos.`);
    mongoose.connection.close();
  })
  .catch(err => console.error("Error al conectar:", err));