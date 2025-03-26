/**
 * PdfCard.jsx
 * Location: src/pages/UploadPDF/components/PdfCard.jsx
 *
 * Displays a single PDF with a card-like UI.
 * Includes a Download button that triggers a download of the full PDF
 * via GET /pdf/{pdf_id} with responseType 'blob', and a "Go with this PDF" button.
 */

import React from 'react';
import styles from './PdfCard.module.css';
import apiClient from '../../../api/apiClient';

const PdfCard = ({ pdf, onSelect }) => {
  const handleDownload = async () => {
    try {
      // GET the individual PDF as a blob
      const response = await apiClient.get(`/pdf/download/${pdf.pdf_id}`, {
        responseType: 'blob',
      });
      // Create a blob URL and trigger a download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', pdf.filename); // Use the PDF's filename for download
      document.body.appendChild(link);
      link.click();
      link.remove();
      // Revoke the object URL after a short delay to free up memory
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error downloading PDF');
    }
  };

  const handleSelect = () => {
    if (onSelect) onSelect(pdf);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardInfo}>
        <h4 className={styles.filename}>{pdf.filename}</h4>
        <p className={styles.pdfId}>ID: {pdf.pdf_id}</p>
      </div>
      <div className={styles.cardActions}>
        <button className={styles.downloadBtn} onClick={handleDownload}>
          Download
        </button>
        <button className={styles.goBtn} onClick={handleSelect}>
          Go with this PDF
        </button>
      </div>
    </div>
  );
};

export default PdfCard;
