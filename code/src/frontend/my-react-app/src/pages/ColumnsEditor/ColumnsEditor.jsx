import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { WorkflowContext } from '../../context/WorkFlowContext';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import ColumnsList from './components/ColumnsList';
import ColumnModal from './components/ColumnModal';
import GuidancePanel from '../../components/GuidancePanel/GuidancePanel';
import styles from './ColumnsEditor.module.css';

const ColumnsEditor = () => {
  const { workflowState, setWorkflowState } = useContext(WorkflowContext);
  const { schema } = workflowState;
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // "add" or "edit"
  const [modalInitialValue, setModalInitialValue] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!schema) {
      setError('No schema selected. Please select a schema first.');
      return;
    }
    if (schema.columns && schema.columns.length > 0) {
      setColumns(schema.columns);
    } else {
      fetchGeneratedColumns();
    }
  }, [schema]);

  const fetchGeneratedColumns = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.get(`/columns/${schema.id}`);
      const generatedColumns = response.data.columns;
      setColumns(generatedColumns);
      setWorkflowState({
        ...workflowState,
        schema: { ...schema, columns: generatedColumns },
      });
    } catch (err) {
      console.error('Error generating columns:', err);
      setError('Failed to generate columns.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddColumn = () => {
    setModalMode('add');
    setModalInitialValue('');
    setShowModal(true);
  };

  const handleEditColumn = (index) => {
    setModalMode('edit');
    setModalInitialValue(columns[index]);
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDeleteColumn = (index) => {
    const updatedColumns = [...columns];
    updatedColumns.splice(index, 1);
    setColumns(updatedColumns);
  };

  const handleModalConfirm = (value) => {
    if (
      columns.some(
        (col, idx) =>
          col.toLowerCase() === value.toLowerCase() && idx !== editIndex
      )
    ) {
      alert('Duplicate column name not allowed.');
      return;
    }
    if (modalMode === 'add') {
      setColumns([...columns, value]);
    } else if (modalMode === 'edit') {
      const updatedColumns = [...columns];
      updatedColumns[editIndex] = value;
      setColumns(updatedColumns);
    }
    setShowModal(false);
    setModalInitialValue('');
    setEditIndex(null);
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setModalInitialValue('');
    setEditIndex(null);
  };

  const handleSaveColumns = () => {
    setWorkflowState({
      ...workflowState,
      schema: { ...schema, columns },
    });
    alert('Columns saved locally.');
  };

  const handleConfirmColumns = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.put(`/columns/update/${schema.id}`, {
        columns,
      });
      setWorkflowState({
        ...workflowState,
        schema: response.data,
      });
      alert('Columns updated successfully.');
      navigate('/rules-editor');
    } catch (err) {
      console.error('Error updating columns:', err);
      setError('Failed to update columns.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {loading && <LoadingScreen message="Loading columns..." />}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && (
        <>
          <div className={styles.leftColumn}>
            <h2 className={styles.heading}>
              Edit Columns for {schema.name}
            </h2>
            <div className={styles.scrollableContainer}>
              <ColumnsList
                columns={columns}
                onEdit={handleEditColumn}
                onDelete={handleDeleteColumn}
              />
            </div>
            <div className={styles.buttonGroup}>
              <button className={styles.actionButton} onClick={handleAddColumn}>
                + Add Column
              </button>
              <button className={styles.actionButton} onClick={handleSaveColumns}>
                Save Columns
              </button>
              <button className={styles.actionButton} onClick={handleConfirmColumns}>
                Confirm Columns
              </button>
            </div>
          </div>
          <div className={styles.rightColumn}>
            <GuidancePanel
              contextText="Welcome to Columns Editor. Here you can review and adjust the columns that will be used to parse your data. Make sure to remove duplicates and confirm changes before proceeding."
            />
          </div>
        </>
      )}
      {showModal && (
        <ColumnModal
          mode={modalMode}
          initialValue={modalInitialValue}
          onCancel={handleModalCancel}
          onConfirm={handleModalConfirm}
        />
      )}
    </div>
  );
};

export default ColumnsEditor;
