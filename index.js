const { createServer } = require('http');
const { Server } = require('socket.io');
const express = require('express');
const mongoose = require('mongoose'); // Importar Mongoose
require('dotenv').config(); // Cargar variables de entorno
const path = require('path');

// Importar funciones de controladores
const { getAllProducts, addProduct, deleteProduct } = require('./src/controllers/product.controller');
const Product = require('./src/models/product.model'); // Importar el modelo de productos

// Crear la aplicación Express
const app = express();

const handlebars = require('express-handlebars');

// Configuración de Handlebars como motor de plantillas
app.engine('handlebars', handlebars.engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true, // Permite el acceso a propiedades del prototipo
    allowProtoMethodsByDefault: true    // Permite el acceso a métodos del prototipo
  },
  helpers: {
    ifCond: function (v1, v2, options) {
      return v1 === v2 ? options.fn(this) : options.inverse(this); // Helper personalizado para condiciones
    }
  }
}));
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

// Ruta para la página de inicio
app.get('/', async (req, res) => {
  try {
    const products = await getAllProducts();
    res.render('home', { title: 'Home', products });
  } catch (error) {
    console.error("Error al cargar productos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Ruta para la página de productos en tiempo real
app.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await getAllProducts();
    res.render('realTimeProducts', { title: 'Productos en Tiempo Real', products });
  } catch (error) {
    console.error("Error al cargar productos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Ruta para la página de productos paginados
app.get('/products', async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Página actual (por defecto: 1)
  const limit = parseInt(req.query.limit) || 10; // Límite de productos por página (por defecto: 10)

  try {
    const options = {
      page,
      limit,
      customLabels: {
        totalDocs: 'total',
        docs: 'products',
        totalPages: 'totalPages',
        currentPage: 'page'
      }
    };

    const result = await Product.paginate({}, options); // Paginar los productos

    // Renderiza la vista con los datos
    res.render('products', {
      title: 'Lista de Productos',
      products: result.products,
      total: result.total,
      totalPages: result.totalPages,
      currentPage: result.page
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Conectar a MongoDB Atlas
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("La variable de entorno MONGO_URI no está definida.");
  process.exit(1); // Detener el servidor si no hay URI
}

mongoose.connect(MONGO_URI)
  .then(() => console.log("Conexión exitosa a MongoDB Atlas"))
  .catch(err => {
    console.error("Error al conectar a MongoDB Atlas:", err);
    process.exit(1); // Detener el servidor si hay un error
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
      io.emit('updateProducts', updatedProducts); // Notificar a todos los clientes
    } catch (error) {
      console.error("Error al agregar producto:", error);
      socket.emit('error', "No se pudo agregar el producto");
    }
  });

  socket.on('deleteProduct', async (productId) => {
    try {
      await deleteProduct(productId);
      const updatedProducts = await getAllProducts();
      io.emit('updateProducts', updatedProducts); // Notificar a todos los clientes
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