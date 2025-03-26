import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './WorkflowIndicator.module.css';

const steps = [
  { label: 'Upload PDF', path: '/upload-pdf' },
  { label: 'Select/Generate Schemas', path: '/schema-display' },
  { label: 'Edit Columns', path: '/columns-editor' },
  { label: 'Edit Rules', path: '/rules-editor' },
  { label: 'Code Review', path: '/code-review' },
  { label: 'CSV Analytics', path: '/csv-analytics' },
];

const WorkflowIndicator = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Find which step matches the current route
  const currentStepIndex = steps.findIndex(
    (step) => step.path === location.pathname
  );

  const handleStepClick = (path) => {
    navigate(path);
  };

  return (
    <div className={styles.workflowContainer}>
      <ul className={styles.stepList}>
        {steps.map((step, index) => {
          let stepClass = styles.stepItem;
          if (index < currentStepIndex) {
            stepClass = `${styles.stepItem} ${styles.completed}`;
          } else if (index === currentStepIndex) {
            stepClass = `${styles.stepItem} ${styles.active}`;
          }

          return (
            <li
              key={step.path}
              className={stepClass}
              onClick={() => handleStepClick(step.path)}
            >
              <span className={styles.stepLabel}>{step.label}</span>
              {index < steps.length - 1 && (
                <span className={styles.arrow}>&rsaquo;</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default WorkflowIndicator;
