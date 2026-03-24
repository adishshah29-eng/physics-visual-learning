import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import type { Options as SanitizeOptions } from 'rehype-sanitize';
import 'katex/dist/katex.min.css';

// Allow KaTeX CSS classes and aria attributes but strip all event handlers,
// script tags, iframes, and on* attributes.
const mathSafeSchema: SanitizeOptions = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    'math', 'semantics', 'mrow', 'mi', 'mo', 'mn', 'msup', 'msub',
    'mfrac', 'mover', 'munder', 'mspace', 'mtext', 'annotation',
    'span', 'div',
  ],
  attributes: {
    ...defaultSchema.attributes,
    '*': [
      ...(defaultSchema.attributes?.['*'] ?? []),
      'className',
      'style',
      'aria-hidden',
      'aria-label',
      'data-*',
    ],
    span: ['style', 'className', 'aria-hidden'],
    math: ['display', 'xmlns'],
    annotation: ['encoding'],
  },
  // Strip all protocols except http, https, and mailto
  protocols: {
    href: ['http', 'https', 'mailto'],
    src:  ['http', 'https'],
  },
};

interface MathRendererProps {
  content: string;
  className?: string;
}

const MathRenderer: React.FC<MathRendererProps> = memo(({ content, className = '' }) => {
  // Truncate runaway content to prevent DoS
  const safeContent = content?.slice(0, 50000) ?? '';

  return (
    <div className={`math-rendered-content markdown-body ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[
          [rehypeSanitize, mathSafeSchema],
          rehypeKatex as any,
        ]}
      >
        {safeContent}
      </ReactMarkdown>
    </div>
  );
});

MathRenderer.displayName = 'MathRenderer';
export default MathRenderer;
