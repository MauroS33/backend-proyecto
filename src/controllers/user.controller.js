// const User = require('../models/user.model');
// const Cart = require('../models/cart.model');
// const jwt = require('jsonwebtoken'); // Para generar tokens JWT (recomendacion de IA)

// // Registrar un nuevo usuario
// exports.registerUser = async (userData) => {
//   const { email, password, firstName, lastName } = userData;

//   // Verificar si el usuario ya existe
//   const existingUser = await User.findOne({ email });
//   if (existingUser) throw new Error("El correo electrónico ya está registrado");

//   // Crear un carrito vacío para el usuario
//   const cart = await Cart.create({ products: [], total: 0 });

//   // Crear el usuario
//   const newUser = new User({ email, password, firstName, lastName, cart: cart._id });
//   await newUser.save();

//   return newUser;
// };

// // Autenticar un usuario
// exports.loginUser = async (email, password) => {
//   // Buscar al usuario por su correo electrónico
//   const user = await User.findOne({ email }).populate('cart');
//   if (!user) throw new Error("Usuario no encontrado");

//   // Comparar contraseñas
//   const isMatch = await user.comparePassword(password);
//   if (!isMatch) throw new Error("Contraseña incorrecta");

//   // Generar un token JWT (recomendacion de IA)
//   const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//   return { user, token };
// };