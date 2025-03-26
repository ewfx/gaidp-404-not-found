import React, { createContext, useState, useEffect } from 'react';

export const WorkflowContext = createContext();

export const WorkflowProvider = ({ children }) => {
  const [workflowState, setWorkflowState] = useState(() => {
    try {
      const savedState = localStorage.getItem('workflowState');
      return savedState
        ? JSON.parse(savedState)
        : {
            pdfId: null,
            pdfName: '',
            columns: [],
            rules: [],
            code: [],
            csvData: null,
            validationResults: null,
          };
    } catch (error) {
      console.error('Error parsing workflow state from localStorage:', error);
      return {
        pdfId: null,
        pdfName: '',
        columns: [],
        rules: [],
        code: [],
        csvData: null,
        validationResults: null,
      };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('workflowState', JSON.stringify(workflowState));
    } catch (error) {
      console.error('Error saving workflow state to localStorage:', error);
    }
  }, [workflowState]);

  return (
    <WorkflowContext.Provider value={{ workflowState, setWorkflowState }}>
      {children}
    </WorkflowContext.Provider>
  );
};
