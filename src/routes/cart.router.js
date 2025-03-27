const express = require('express');
const router = express.Router();
const Cart = require('../models/cart.model'); // Importar el modelo Cart
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
    const cart = await Cart.findById(cartId).populate('products.product'); // Cargar detalles de los productos
    if (!cart) throw new Error("Carrito no encontrado");

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

// Vaciar el carrito
router.delete('/:cid', async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.products = []; // Vaciar la lista de productos
    cart.total = 0; // Restablecer el total
    await cart.save();

    res.json({ message: "Carrito vaciado exitosamente", cart });
  } catch (error) {
    console.error("Error al vaciar el carrito:", error);
    res.status(404).json({ error: error.message });
  }
});

// Ruta para ver el carrito (renderizar la vista)
router.get('/', async (req, res) => {
  const cartId = req.query.cartId || req.session.cartId; // Obtener el ID del carrito desde los parámetros o la sesión

  if (!cartId) {
    return res.render('cart', { 
      title: 'Mi Carrito', 
      cart: null, 
      errorMessage: "No se encontró un carrito asociado. Agrega productos desde la página principal." 
    });
  }

  try {
    const cart = await Cart.findById(cartId).populate('products.product'); // Cargar detalles de los productos
    if (!cart) {
      return res.render('cart', { 
        title: 'Mi Carrito', 
        cart: null, 
        errorMessage: "El carrito no existe o ha sido eliminado." 
      });
    }

    res.render('cart', { title: 'Mi Carrito', cart });
  } catch (error) {
    console.error("Error al cargar el carrito:", error);
    res.status(500).send("Error interno del servidor");
  }
});

module.exports = router;