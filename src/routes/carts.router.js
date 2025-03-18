const express = require('express');
const router = express.Router();
const { createCart, getCartById, addProductToCart } = require('../controllers/cart.controller');

// Crear un nuevo carrito
router.post('/', async (req, res) => {
  const newCart = await createCart();
  res.status(201).json(newCart);
});

// Obtener un carrito por ID
router.get('/:cid', async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const cart = await getCartById(cartId);
  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

// Agregar un producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  const updatedCart = await addProductToCart(cartId, productId);
  if (updatedCart) {
    res.json(updatedCart);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

module.exports = router;