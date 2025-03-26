import React from 'react';
import styles from './RuleCard.module.css';

const RuleCard = ({ rule, onEdit, onDelete, onSave, onRegenerate }) => {
  return (
    <div className={styles.ruleCard}>
      <div className={styles.ruleHeader}>
        <p className={styles.description}>{rule.description}</p>
      </div>
      <div className={styles.ruleDetails}>
        <div className={styles.columns}>
          {rule.columns && rule.columns.map((col, i) => (
            <span key={i} className={styles.columnBadge}>{col}</span>
          ))}
        </div>
        <div className={styles.category}>
          <strong>Category: </strong>{rule.category}
        </div>
      </div>
      <div className={styles.actions}>
        <button className={styles.actionButton} onClick={onEdit}>
          Edit
        </button>
        <button className={styles.actionButton} onClick={() => onSave(rule)}>
          Save
        </button>
        <button className={styles.actionButton} onClick={onRegenerate}>
          Regenerate
        </button>
        <button className={styles.actionButton} onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default RuleCard;
