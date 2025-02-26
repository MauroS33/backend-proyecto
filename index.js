const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const ProductManager = require('./src/managers/ProductManager');
const CartManager = require('./src/managers/CartManager');
const path = require('path');

const app = express();
const PORT = 8080;

// Middleware JSON
app.use(express.json());

// Config de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas JSON
const productsFilePath = path.join(__dirname, 'src/data/products.json');
const cartsFilePath = path.join(__dirname, 'src/data/carts.json');

// Instancias managers
const productManager = new ProductManager(productsFilePath);
const cartManager = new CartManager(cartsFilePath);

// Crear el servidor y vincular Socket
const httpServer = createServer(app);
const io = new Server(httpServer);

// Rutas productos
app.get('/api/products', async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

app.get('/api/products/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = await productManager.getProductById(productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.post('/api/products', async (req, res) => {
  const productData = req.body;
  const newProduct = await productManager.addProduct(productData);
  res.status(201).json(newProduct);
});

app.put('/api/products/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  const updatedFields = req.body;
  const updatedProduct = await productManager.updateProduct(productId, updatedFields);
  if (updatedProduct) {
    res.json(updatedProduct);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.delete('/api/products/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  await productManager.deleteProduct(productId);
  res.json({ message: 'Producto eliminado correctamente' });
});

// Rutas carritos
app.post('/api/carts', async (req, res) => {
  const newCart = await CartManager.createCart();
  res.status(201).json(newCart);
});

app.get('/api/carts/:cid', async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const cart = await CartManager.getCartById(cartId);
  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

app.post('/api/carts/:cid/product/:pid', async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  const updatedCart = await CartManager.addProductToCart(cartId, productId);
  if (updatedCart) {
    res.json(updatedCart);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

// Ruta home.hndbr
app.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('home', { title: 'Home', products });
});

// Ruta realTimeProducts.hndbr
app.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('realTimeProducts', { title: 'Productos en Tiempo Real', products });
});

// Configurar Socket
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // Lista inicial de productos
  socket.emit('updateProducts', productManager.getProducts());

  // Escuchar eventos cliente
  socket.on('addProduct', async (productData) => {
    await productManager.addProduct(productData);
    const updatedProducts = await productManager.getProducts();
    io.emit('updateProducts', updatedProducts); // Notificar a todos los clientes
  });

  socket.on('deleteProduct', async (productId) => {
    await productManager.deleteProduct(productId);
    const updatedProducts = await productManager.getProducts();
    io.emit('updateProducts', updatedProducts); // Notificar a todos los clientes
  });
});

// Iniciar el servidor
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});