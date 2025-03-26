import React from 'react';
import styles from './ColumnItem.module.css';

const ColumnItem = ({ column, index, onEdit, onDelete }) => {
  return (
    <div className={styles.columnItem}>
      <span className={styles.columnName}>{column}</span>
      <div className={styles.actions}>
        <button className={styles.editButton} onClick={() => onEdit(index)}>
          ✏️
        </button>
        <button className={styles.deleteButton} onClick={() => onDelete(index)}>
          🗑️
        </button>
      </div>
    </div>
  );
};

export default ColumnItem;
