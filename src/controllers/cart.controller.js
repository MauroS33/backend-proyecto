const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

// Crear un nuevo carrito
exports.createCart = async () => {
  const cart = new Cart({ products: [], total: 0 });
  await cart.save();
  return cart;
};

// Obtener un carrito por ID
exports.getCartById = async (cartId) => {
  const cart = await Cart.findById(cartId).populate('products.product');
  if (!cart) throw new Error("Carrito no encontrado");
  return cart;
};

// Agregar un producto al carrito
exports.addProductToCart = async (cartId, productId, quantity) => {
  const cart = await Cart.findById(cartId);
  if (!cart) throw new Error("Carrito no encontrado");

  const product = await Product.findById(productId);
  if (!product) throw new Error("Producto no encontrado");

  // Verificar si el producto ya está en el carrito
  const existingProduct = cart.products.find(item => item.product.toString() === productId);
  if (existingProduct) {
    existingProduct.quantity += quantity; // Incrementar la cantidad si ya existe
  } else {
    cart.products.push({ product: productId, quantity }); // Agregar el producto al carrito
  }

  await cart.save(); // Guardar el carrito (el middleware calculará el total)
  return cart;
};

// Eliminar un producto del carrito
exports.removeProductFromCart = async (cartId, productId) => {
  const cart = await Cart.findById(cartId);
  if (!cart) throw new Error("Carrito no encontrado");

  cart.products = cart.products.filter(item => item.product.toString() !== productId); // Filtrar el producto
  await cart.save(); // Guardar el carrito (el middleware recalculará el total)
  return cart;
};