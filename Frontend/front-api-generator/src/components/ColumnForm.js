import React from 'react';
import './../styles.css';

const dataTypes = [
    { label: 'String(n)', value: 'String' },
    { label: 'bigint', value: 'BigInteger' },
    { label: 'int', value: 'Integer' },
    { label: 'text', value: 'Text' },
    { label: 'boolean', value: 'Boolean' },
    { label: 'date', value: 'Date' },
    { label: 'datetime', value: 'DateTime' },
    { label: 'float', value: 'Float' },
    { label: 'numeric', value: 'Numeric' }
];

const constraintsOptions = [
    { label: 'LENGTH(n)', value: 'LENGTH', requiresInput: true },
    { label: 'MAXLENGTH(n)', value: 'MAXLENGTH', requiresInput: true },
    { label: '>= n', value: 'GE', requiresInput: true },
    { label: '<= n', value: 'LE', requiresInput: true },
    { label: 'BETWEEN n AND m', value: 'BETWEEN', requiresInput: true },
    { label: 'IN (val1, val2, ...)', value: 'IN', requiresInput: true },
    { label: 'NOT NULL', value: 'NOT NULL', requiresInput: false }
];

const ColumnForm = ({ index, column, handleColumnChange, entityIndex, tables, disabled }) => {
    const handleCheckboxChange = (e, constraint) => {
        const { name, checked } = e.target;
        let constraints = column.constraints ? column.constraints.split(',') : [];
        if (checked) {
            constraints.push(constraint.value);
        } else {
            constraints = constraints.filter(c => !c.startsWith(constraint.value));
        }
        handleColumnChange({ target: { name, value: constraints.join(',') } }, entityIndex, index);
    };

    const handleInputChange = (e, constraint) => {
        const { value } = e.target;
        let constraints = column.constraints ? column.constraints.split(',') : [];
        const existingConstraintIndex = constraints.findIndex(c => c.startsWith(constraint.value));
        if (existingConstraintIndex !== -1) {
            constraints[existingConstraintIndex] = `${constraint.value}(${value})`;
        } else {
            constraints.push(`${constraint.value}(${value})`);
        }
        handleColumnChange({ target: { name: 'constraints', value: constraints.join(',') } }, entityIndex, index);
    };

    const handleDataTypeChange = (e) => {
        const { value } = e.target;
        handleColumnChange({ target: { name: 'data_type', value } }, entityIndex, index);
        if (value === 'String') {
            handleColumnChange({ target: { name: 'constraints', value: 'LENGTH(255)' } }, entityIndex, index); // Default length
        }
    };

    return (
        <div className="column-form">
            <h4>Column {index + 1}</h4>
            <label>Name:</label>
            <input
                type="text"
                name="name"
                value={column.name}
                onChange={(e) => handleColumnChange(e, entityIndex, index)}
                disabled={disabled}
            />
            <label>Data Type:</label>
            <select
                name="data_type"
                value={column.data_type}
                onChange={handleDataTypeChange}
                disabled={disabled}
            >
                {dataTypes.map((type, idx) => (
                    <option key={idx} value={type.value}>{type.label}</option>
                ))}
            </select>
            <label>Constraints:</label>
            {constraintsOptions.map((constraint, idx) => (
                <div key={idx}>
                    <input
                        type="checkbox"
                        name="constraints"
                        checked={column.constraints?.includes(constraint.value) || false}
                        onChange={(e) => handleCheckboxChange(e, constraint)}
                        disabled={disabled}
                    />
                    <label>{constraint.label}</label>
                    {constraint.requiresInput && column.constraints?.includes(constraint.value) && (
                        <input
                            type="text"
                            onChange={(e) => handleInputChange(e, constraint)}
                            placeholder={`Enter value for ${constraint.label}`}
                            disabled={disabled}
                        />
                    )}
                </div>
            ))}
            <label>Description:</label>
            <input
                type="text"
                name="description"
                value={column.description}
                onChange={(e) => handleColumnChange(e, entityIndex, index)}
                disabled={disabled}
            />
            <div className="checkbox-group">
                <label>Primary Key:</label>
                <input
                    type="checkbox"
                    name="isPrimaryKey"
                    checked={column.isPrimaryKey}
                    onChange={(e) => handleColumnChange(e, entityIndex, index)}
                    disabled={disabled}
                />
                <label>Foreign Key:</label>
                <input
                    type="checkbox"
                    name="isForeignKey"
                    checked={column.isForeignKey}
                    onChange={(e) => handleColumnChange(e, entityIndex, index)}
                    disabled={disabled}
                />
            </div>
            {column.isForeignKey && (
                <div className="foreign-key-group">
                    <label>References Table:</label>
                    <select
                        name="referencesTable"
                        value={column.referencesTable}
                        onChange={(e) => handleColumnChange(e, entityIndex, index)}
                        disabled={disabled}
                    >
                        <option value="">Select Table</option>
                        {tables.map((table, idx) => (
                            <option key={idx} value={table}>{table}</option>
                        ))}
                    </select>
                    <label>References Column:</label>
                    <input
                        type="text"
                        name="referencesColumn"
                        value={column.referencesColumn}
                        onChange={(e) => handleColumnChange(e, entityIndex, index)}
                        disabled={disabled}
                    />
                </div>
            )}
        </div>
    );
};

export default ColumnForm;
