const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct } = require('../controllers/product.controller');
const Product = require('../models/product.model'); // Importar el modelo de productos
const Cart = require('../models/cart.model'); // Importar el modelo de carritos

// Ruta API: Obtener todos los productos con paginación usando mongoose-paginate-v2
router.get('/api', async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Página actual (por defecto: 1)
  const limit = parseInt(req.query.limit) || 5; // Límite de productos por página (por defecto: 5)

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
    res.json(result);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Ruta API: Obtener un producto por ID
router.get('/api/:pid', async (req, res) => {
  const productId = req.params.pid; // Obtener el ID del producto
  try {
    const product = await getProductById(productId); // Pasar el ID al controlador
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Ruta API: Agregar un nuevo producto
router.post('/api', async (req, res) => {
  const productData = req.body;
  try {
    const newProduct = await addProduct(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error al agregar producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Ruta API: Actualizar un producto existente
router.put('/api/:pid', async (req, res) => {
  const productId = req.params.pid; // Eliminamos parseInt
  const updatedFields = req.body;
  try {
    const updatedProduct = await updateProduct(productId, updatedFields);
    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Ruta API: Eliminar un producto
router.delete('/api/:pid', async (req, res) => {
  const productId = req.params.pid; // Obtener el ID del producto
  try {
    await deleteProduct(productId); // Pasar el ID al controlador
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Ruta de Vista: Obtener la página de productos paginados
router.get('/', async (req, res) => {
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

    // Obtener el ID del carrito del usuario
    let cartId = req.session.cartId; // Obtener el carrito de la sesión
    if (!cartId) {
      const cart = await Cart.create({ products: [], total: 0 }); // Crear un nuevo carrito
      cartId = cart._id;
      req.session.cartId = cartId; // Guardar el ID del carrito en la sesión
    }

    // Renderiza la vista con los datos
    res.render('products', {
      title: 'Lista de Productos',
      products: result.products,
      total: result.total,
      totalPages: result.totalPages,
      currentPage: result.page,
      cartId // Pasar el ID del carrito a la vista
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

module.exports = router;