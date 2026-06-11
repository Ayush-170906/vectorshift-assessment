// BaseNode.js
// Shared shell for every pipeline node — header, body, and connection handles.

import { Handle, Position } from 'reactflow';

/** Inline styles for input, select, and textarea controls inside nodes. */
export const NODE_CONTROL_STYLE = {
  background: '#0c0c0e',
  border: '1px solid #2a2a2f',
  color: '#f0ede8',
  borderRadius: '4px',
  padding: '5px 8px',
  width: '100%',
  fontSize: '12px',
  fontFamily: 'Inter, sans-serif',
};

const handleTop = (index, total) =>
  total === 1 ? '50%' : `${((index + 1) / (total + 1)) * 100}%`;

export const BaseNode = ({ id, config, children }) => {
  const {
    title,
    icon = '●',
    color = '#6366f1',
    inputs = [],
    outputs = [],
    width = 220,
    minHeight = 90,
    height,
    className = '',
  } = config;

  const rootStyle = {
    background: '#141416',
    border: '1px solid #2a2a2f',
    borderRadius: '8px',
    minWidth: 220,
    position: 'relative',
    fontFamily: 'Inter, sans-serif',
    boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
    width,
    minHeight,
    ...(height ? { height } : {}),
    '--node-accent': color,
  };

  const headerStyle = {
    background: color,
    padding: '8px 12px',
    borderRadius: '8px 8px 0 0',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  const titleStyle = {
    color: '#fff',
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  };

  const bodyStyle = {
    padding: '10px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  };

  return (
    <div className={`base-node ${className}`.trim()} style={rootStyle}>
      {inputs.map((handle, i) => (
        <Handle
          key={handle.id}
          type="target"
          position={Position.Left}
          id={`${id}-${handle.id}`}
          style={{ top: handleTop(i, inputs.length), ...handle.style }}
          className="node-handle node-handle--input"
        >
          {handle.label && (
            <span className="handle-label handle-label--left">{handle.label}</span>
          )}
        </Handle>
      ))}

      <div className="node-header" style={headerStyle}>
        <span className="node-icon">{icon}</span>
        <span className="node-title" style={titleStyle}>{title}</span>
      </div>

      <div className="node-body" style={bodyStyle}>{children}</div>

      {outputs.map((handle, i) => (
        <Handle
          key={handle.id}
          type="source"
          position={Position.Right}
          id={`${id}-${handle.id}`}
          style={{ top: handleTop(i, outputs.length), ...handle.style }}
          className="node-handle node-handle--output"
        >
          {handle.label && (
            <span className="handle-label handle-label--right">{handle.label}</span>
          )}
        </Handle>
      ))}
    </div>
  );
};
