const axios = require('axios');

const executeCode = async (code) => {
    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions',
        headers: {
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            'X-RapidAPI-Key': '320b070507msh90c6708f773b736p1607fcjsnafe5e2dda95f'
        },
        data: {
            source_code: code,
            language_id: 62
        }
    };

    const { data } = await axios.request(options);
    return data.token;  // Devuelve el token generado
};

const getExecutionResult = async (token) => {
    const options = {
        method: 'GET',
        url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
        headers: {
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            'X-RapidAPI-Key': '320b070507msh90c6708f773b736p1607fcjsnafe5e2dda95f'
        }
    };

    let result;
    let isProcessing = true;

    while (isProcessing) {
        const { data } = await axios.request(options);
        if (data.status?.id === 3) {
            result = data;
            isProcessing = false;
        } else if (data.status?.id === 2) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
            result = data;
            isProcessing = false;
        }
    }
    return result;
};

module.exports = { executeCode, getExecutionResult };
