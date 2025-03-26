import React from 'react';
import styles from './LoadingScreen.module.css';

/**
 * A simple overlay with a spinner and a message.
 * Usage:
 *   {loading && <LoadingScreen message="Fetching data..." />}
 */
const LoadingScreen = ({ message }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner}></div>
      <p className={styles.message}>{message}</p>
    </div>
  );
};

export default LoadingScreen;
