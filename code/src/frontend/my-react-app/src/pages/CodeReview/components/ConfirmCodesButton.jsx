import React from 'react';
import styles from './ConfirmCodesButton.module.css';

const ConfirmCodesButton = ({ onConfirm }) => {
  return (
    <button className={styles.confirmButton} onClick={onConfirm}>
      Confirm All Codes
    </button>
  );
};

export default ConfirmCodesButton;
