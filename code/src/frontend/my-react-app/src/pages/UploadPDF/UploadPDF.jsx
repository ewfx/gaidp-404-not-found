import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import styles from './UploadPDF.module.css';
import UploadPDFHeader from './components/UploadPDFHeader';
import SearchBar from './components/SearchBar';
import ExistingPDFList from './components/ExistingPDFList';
import DragDropModal from './components/DragDropModal';
import { WorkflowContext } from '../../context/WorkFlowContext';
import GuidancePanel from '../../components/GuidancePanel/GuidancePanel';

const UploadPDF = () => {
  const { workflowState, setWorkflowState } = useContext(WorkflowContext);
  const navigate = useNavigate();

  // State for drag-and-drop upload modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for search term to filter existing PDFs
  const [searchTerm, setSearchTerm] = useState('');

  // State for the list of existing PDFs (fetched from backend)
  const [pdfs, setPdfs] = useState([]);

  useEffect(() => {
    console.log('Component mounted, fetching existing PDFs...');
    fetchExistingPdfs();
  }, []);

  const fetchExistingPdfs = async () => {
    try {
      const response = await apiClient.get('/pdf/');
      console.log('Fetched PDFs:', response.data);
      setPdfs(response.data);
    } catch (error) {
      console.error('Error fetching PDFs:', error);
    }
  };

  const filteredPdfs = pdfs.filter((pdf) =>
    pdf.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenUploadModal = () => {
    console.log('Opening upload modal');
    setIsModalOpen(true);
  };

  const handleUpload = async (file) => {
    if (!file) {
      alert('No file provided.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await apiClient.post('/pdf/upload', formData);
      const pdfId = response.data.pdf_id;
      const filename = response.data.filename || file.name;
      setWorkflowState({
        ...workflowState,
        pdfId,
        pdfName: filename,
      });
      setPdfs((prev) => [...prev, { pdf_id: pdfId, filename }]);
      setIsModalOpen(false);
      alert('PDF uploaded successfully!');
      navigate('/schema-display');
    } catch (error) {
      console.error('Error uploading PDF:', error);
      alert('Error uploading PDF');
    }
  };

  const handlePdfUploaded = (file) => {
    handleUpload(file);
  };

  const handleSelectExistingPdf = (selectedPdf) => {
    setWorkflowState({
      ...workflowState,
      pdfId: selectedPdf.pdf_id,
      pdfName: selectedPdf.filename,
    });
    navigate('/schema-display');
  };

  return (
    <div className={styles.uploadPdfContainer}>
      <div className={styles.leftColumn}>
        <UploadPDFHeader onOpenUploadModal={handleOpenUploadModal} />
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <ExistingPDFList pdfs={filteredPdfs} onSelectPdf={handleSelectExistingPdf} />
      </div>
      <div className={styles.rightColumn}>
        <GuidancePanel 
          contextText="Welcome to Upload PDF. Use this page to upload a new PDF or select an existing one. Ensure your file is in a valid PDF format."
        />
      </div>
      {isModalOpen && (
        <DragDropModal
          onClose={() => setIsModalOpen(false)}
          onUploadComplete={handlePdfUploaded}
        />
      )}
    </div>
  );
};

export default UploadPDF;
