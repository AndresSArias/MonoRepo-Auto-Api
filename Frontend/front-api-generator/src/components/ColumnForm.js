import React, { useEffect } from 'react';
import './../styles.css';

const dataTypes = [
    { label: 'bigint', value: 'BigInteger' },
    { label: 'int', value: 'Integer' },
    { label: 'text', value: 'Text' },
    { label: 'boolean', value: 'Boolean' },
    { label: 'date', value: 'Date' },
    { label: 'datetime', value: 'DateTime' },
    { label: 'float', value: 'Float' },
    { label: 'numeric', value: 'Numeric' },
    { label: 'String(n)', value: 'String' }
];

const constraints = [
    { label: 'LENGTH(n): Restricción de longitud mínima', value: 'LENGTH', hasValue: true, valueType: 'number' },
    { label: 'MAXLENGTH(n): Restricción de longitud máxima', value: 'MAXLENGTH', hasValue: true, valueType: 'number' },
    { label: '>= n: Restricción de valor mínimo', value: '>=', hasValue: true, valueType: 'number' },
    { label: '<= n: Restricción de valor máximo', value: '<=', hasValue: true, valueType: 'number' },
    { label: 'BETWEEN n AND m: Restricción de rango', value: 'BETWEEN', hasValue: true, valueType: 'range' },
    { label: 'IN (val1, val2, ...): Restricción de valores permitidos', value: 'IN', hasValue: true, valueType: 'text' },
    { label: 'NOT NULL: Restricción de no nulo', value: 'NOT NULL', hasValue: false }
];

const ColumnForm = ({ index, column, handleColumnChange, entityIndex, tables }) => {
    useEffect(() => {
        let newConstraints = column.constraints ? [...column.constraints] : [];

        if (column.isPrimaryKey && !newConstraints.some(c => c.type === 'NOT NULL')) {
            newConstraints.push({ type: 'NOT NULL' });
        }
        if (column.isForeignKey && !newConstraints.some(c => c.type === 'NOT NULL')) {
            newConstraints.push({ type: 'NOT NULL' });
        }

        // Solo actualizar las restricciones si han cambiado
        const constraintsChanged = JSON.stringify(newConstraints) !== JSON.stringify(column.constraints);
        if (constraintsChanged) {
            handleColumnChange({ target: { name: 'constraints', value: newConstraints } }, entityIndex, index);
        }
    }, [column.isPrimaryKey, column.isForeignKey, column.constraints, entityIndex, index, handleColumnChange]);

    const handleConstraintChange = (e, constraint, entityIndex, columnIndex) => {
        const { checked } = e.target;
        const newConstraints = column.constraints ? [...column.constraints] : [];
        if (checked) {
            if (constraint.hasValue) {
                if (constraint.valueType === 'range') {
                    newConstraints.push({ type: constraint.value, min: '', max: '' });
                } else {
                    newConstraints.push({ type: constraint.value, value: '' });
                }
            } else {
                newConstraints.push({ type: constraint.value });
            }
        } else {
            const index = newConstraints.findIndex(c => c.type === constraint.value);
            if (index > -1) {
                newConstraints.splice(index, 1);
            }
        }
        handleColumnChange({ target: { name: 'constraints', value: newConstraints } }, entityIndex, columnIndex);
    };

    const handleConstraintValueChange = (e, constraint, entityIndex, columnIndex) => {
        const { name, value } = e.target;
        const newConstraints = [...column.constraints];
        const index = newConstraints.findIndex(c => c.type === constraint.value);
        if (index > -1) {
            if (constraint.valueType === 'range') {
                newConstraints[index][name] = value;
            } else {
                newConstraints[index].value = value;
            }
        }
        handleColumnChange({ target: { name: 'constraints', value: newConstraints } }, entityIndex, columnIndex);
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
            />
            <label>Data Type:</label>
            <select
                name="data_type"
                value={column.data_type}
                onChange={(e) => handleColumnChange(e, entityIndex, index)}
            >
                {dataTypes.map((type, idx) => (
                    <option key={idx} value={type.value}>{type.label}</option>
                ))}
            </select>
            <label>Constraints:</label>
            <div className="constraints">
                {constraints.map((constraint, idx) => (
                    <div key={idx} className="constraint-item">
                        <label>
                            <input
                                type="checkbox"
                                checked={column.constraints && column.constraints.some(c => c.type === constraint.value)}
                                onChange={(e) => handleConstraintChange(e, constraint, entityIndex, index)}
                            />
                            {constraint.label}
                        </label>
                        {column.constraints && column.constraints.some(c => c.type === constraint.value) && constraint.hasValue && (
                            constraint.valueType === 'range' ? (
                                <>
                                    <input
                                        type="number"
                                        name="min"
                                        placeholder="min"
                                        value={column.constraints.find(c => c.type === constraint.value).min}
                                        onChange={(e) => handleConstraintValueChange(e, constraint, entityIndex, index)}
                                    />
                                    <input
                                        type="number"
                                        name="max"
                                        placeholder="max"
                                        value={column.constraints.find(c => c.type === constraint.value).max}
                                        onChange={(e) => handleConstraintValueChange(e, constraint, entityIndex, index)}
                                    />
                                </>
                            ) : (
                                <input
                                    type={constraint.valueType}
                                    value={column.constraints.find(c => c.type === constraint.value).value}
                                    onChange={(e) => handleConstraintValueChange(e, constraint, entityIndex, index)}
                                />
                            )
                        )}
                    </div>
                ))}
            </div>
            <label>Description:</label>
            <input
                type="text"
                name="description"
                value={column.description}
                onChange={(e) => handleColumnChange(e, entityIndex, index)}
            />
            {column.isForeignKey && (
                <div className="foreign-key-group">
                    <label>References Table:</label>
                    <select
                        name="referencesTable"
                        value={column.referencesTable}
                        onChange={(e) => handleColumnChange(e, entityIndex, index)}
                    >
                        <option value="">Select Table</option>
                        {tables.map((table, idx) => (
                            <option key={idx} value={table.tableName}>{table.tableName}</option>
                        ))}
                    </select>
                    <label>References Column:</label>
                    <select
                        name="referencesColumn"
                        value={column.referencesColumn}
                        onChange={(e) => handleColumnChange(e, entityIndex, index)}
                    >
                        <option value="">Select Column</option>
                        {tables.find(t => t.tableName === column.referencesTable)?.columns.map((col, idx) => (
                            <option key={idx} value={col.name}>{col.name}</option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};

export default ColumnForm;
