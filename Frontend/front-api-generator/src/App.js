import React, { useState } from 'react';
import axios from 'axios';
import TableForm from './components/TableForm';
import ApiResult from './components/ApiResult';
import './styles.css';

const App = () => {
    const [apiCode, setApiCode] = useState('');

    const handleSubmit = async (formData) => {
        try {
            const response = await axios.post('http://your-backend-url/api/generate', formData);
            setApiCode(response.data);
        } catch (error) {
            console.error('Error generating API:', error);
        }
    };

    return (
        <div className="app-container">
            <h1>API Generator</h1>
            <TableForm handleSubmit={handleSubmit} />
            {apiCode && <ApiResult apiCode={apiCode} />}
        </div>
    );
};

export default App;
