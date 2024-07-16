import React, { useState } from 'react';
import EntityForm from './EntityForm';
import './../styles.css';

const TableForm = ({ handleSubmit }) => {
    const [entities, setEntities] = useState([{
        tableName: '',
        columns: [{ name: '', data_type: '', constraints: '', description: '', isPrimaryKey: false, isForeignKey: false, referencesTable: '', referencesColumn: '' }],
        isLocked: false
    }]);
    const [generatedJson, setGeneratedJson] = useState(null);
    const [isEditingColumn, setIsEditingColumn] = useState({});
    const [isEditingTable, setIsEditingTable] = useState({});

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
            if (name === "isPrimaryKey" && checked) {
                newEntities[entityIndex].columns[columnIndex].constraints = "NOT NULL";
            } else if (name === "isForeignKey" && checked) {
                newEntities[entityIndex].columns[columnIndex].constraints = "FOREIGN KEY";
            }
        } else {
            newEntities[entityIndex].columns[columnIndex][name] = value;
        }
        setEntities(newEntities);
    };

    const addColumn = (entityIndex) => {
        const newEntities = [...entities];
        newEntities[entityIndex].columns.push({ name: '', data_type: '', constraints: '', description: '', isPrimaryKey: false, isForeignKey: false, referencesTable: '', referencesColumn: '' });
        setEntities(newEntities);
    };

    const deleteColumn = (entityIndex, columnIndex) => {
        const newEntities = [...entities];
        newEntities[entityIndex].columns.splice(columnIndex, 1);
        setEntities(newEntities);
    };

    const saveColumn = (entityIndex, columnIndex) => {
        setIsEditingColumn(prev => ({
            ...prev,
            [entityIndex]: {
                ...prev[entityIndex],
                [columnIndex]: false
            }
        }));
    };

    const saveEntity = (entityIndex) => {
        const newEntities = [...entities];
        newEntities[entityIndex].isLocked = true;
        setEntities(newEntities);
    };

    const addEntity = () => {
        const newEntities = [...entities];
        newEntities.push({
            tableName: '',
            columns: [{ name: '', data_type: '', constraints: '', description: '', isPrimaryKey: false, isForeignKey: false, referencesTable: '', referencesColumn: '' }],
            isLocked: false
        });
        setEntities(newEntities);
    };

    const deleteEntity = (entityIndex) => {
        const newEntities = [...entities];
        newEntities.splice(entityIndex, 1);
        setEntities(newEntities);
    };

    const setEditingColumn = (entityIndex, columnIndex, isEditing) => {
        setIsEditingColumn(prev => ({
            ...prev,
            [entityIndex]: {
                ...prev[entityIndex],
                [columnIndex]: isEditing
            }
        }));
    };

    const setEditingTable = (entityIndex, isEditing) => {
        setIsEditingTable(prev => ({
            ...prev,
            [entityIndex]: isEditing
        }));
    };

    const saveTable = (entityIndex) => {
        setIsEditingTable(prev => ({
            ...prev,
            [entityIndex]: false
        }));
        lockEntity(entityIndex);
    };

    const lockEntity = (index) => {
        const newEntities = [...entities];
        newEntities[index].isLocked = true;
        setEntities(newEntities);
    };

    const unlockEntity = (index) => {
        const newEntities = [...entities];
        newEntities[index].isLocked = false;
        setEntities(newEntities);
    };

    const formatColumns = (columns) => {
        const formattedColumns = {};
        columns.forEach((col) => {
            const dataType = col.data_type === 'String' ? `${col.data_type}(255)` : col.data_type;
            formattedColumns[col.name] = {
                data_type: dataType,
                constraints: col.constraints ? col.constraints.split(',') : [],
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
                    deleteColumn={deleteColumn}
                    saveColumn={saveColumn}
                    saveEntity={saveEntity}
                    lockEntity={lockEntity}
                    unlockEntity={unlockEntity}
                    isEditingColumn={isEditingColumn}
                    setEditingColumn={setEditingColumn}
                    saveTable={saveTable}
                    setEditingTable={setEditingTable}
                    deleteEntity={deleteEntity}
                    isEditingTable={isEditingTable[entityIndex]}
                    tables={entities.map(e => e.tableName)}
                />
            ))}
            <button type="button" onClick={addEntity}>Add New Table</button>
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
