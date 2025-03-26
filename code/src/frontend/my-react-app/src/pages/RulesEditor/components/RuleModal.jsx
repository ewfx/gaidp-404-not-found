import React, { useState } from 'react';
import styles from './RuleModal.module.css';

const RuleModal = ({ mode, initialRule, onCancel, onConfirm }) => {
  // initialRule is an object containing description, category, columns, code, etc.
  const [description, setDescription] = useState(initialRule ? initialRule.description : '');
  const [category, setCategory] = useState(initialRule ? initialRule.category : '');
  const [columns, setColumns] = useState(initialRule ? initialRule.columns.join(', ') : '');
  const [code, setCode] = useState(initialRule ? initialRule.code : '');

  const handleConfirm = () => {
    if (!description.trim()) {
      alert('Rule description cannot be empty.');
      return;
    }
    // Convert comma-separated columns into an array
    const columnsArray = columns.split(',').map(c => c.trim()).filter(c => c);
    const ruleData = {
      description: description.trim(),
      category: category.trim(),
      columns: columnsArray,
      code: code.trim(),
    };
    onConfirm(ruleData);
  };

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>
          {mode === 'add' ? 'Add Rule' : 'Edit Rule'}
        </h3>
        <div className={styles.inputGroup}>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.textarea}
            placeholder="Enter rule description..."
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={styles.textInput}
            placeholder="Enter rule category..."
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Associated Columns (comma separated):</label>
          <input
            type="text"
            value={columns}
            onChange={(e) => setColumns(e.target.value)}
            className={styles.textInput}
            placeholder="Enter columns..."
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Code (optional):</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={styles.textarea}
            placeholder="Enter rule code..."
          />
        </div>
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

export default RuleModal;
