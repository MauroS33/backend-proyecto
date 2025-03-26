const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Referencia al modelo Product
    quantity: { type: Number, required: true, min: 1 }
  }],
  total: { type: Number, default: 0 }
});

module.exports = mongoose.model('Cart', cartSchema);