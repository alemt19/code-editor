import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:3000";

const languageOptions = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "ruby", label: "Ruby" },
  { value: "perl", label: "Perl" },
  { value: "php", label: "PHP" },
];

export default function Dashboard() {
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", language: "" });
  const addDialogRef = useRef(null);
  const errorDialogRef = useRef(null);
  const navigate = useNavigate();

  // Helper: get token from localStorage
  const getToken = () => localStorage.getItem("authToken");

  // Fetch scripts on mount
  useEffect(() => {
    loadScripts();
    // eslint-disable-next-line
  }, []);

  // Dialog open/close helpers
  useEffect(() => {
    if (showAddDialog) {
      addDialogRef.current?.showModal();
    } else {
      addDialogRef.current?.close();
    }
  }, [showAddDialog]);

  useEffect(() => {
    if (showError) {
      errorDialogRef.current?.showModal();
    } else {
      errorDialogRef.current?.close();
    }
  }, [showError]);

  async function loadScripts() {
    const token = getToken();
    if (!token) {
      setErrorMsg("No authentication token found. Please login again.");
      setShowError(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/scripts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        if (res.status === 401) {
          setErrorMsg("Unauthorized. Please login again.");
        } else {
          setErrorMsg(`Failed to load scripts: ${res.statusText}`);
        }
        setShowError(true);
        setScripts([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setScripts(data);
    } catch (err) {
      setErrorMsg("Network error while loading scripts.");
      setShowError(true);
      setScripts([]);
    }
    setLoading(false);
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Are you sure you want to delete the script "${name}"?`)) return;
    const token = getToken();
    if (!token) {
      setErrorMsg("No authentication token found. Please login again.");
      setShowError(true);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/scripts/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setErrorMsg(`Failed to delete script "${name}".`);
        setShowError(true);
        return;
      }
      loadScripts();
    } catch (err) {
      setErrorMsg("Network error while deleting script.");
      setShowError(true);
    }
  }

  async function handleAddScript(e) {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      setErrorMsg("No authentication token found. Please login again.");
      setShowError(true);
      setShowAddDialog(false);
      return;
    }
    if (!addForm.name.trim() || !addForm.language) {
      setErrorMsg("Please fill out all fields.");
      setShowError(true);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/scripts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: addForm.name.trim(),
          language: addForm.language,
        }),
      });
      if (!res.ok) {
        setErrorMsg("Failed to create script.");
        setShowError(true);
        return;
      }
      setShowAddDialog(false);
      setAddForm({ name: "", language: "" });
      loadScripts();
    } catch (err) {
      setErrorMsg("Network error while creating script.");
      setShowError(true);
    }
  }

  // Inline styles (from your CSS)
  const styles = {
    root: {
      fontFamily: "Arial, sans-serif",
      maxWidth: 600,
      margin: "2rem auto",
      background: "#f9f9f9",
      padding: "1rem",
    },
    h1: {
      textAlign: "center",
      color: "#333",
    },
    list: {
      listStyle: "none",
      padding: 0,
      margin: "1rem 0",
      border: "1px solid #ddd",
      borderRadius: 6,
      background: "white",
    },
    listItem: {
      display: "flex",
      justifyContent: "space-between",
      padding: "0.75rem 1rem",
      borderBottom: "1px solid #eee",
      alignItems: "center",
    },
    listItemLast: {
      borderBottom: "none",
    },
    scriptInfo: {
      display: "flex",
      flexDirection: "column",
    },
    scriptName: {
      fontWeight: "bold",
      fontSize: "1.1rem",
      color: "#222",
    },
    scriptLanguage: {
      fontSize: "0.9rem",
      color: "#666",
    },
    deleteBtn: {
      backgroundColor: "#e74c3c",
      border: "none",
      color: "white",
      padding: "0.4rem 0.8rem",
      borderRadius: 4,
      cursor: "pointer",
      fontSize: "0.9rem",
      transition: "background-color 0.2s ease",
    },
    addBtn: {
      display: "block",
      margin: "1rem auto",
      padding: "0.75rem 1.5rem",
      fontSize: "1rem",
      backgroundColor: "#3498db",
      color: "white",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      transition: "background-color 0.2s ease",
    },
    dialog: {
      borderRadius: 8,
      border: "1px solid #ccc",
      padding: "1.5rem",
      maxWidth: 400,
      width: "90%",
    },
    dialogForm: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    dialogLabel: {
      fontWeight: "bold",
      color: "#333",
    },
    dialogInput: {
      padding: "0.5rem",
      fontSize: "1rem",
      border: "1px solid #ccc",
      borderRadius: 4,
      width: "100%",
      boxSizing: "border-box",
    },
    dialogBtnRow: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "1rem",
    },
    submitBtn: {
      backgroundColor: "#2ecc71",
      color: "white",
      padding: "0.6rem 1rem",
      fontSize: "1rem",
      borderRadius: 4,
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
    },
    cancelBtn: {
      backgroundColor: "#bdc3c7",
      color: "#333",
      marginLeft: "0.5rem",
      padding: "0.6rem 1rem",
      fontSize: "1rem",
      borderRadius: 4,
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
    },
    errorP: {
      color: "#e74c3c",
      fontWeight: "bold",
      margin: 0,
    },
  };

  return (
    <div style={styles.root}>
      <h1 style={styles.h1}>Your Scripts</h1>

      <ul style={styles.list} aria-live="polite" aria-label="List of your scripts">
      {loading ? (
        <li>Loading...</li>
      ) : scripts.length === 0 ? (
        <li>No scripts found.</li>
      ) : (
        scripts.map((script, idx) => (
          <li
            key={script.id}
            style={{
              ...styles.listItem,
              ...(idx === scripts.length - 1 ? styles.listItemLast : {}),
              cursor: "pointer", // indicate clickable
            }}
            onClick={() => navigate(`/editor?id=${script.id}`)} // Redirect on click
            tabIndex={0} // make it focusable for accessibility
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                navigate(`/editor?id=${script.id}`);
              }
            }}
            aria-label={`Open editor for script ${script.name}`}
          >
            <div style={styles.scriptInfo}>
              <span style={styles.scriptName}>{script.name}</span>
              <span style={styles.scriptLanguage}>{script.language}</span>
            </div>
            <button
              style={styles.deleteBtn}
              aria-label={`Delete script ${script.name}`}
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering li onClick
                handleDelete(script.id, script.name);
              }}
            >
              Delete
            </button>
          </li>
        ))
      )}
    </ul>

      <button
        style={styles.addBtn}
        aria-haspopup="dialog"
        aria-controls="addScriptDialog"
        onClick={() => setShowAddDialog(true)}
      >
        + Add New Script
      </button>

      {/* Add Script Modal */}
      <dialog ref={addDialogRef} style={styles.dialog} onClose={() => setShowAddDialog(false)}>
        <h2>Add New Script</h2>
        <form style={styles.dialogForm} onSubmit={handleAddScript} autoComplete="off">
          <label htmlFor="name" style={styles.dialogLabel}>
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            minLength={1}
            autoComplete="off"
            style={styles.dialogInput}
            value={addForm.name}
            onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
          />

          <label htmlFor="language" style={styles.dialogLabel}>
            Language:
          </label>
          <select
            id="language"
            name="language"
            required
            style={styles.dialogInput}
            value={addForm.language}
            onChange={(e) => setAddForm((f) => ({ ...f, language: e.target.value }))}
          >
            <option value="" disabled>
              Select language
            </option>
            {languageOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <div style={styles.dialogBtnRow}>
            <button type="submit" className="submit-btn" style={styles.submitBtn}>
              Create
            </button>
            <button
              type="button"
              className="cancel-btn"
              style={styles.cancelBtn}
              onClick={() => setShowAddDialog(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </dialog>

      {/* Error Dialog */}
      <dialog ref={errorDialogRef} style={styles.dialog} onClose={() => setShowError(false)}>
        <h3>Error</h3>
        <p style={styles.errorP}>{errorMsg}</p>
        <button onClick={() => setShowError(false)} style={styles.cancelBtn}>
          Close
        </button>
      </dialog>
    </div>
  );
}
