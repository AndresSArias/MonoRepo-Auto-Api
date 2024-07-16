import React from 'react';
import './../styles.css';

const ApiResult = ({ apiCode }) => {
    return (
        <div className="api-result">
            <h2>Generated API Code:</h2>
            <pre>{apiCode}</pre>
        </div>
    );
};

export default ApiResult;
