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
  customInput: InputNode, llm: LLMNode, customOutput: OutputNode,
  text: TextNode, api: ApiNode, condition: ConditionNode,
  transform: TransformNode, note: NoteNode, timer: TimerNode,
};
const COLORS = {
  customInput:'#10b981',customOutput:'#f59e0b',llm:'#6366f1',
  text:'#ec4899',api:'#0ea5e9',condition:'#8b5cf6',
  transform:'#f97316',note:'#C9A96E',timer:'#14b8a6',
};
const selector = (s) => ({
  nodes:s.nodes, edges:s.edges, getNodeID:s.getNodeID,
  addNode:s.addNode, onNodesChange:s.onNodesChange,
  onEdgesChange:s.onEdgesChange, onConnect:s.onConnect,
});

const FlowCanvas = () => {
  const wrapper = useRef(null);
  const { project } = useReactFlow();
  const [dragOver, setDragOver] = useState(false);
  const { nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect } = useStore(selector, shallow);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(true);
  }, []);

  const onDragLeave = useCallback(() => setDragOver(false), []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const raw = e.dataTransfer.getData('application/reactflow');
    if (!raw || !wrapper.current) return;
    let type;
    try { type = JSON.parse(raw)?.nodeType; } catch { type = raw; }
    if (!type) return;
    const b = wrapper.current.getBoundingClientRect();
    const position = project({ x: e.clientX - b.left, y: e.clientY - b.top });
    const nodeID = getNodeID(type);
    addNode({ id: nodeID, type, position, data: { id: nodeID, nodeType: type } });
  }, [project, addNode, getNodeID]);

  return (
    <div ref={wrapper} style={{ width:'100%', height:'100%', position:'relative' }}>
      {dragOver && (
        <div style={{
          position:'absolute',inset:0,zIndex:10,pointerEvents:'none',
          border:'2px dashed #C9A96E',borderRadius:'4px',
          background:'rgba(201,169,110,0.05)',
          display:'flex',alignItems:'center',justifyContent:'center',
        }}>
          <div style={{
            background:'#141416',border:'1px solid #C9A96E',
            borderRadius:'8px',padding:'10px 20px',
            color:'#C9A96E',fontSize:'13px',fontWeight:600,
            fontFamily:'Inter,sans-serif',
          }}>✦ Drop here to place node</div>
        </div>
      )}
      {nodes.length === 0 && !dragOver && (
        <div style={{
          position:'absolute',inset:0,zIndex:5,pointerEvents:'none',
          display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8,
        }}>
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" style={{opacity:0.25}}>
            <rect x="3" y="9" width="16" height="11" rx="3" stroke="#f0ede8" strokeWidth="1.5"/>
            <rect x="25" y="24" width="16" height="11" rx="3" stroke="#f0ede8" strokeWidth="1.5"/>
            <path d="M19 14.5h3M22 14.5v9.5" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p style={{fontFamily:'Inter,sans-serif',fontSize:13,color:'#5a5750',margin:0,fontWeight:500}}>
            Drop a node to begin
          </p>
          <p style={{fontFamily:'Inter,sans-serif',fontSize:10,color:'#3a3a3a',margin:0,letterSpacing:'0.8px',textTransform:'uppercase'}}>
            Drag from toolbar above
          </p>
        </div>
      )}
      <ReactFlow
        nodes={nodes} edges={edges}
        onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect}
        onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
        nodeTypes={nodeTypes} proOptions={proOptions}
        snapGrid={[gridSize,gridSize]} snapToGrid
        connectionLineType="smoothstep"
        connectionLineStyle={{stroke:'#C9A96E',strokeWidth:1.5}}
        defaultEdgeOptions={{type:'smoothstep',animated:true,style:{stroke:'#3a3a42',strokeWidth:1.5}}}
        style={{width:'100%',height:'100%',background:'transparent'}}
        fitView={false}
      >
        <Background variant="dots" color="#1e1e22" gap={24} size={1.5}/>
        <Controls showInteractive={false}/>
        <MiniMap pannable zoomable maskColor="rgba(12,12,14,0.85)"
          nodeStrokeWidth={3} nodeColor={(n)=>COLORS[n.type]||'#64748b'}
          style={{background:'#141416',border:'1px solid #2a2a2f',borderRadius:'6px'}}
        />
      </ReactFlow>
    </div>
  );
};

export const PipelineUI = () => (
  <ReactFlowProvider><FlowCanvas /></ReactFlowProvider>
);