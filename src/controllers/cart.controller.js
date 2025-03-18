const CartManager = require('../managers/CartManager');
const path = require('path');
const cartsFilePath = path.join(__dirname, '../data/carts.json');
const cartManager = new CartManager(cartsFilePath);

// Crear un nuevo carrito
const createCart = async () => {
  return await cartManager.createCart();
};

// Obtener un carrito por ID
const getCartById = async (id) => {
  return await cartManager.getCartById(id);
};

// Agregar un producto a un carrito
const addProductToCart = async (cartId, productId) => {
  return await cartManager.addProductToCart(cartId, productId);
};

module.exports = {
  createCart,
  getCartById,
  addProductToCart,
};