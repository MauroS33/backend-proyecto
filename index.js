const { createServer } = require('http');
const { Server } = require('socket.io');
const express = require('express');
const path = require('path');

// Importar funciones de controladores
const { getAllProducts, addProduct, deleteProduct } = require('./src/controllers/product.controller');

// Crear la aplicación Express
const app = express();

// Configuración de Handlebars como motor de plantillas
const handlebars = require('express-handlebars');
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src/views'));

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear JSON
app.use(express.json());

// Importar rutas
const productsRouter = require('./src/routes/products.router');
const cartsRouter = require('./src/routes/carts.router');

// Montar las rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Rutas para vistas
app.get('/', async (req, res) => {
  const products = await getAllProducts();
  res.render('home', { title: 'Home', products });
});

app.get('/realtimeproducts', async (req, res) => {
  const products = await getAllProducts();
  res.render('realTimeProducts', { title: 'Productos en Tiempo Real', products });
});

// Crear el servidor HTTP y vincularlo con Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer);

// Configurar Socket.IO
io.on('connection', async (socket) => {
  console.log(`Nuevo cliente conectado. ID: ${socket.id}`);

  // Lista inicial de productos
  const initialProducts = await getAllProducts();
  socket.emit('updateProducts', initialProducts);

  // Escuchar eventos del cliente
  socket.on('addProduct', async (productData) => {
    await addProduct(productData);
    const updatedProducts = await getAllProducts();
    io.emit('updateProducts', updatedProducts); // Notificar a todos los clientes
  });

  socket.on('deleteProduct', async (productId) => {
    await deleteProduct(productId);
    const updatedProducts = await getAllProducts();
    io.emit('updateProducts', updatedProducts); // Notificar a todos los clientes
  });
});

// Iniciar el servidor
const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});