import React from 'react';
import './../styles.css';

const ApiResult = ({ apiCode }) => {
    return (
        <div className="api-result">
            <h2>Generated API Code:</h2>
            <div>
                {Object.keys(apiCode).map((key) => (
                    <div key={key}>
                        <h3>{key}</h3>
                        <pre>{apiCode[key]}</pre>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ApiResult;