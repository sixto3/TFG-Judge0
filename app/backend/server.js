const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Para habilitar CORS
require('dotenv').config(); // Cargar variables de entorno desde .env
const authRoutes = require('./routes/authRoutes');
const codeRoutes = require('./routes/codeRoutes');
const db = require('./db'); // Conexión a la base de datos (opcional para verificar)

const app = express();

// Middleware para manejar JSON y CORS
app.use(bodyParser.json());
app.use(cors());

// Verificar conexión a la base de datos (opcional)
(async () => {
    try {
        await db.query('SELECT 1'); // Consulta simple para probar conexión
        console.log('Conexión a la base de datos exitosa');
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
    }
})();

// Configurar las rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas existentes
app.use('/api/code', codeRoutes);

// Manejo de errores (opcional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Error interno del servidor' });
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
