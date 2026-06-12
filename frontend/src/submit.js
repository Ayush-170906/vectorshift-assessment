// submit.js — Part 4: Backend Integration
import { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({ nodes: state.nodes, edges: state.edges });

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://vectorshift-assessment-hgbo.onrender.com/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setResult(null);

  return (
    <>
      <footer className="submit-bar">
        <div className="submit-bar-meta">
          <span className="submit-stat">
            <strong>{nodes.length}</strong> node{nodes.length !== 1 ? 's' : ''}
          </span>
          <span className="submit-stat-divider" />
          <span className="submit-stat">
            <strong>{edges.length}</strong> edge{edges.length !== 1 ? 's' : ''}
          </span>
        </div>
        <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <span className="submit-btn-spinner" aria-hidden="true" />
              Analyzing...
            </>
          ) : (
            'Analyze Pipeline'
          )}
        </button>
      </footer>

      {result && (
        <div className="pipeline-alert-overlay" onClick={closeModal} role="presentation">
          <div
            className="pipeline-alert"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="alert-title"
          >
            {result.error ? (
              <>
                <div className="alert-header alert-header--error">
                  <span className="alert-header-icon">!</span>
                  <h3 id="alert-title">Connection Error</h3>
                </div>
                <p className="alert-error-message">
                  Could not reach the backend at <code>localhost:8000</code>.
                  <br />
                  {result.error}
                </p>
                <button className="alert-close-btn" onClick={closeModal}>Dismiss</button>
              </>
            ) : (
              <>
                <div className="alert-header">
                  <span className="alert-header-icon alert-header-icon--success">✓</span>
                  <h3 id="alert-title">Pipeline Analysis</h3>
                </div>

                <div className="alert-stats">
                  <div className="alert-stat">
                    <div className="alert-stat-value">{result.num_nodes}</div>
                    <div className="alert-stat-label">Nodes</div>
                  </div>
                  <div className="alert-stat">
                    <div className="alert-stat-value">{result.num_edges}</div>
                    <div className="alert-stat-label">Edges</div>
                  </div>
                  <div className="alert-stat">
                    <div
                      className={`alert-stat-value alert-stat-dag ${result.is_dag ? 'dag-true' : 'dag-false'}`}
                      aria-label={result.is_dag ? 'Is a valid DAG' : 'Contains cycles'}
                    >
                      <span className="dag-icon">{result.is_dag ? '✓' : '✗'}</span>
                    </div>
                    <div className="alert-stat-label">Is DAG</div>
                  </div>
                </div>

                <p className={`alert-dag-message ${result.is_dag ? 'alert-dag-message--valid' : 'alert-dag-message--invalid'}`}>
                  {result.is_dag
                    ? 'Valid DAG — no circular dependencies detected. Pipeline is ready to execute.'
                    : 'Not a DAG — the pipeline contains cycles and cannot be executed as-is.'}
                </p>

                <button className="alert-close-btn" onClick={closeModal}>Done</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
