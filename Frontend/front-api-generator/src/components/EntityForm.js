import React from 'react';
import ColumnForm from './ColumnForm';
import './../styles.css';

const EntityForm = ({ entity, entityIndex, handleTableNameChange, handleColumnChange, addColumn, tables }) => {
    return (
        <div className="entity-form">
            <label>Table Name:</label>
            <input
                type="text"
                value={entity.tableName}
                onChange={(e) => handleTableNameChange(e, entityIndex)}
            />
            {entity.columns.map((column, columnIndex) => (
                <div key={columnIndex} className="column-container">
                    <ColumnForm
                        index={columnIndex}
                        column={column}
                        handleColumnChange={handleColumnChange}
                        entityIndex={entityIndex}
                        tables={tables}
                    />
                    <div className="checkbox-group">
                        <label>Primary Key:</label>
                        <input
                            type="checkbox"
                            name="isPrimaryKey"
                            checked={column.isPrimaryKey}
                            onChange={(e) => handleColumnChange(e, entityIndex, columnIndex)}
                        />
                        <label>Foreign Key:</label>
                        <input
                            type="checkbox"
                            name="isForeignKey"
                            checked={column.isForeignKey}
                            onChange={(e) => handleColumnChange(e, entityIndex, columnIndex)}
                        />
                    </div>
                </div>
            ))}
            <button type="button" onClick={() => addColumn(entityIndex)}>Add Column</button>
        </div>
    );
};

export default EntityForm;
