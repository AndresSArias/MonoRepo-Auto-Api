import React, { useState } from 'react';
import EntityForm from './EntityForm';
import './../styles.css';

const TableForm = ({ handleSubmit }) => {
    const [entities, setEntities] = useState([]);
    const [generatedJson, setGeneratedJson] = useState(null);

    const handleTableNameChange = (e, entityIndex) => {
        const newEntities = [...entities];
        newEntities[entityIndex].tableName = e.target.value;
        setEntities(newEntities);
    };

    const handleColumnChange = (e, entityIndex, columnIndex) => {
        const { name, value, type, checked } = e.target;
        const newEntities = [...entities];
        if (type === "checkbox") {
            newEntities[entityIndex].columns[columnIndex][name] = checked;
        } else {
            newEntities[entityIndex].columns[columnIndex][name] = value;
        }
        setEntities(newEntities);
    };

    const addColumn = (entityIndex) => {
        const newEntities = [...entities];
        newEntities[entityIndex].columns.push({
            name: '',
            data_type: '',
            constraints: [],
            description: '',
            isPrimaryKey: false,
            isForeignKey: false,
            referencesTable: '',
            referencesColumn: ''
        });
        setEntities(newEntities);
    };

    const addNewEntity = () => {
        const newEntities = [...entities, { tableName: '', columns: [] }];
        setEntities(newEntities);
        console.log('New Entity Added:', newEntities);
    };

    const formatColumns = (columns) => {
        const formattedColumns = {};
        columns.forEach((col) => {
            const dataType = col.data_type;
            const constraints = col.constraints.map(constraint => {
                if (constraint.type === 'BETWEEN') {
                    return `${constraint.type} ${constraint.min} AND ${constraint.max}`;
                }
                return `${constraint.type} ${constraint.value || ''}`.trim();
            });
            formattedColumns[col.name] = {
                data_type: dataType,
                constraints: constraints,
                description: col.description
            };
        });
        return formattedColumns;
    };

    const generateJson = () => {
        const formattedEntities = {};
        entities.forEach(entity => {
            const formattedColumns = formatColumns(entity.columns);
            const primaryKey = entity.columns.filter(col => col.isPrimaryKey).map(col => col.name);
            const foreignKeys = entity.columns.filter(col => col.isForeignKey).map(col => ({
                column: [col.name],
                references: {
                    table: col.referencesTable,
                    column: col.referencesColumn.split(',')
                }
            }));
            formattedEntities[entity.tableName] = {
                ...formattedColumns,
                primary_key: primaryKey,
                foreign_keys: foreignKeys
            };
        });
        return formattedEntities;
    };

    const submitForm = (e) => {
        e.preventDefault();
        const jsonPayload = generateJson();
        setGeneratedJson(jsonPayload);  // Save the JSON for display
        handleSubmit(jsonPayload);
    };

    return (
        <form onSubmit={submitForm} className="table-form">
            {entities.map((entity, entityIndex) => (
                <EntityForm
                    key={entityIndex}
                    entity={entity}
                    entityIndex={entityIndex}
                    handleTableNameChange={handleTableNameChange}
                    handleColumnChange={handleColumnChange}
                    addColumn={addColumn}
                    tables={entities}
                />
            ))}
            <button type="button" onClick={addNewEntity}>Add New Entity</button>
            <button type="submit">Generate API</button>
            {generatedJson && (
                <div className="json-preview">
                    <h3>Generated JSON</h3>
                    <pre>{JSON.stringify(generatedJson, null, 2)}</pre>
                </div>
            )}
        </form>
    );
};

export default TableForm;
