import axios from 'axios';
import React, { useState } from 'react';

const CodeExecutor = () => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  const executeCode = async () => {
    try {
      // Llamada al backend para ejecutar el código
      const response = await axios.post('http://localhost:5000/api/execute', { code });
      setOutput(response.data.output || 'Sin salida');
    } catch (error) {
      setOutput('Error al conectar con el servidor');
    }
  };

  return (
    <div className="code-executor">
      <h1>Ejecutor de Código Java</h1>
      <textarea 
        value={code} 
        onChange={(e) => setCode(e.target.value)} 
        rows="10" 
        cols="50"
        placeholder="Escribe tu código Java aquí"
      />
      <br />
      <button onClick={executeCode}>Ejecutar</button>
      <h3>Salida:</h3>
      <pre>{output}</pre>
    </div>
  );
};

export default CodeExecutor;
