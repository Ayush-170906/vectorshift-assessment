// outputNode.js
import { useState } from 'react';
import { BaseNode, NODE_CONTROL_STYLE } from './BaseNode';

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data.outputType || 'Text');

  return (
    <BaseNode
      id={id}
      config={{
        title: 'Output',
        icon: '⬆️',
        color: '#f59e0b',
        inputs: [{ id: 'value' }],
        outputs: [],
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
        <select className="node-select" style={NODE_CONTROL_STYLE} value={outputType} onChange={(e) => setOutputType(e.target.value)}>
          <option value="Text">Text</option>
          <option value="Image">Image</option>
        </select>
      </div>
    </BaseNode>
  );
};
