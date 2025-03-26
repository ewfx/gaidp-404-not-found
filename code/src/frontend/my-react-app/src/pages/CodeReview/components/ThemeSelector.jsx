import React from 'react';
import styles from './ThemeSelector.module.css';

const ThemeSelector = ({ selectedTheme, onThemeChange }) => {
  return (
    <div className={styles.selector}>
      <label htmlFor="theme-select">Theme:</label>
      <select
        id="theme-select"
        value={selectedTheme}
        onChange={(e) => onThemeChange(e.target.value)}
      >
        <option value="light">Light</option>
        <option value="oneDark">One Dark</option>
      </select>
    </div>
  );
};

export default ThemeSelector;
