const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');

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

module.exports = app;