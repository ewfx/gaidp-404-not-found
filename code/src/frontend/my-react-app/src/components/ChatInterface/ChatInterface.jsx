import React, { useState } from 'react';
import styles from './ChatInterface.module.css';

export const ChatInterface = ({ currentRule, onSubmitPrompt }) => {
  const [prompt, setPrompt] = useState('');
  const [chatMode, setChatMode] = useState('all'); // 'all' or 'individual'

  const handleToggle = (mode) => {
    setChatMode(mode);
  };

  const handleSubmit = () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt.');
      return;
    }
    onSubmitPrompt(prompt.trim(), chatMode === 'individual' ? currentRule : null);
    setPrompt('');
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.toggleButtons}>
        <button
          className={`${styles.toggleButton} ${chatMode === 'individual' ? styles.active : ''}`}
          onClick={() => handleToggle('individual')}
        >
          Individual Rule
        </button>
        <button
          className={`${styles.toggleButton} ${chatMode === 'all' ? styles.active : ''}`}
          onClick={() => handleToggle('all')}
        >
          All Rules
        </button>
      </div>
      <div className={styles.topSection}>
        {chatMode === 'individual' ? (
          currentRule ? (
            <div>
              <h4>Regenerate Rule</h4>
              <p className={styles.ruleData}>
                <strong>Description:</strong> {currentRule.description}
              </p>
              <p className={styles.ruleData}>
                <strong>Category:</strong> {currentRule.category}
              </p>
              <div className={styles.columnsList}>
                <strong>Columns:</strong>
                {currentRule.columns && currentRule.columns.map((col, index) => (
                  <span key={index} className={styles.columnBadge}>
                    {col}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h4>Individual Rule Mode</h4>
              <p>No rule selected. Please select a rule to regenerate.</p>
            </div>
          )
        ) : (
          <div>
            <h4>Generate All Rules</h4>
            <p>Enter a prompt to generate rules for this schema.</p>
          </div>
        )}
      </div>
      <div className={styles.bottomSection}>
        <input
          type="text"
          placeholder="Enter your prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className={styles.promptInput}
        />
        <button className={styles.submitButton} onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};
