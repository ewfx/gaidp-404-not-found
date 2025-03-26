import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkflowContext } from '../../context/WorkFlowContext';
import CSVUploadForm from './components/CSVUploadForm';
import styles from './CSVAnalytics.module.css';

const CSVAnalytics = () => {
  const { workflowState, setWorkflowState } = useContext(WorkflowContext);
  const navigate = useNavigate();
  const [uploadStatus, setUploadStatus] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <h2>CSV Analytics</h2>
        <CSVUploadForm setUploadStatus={setUploadStatus} setLoading={setLoading} />
        {uploadStatus && <p className={styles.status}>{uploadStatus}</p>}
      </div>
      <div className={styles.rightColumn}>
        {/* Placeholder for future CSV analytics visualization */}
        <p>CSV Analytics Visualization will appear here.</p>
      </div>
    </div>
  );
};

export default CSVAnalytics;
