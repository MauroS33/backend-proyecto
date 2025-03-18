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
  const productId = parseInt(req.params.pid);
  const product = await getProductById(productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
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
  const productId = parseInt(req.params.pid);
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
  const productId = parseInt(req.params.pid);
  await deleteProduct(productId);
  res.json({ message: 'Producto eliminado correctamente' });
});

module.exports = router;