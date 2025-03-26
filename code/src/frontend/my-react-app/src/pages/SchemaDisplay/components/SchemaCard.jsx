import React from 'react';
import styles from './SchemaCard.module.css';

const SchemaCard = ({ schema, onEdit, onSelect }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardInfo}>
        <h4 className={styles.schemaName}>{schema.name}</h4>
        <p className={styles.pageNumbers}>Pages: {schema.pages.join(', ')}</p>
      </div>
      <div className={styles.cardActions}>
        <button className={styles.editBtn} onClick={() => onEdit(schema)}>
          Edit
        </button>
        <button className={styles.selectBtn} onClick={() => onSelect(schema)}>
          Select
        </button>
      </div>
    </div>
  );
};

export default SchemaCard;
