const express = require('express');
const { check } = require('express-validator');
const { registerUser, loginUser } = require('../controllers/userController');

const router = express.Router();

// Ruta para registrar usuarios
router.post(
    '/register',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 })
    ],
    registerUser
);

// Ruta para iniciar sesión
router.post('/login', loginUser);

module.exports = router;
