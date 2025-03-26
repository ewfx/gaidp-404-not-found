import React, { useState } from 'react';
import styles from './RegeneratePrompt.module.css';

const RegeneratePrompt = ({ rule, onSubmitPrompt }) => {
  // rule: if provided, it indicates regenerating an individual rule; if null, generate all rules.
  const [prompt, setPrompt] = useState('');

  const handleSubmit = () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt.');
      return;
    }
    onSubmitPrompt(prompt.trim(), rule);
    setPrompt('');
  };

  return (
    <div className={styles.promptContainer}>
      {rule ? (
        <div className={styles.ruleInfo}>
          <h4>Regenerate Rule:</h4>
          <p className={styles.ruleDescription}>{rule.description}</p>
        </div>
      ) : (
        <div className={styles.ruleInfo}>
          <h4>Generate All Rules</h4>
          <p>Enter prompt to generate rules for this schema.</p>
        </div>
      )}
      <div className={styles.inputArea}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt..."
          className={styles.promptInput}
        />
        <button className={styles.submitButton} onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default RegeneratePrompt;
