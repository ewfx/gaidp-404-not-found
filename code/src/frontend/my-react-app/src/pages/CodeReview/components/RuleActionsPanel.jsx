import React, { useState } from 'react';
import styles from './RuleActionsPanel.module.css';

const RuleActionsPanel = ({ onSave, onRegenerate, isDirty }) => {
  const [prompt, setPrompt] = useState('');

  const handleRegenerateClick = () => {
    onRegenerate(prompt);
    setPrompt('');
  };

  return (
    <div className={styles.panel}>
      <button className={styles.saveButton} onClick={onSave} disabled={!isDirty}>
        Save Code
      </button>
      <div className={styles.regenerateContainer}>
        <input
          type="text"
          placeholder="Enter prompt (optional)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className={styles.promptInput}
        />
        <button className={styles.regenerateButton} onClick={handleRegenerateClick}>
          Regenerate Code
        </button>
      </div>
    </div>
  );
};

export default RuleActionsPanel;
