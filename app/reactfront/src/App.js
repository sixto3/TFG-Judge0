import axios from 'axios';
import React, { useState } from 'react';

function App() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  const executeCode = async () => {
    try {
      // Solicitar la ejecución del código al backend
      const response = await axios.post('http://localhost:5000/execute', { code });
  
      // Mostrar la salida, asegurándonos de acceder a la propiedad correcta
      setOutput(response.data.output || 'Sin salida');
    } catch (error) {
      setOutput('Error al conectar con el servidor');
    }
  };

  return (
    <div className="App">
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
}

export default App;
