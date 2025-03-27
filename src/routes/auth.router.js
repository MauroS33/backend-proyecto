const express = require('express');
const router = express.Router();

// Ruta para la página de autenticación
router.get('/auth', (req, res) => {
  const mode = req.query.mode || 'login'; // Modo predeterminado: inicio de sesión
  const isLogin = mode === 'login';

  res.render('auth', {
    title: isLogin ? 'Iniciar Sesión' : 'Registro',
    isLogin
  });
});

module.exports = router;