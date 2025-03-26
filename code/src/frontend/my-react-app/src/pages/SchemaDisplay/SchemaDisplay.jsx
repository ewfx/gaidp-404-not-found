import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { WorkflowContext } from '../../context/WorkFlowContext';
import SchemaSearchBar from './components/SchemaSearchBar';
import SchemaCard from './components/SchemaCard';
import CreateSchemaModal from './components/CreateSchemaModal';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import GuidancePanel from '../../components/GuidancePanel/GuidancePanel';
import styles from './SchemaDisplay.module.css';

const SchemaDisplay = () => {
  const { workflowState, setWorkflowState } = useContext(WorkflowContext);
  const { pdfId } = workflowState;
  const navigate = useNavigate();

  const [schemas, setSchemas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSchema, setEditingSchema] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  useEffect(() => {
    if (pdfId) {
      fetchSchemas();
    }
  }, [pdfId]);

  const fetchSchemas = async () => {
    try {
      setLoading(true);
      setLoadingMessage('Fetching schemas...');
      const response = await apiClient.get(`/schema/pdf/${pdfId}`);
      let data = response.data;
      if (data.length === 0) {
        setLoadingMessage('Generating schemas from PDF...');
        const genResponse = await apiClient.get(`/schema/generate/${pdfId}`);
        data = genResponse.data;
      }
      setSchemas(data);
    } catch (error) {
      console.error('Error fetching schemas:', error);
      alert('Error fetching schemas');
    } finally {
      setLoading(false);
    }
  };

  const filteredSchemas = schemas.filter((schema) =>
    schema.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSchemaUpdated = (updatedSchema, isNew) => {
    if (isNew) {
      setSchemas((prev) => [...prev, updatedSchema]);
    } else {
      setSchemas((prev) =>
        prev.map((s) => (s.id === updatedSchema.id ? updatedSchema : s))
      );
    }
    setShowModal(false);
    setEditingSchema(null);
  };

  const handleSelectSchema = (schema) => {
    setWorkflowState({
      ...workflowState,
      schema: schema,
    });
    navigate('/columns-editor');
  };

  const handleEditSchema = (schema) => {
    setEditingSchema(schema);
    setShowModal(true);
  };

  const handleCreateSchema = () => {
    setEditingSchema(null);
    setShowModal(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <div className={styles.headerRow}>
          <h2 className={styles.pageTitle}>Select or Create a Schema</h2>
          <button className={styles.createButton} onClick={handleCreateSchema}>
            Create Schema
          </button>
        </div>
        <SchemaSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className={styles.schemaList}>
          {filteredSchemas.length === 0 ? (
            <p>No schemas found. Please create a new schema.</p>
          ) : (
            filteredSchemas.map((schema) => (
              <SchemaCard
                key={schema.id}
                schema={schema}
                onEdit={handleEditSchema}
                onSelect={handleSelectSchema}
              />
            ))
          )}
        </div>
      </div>
      <div className={styles.rightColumn}>
        <GuidancePanel 
          contextText="Welcome to Schema Display. Select a schema that best represents your PDF, or create a new one. Clear guidance will help you choose the right structure."
        />
      </div>
      {loading && <LoadingScreen message={loadingMessage} />}
      {showModal && (
        <CreateSchemaModal
          onClose={() => {
            setShowModal(false);
            setEditingSchema(null);
          }}
          onSchemaUpdated={handleSchemaUpdated}
          pdfId={pdfId}
          initialSchema={editingSchema}
        />
      )}
    </div>
  );
};

export default SchemaDisplay;
