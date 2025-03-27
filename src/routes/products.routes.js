const express = require('express');
const router = express.Router();
const Product = require('../models/product.model'); // Importar el modelo de productos

const { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct } = require('../controllers/product.controller');
const Cart = require('../models/cart.model'); // Importar el modelo de carritos

// Ruta API: Obtener todos los productos con paginación usando mongoose-paginate-v2
router.get('/', async (req, res) => {
  try {
    const { limit = 5, page = 1, sort, query } = req.query; // Límite de productos por página (por defecto: 5)
// Aplico filtro
    let filter = {};
    if (query) {
      if (query === "true" || query === "false") {
        filter.status = query === "true";
        } else {
          filter.category = query;
        }
    }
    // Orden por precios
    let sortOptions = {};
    if (sort === "asc") sortOptions.price = 1;
    if (sort === "desc") sortOptions.price = -1;

    const result = await Product.paginate(filter, {
      page, limit, sort: sortOptions, lean: true,
    });
    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.hasPrevPage ? result.prevPage : null,
      nextPage: result.hasNextPage ? result.nextPage : null,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}` : null,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});



// Obtener un producto por ID
router.get("/:pid", async (req, res) => {
  try {
  const product = await Product.findById(req.params.pid).lean(); // Obtener el ID del producto
    // const product = await getProductById(productId); // Pasar el ID al controlador
    if (!product)
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
      res.json({ status: "success", product });
  } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
  }
});
  
// Agregar un nuevo producto
router.post("/", async (req, res) => {
  try {
  const { title, description, price, stock, category } = req.body;
      // Validación de campos requeridos
      if (!title || !code || !price || !stock || !category) {
        return res.status(400).json({
          status: "error",
          message: "Faltan campos obligatorios: title, code, price, stock, category",
        });
      }

      // Verificar unique
      const exists = await Product.findOne({ title });
      if (exists) {
        return res.status(400).json({
          status: "error",
          message: "Ya existe un producto con ese nombre",
        });
}
      // Crea Producto
      const product = await Product.create({
        ...req.body, status: req.body.thumbnails || [],
      });
      res.status(201).json({ status: "success", product });
      } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
      }
});

// Ruta API: Actualizar un producto existente
router.put("/:pid", async (req, res) => {
  try {
  const { pid } = req.params;

  if (req.body._id) delete req.body._id; // Para evitar actualizacion de id
  
    const updated = await Product.findByIdAndUpdate(pid, req.body, {
      new: true,
    });

    if (!updated)
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });

    res.json({ status: "success", product: updated });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Ruta API: Eliminar un producto
router.delete("/:pid", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.pid);
    if (!deleted)
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    res.json({ status: "success", product: deleted });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});


module.exports = router;