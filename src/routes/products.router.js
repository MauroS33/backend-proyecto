const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct } = require('../controllers/product.controller');

// Obtener todos los productos
router.get('/', async (req, res) => {
  const products = await getAllProducts();
  res.json(products);
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