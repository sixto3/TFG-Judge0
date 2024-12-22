const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const codeRoutes = require('./routes/codeRoutes');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Usa las rutas definidas
app.use('/api', codeRoutes);

app.listen(5000, () => console.log('Servidor corriendo en http://localhost:5000'));
