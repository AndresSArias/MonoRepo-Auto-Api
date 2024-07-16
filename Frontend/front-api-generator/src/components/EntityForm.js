import React from 'react';
import ColumnForm from './ColumnForm';
import './../styles.css';

const EntityForm = ({ entity, entityIndex, handleTableNameChange, handleColumnChange, addColumn, deleteColumn, saveColumn, tables, isEditingColumn, setEditingColumn, saveTable, setEditingTable, deleteEntity, isEditingTable }) => {
    return (
        <div className="entity-form">
            <label>Table Name:</label>
            <input
                type="text"
                value={entity.tableName}
                onChange={(e) => handleTableNameChange(e, entityIndex)}
                disabled={entity.isLocked && !isEditingTable}
            />
            {entity.columns.map((column, columnIndex) => (
                <div key={columnIndex} className="column-container">
                    <ColumnForm
                        index={columnIndex}
                        column={column}
                        handleColumnChange={handleColumnChange}
                        entityIndex={entityIndex}
                        tables={tables}
                        disabled={entity.isLocked && !isEditingColumn[entityIndex]?.[columnIndex]}
                    />
                    {entity.isLocked && !isEditingColumn[entityIndex]?.[columnIndex] ? (
                        <button type="button" onClick={() => setEditingColumn(entityIndex, columnIndex, true)}>Edit</button>
                    ) : (
                        <button type="button" onClick={() => saveColumn(entityIndex, columnIndex)}>Save Column</button>
                    )}
                    <button type="button" onClick={() => deleteColumn(entityIndex, columnIndex)} disabled={entity.isLocked && !isEditingColumn[entityIndex]?.[columnIndex]}>Delete Column</button>
                </div>
            ))}
            {!entity.isLocked ? (
                <button type="button" onClick={() => addColumn(entityIndex)}>Add Column</button>
            ) : (
                <button type="button" onClick={() => setEditingTable(entityIndex, true)}>Edit Table</button>
            )}
            {!entity.isLocked && (
                <button type="button" onClick={() => saveTable(entityIndex)}>Save Table</button>
            )}
            <button type="button" onClick={() => deleteEntity(entityIndex)}>Delete Table</button>
        </div>
    );
};

export default EntityForm;
