// draggableNode.js
export const DraggableNode = ({ type, label, icon, accent }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.currentTarget.classList.add('is-dragging');
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragEnd = (event) => {
    event.currentTarget.classList.remove('is-dragging');
  };

  return (
    <div
      className="draggable-node"
      style={{ '--node-accent': accent }}
      onDragStart={(e) => onDragStart(e, type)}
      onDragEnd={onDragEnd}
      draggable
      title={`Drag ${label} onto canvas`}
    >
      <span className="draggable-node-accent" />
      <span className="draggable-node-icon">{icon}</span>
      <span className="draggable-node-label">{label}</span>
    </div>
  );
};
