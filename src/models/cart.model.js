const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Referencia al modelo Product
    quantity: { type: Number, required: true, min: 1 }
  }],
  total: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware "pre" para calcular el total del carrito antes de guardar
cartSchema.pre('save', async function (next) {
  try {
    let total = 0;
    for (const item of this.products) {
      const product = await mongoose.model('Product').findById(item.product); // Obtener el producto por su ID
      if (product) {
        total += product.price * item.quantity; // Calcular el subtotal
      }
    }
    this.total = total; // Actualizar el total del carrito
    next();
  } catch (error) {
    next(error);
  }
});

// Middleware "pre" para calcular el total del carrito antes de actualizar
cartSchema.pre('findOneAndUpdate', async function (next) {
  try {
    const update = this.getUpdate(); // Obtener los datos de actualización
    if (update.$set && update.$set.products) {
      let total = 0;
      for (const item of update.$set.products) {
        const product = await mongoose.model('Product').findById(item.product); // Obtener el producto por su ID
        if (product) {
          total += product.price * item.quantity; // Calcular el subtotal
        }
      }
      this._update.total = total; // Actualizar el total del carrito
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Middleware "post" para registrar cambios después de guardar
cartSchema.post('save', function (doc) {
  console.log(`Carrito guardado con ID: ${doc._id}`);
});


const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;