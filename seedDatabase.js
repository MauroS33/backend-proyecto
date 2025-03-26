const mongoose = require('mongoose');
require('dotenv').config(); // Cargar variables de entorno desde .env
const productsData = require('./src/data/products.json'); // Importar datos desde products.json
const Product = require('./src/models/product.model'); // Importar el modelo de Producto

// Obtener la cadena de conexión desde .env
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("La variable de entorno MONGO_URI no está definida.");
  process.exit(1); // Detener el script si no hay URI
}

// Conectar a MongoDB Atlas
mongoose.connect(MONGO_URI) // Eliminamos opciones obsoletas [[1]]
  .then(async () => {
    console.log("Conexión exitosa a MongoDB Atlas");

    // Eliminar todos los productos existentes (opcional)
    await Product.deleteMany();
    console.log("Colección 'products' vaciada.");

    // Insertar datos en la colección
    await Product.insertMany(productsData);
    console.log("Datos cargados exitosamente en la colección 'products'");
    mongoose.connection.close(); // Cerrar la conexión después de insertar
  })
  .catch(err => console.error("Error al conectar:", err));