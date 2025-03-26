const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/user.controller');

// Registrar un nuevo usuario
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const user = await registerUser({ email, password, firstName, lastName });
    res.status(201).json(user);
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(400).json({ error: error.message });
  }
});

// Autenticar un usuario
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);
    res.json({ user, token });
  } catch (error) {
    console.error("Error al autenticar usuario:", error);
    res.status(401).json({ error: error.message });
  }
});

module.exports = router;