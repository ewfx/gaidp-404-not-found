import React, { useState } from 'react';
import styles from './ColumnModal.module.css';

const ColumnModal = ({ mode, initialValue, onCancel, onConfirm }) => {
  const [value, setValue] = useState(initialValue);

  const handleConfirm = () => {
    if (!value.trim()) {
      alert('Column name cannot be empty.');
      return;
    }
    onConfirm(value.trim());
  };

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>
          {mode === 'add' ? 'Add Column' : 'Edit Column'}
        </h3>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={styles.textInput}
          placeholder="Enter column name"
        />
        <div className={styles.buttonGroup}>
          <button className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button className={styles.confirmButton} onClick={handleConfirm}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColumnModal;
