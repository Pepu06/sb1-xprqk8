import React from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { CodeState } from '../types';
import { Code2, Play, Loader2 } from 'lucide-react';

interface CodePreviewProps {
  codeState: CodeState;
  isGenerating: boolean;
}

export function CodePreview({ codeState, isGenerating }: CodePreviewProps) {
  const [activeTab, setActiveTab] = React.useState<'code' | 'preview'>('code');

  const transformCode = (code: string) => {
    const cleanCode = code
      .replace(/^import.*$/gm, '')
      .replace(/export default.*$/gm, '')
      .trim();

    return `
      ${cleanCode}
      
      render(<App />);
    `;
  };

  const scope = {
    useState: React.useState,
    useEffect: React.useEffect,
    useRef: React.useRef,
    useCallback: React.useCallback,
    useMemo: React.useMemo,
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="flex border-b border-gray-700">
        <button
          className={`flex items-center px-4 py-2 space-x-2 ${
            activeTab === 'code'
              ? 'bg-gray-800 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('code')}
        >
          <Code2 size={16} />
          <span>Code</span>
        </button>
        <button
          className={`flex items-center px-4 py-2 space-x-2 ${
            activeTab === 'preview'
              ? 'bg-gray-800 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('preview')}
        >
          <Play size={16} />
          <span>Preview</span>
        </button>
      </div>
      <div className="flex-1 overflow-auto relative">
        {isGenerating && (
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="flex items-center space-x-3 text-white">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Generating code...</span>
            </div>
          </div>
        )}
        <LiveProvider
          code={codeState.code}
          scope={scope}
          noInline={true}
          transformCode={transformCode}
          theme={{
            plain: {
              color: '#D4D4D4',
              backgroundColor: '#1E1E1E',
            },
            styles: [
              {
                types: ['comment'],
                style: {
                  color: '#6A9955',
                },
              },
              {
                types: ['string'],
                style: {
                  color: '#CE9178',
                },
              },
              {
                types: ['keyword'],
                style: {
                  color: '#569CD6',
                },
              },
              {
                types: ['function'],
                style: {
                  color: '#DCDCAA',
                },
              },
            ],
          }}
        >
          {activeTab === 'code' ? (
            <LiveEditor
              className="h-full"
              style={{
                fontFamily:
                  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontSize: '14px',
                padding: '1rem',
                background: 'transparent',
                minHeight: '100%',
              }}
            />
          ) : (
            <div className="bg-white p-4 h-full">
              <LiveError className="p-4 text-red-500 bg-red-50 rounded mb-4" />
              <LivePreview />
            </div>
          )}
        </LiveProvider>
      </div>
    </div>
  );
}
