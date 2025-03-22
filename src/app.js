const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose'); // Importar Mongoose
require('dotenv').config(); // Cargar variables de entorno

// Crear la aplicación Express
const app = express();

// Configuración de Handlebars como motor de plantillas
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, '../../public')));

// Middleware para parsear JSON
app.use(express.json());

// Importar rutas
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');

// Montar las rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta home.handlebars
app.get('/', async (req, res) => {
  const products = await require('./controllers/product.controller').getAllProducts();
  res.render('home', { title: 'Home', products });
});

// Ruta realTimeProducts.handlebars
app.get('/realtimeproducts', async (req, res) => {
  const products = await require('./controllers/product.controller').getAllProducts();
  res.render('realTimeProducts', { title: 'Productos en Tiempo Real', products });
});

// Conexión a MongoDB Atlas
const MONGO_URI = process.env.MONGO_URI; // Obtener la cadena de conexión desde .env
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Conexión exitosa a MongoDB Atlas"))
  .catch(err => console.error("Error al conectar:", err));

module.exports = app;