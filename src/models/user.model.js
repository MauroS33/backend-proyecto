const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Para cifrar contraseñas

// Definir el esquema del usuario
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' } // Referencia al carrito del usuario
});

// Middleware "pre" para cifrar la contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Si la contraseña no cambia, no cifrarla
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt); // Cifrar la contraseña
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password); // Comparar contraseñas
};

module.exports = mongoose.model('User', userSchema);