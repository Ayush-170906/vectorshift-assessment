// llmNode.js
import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      config={{
        title: 'LLM',
        icon: '🤖',
        color: '#6366f1',
        inputs: [
          { id: 'system', label: 'System' },
          { id: 'prompt', label: 'Prompt' },
        ],
        outputs: [{ id: 'response' }],
      }}
    >
      <p className="node-description">
        Language model — connect a system prompt and user prompt to get a response.
      </p>
    </BaseNode>
  );
};
