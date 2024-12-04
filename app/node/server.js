// server/server.js
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Permite solicitudes desde el frontend

// Ruta para ejecutar código Java
app.post('/execute', async (req, res) => {
    const { code } = req.body;
  
    try {
        // Codificar el código Java a Base64

        // Primera solicitud: Enviar el código
        const submissionResponse = await axios.post('https://judge0-ce.p.rapidapi.com/submissions', {
            source_code: code,
            language_id: 62, // ID de Java
            wait: false,  // No esperar, solo obtenemos el token
            base64_encoded: true,  // Indicamos que el código está en Base64
        }, {
            headers: {
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                'X-RapidAPI-Key': '320b070507msh90c6708f773b736p1607fcjsnafe5e2dda95f'
            }
        });
  
        // Obtener el token de la respuesta
        const { token } = submissionResponse.data;
  
          // Esperar hasta que la ejecución termine
        let result = null;
        let isProcessing = true;
  
        while (isProcessing) {
            // Hacemos una segunda solicitud con el token para verificar el estado
            const resultResponse = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
            headers: {
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                'X-RapidAPI-Key': '320b070507msh90c6708f773b736p1607fcjsnafe5e2dda95f'
            }
            });
  
            // Verificar el estado
            const status = resultResponse.data.status?.id;
            if (status === 3) {  // Estado 3 significa "Completed"
                result = resultResponse.data;
                isProcessing = false; // Detenemos el ciclo
            } else if (status === 2) { // Estado 2 significa "Processing"
                // Esperamos un tiempo antes de hacer otra consulta
                await new Promise(resolve => setTimeout(resolve, 2000));
            } else {
                // Si hay un error en la ejecución
                result = resultResponse.data;
                isProcessing = false;
            }
        }
  
        // Imprimir la respuesta completa en la terminal para depuración
        console.log(result);
        
        // Enviar la salida o errores al frontend
        const output = result.stdout || result.stderr || result.compile_output || 'Sin salida';
          res.json({ output });
  
    } catch (error) {
        console.error('Error al ejecutar el código:', error);
        res.status(500).send('Error al ejecutar el código');
    }
});

// Iniciar el servidor
app.listen(5000, () => console.log('Servidor corriendo en http://localhost:5000'));
