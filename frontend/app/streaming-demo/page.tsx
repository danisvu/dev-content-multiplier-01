'use client';

import { useState } from 'react';
import { StreamingDisplay } from '../components/StreamingDisplay';
import { Breadcrumb } from '../components/Breadcrumb';

export default function StreamingDemoPage() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [content, setContent] = useState('');

  const demoTexts = [
    `# Welcome to StreamingDisplay Demo

This component simulates a **streaming text** effect, similar to what you'd see when:
- AI is generating responses
- Live data is being fetched
- Real-time updates are coming in

## Features:
- Character-by-character animation (20ms per char)
- Auto-scroll to bottom
- Blinking cursor indicator
- Completion badge
- Customizable max-height
- Monospace font for code readability
- Smooth transitions

The component automatically handles:
1. Content display with typing animation
2. Cursor blinking during streaming
3. Auto-scroll behavior
4. Completion status

Try clicking the buttons to see different streaming examples!`,

    `## Code Snippet Example

Here's how to use StreamingDisplay:

\`\`\`jsx
<StreamingDisplay
  content={content}
  isStreaming={isStreaming}
  maxHeight={400}
  showCursor={true}
/>
\`\`\`

This component is perfect for:
- AI chat responses
- Real-time log viewers
- Live code execution output
- Streaming data displays`,

    `## System Architecture

Our Content Multiplier system uses:

**Frontend Stack:**
- Next.js 14 (React 18)
- TypeScript
- Tailwind CSS
- Lucide React Icons
- @uiw Markdown Editor

**Backend Stack:**
- Fastify Server
- PostgreSQL Database
- Google Gemini 2.0 Flash
- Deepseek AI Models

**Features:**
- AI-powered content generation
- Rich markdown editing
- Grid card layouts
- Real-time streaming display
- Dark/light theme support`,
  ];

  const handleStream = (textIndex: number) => {
    setContent('');
    setIsStreaming(true);

    let currentIndex = 0;
    const text = demoTexts[textIndex];

    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setContent(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsStreaming(false);
        clearInterval(interval);
      }
    }, 20);
  };

  const handleClear = () => {
    setContent('');
    setIsStreaming(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Demo', href: '/streaming-demo' },
              { label: 'Streaming Display' }
            ]}
            className="text-gray-600"
          />
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎬 Streaming Display Demo
          </h1>
          <p className="text-lg text-gray-600">
            Experience real-time text streaming with animation
          </p>
        </div>

        {/* Demo Container */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Stream Preview
            </h2>
            <StreamingDisplay
              content={content}
              isStreaming={isStreaming}
              maxHeight={400}
              showCursor={true}
            />
          </div>

          {/* Controls */}
          <div className="mt-6 space-y-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleStream(0)}
                disabled={isStreaming}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium text-sm"
              >
                📝 Stream Demo 1
              </button>
              <button
                onClick={() => handleStream(1)}
                disabled={isStreaming}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium text-sm"
              >
                💻 Stream Demo 2
              </button>
              <button
                onClick={() => handleStream(2)}
                disabled={isStreaming}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium text-sm"
              >
                🏗️ Stream Demo 3
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm"
              >
                🗑️ Clear
              </button>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 text-sm">
              {isStreaming ? (
                <>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                  <span className="text-blue-600 font-medium">Streaming...</span>
                </>
              ) : content ? (
                <>
                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                  <span className="text-green-600 font-medium">Complete</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  <span className="text-gray-600">Ready</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Features */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">✨ Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex gap-2">
                <span>✓</span>
                <span>Character-by-character animation</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Auto-scroll to bottom</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Blinking cursor indicator</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Completion badge</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Customizable height</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Monospace font</span>
              </li>
            </ul>
          </div>

          {/* Props */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">⚙️ Props</h3>
            <div className="space-y-2 text-sm text-gray-600 font-mono">
              <div><span className="text-blue-600">content</span>: string</div>
              <div><span className="text-blue-600">isStreaming</span>?: boolean</div>
              <div><span className="text-blue-600">maxHeight</span>?: number</div>
              <div><span className="text-blue-600">className</span>?: string</div>
              <div><span className="text-blue-600">showCursor</span>?: boolean</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
