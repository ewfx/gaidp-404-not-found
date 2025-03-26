import React from "react";
import styles from "./CodeReviewRuleCard.module.css";

const CodeReviewRuleCard = ({ rule, onSelect, isSelected }) => {
  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ""}`}
      onClick={onSelect}
    >
      <h4 className={styles.description}>{rule.description}</h4>
      <p className={styles.category}>
        <strong>Category:</strong> {rule.category}
      </p>
      <button className={styles.viewButton} onClick={onSelect}>
        View Code
      </button>
    </div>
  );
};

export default CodeReviewRuleCard;
