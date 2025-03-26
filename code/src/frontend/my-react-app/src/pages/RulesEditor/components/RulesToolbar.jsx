import React from 'react';
import styles from './RulesToolbar.module.css';

const RulesToolbar = ({ onSaveRules, onConfirmRules, onGenerateAll }) => {
  // onGenerateAll receives a prompt string to generate all rules
  const [prompt, setPrompt] = React.useState('');

  const handleGenerateAll = () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt to generate all rules.');
      return;
    }
    onGenerateAll(prompt.trim());
    setPrompt('');
  };

  return (
    <div className={styles.toolbar}>
      <button className={styles.toolbarButton} onClick={onSaveRules}>
        Save Rules
      </button>
      <button className={styles.toolbarButton} onClick={onConfirmRules}>
        Confirm Rules
      </button>
      
    </div>
  );
};

export default RulesToolbar;
