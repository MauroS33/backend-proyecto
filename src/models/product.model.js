const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// Definir el esquema del producto
const productSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: false },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  category: { type: String, required: false },
  thumbnails: { type: [String], default: [] }
},
  {
    timestamps: true
  });

// Plugin de paginación
productSchema.plugin(mongoosePaginate);

// // *Middleware "pre" para actualizar la fecha de modificación
// productSchema.pre('findOneAndUpdate', function (next) {
//   this._update.updatedAt = Date.now(); // Actualiza la fecha de modificación
//   next();
// });

// // *Asegura que el precio no sea negativo
// productSchema.pre('save', function (next) {
//   if (this.price < 0) {
//     throw new Error("El precio no puede ser negativo.");
//   }
//   next();
// });

// // *Middleware "pre" para validar el stock antes de guardar
// productSchema.pre('save', function (next) {
//   if (this.stock < 0) {
//     this.stock = 0; // Para que sea mayor a cero
//   }
//   next();
// });

// // *Middleware "post" para registrar cambios después de guardar
// productSchema.post('save', function (doc) {
//   console.log(`Producto guardado: ${doc.title}`);
// });

// Crear el modelo
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
