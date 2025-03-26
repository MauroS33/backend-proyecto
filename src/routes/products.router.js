const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct } = require('../controllers/product.controller');

// Obtener todos los productos con paginación usando mongoose-paginate-v2
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Página actual (por defecto: 1)
  const limit = parseInt(req.query.limit) || 5; // Límite de productos por página (por defecto: 10)

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

// Obtener un producto por ID
router.get('/:pid', async (req, res) => {
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

// Agregar un nuevo producto
router.post('/', async (req, res) => {
  const productData = req.body;
  const newProduct = await addProduct(productData);
  res.status(201).json(newProduct);
});

// Actualizar un producto existente
router.put('/:pid', async (req, res) => {
  const productId = req.params.pid; // Eliminamos parseInt
  const updatedFields = req.body;
  const updatedProduct = await updateProduct(productId, updatedFields);
  if (updatedProduct) {
    res.json(updatedProduct);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Eliminar un producto
router.delete('/:pid', async (req, res) => {
  const productId = req.params.pid; // Obtener el ID del producto
  try {
    await deleteProduct(productId); // Pasar el ID al controlador
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;