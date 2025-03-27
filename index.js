const { createServer } = require('http');
const { Server } = require('socket.io');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
const session = require('express-session');

// Importar funciones de controladores
const { getAllProducts, addProduct, deleteProduct } = require('./src/controllers/product.controller');

// Crear la aplicación Express
const app = express();

// Configuración de Handlebars como motor de plantillas
const handlebars = require('express-handlebars');
app.engine('handlebars', handlebars.engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  },
  helpers: {
    ifCond: function (v1, v2, options) {
      return v1 === v2 ? options.fn(this) : options.inverse(this);
    },
    multiply: (price, quantity) => price * quantity
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src/views'));

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear JSON
app.use(express.json());

// Configurar sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || 'secreto',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Importar rutas
const homeRouter = require('./src/routes/home.router');
const authRouter = require('./src/routes/auth.router');
const productsRouter = require('./src/routes/products.router');
const cartRouter = require('./src/routes/cart.router');
const usersRouter = require('./src/routes/users.router');
const productsAPIRouter = require('./src/routes/products.router');

// Montar las rutas
app.use('/', homeRouter);
app.use('/auth', authRouter);
app.use('/products', productsRouter);
app.use('/cart', cartRouter); // Montar las rutas del carrito
app.use('/api/users', usersRouter);
app.use('/api/products', productsAPIRouter);

// Conectar a MongoDB Atlas
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("La variable de entorno MONGO_URI no está definida.");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log("Conexión exitosa a MongoDB Atlas"))
  .catch(err => {
    console.error("Error al conectar a MongoDB Atlas:", err);
    process.exit(1);
  });

// Crear el servidor HTTP y vincularlo con Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer);

// Configurar Socket.IO
io.on('connection', async (socket) => {
  console.log(`Nuevo cliente conectado. ID: ${socket.id}`);

  // Lista inicial de productos
  try {
    const initialProducts = await getAllProducts();
    socket.emit('updateProducts', initialProducts);
  } catch (error) {
    console.error("Error al obtener productos iniciales:", error);
  }

  // Escuchar eventos del cliente
  socket.on('addProduct', async (productData) => {
    try {
      await addProduct(productData);
      const updatedProducts = await getAllProducts();
      io.emit('updateProducts', updatedProducts);
    } catch (error) {
      console.error("Error al agregar producto:", error);
      socket.emit('error', "No se pudo agregar el producto");
    }
  });

  socket.on('deleteProduct', async (productId) => {
    try {
      await deleteProduct(productId);
      const updatedProducts = await getAllProducts();
      io.emit('updateProducts', updatedProducts);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  });
});

// Iniciar el servidor
const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});