import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";
import { WorkflowContext } from "../../context/WorkFlowContext";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import RulesList from "./components/RulesList";
import RuleModal from "./components/RuleModal";
import RulesToolbar from "./components/RulesToolbar";
import { ChatInterface } from "../../components/ChatInterface/ChatInterface";
import styles from "./RulesEditor.module.css";

const RulesEditor = () => {
  const { workflowState, setWorkflowState } = useContext(WorkflowContext);
  const { schema } = workflowState;
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // State for editing/adding a rule via modal
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [modalInitialRule, setModalInitialRule] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  // State for the chat interface regeneration; if null then default (generate all rules)
  const [selectedRuleForRegen, setSelectedRuleForRegen] = useState(null);

  const navigate = useNavigate();

  // On mount, fetch rules using schema.id as dependency.
  useEffect(() => {
    if (!schema || !schema.id) {
      setError("No schema selected. Please select a schema first.");
      return;
    }
    fetchRules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schema?.id]);

  const fetchRules = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await apiClient.get(`/rules/${schema.id}`);
      const fetchedRules = response.data;
      if (fetchedRules && fetchedRules.length > 0) {
        setRules(fetchedRules);
        // update global state with rules
        setWorkflowState({
          ...workflowState,
          schema: { ...schema, rules: fetchedRules },
        });
      } else {
        // If no rules, leave rules as empty so that the ChatInterface shows a prompt to generate all rules.
        setRules([]);
      }
    } catch (err) {
      console.error("Error fetching rules:", err);
      setError("Failed to fetch rules.");
    } finally {
      setLoading(false);
    }
  };

  // Handler for RuleModal (for add/edit)
  const handleAddRule = () => {
    setModalMode("add");
    setModalInitialRule(null);
    setShowModal(true);
  };

  const handleEditRule = (index) => {
    setModalMode("edit");
    setModalInitialRule(rules[index]);
    setEditIndex(index);
    setShowModal(true);
  };

  // Updated handleModalConfirm to be async for add mode.
  const handleModalConfirm = async (ruleData) => {
    if (modalMode === "add") {
      try {
        // Call the add endpoint with schema_id and rule data.
        const response = await apiClient.post(`/rules/add/`, {
          schema_id: schema.id,
          rule: ruleData,
        });
        // Append the new rule returned from the backend.
        setRules([...rules, response.data]);
      } catch (err) {
        console.error("Error adding rule:", err);
        alert("Failed to add rule.");
      }
    } else if (modalMode === "edit") {
      // For edit mode, update local state; user must click "Save" on the card to commit changes.
      const updatedRules = [...rules];
      updatedRules[editIndex] = ruleData;
      setRules(updatedRules);
    }
    setShowModal(false);
    setModalInitialRule(null);
    setEditIndex(null);
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setModalInitialRule(null);
    setEditIndex(null);
  };

  // Handler to update a rule (when the user clicks "Save" on a rule card)
  const handleSaveRule = async (index, updatedRule) => {
    try {
      const ruleId = rules[index].id;
      const response = await apiClient.put(
        `/rules/update/${schema.id}/${ruleId}`,
        {
          rule_category: updatedRule.category,
          rule_description: updatedRule.description,
          rule_code: updatedRule.code,
          columns: updatedRule.columns,
        }
      );
      const updatedRules = [...rules];
      updatedRules[index] = response.data;
      setRules(updatedRules);
      alert("Rule updated successfully.");
    } catch (err) {
      console.error("Error updating rule:", err);
      alert("Failed to update rule.");
    }
  };

  // Handler to remove a rule locally (delete functionality)
  const handleDeleteRule = async (index) => {
    const ruleId = rules[index].id;
    const response = await apiClient.post(
      `/rules/delete/${schema.id}/${rules[index].id}`
    );
    const updatedRules = rules.filter((r) => r.id !== ruleId);
    console.log(updatedRules);
    setRules(updatedRules);
    setWorkflowState({
      ...workflowState,
      schema: { ...schema, rules: updatedRules },
    });
  };

  // When a rule's "Regenerate" button is clicked on a rule card
  const handleRegenerateRule = (rule) => {
    setSelectedRuleForRegen(rule);
  };

  // Handler for the ChatInterface prompt submission
  const handleChatPromptSubmit = async (prompt, rule) => {
    setLoading(true);
    try {
      if (rule) {
        // Regenerate individual rule
        const regenResponse = await apiClient.post(
          `/rules/generate/${schema.id}/${rule.id}`,
          { prompt }
        );
        // After regeneration, delete the old rule.
        await apiClient.post(`/rules/delete/${schema.id}/${rule.id}`, {});
        // Replace old rule with regenerated one.
        const updatedRules = rules.map((r) =>
          r.id === rule.id ? regenResponse.data : r
        );
        setRules(updatedRules);
        alert("Rule regenerated successfully.");
        setSelectedRuleForRegen(null);
      } else {
        // Generate all rules
        const response = await apiClient.post(`/rules/generate/${schema.id}`, {
          prompt,
        });
        setRules(response.data);
        alert("Rules generated successfully.");
      }
      setWorkflowState({
        ...workflowState,
        schema: { ...schema, rules },
      });
    } catch (err) {
      console.error("Error generating rules:", err);
      alert("Failed to generate rules.");
    } finally {
      setLoading(false);
    }
  };

  // Global toolbar actions
  const handleSaveRules = async () => {
    setWorkflowState({
      ...workflowState,
      schema: { ...schema, rules },
    });
    alert("Rules saved locally.");
  };

  const handleConfirmRules = () => {
    setWorkflowState({
      ...workflowState,
      schema: { ...schema, rules },
    });
    navigate("/code-review");
  };

  return (
    <div className={styles.container}>
      {loading && <LoadingScreen message="Processing rules..." />}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && (
        <div className={styles.mainContent}>
          <div className={styles.leftColumn}>
            <h2 className={styles.heading}>Edit Rules for {schema.name}</h2>
            <button className={styles.addButton} onClick={handleAddRule}>
              + Add Rule
            </button>
            <RulesList
              rules={rules}
              onEdit={handleEditRule}
              onDelete={handleDeleteRule}
              onSave={handleSaveRule}
              onRegenerate={handleRegenerateRule}
            />
            <RulesToolbar
              onSaveRules={handleSaveRules}
              onConfirmRules={handleConfirmRules}
            />
          </div>
          <div className={styles.rightColumn}>
            <ChatInterface
              contextText="Use this panel to regenerate rules. Toggle between generating all rules and regenerating an individual rule. In individual mode, detailed rule information is displayed."
              onSubmitPrompt={handleChatPromptSubmit}
              currentRule={selectedRuleForRegen}
            />
          </div>
        </div>
      )}
      {showModal && (
        <RuleModal
          mode={modalMode}
          initialRule={modalInitialRule}
          onCancel={handleModalCancel}
          onConfirm={handleModalConfirm}
        />
      )}
    </div>
  );
};

export default RulesEditor;
