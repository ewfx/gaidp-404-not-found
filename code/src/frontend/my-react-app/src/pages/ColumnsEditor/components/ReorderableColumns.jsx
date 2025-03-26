import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ColumnItem from './ColumnItem';
import styles from './ReorderableColumns.module.css';

const ReorderableColumns = ({ columns, onDragEnd, onEdit, onDelete }) => {
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newColumns = Array.from(columns);
    const [removed] = newColumns.splice(result.source.index, 1);
    newColumns.splice(result.destination.index, 0, removed);
    onDragEnd(newColumns);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="columnsList">
        {(provided) => (
          <div
            className={styles.columnsList}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {columns.map((column, index) => (
              <Draggable key={index.toString()} draggableId={index.toString()} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`${styles.draggableItem} ${snapshot.isDragging ? styles.dragging : ''}`}
                  >
                    <ColumnItem
                      column={column}
                      index={index}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ReorderableColumns;
