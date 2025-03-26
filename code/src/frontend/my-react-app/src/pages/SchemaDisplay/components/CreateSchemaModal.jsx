import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import apiClient from '../../../api/apiClient';
import styles from './CreateSchemaModal.module.css';

// Point this to your locally hosted worker file or remove if you have an alternative approach
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const CreateSchemaModal = ({ onClose, onSchemaUpdated, pdfId, initialSchema }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [selectedPages, setSelectedPages] = useState(initialSchema ? initialSchema.pages : []);
  const [schemaName, setSchemaName] = useState(initialSchema ? initialSchema.name : '');
  const [loading, setLoading] = useState(false);

  // currentPage represents the *first* page in a 2-page spread
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await apiClient.get(`/pdf/download/${pdfId}`, { responseType: 'blob' });
        const url = URL.createObjectURL(response.data);
        setPdfUrl(url);
      } catch (error) {
        console.error('Error fetching PDF for preview:', error);
      }
    };

    fetchPdf();

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfId]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Toggle selection for a given page
  const togglePage = (pageNumber) => {
    if (selectedPages.includes(pageNumber)) {
      setSelectedPages(selectedPages.filter((num) => num !== pageNumber));
    } else {
      setSelectedPages([...selectedPages, pageNumber]);
    }
  };

  // Confirm button: either create or update schema
  const handleConfirm = async () => {
    if (!schemaName.trim()) {
      alert('Schema name cannot be empty.');
      return;
    }
    if (selectedPages.length === 0) {
      alert('Please select at least one page.');
      return;
    }
    setLoading(true);

    try {
      let response;
      if (initialSchema) {
        response = await apiClient.put(`/schema/update/${initialSchema.id}`, {
          name: schemaName,
          pages: selectedPages.sort((a, b) => a - b),
        });
      } else {
        response = await apiClient.post(`/schema/create/${pdfId}`, {
          name: schemaName,
          pages: selectedPages.sort((a, b) => a - b),
        });
      }
      onSchemaUpdated(response.data, !initialSchema);
    } catch (error) {
      console.error('Error creating/updating schema:', error);
      alert('Error processing schema. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Go to previous "spread" (2 pages)
  const goToPreviousSpread = () => {
    if (currentPage > 2) {
      setCurrentPage(currentPage - 2);
    } else {
      setCurrentPage(1);
    }
  };

  // Go to next "spread" (2 pages)
  const goToNextSpread = () => {
    if (currentPage + 2 <= numPages) {
      setCurrentPage(currentPage + 2);
    } else {
      setCurrentPage(numPages);
    }
  };

  // Build array of up to 2 pages
  const getPagesToShow = () => {
    const pages = [currentPage];
    if (currentPage + 1 <= numPages) {
      pages.push(currentPage + 1);
    }
    return pages;
  };

  const pagesToShow = getPagesToShow();

  // Build a string like "Pages 1-2 of 9" or "Page 9 of 9"
  const pageIndicator =
    pagesToShow.length === 2
      ? `Pages ${pagesToShow[0]}-${pagesToShow[1]} of ${numPages}`
      : `Page ${pagesToShow[0]} of ${numPages}`;

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage + 1 < numPages || currentPage < numPages;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>
          {initialSchema ? 'Edit Schema' : 'Create Schema'}
        </h3>

        {/* Schema Name Field */}
        <div className={styles.inputGroup}>
          <label>Schema Name:</label>
          <input
            type="text"
            value={schemaName}
            onChange={(e) => setSchemaName(e.target.value)}
            className={styles.textInput}
          />
        </div>

        {/* PDF Preview */}
        <div className={styles.pdfPreview}>
          {pdfUrl ? (
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading="Loading PDF..."
            >
              <div className={styles.pagesRow}>
                {pagesToShow.map((pageNumber) => {
                  const isSelected = selectedPages.includes(pageNumber);
                  return (
                    <div
                      key={pageNumber}
                      className={`${styles.pageWrapper} ${
                        !isSelected ? styles.unselected : ''
                      }`}
                      onClick={() => togglePage(pageNumber)} /* <-- Click anywhere on the page */
                    >
                      <Page
                        pageNumber={pageNumber}
                        width={450} /* Increase page width for better visibility */
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                      />
                      <div className={styles.checkboxContainer}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation(); // Prevent togglePage from firing twice
                            togglePage(pageNumber);
                          }}
                          className={styles.checkbox}
                        />
                        <label>Page {pageNumber}</label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Document>
          ) : (
            <p>Loading PDF preview...</p>
          )}
        </div>

        {/* Navigation Controls */}
        <div className={styles.navigation}>
          <button
            className={styles.navButton}
            onClick={goToPreviousSpread}
            disabled={!canGoPrevious}
          >
            Previous
          </button>
          <span className={styles.pageIndicator}>{pageIndicator}</span>
          <button
            className={styles.navButton}
            onClick={goToNextSpread}
            disabled={!canGoNext}
          >
            Next
          </button>
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className={styles.confirmBtn} onClick={handleConfirm} disabled={loading}>
            {loading ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSchemaModal;
