const express = require('express');
const router = express.Router();
const { getAllProducts } = require('../controllers/product.controller');
const Product = require("../models/product.model")
const Cart = require('../models/cart.model');

// Ruta para la página de inicio
router.get('/', async (req, res) => {
  try {
    const products = await getAllProducts();

    // Obtener el ID del carrito del usuario
    let cartId = req.session.cartId; // Obtener el carrito de la sesión
    if (!cartId) {
      const cart = await Cart.create({ products: [], total: 0 });
      cartId = cart._id;
      req.session.cartId = cartId; // Guardar el ID del carrito en la sesión
    }

    res.render('home', { 
      title: 'Home', 
      products, 
      cartId // Pasar el ID del carrito a la vista
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

module.exports = router;