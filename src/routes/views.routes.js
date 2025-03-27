const express = require("express");
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");

const router = express.Router();

router.get("/products", async (req, res) => {
  const { page = 1, limit = 10, sort, query } = req.query;

  let filter = {};
  if (query) {
    if (query === "true" || query === "false") {
      filter.status = query === "true";
    } else {
      filter.category = query;
    }
  }

  let sortOptions = {};
  if (sort === "asc") sortOptions.price = 1;
  if (sort === "desc") sortOptions.price = -1;

  const result = await Product.paginate(filter, {
    page,
    limit,
    sort: sortOptions,
    lean: true,
  });

  // Obtener lista de categorías únicas
  const allProducts = await Product.find().lean();
  const categories = [...new Set(allProducts.map(p => p.category))];

  res.render("products", {
    products: result.docs,
    totalPages: result.totalPages,
    page: result.page,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevPage: result.prevPage,
    nextPage: result.nextPage,
    categories,
    currentQuery: query || "",
    currentSort: sort || ""
  });
});


// Página principal con los botones
router.get("/", (req, res) => {
  res.render("home");
});

router.get("/products/:pid", async (req, res) => {
  const product = await Product.findById(req.params.pid).lean();
  if (!product) return res.status(404).send("Producto no encontrado");
  res.render("product", { product });
});

router.get("/carts/:cid", async (req, res) => {
  const cart = await Cart.findById(req.params.cid).populate("products.product").lean();
  if (!cart) return res.status(404).send("Carrito no encontrado");
  res.render("cart", { products: cart.products });
});

router.get("/realtimeproducts", async (req, res) => {
    res.render("realtimeProducts");
  });
  

module.exports = router;
