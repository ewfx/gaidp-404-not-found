/**
 * UploadPDFHeader.jsx
 * Location: src/pages/UploadPDF/components/UploadPDFHeader.jsx
 *
 * Displays the heading "Upload Rules PDF" on the left
 * and an "Upload PDF" button on the right side, which
 * opens the DragDropModal.
 */

import React from 'react';
import styles from './UploadPDFHeader.module.css';

const UploadPDFHeader = ({ onOpenUploadModal }) => {
  return (
    <div className={styles.headerContainer}>
      <h2 className={styles.heading}>Upload Rules PDF</h2>
      <button className={styles.uploadButton} onClick={onOpenUploadModal}>
        Upload PDF
      </button>
    </div>
  );
};

export default UploadPDFHeader;
