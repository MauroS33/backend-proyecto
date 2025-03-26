const mongoose = require('mongoose');

// Definir el esquema del producto
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  category: { type: String, required: false },
  thumbnails: { type: [String], default: [] }
});

// Crear el modelo
const Product = mongoose.model('Product', productSchema);

module.exports = Product;