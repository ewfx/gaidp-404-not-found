import React from 'react';
import styles from './GuidancePanel.module.css';

const GuidancePanel = ({ contextText }) => {
  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>Need Guidance?</h3>
      <p className={styles.description}>
        {contextText || 
          "Follow these steps to complete your workflow:"}
      </p>
      <ul className={styles.tipsList}>
        <li>Step 1: Upload or select your PDF file.</li>
        <li>Step 2: Choose or generate a schema that matches your data.</li>
        <li>Step 3: Edit columns as needed.</li>
        <li>Step 4: Define rules for data validation.</li>
      </ul>
      <p className={styles.footer}>
        For more help, check our documentation or contact support.
      </p>
    </div>
  );
};

export default GuidancePanel;
