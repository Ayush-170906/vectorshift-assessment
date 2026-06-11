// toolbar.js
import { DraggableNode } from './draggableNode';

const NODE_GROUPS = [
  {
    label: 'Core',
    nodes: [
      { type: 'customInput', label: 'Input', icon: '⬇', accent: '#10b981' },
      { type: 'customOutput', label: 'Output', icon: '⬆', accent: '#f59e0b' },
      { type: 'llm', label: 'LLM', icon: '◈', accent: '#6366f1' },
      { type: 'text', label: 'Text', icon: 'T', accent: '#ec4899' },
    ],
  },
  {
    label: 'Logic',
    nodes: [
      { type: 'api', label: 'API', icon: '⇄', accent: '#0ea5e9' },
      { type: 'condition', label: 'Condition', icon: '?', accent: '#8b5cf6' },
      { type: 'transform', label: 'Transform', icon: '⚙', accent: '#f97316' },
      { type: 'timer', label: 'Timer', icon: '⏱', accent: '#14b8a6' },
      { type: 'note', label: 'Note', icon: '✎', accent: '#ca8a04' },
    ],
  },
];

export const PipelineToolbar = () => {
  return (
    <header className="pipeline-toolbar">
      <div className="toolbar-brand">
        <div className="toolbar-brand-mark">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="4" cy="9" r="2.5" fill="currentColor" opacity="0.5" />
            <circle cx="9" cy="4" r="2.5" fill="currentColor" />
            <circle cx="14" cy="9" r="2.5" fill="currentColor" opacity="0.7" />
            <path d="M6 8.5L7.5 5.5M10.5 5.5L12 8.5" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
          </svg>
        </div>
        <div className="toolbar-brand-text">
          <span className="toolbar-brand-name">VectorShift</span>
          <span className="toolbar-brand-sub">Pipeline Builder</span>
        </div>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-palette">
        {NODE_GROUPS.map((group) => (
          <div key={group.label} className="toolbar-group">
            <span className="toolbar-group-label">{group.label}</span>
            <div className="toolbar-group-nodes">
              {group.nodes.map((node) => (
                <DraggableNode key={node.type} {...node} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </header>
  );
};
