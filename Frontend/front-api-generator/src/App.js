import React, { useState } from 'react';
import axios from 'axios';
import TableForm from './components/TableForm';
import ApiResult from './components/ApiResult';
import './styles.css';

const App = () => {
    
    const [apiCode, setApiCode] = useState('');

    const handleSubmit = async (formData) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/schema/create_model', formData);
            console.log('Respuesta del backend:', response.data); // Verifica la respuesta del backend en la consola

            // Verifica que la respuesta del backend sea válida y contenga datos
            if (response.data && typeof response.data === 'object' && Object.keys(response.data).length > 0) {
                setApiCode(response.data); // Asigna la respuesta del backend al estado de apiCode
            } else {
                console.error('Respuesta inválida del backend:', response.data);
                setApiCode('Error: Respuesta inválida del backend.');
            }
        } catch (error) {
            console.error('Error generando API:', error);
            setApiCode('Error generando API. Por favor, intenta de nuevo.');
        }
    };

    return (
        <div className="app-container">
            <h1>API Generator</h1>
            <TableForm handleSubmit={handleSubmit} />
            <ApiResult apiCode={apiCode} />
        </div>
    );
};

export default App;