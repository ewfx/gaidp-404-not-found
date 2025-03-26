/**
 * DragDropModal.jsx
 * Location: src/pages/UploadPDF/components/DragDropModal.jsx
 *
 * A modal popup for uploading a PDF with a drag & drop area.
 * On successful upload, we call onUploadComplete with the selected file.
 */

import React, { useState } from 'react';
import styles from './DragDropModal.module.css';

const DragDropModal = ({ onClose, onUploadComplete }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    console.log('Drag over event');
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    console.log('Drag leave event');
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    console.log('File dropped');
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      console.log('File from drop:', e.dataTransfer.files[0]);
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      console.log('File selected from input:', e.target.files[0]);
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      alert('Please select or drop a PDF file.');
      return;
    }
    console.log('Uploading file:', file);
    // Here, instead of simulating, you can call a callback.
    // We pass the file back to the parent so that it can call the API.
    onUploadComplete(file);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>Upload PDF</h3>
        
        <div
          className={`${styles.dragDropArea} ${dragActive ? styles.dragActive : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {file ? (
            <p>{file.name}</p>
          ) : (
            <p>Drag & drop your PDF file here, or click below to select</p>
          )}
        </div>

        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className={styles.fileInput}
        />

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.uploadBtn} onClick={handleUpload}>
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default DragDropModal;
