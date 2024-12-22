const { executeCode, getExecutionResult } = require('../models/codeExecutor');

const runCode = async (req, res) => {
    const { code } = req.body;
    try {
        const token = await executeCode(code);
        const result = await getExecutionResult(token);
    
        console.log('Respuesta de judge0: ', result);

        const output = result.stdout || result.stderr || result.compile_output || 'Sin salida';
        res.json({ output });
    } catch (error) {
        res.status(500).json({ message: 'Error al ejecutar el código', error });
    }
};

module.exports = { runCode };
