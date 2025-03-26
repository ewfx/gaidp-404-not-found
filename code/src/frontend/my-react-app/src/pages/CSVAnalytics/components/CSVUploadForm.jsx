import React, { useState, useContext } from "react";
import apiClient from "../../../api/apiClient";
import { WorkflowContext } from "../../../context/WorkFlowContext";
import styles from "./CSVUploadForm.module.css";

const CSVUploadForm = ({ setUploadStatus, setLoading }) => {
  const { workflowState, setWorkflowState } = useContext(WorkflowContext);
  const { schema } = workflowState;
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const downloadFile = async (schema_id, csv_id) => {
    const url = `/validate/csv/${schema_id}/${csv_id}`;

    try {
      const response = await apiClient.get(url, {
        responseType: "blob",
      });

      if (response.status !== 200) throw new Error("Failed to download file");

      const blob = new Blob([response.data]);
      const fileURL = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = fileURL;
      a.download = "data.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(fileURL);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a CSV file.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    try {
      const res = await apiClient.post("/csv/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Assuming the response contains CSV data or analytics results.
      const csvData = res.data;
      // Update global state if needed.
      setWorkflowState((prev) => ({ ...prev, csvData }));
      setUploadStatus("CSV uploaded successfully.");
      downloadFile(schema.id, csvData.csv_id);
    } catch (error) {
      console.error("Error uploading CSV:", error);
      setUploadStatus("Error uploading CSV.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className={styles.fileInput}
      />
      <button onClick={handleUpload} className={styles.uploadButton}>
        Upload CSV
      </button>
    </div>
  );
};

export default CSVUploadForm;
