import React from "react";
import CodeReviewRuleCard from "./CodeReviewRuleCard";
import styles from "./CodeReviewRulesList.module.css";

const CodeReviewRulesList = ({ rules, onSelectRule, selectedRuleId }) => {
  return (
    <div className={styles.listContainer}>
      {rules.map((rule) => (
        <CodeReviewRuleCard
          key={rule.id}
          rule={rule}
          onSelect={() => onSelectRule(rule)}
          isSelected={rule.id === selectedRuleId}
        />
      ))}
    </div>
  );
};

export default CodeReviewRulesList;
