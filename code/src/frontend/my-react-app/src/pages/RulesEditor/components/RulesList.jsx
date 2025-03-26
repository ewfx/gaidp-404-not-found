import React from 'react';
import RuleCard from './RuleCard';
import styles from './RulesList.module.css';

const RulesList = ({ rules, onEdit, onDelete, onSave, onRegenerate }) => {
  return (
    <div className={styles.rulesList}>
      {rules.map((rule, index) => (
        <RuleCard
          key={rule.id || index}
          rule={rule}
          onEdit={() => onEdit(index)}
          onDelete={() => onDelete(index)}
          onSave={(updatedRule) => onSave(index, updatedRule)}
          onRegenerate={() => onRegenerate(rule)}
        />
      ))}
    </div>
  );
};

export default RulesList;
