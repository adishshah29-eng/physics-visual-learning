import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';

interface MathRendererProps {
  content: string;
  className?: string;
}

const MathRenderer: React.FC<MathRendererProps> = memo(({ content, className = '' }) => {
  // We use react-markdown along with remark-math and rehype-katex 
  // to safely parse mixed text that contains both markdown, HTML strings, 
  // and $$ inline/display math delimiters without destroying React's VDOM.

  return (
    <div className={`math-rendered-content markdown-body ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        // Type coercion used for rehype plugins due to conflicting Astro/Unified AST types
        rehypePlugins={[rehypeRaw, rehypeKatex as any]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

export default MathRenderer;
