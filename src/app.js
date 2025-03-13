const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');

// Importar managers
const ProductManager = require('./managers/ProductManager');
app.locals.productManager = productManager;
const CartManager = require('./managers/CartManager');

// Crear la aplicación Express
const app = express();

// Configuración de Handlebars como motor de plantillas
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Middleware para parsear JSON
app.use(express.json());

// Rutas de archivos JSON
const productsFilePath = path.join(__dirname, '../data/products.json');
const cartsFilePath = path.join(__dirname, '../data/carts.json');

// Instancias de los managers
const productManager = new ProductManager(productsFilePath);
const cartManager = new CartManager(cartsFilePath);

// Rutas para productos
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

// Rutas para carritos
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

// Ruta home.handlebars
app.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('home', { title: 'Home', products });
});

// Ruta realTimeProducts.handlebars
app.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('realTimeProducts', { title: 'Productos en Tiempo Real', products });
});

module.exports = app;