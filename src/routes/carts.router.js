const express = require('express');
const router = express.Router();
const { createCart, getCartById, addProductToCart, removeProductFromCart } = require('../controllers/cart.controller');

// Crear un nuevo carrito
router.post('/', async (req, res) => {
  try {
    const cart = await createCart();
    res.status(201).json(cart);
  } catch (error) {
    console.error("Error al crear carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener un carrito por ID
router.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cart = await getCartById(cartId);
    res.json(cart);
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(404).json({ error: "Carrito no encontrado" });
  }
});

// Agregar un producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: "La cantidad debe ser mayor que cero" });
  }

  try {
    const cart = await addProductToCart(cartId, productId, quantity);
    res.json(cart);
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res.status(404).json({ error: error.message });
  }
});

// Eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  try {
    const cart = await removeProductFromCart(cartId, productId);
    res.json(cart);
  } catch (error) {
    console.error("Error al eliminar producto del carrito:", error);
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;