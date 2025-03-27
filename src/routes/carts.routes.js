const express = require('express');
const router = express.Router();
const Cart = require('../models/cart.model'); // Importar el modelo Cart
const Product = require("../models/product.model")
// const { createCart, getCartById, addProductToCart, removeProductFromCart } = require('../controllers/cart.controller');

// Crear un nuevo carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await Cart.create({products:[]});
    res.status(201).json({status: "success", cart:newCart});
  } catch (err) {
    // console.error("Error al crear carrito:", error);
    res.status(500).json({ status: "Error", message: err.message });
  }
});

// // Obtener un carrito por ID
// router.get('/:cid', async (req, res) => {
//   const cartId = req.params.cid;

//   try {
//     const cart = await Cart.findById(cartId).populate('products.product'); // Cargar detalles de los productos
//     if (!cart) throw new Error("Carrito no encontrado");

//     res.json(cart);
//   } catch (error) {
//     console.error("Error al obtener carrito:", error);
//     res.status(404).json({ error: "Carrito no encontrado" });
//   }
// });

// Carrito con populate
router.put("/:cid", async (req, res) => {
  try {
    const { products } = req.body;
    // comprobar existencia
    for (const item of products) {
      const exists = await Product.findById(item.product);
      if (!exists) {
        return res.status(400).json({ status: "error", message: `Producto ${item.product} no existe` });
      }
    }

    // Actualizar vista
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.cid,
      { products },
      { new: true }
    );

    res.json({ status: "success", cart: updatedCart });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// // Agregar un producto al carrito
// router.post('/:cid/products/:pid', async (req, res) => {
//   const cartId = req.params.cid;
//   const productId = req.params.pid;
//   const { quantity } = req.body;

//   if (!quantity || quantity <= 0) {
//     return res.status(400).json({ error: "La cantidad debe ser mayor que cero" });
//   }

//   try {
//     const cart = await addProductToCart(cartId, productId, quantity);
//     res.json(cart);
//   } catch (error) {
//     console.error("Error al agregar producto al carrito:", error);
//     res.status(404).json({ error: error.message });
//   }
// });

// Actuslizar vista de producto/s
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    const productIndex = cart.products.findIndex(p => p.product.toString() === req.params.pid);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity = quantity;
    } else {
      cart.products.push({ product: req.params.pid, quantity });
    }

    await cart.save();
    res.json({ status: "success", cart });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  // const cartId = req.params.cid;
  // const productId = req.params.pid;

  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

cart.products = cart.products.filter(p => p.product.toString() !== req.params.pid);
await cart.save();
res.json({status: "success", cart})
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Vaciar el carrito
router.delete('/:cid', async (req, res) => {

  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    cart.products = []; // Vaciar la lista de productos
    cart.total = 0; // Restablecer el total
    await cart.save();

    res.json({ status: "success", message: "Carrito vaciado" });
  } catch (err) {
    console.error("Error al vaciar el carrito:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// // Ruta para ver el carrito (renderizar la vista)
// router.get('/', async (req, res) => {
//   const cartId = req.query.cartId || req.session.cartId; // Obtener el ID del carrito desde los parámetros o la sesión

//   if (!cartId) {
//     return res.render('cart', { 
//       title: 'Mi Carrito', 
//       cart: null, 
//       errorMessage: "No se encontró un carrito asociado. Agrega productos desde la página principal." 
//     });
//   }

//   try {
//     const cart = await Cart.findById(cartId).populate('products.product'); // Cargar detalles de los productos
//     if (!cart) {
//       return res.render('cart', { 
//         title: 'Mi Carrito', 
//         cart: null, 
//         errorMessage: "El carrito no existe o ha sido eliminado." 
//       });
//     }

//     res.render('cart', { title: 'Mi Carrito', cart });
//   } catch (error) {
//     console.error("Error al cargar el carrito:", error);
//     res.status(500).send("Error interno del servidor");
//   }
// });

module.exports = router;