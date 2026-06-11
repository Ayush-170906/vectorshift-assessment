// inputNode.js
import { useState } from 'react';
import { BaseNode, NODE_CONTROL_STYLE } from './BaseNode';

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data.inputType || 'Text');

  return (
    <BaseNode
      id={id}
      config={{
        title: 'Input',
        icon: '⬇️',
        color: '#10b981',
        inputs: [],
        outputs: [{ id: 'value' }],
      }}
    >
      <div className="node-field">
        <label className="node-label">Name</label>
        <input
          className="node-input"
          type="text"
          style={NODE_CONTROL_STYLE}
          value={currName}
          onChange={(e) => setCurrName(e.target.value)}
        />
      </div>
      <div className="node-field">
        <label className="node-label">Type</label>
        <select className="node-select" style={NODE_CONTROL_STYLE} value={inputType} onChange={(e) => setInputType(e.target.value)}>
          <option value="Text">Text</option>
          <option value="File">File</option>
        </select>
      </div>
    </BaseNode>
  );
};
