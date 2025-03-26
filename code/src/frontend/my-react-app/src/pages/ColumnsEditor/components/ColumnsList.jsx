import React from 'react';
import ColumnItem from './ColumnItem';
import styles from './ColumnsList.module.css';

const ColumnsList = ({ columns, onEdit, onDelete }) => {
  return (
    <div className={styles.columnsList}>
      {columns.map((column, index) => (
        <ColumnItem
          key={index}
          column={column}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ColumnsList;
