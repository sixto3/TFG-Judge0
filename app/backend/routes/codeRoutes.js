const express = require('express');
const router = express.Router();
const { runCode } = require('../controllers/codeController');

// Definir la ruta para ejecutar código
router.post('/execute', runCode);

module.exports = router;
