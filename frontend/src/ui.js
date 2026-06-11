// ui.js
import { useRef, useCallback, useState } from 'react';
import ReactFlow, { Controls, Background, MiniMap, ReactFlowProvider, useReactFlow } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { ApiNode, ConditionNode, TransformNode, NoteNode, TimerNode } from './nodes/customNodes';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  api: ApiNode,
  condition: ConditionNode,
  transform: TransformNode,
  note: NoteNode,
  timer: TimerNode,
};

const MINIMAP_COLORS = {
  customInput: '#10b981',
  customOutput: '#f59e0b',
  llm: '#6366f1',
  text: '#ec4899',
  api: '#0ea5e9',
  condition: '#8b5cf6',
  transform: '#f97316',
  note: '#C9A96E',
  timer: '#14b8a6',
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

// reactflow@11.8.3 — use project(), not screenToFlowPosition() (v12+)
const FlowCanvas = () => {
  const reactFlowWrapper = useRef(null);
  const { project } = useReactFlow();
  const [isDragOver, setIsDragOver] = useState(false);
  const { nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect } =
    useStore(selector, shallow);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      setIsDragOver(false);

      const transferData = event.dataTransfer.getData('application/reactflow');
      if (!transferData || !reactFlowWrapper.current) return;

      let type;
      try {
        type = JSON.parse(transferData)?.nodeType;
      } catch {
        type = transferData;
      }
      if (!type) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const nodeID = getNodeID(type);
      addNode({
        id: nodeID,
        type,
        position,
        data: { id: nodeID, nodeType: type },
      });
    },
    [project, addNode, getNodeID]
  );

  return (
    <div
      ref={reactFlowWrapper}
      className="pipeline-canvas"
      style={{ width: '100%', height: '100%' }}
    >
      {nodes.length === 0 && !isDragOver && (
        <div
          className="canvas-empty-state"
          aria-hidden="true"
          style={{ zIndex: 1 }}
        >
          <div className="canvas-empty-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="4" y="10" width="16" height="12" rx="3" stroke="#2a2a2f" strokeWidth="1.5" />
              <rect x="28" y="26" width="16" height="12" rx="3" stroke="#2a2a2f" strokeWidth="1.5" />
            </svg>
          </div>
          <p className="canvas-empty-title">Drop a node to begin</p>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        snapToGrid
        connectionLineType="smoothstep"
        connectionLineStyle={{ stroke: '#C9A96E', strokeWidth: 1.5 }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#3a3a42', strokeWidth: 1.5 },
        }}
        fitView={false}
        style={{ width: '100%', height: '100%', position: 'relative', zIndex: 2 }}
      >
        <Background variant="dots" color="#222226" gap={24} size={1.5} />
        <Controls showInteractive={false} />
        <MiniMap
          pannable
          zoomable
          maskColor="rgba(12,12,14,0.85)"
          nodeStrokeWidth={3}
          nodeColor={(node) => MINIMAP_COLORS[node.type] || '#64748b'}
          style={{ background: '#141416', border: '1px solid #2a2a2f', borderRadius: '6px' }}
        />
      </ReactFlow>

      {isDragOver && (
        <div
          className="canvas-drag-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 4,
            border: '2px dashed #C9A96E',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#C9A96E',
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          ✦ Drop here
        </div>
      )}
    </div>
  );
};

export const PipelineUI = () => (
  <ReactFlowProvider>
    <FlowCanvas />
  </ReactFlowProvider>
);
