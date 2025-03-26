import React, { useState, useEffect, useContext, useRef } from "react";
import { WorkflowContext } from "../../context/WorkFlowContext";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";
import CodeReviewRulesList from "./components/CodeReviewRulesList";
import CodeEditor from "./components/CodeEditor";
import ConfirmCodesButton from "./components/ConfirmCodesButton";
import styles from "./CodeReview.module.css";

const CodeReview = () => {
  const { workflowState, setWorkflowState } = useContext(WorkflowContext);
  const { schema } = workflowState;
  const navigate = useNavigate();

  const [rules, setRules] = useState(schema.rules || []);
  const [selectedRule, setSelectedRule] = useState(null);
  const [loading, setLoading] = useState(true);

  // Flag to ensure we only fetch codes once
  const didFetchCodes = useRef(false);

  // Helper: Extract code from the rule body returned by the endpoint.
  // Adjust this function if the API structure changes.
  const extractCodeFromRuleBody = (ruleData) => {
    // Assume the API returns an object with a field 'rule_body'
    // which contains the code (or the section with code).
    if (ruleData.code) {
      return ruleData.code;
    }
    return "";
  };

  useEffect(() => {
    if (!schema || !schema.rules || schema.rules.length === 0) {
      alert("No rules found. Please complete the Rules Editor first.");
      navigate("/rules-editor");
      return;
    }

    if (didFetchCodes.current) return;

    let isMounted = true;

    // For each rule, make an individual asynchronous call
    schema.rules.forEach((rule) => {
      (async () => {
        try {
          // Use the new endpoint: /rules/{schema_id}/{rule_id}
          const res = await apiClient.get(`/rules/${schema.id}/${rule.id}`);
          let ruleData = res.data; // Expected to contain a 'rule_body' field
          let extractedCode = extractCodeFromRuleBody(ruleData);
          // If the extracted code is empty, call generate endpoint with an empty prompt.
          if (!extractedCode || extractedCode.trim() === "") {
            const genRes = await apiClient.post(
              `/code/generate/${schema.id}/${rule.id}`,
              { prompt: "" }
            );
            extractedCode = genRes.data.code;
          }
          ruleData.code = extractedCode;

          if (isMounted) {
            // Update state: If rule exists, update it; otherwise, add it.
            setRules((prev) => {
              const existing = prev.find((r) => r.id === rule.id);
              if (existing) {
                const newPrev = [...prev]; // Create a shallow copy
                newPrev[prev.indexOf(existing)] = ruleData; // Update the element at the found index
                return newPrev;
              } else {
                return [...prev, ruleData];
              }
            });
            // Set the first rule as the selected rule if none is selected
            setSelectedRule((prev) => prev || ruleData);
            // As soon as the first rule's code is fetched, remove the loading state.
            if (loading) setLoading(false);
          }
        } catch (error) {
          console.error(`Error fetching code for rule ${rule.id}:`, error);
        }
      })();
    });

    didFetchCodes.current = true;
    return () => {
      isMounted = false;
    };
  }, [schema?.id, navigate, setWorkflowState, schema, loading]);

  // Update a rule in both local and global state
  const updateRuleInState = (updatedRule) => {
    const newRules = rules.map((r) =>
      r.id === updatedRule.id ? updatedRule : r
    );
    setRules(newRules);
    setWorkflowState((prevState) => ({
      ...prevState,
      schema: { ...schema, rules: newRules },
    }));
    if (selectedRule && selectedRule.id === updatedRule.id) {
      setSelectedRule(updatedRule);
    }
  };

  // Save the code for the selected rule using the PUT endpoint
  const handleSaveCode = async (code) => {
    try {
      const res = await apiClient.put(
        `/rules/update/${schema.id}/${selectedRule.id}`,
        {
          rule_category: selectedRule.category,
          rule_description: selectedRule.description,
          rule_code: code,
          columns: selectedRule.columns,
        }
      );
      const updatedRule = res.data;
      updateRuleInState(updatedRule);
      alert("Code saved successfully.");
    } catch (error) {
      console.error("Error saving code:", error);
      alert("Failed to save code.");
    }
  };

  // Regenerate code for the selected rule using the POST endpoint
  const handleRegenerateCode = async (prompt) => {
    try {
      setLoading(true);
      const res = await apiClient.post(
        `/code/generate/${schema.id}/${selectedRule.id}`,
        { prompt }
      );
      const newCode = res.data.code;
      const updatedRule = { ...selectedRule, code: newCode };
      updateRuleInState(updatedRule);
      alert("Code regenerated successfully.");
      setLoading(false);
    } catch (error) {
      console.error("Error regenerating code:", error);
      alert("Failed to regenerate code.");
    }
  };

  const handleSelectRule = (rule) => {
    setSelectedRule(rule);
  };

  const handleConfirmCodes = () => {
    setWorkflowState((prevState) => ({
      ...prevState,
      schema: { ...schema, rules },
    }));
    navigate("/csv-analytics");
  };

  if (loading) {
    return <div className={styles.loading}>Loading codes...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <h2>Code Review</h2>
        <CodeReviewRulesList
          rules={rules}
          onSelectRule={handleSelectRule}
          selectedRuleId={selectedRule ? selectedRule.id : null}
        />
        <ConfirmCodesButton onConfirm={handleConfirmCodes} />
      </div>
      <div className={styles.rightColumn}>
        {selectedRule ? (
          <CodeEditor
            rule={selectedRule}
            onSaveCode={handleSaveCode}
            onRegenerateCode={handleRegenerateCode}
          />
        ) : (
          <p>Please select a rule to review its code.</p>
        )}
      </div>
    </div>
  );
};

export default CodeReview;
