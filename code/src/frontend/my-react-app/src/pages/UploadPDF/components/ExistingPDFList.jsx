/**
 * ExistingPDFList.jsx
 * Location: src/pages/UploadPDF/components/ExistingPDFList.jsx
 *
 * Shows a list of PDFs (filtered by search).
 * Each PDF is displayed as a card with "Go with this PDF"
 * and "Download" buttons. We'll use PdfCard for each item.
 */

import React from 'react';
import styles from './ExistingPDFList.module.css';
import PdfCard from './PdfCard';

const ExistingPDFList = ({ pdfs, onSelectPdf }) => {
    if (pdfs.length === 0) {
      return (
        <div className={styles.noResults}>
          No PDFs found. Try uploading or adjusting your search.
        </div>
      );
    }
  
    return (
      <div className={styles.listContainer}>
        {pdfs.map((pdf) => (
          <PdfCard key={pdf.pdf_id} pdf={pdf} onSelect={onSelectPdf} />
        ))}
      </div>
    );
  };
  
  export default ExistingPDFList;