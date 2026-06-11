// textNode.js — Part 3: auto-resize + dynamic {{ variable }} handles
import { useState, useEffect, useRef, useMemo } from 'react';
import { BaseNode, NODE_CONTROL_STYLE } from './BaseNode';

const VARIABLE_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

const extractVariables = (text) => {
  const vars = [];
  const seen = new Set();
  let match;
  const regex = new RegExp(VARIABLE_REGEX.source, 'g');
  while ((match = regex.exec(text)) !== null) {
    if (!seen.has(match[1])) {
      seen.add(match[1]);
      vars.push(match[1]);
    }
  }
  return vars;
};

const MIN_WIDTH = 220;
const MIN_HEIGHT = 120;
const CHAR_WIDTH = 7.5;
const LINE_HEIGHT = 18;
const BODY_PADDING = 96;

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [nodeSize, setNodeSize] = useState({ width: MIN_WIDTH, height: MIN_HEIGHT });
  const textareaRef = useRef(null);

  const variables = useMemo(() => extractVariables(currText), [currText]);

  useEffect(() => {
    const lines = currText.split('\n');
    const longestLine = Math.max(...lines.map((l) => l.length), 12);
    const textWidth = Math.max(MIN_WIDTH, longestLine * CHAR_WIDTH + 48);
    const tagRows = variables.length > 0 ? Math.ceil(variables.length / 3) : 0;
    const textHeight = Math.max(72, lines.length * LINE_HEIGHT + 24);
    const tagHeight = tagRows * 28;
    const totalHeight = Math.max(MIN_HEIGHT, textHeight + tagHeight + BODY_PADDING);

    setNodeSize({ width: textWidth, height: totalHeight });

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(72, textareaRef.current.scrollHeight)}px`;
    }
  }, [currText, variables.length]);

  const config = useMemo(
    () => ({
      title: 'Text',
      icon: '📝',
      color: '#ec4899',
      width: nodeSize.width,
      minHeight: nodeSize.height,
      inputs: variables.map((varName) => ({ id: varName, label: varName })),
      outputs: [{ id: 'output' }],
    }),
    [variables, nodeSize]
  );

  return (
    <BaseNode id={id} config={config}>
      <div className="node-field">
        <label className="node-label">Content</label>
        <textarea
          ref={textareaRef}
          className="node-textarea"
          style={NODE_CONTROL_STYLE}
          value={currText}
          onChange={(e) => setCurrText(e.target.value)}
          placeholder="Type text… use {{variable}} to add inputs"
          rows={3}
        />
      </div>

      {variables.length > 0 && (
        <div className="node-field">
          <label className="node-label">Variables</label>
          <div className="node-vars">
            {variables.map((v) => (
              <span key={v} className="node-var-tag">{`{{${v}}}`}</span>
            ))}
          </div>
        </div>
      )}
    </BaseNode>
  );
};
