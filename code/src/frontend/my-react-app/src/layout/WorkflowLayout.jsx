import React from 'react';
import { Outlet } from 'react-router-dom';
import WorkflowIndicator from '../components/WorkflowIndicator/WorkflowIndicator';

const WorkflowLayout = () => {
  return (
    <>
      {/* Show the workflow steps at the top of these pages */}
      <WorkflowIndicator />
      {/* Render the nested route content */}
      <Outlet />
    </>
  );
};

export default WorkflowLayout;
