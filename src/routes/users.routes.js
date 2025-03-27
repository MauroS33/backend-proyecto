const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user.model'); // Importar el modelo User

// Registrar un nuevo usuario
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("El correo electrónico ya está registrado");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(400).json({ error: error.message });
  }
});

// Iniciar sesión
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Correo electrónico o contraseña incorrectos");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Correo electrónico o contraseña incorrectos");

    res.json({ message: "Inicio de sesión exitoso" });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(401).json({ error: error.message });
  }
});

module.exports = router;