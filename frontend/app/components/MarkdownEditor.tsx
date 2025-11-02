'use client';

import { useEffect, useState } from 'react';
import MDEditor from '@uiw/react-markdown-editor';
import '@uiw/react-markdown-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  visibleDragbar?: boolean;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Enter markdown text...',
  height = 200,
  visibleDragbar = false,
}: MarkdownEditorProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if dark mode is enabled
    const updateTheme = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    };

    updateTheme();

    // Watch for theme changes
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="rounded-lg border border-gray-300 overflow-hidden"
      data-color-mode={isDark ? 'dark' : 'light'}
      style={{
        '--color-prettybg': isDark ? '#161b22' : '#f6f8fa',
        '--color-prettyborder': isDark ? '#30363d' : '#d0d0d0',
        '--color-prettycaret': isDark ? '#c9d1d9' : '#24292e',
      } as React.CSSProperties & {
        '--color-prettybg': string;
        '--color-prettyborder': string;
        '--color-prettycaret': string;
      }}
    >
      <div style={{ minHeight: `${height}px` }}>
        <MDEditor
          value={value}
          onChange={(val) => onChange(val || '')}
          className={`rounded-lg ${isDark ? 'dark' : 'light'}`}
        />
      </div>
    </div>
  );
}
