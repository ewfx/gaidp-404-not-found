import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WorkflowProvider } from './context/WorkFlowContext';
import Navbar from './components/Navbar/Navbar';
import WorkflowIndicator from './components/WorkflowIndicator/WorkflowIndicator';
import Home from './pages/Home/Home';
import WorkflowLayout from './layout/WorkflowLayout';
import UploadPDF from './pages/UploadPDF/UploadPDF';
import SchemaDisplay from './pages/SchemaDisplay/SchemaDisplay';
import ColumnsEditor from './pages/ColumnsEditor/ColumnsEditor';
import RulesEditor from './pages/RulesEditor/RulesEditor';
import CodeReview from './pages/CodeReview/CodeReview';
import CSVAnalytics from './pages/CSVAnalytics/CSVAnalytics';
import './App.module.css';

function App() {
  return (
    <WorkflowProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Home page: no workflow indicator */}
          <Route path="/" element={<Home />} />
          {/* Workflow pages: wrapped in WorkflowLayout which renders WorkflowIndicator */}
          <Route element={<WorkflowLayout />}>
            <Route path="/upload-pdf" element={<UploadPDF />} />
            <Route path="/schema-display" element={<SchemaDisplay />} />
            <Route path="/columns-editor" element={<ColumnsEditor />} />
            <Route path="/rules-editor" element={<RulesEditor />} />
            <Route path="/code-review" element={<CodeReview />} />
            <Route path="/csv-analytics" element={<CSVAnalytics />} />
          </Route>
        </Routes>
      </Router>
    </WorkflowProvider>
  );
}

export default App;
