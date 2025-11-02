'use client';

import { useEffect, useRef, useState } from 'react';

interface StreamingDisplayProps {
  content: string;
  isStreaming?: boolean;
  maxHeight?: number;
  className?: string;
  showCursor?: boolean;
}

export function StreamingDisplay({
  content,
  isStreaming = false,
  maxHeight = 400,
  className = '',
  showCursor = true,
}: StreamingDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayedContent, setDisplayedContent] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);

  // Typing animation effect
  useEffect(() => {
    if (!content) {
      setDisplayedContent('');
      return;
    }

    if (displayedContent.length < content.length) {
      const timer = setTimeout(() => {
        setDisplayedContent(content.slice(0, displayedContent.length + 1));
      }, 20); // 20ms per character for smooth typing effect

      return () => clearTimeout(timer);
    }
  }, [content, displayedContent]);

  // Blinking cursor effect
  useEffect(() => {
    if (!isStreaming || !showCursor) return;

    const timer = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500); // Blink every 500ms

    return () => clearInterval(timer);
  }, [isStreaming, showCursor]);

  // Auto-scroll to bottom when content updates
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayedContent]);

  const isComplete = displayedContent.length >= content.length && !isStreaming;

  return (
    <div
      ref={containerRef}
      className={`bg-gray-50 border border-gray-300 rounded-lg p-4 font-mono text-sm leading-relaxed overflow-y-auto ${className}`}
      style={{
        maxHeight: `${maxHeight}px`,
        minHeight: '100px',
      }}
    >
      {/* Content */}
      <div className="whitespace-pre-wrap break-words text-gray-800">
        {displayedContent}

        {/* Blinking Cursor */}
        {(isStreaming || !isComplete) && showCursor && (
          <span
            className={`inline-block w-2 h-5 bg-blue-600 ml-0.5 ${
              cursorVisible ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-100`}
            aria-label="Typing cursor"
          />
        )}
      </div>

      {/* Empty State */}
      {!content && (
        <div className="text-gray-400 italic">
          Waiting for content...
        </div>
      )}

      {/* Completion Badge */}
      {isComplete && content && (
        <div className="mt-4 text-xs text-green-600 font-semibold">
          ✓ Complete
        </div>
      )}
    </div>
  );
}
