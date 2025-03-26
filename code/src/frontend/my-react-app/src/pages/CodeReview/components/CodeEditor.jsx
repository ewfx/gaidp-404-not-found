import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';

// Additional CodeMirror 6 extensions
import { EditorView, keymap, lineNumbers } from '@codemirror/view';
import { foldGutter, foldKeymap } from '@codemirror/language';
import { defaultKeymap } from '@codemirror/commands';

import styles from './CodeEditor.module.css';
import RuleActionsPanel from './RuleActionsPanel';
import ThemeSelector from './ThemeSelector';

const CodeEditor = ({ rule, onSaveCode, onRegenerateCode }) => {
  const [code, setCode] = useState(rule.code || '');
  const [isDirty, setIsDirty] = useState(false);
  const [theme, setTheme] = useState('oneDark'); // default theme

  // Map theme keys to CodeMirror theme objects.
  const themeMap = {
    oneDark: oneDark,
    light: null, // Pass null to use CodeMirror's default light theme
  };

  useEffect(() => {
    setCode(rule.code || '');
    setIsDirty(false);
  }, [rule]);

  const handleChange = (value) => {
    setCode(value);
    setIsDirty(true);
  };

  const handleSave = () => {
    onSaveCode(code);
    setIsDirty(false);
  };

  const handleRegenerate = (prompt) => {
    onRegenerateCode(prompt);
    setIsDirty(false);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <div className={styles.editorWrapper}>
      {/* Header area with the theme selector */}
      <div className={styles.header}>
        <ThemeSelector selectedTheme={theme} onThemeChange={handleThemeChange} />
      </div>

      {/* Main editor container */}
      <div className={styles.editorContainer}>
        <CodeMirror
          value={code}
          height="600px"                 // Increased default height
          theme={themeMap[theme]}
          onChange={handleChange}
          extensions={[
            python(),
            // Show line numbers
            lineNumbers(),
            // Enable line wrapping
            EditorView.lineWrapping,
            // Add fold gutter & fold key bindings
            foldGutter(),
            keymap.of([...defaultKeymap, ...foldKeymap]),
          ]}
        />
      </div>

      {/* Panel with Save and Regenerate actions */}
      <RuleActionsPanel onSave={handleSave} onRegenerate={handleRegenerate} isDirty={isDirty} />
    </div>
  );
};

export default CodeEditor;
