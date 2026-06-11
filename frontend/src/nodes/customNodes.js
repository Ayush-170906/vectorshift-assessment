// customNodes.js — 5 new nodes built with BaseNode abstraction
// Demonstrates how quickly new nodes can be created

import { useState } from 'react';
import { BaseNode, NODE_CONTROL_STYLE } from './BaseNode';

// 1. API Request Node
export const ApiNode = ({ id, data }) => {
  const [url, setUrl] = useState(data?.url || '');
  const [method, setMethod] = useState(data?.method || 'GET');

  return (
    <BaseNode
      id={id}
      config={{
        title: 'API Request',
        icon: '🌐',
        color: '#0ea5e9',
        inputs: [{ id: 'body', label: 'Body' }, { id: 'headers', label: 'Headers' }],
        outputs: [{ id: 'response', label: 'Response' }, { id: 'error', label: 'Error' }],
      }}
    >
      <div className="node-field">
        <label className="node-label">URL</label>
        <input className="node-input" type="text" style={NODE_CONTROL_STYLE} value={url} onChange={e => setUrl(e.target.value)} placeholder="https://api.example.com" />
      </div>
      <div className="node-field">
        <label className="node-label">Method</label>
        <select className="node-select" style={NODE_CONTROL_STYLE} value={method} onChange={e => setMethod(e.target.value)}>
          <option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option>
        </select>
      </div>
    </BaseNode>
  );
};

// 2. Conditional / If-Else Node
export const ConditionNode = ({ id, data }) => {
  const [condition, setCondition] = useState(data?.condition || '');

  return (
    <BaseNode
      id={id}
      config={{
        title: 'Condition',
        icon: '🔀',
        color: '#8b5cf6',
        inputs: [{ id: 'value', label: 'Input' }],
        outputs: [{ id: 'true', label: 'True' }, { id: 'false', label: 'False' }],
      }}
    >
      <div className="node-field">
        <label className="node-label">Condition</label>
        <input className="node-input" type="text" style={NODE_CONTROL_STYLE} value={condition} onChange={e => setCondition(e.target.value)} placeholder="e.g. value > 10" />
      </div>
    </BaseNode>
  );
};

// 3. Data Transform Node
export const TransformNode = ({ id, data }) => {
  const [transformType, setTransformType] = useState(data?.transformType || 'JSON Parse');

  return (
    <BaseNode
      id={id}
      config={{
        title: 'Transform',
        icon: '⚙️',
        color: '#f97316',
        inputs: [{ id: 'input', label: 'Input' }],
        outputs: [{ id: 'output', label: 'Output' }],
      }}
    >
      <div className="node-field">
        <label className="node-label">Operation</label>
        <select className="node-select" style={NODE_CONTROL_STYLE} value={transformType} onChange={e => setTransformType(e.target.value)}>
          <option>JSON Parse</option>
          <option>JSON Stringify</option>
          <option>To Uppercase</option>
          <option>To Lowercase</option>
          <option>Trim</option>
        </select>
      </div>
    </BaseNode>
  );
};

// 4. Note / Comment Node
export const NoteNode = ({ id, data }) => {
  const [note, setNote] = useState(data?.note || '');

  return (
    <BaseNode
      id={id}
      config={{
        title: 'Note',
        icon: '🗒️',
        color: '#ca8a04',
        inputs: [],
        outputs: [],
        width: 200,
      }}
    >
      <div className="node-field">
        <textarea
          className="node-textarea"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Add a comment or note..."
          style={{ ...NODE_CONTROL_STYLE, minHeight: 60 }}
        />
      </div>
    </BaseNode>
  );
};

// 5. Timer / Delay Node
export const TimerNode = ({ id, data }) => {
  const [delay, setDelay] = useState(data?.delay || 1000);
  const [unit, setUnit] = useState(data?.unit || 'ms');

  return (
    <BaseNode
      id={id}
      config={{
        title: 'Timer',
        icon: '⏱️',
        color: '#14b8a6',
        inputs: [{ id: 'trigger', label: 'Trigger' }],
        outputs: [{ id: 'done', label: 'Done' }],
      }}
    >
      <div className="node-field">
        <label className="node-label">Delay</label>
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            className="node-input"
            type="number"
            value={delay}
            onChange={e => setDelay(e.target.value)}
            style={{ ...NODE_CONTROL_STYLE, width: 80 }}
          />
          <select className="node-select" value={unit} onChange={e => setUnit(e.target.value)} style={{ ...NODE_CONTROL_STYLE, flex: 1 }}>
            <option>ms</option>
            <option>s</option>
            <option>min</option>
          </select>
        </div>
      </div>
    </BaseNode>
  );
};
