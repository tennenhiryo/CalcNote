import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import { Loader2, Sparkles, X } from 'lucide-react';

interface SolutionPanelProps {
  isOpen: boolean;
  isLoading: boolean;
  content: string; // The raw markdown/latex content from Gemini
  onClose: () => void;
}

const SolutionPanel: React.FC<SolutionPanelProps> = ({ isOpen, isLoading, content, onClose }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Parse and render the mixed markdown/LaTeX content
  useEffect(() => {
    if (contentRef.current && !isLoading && content) {
      const container = contentRef.current;
      
      // Simple custom renderer: Split by $$ for block math and $ for inline
      // Note: A full markdown parser would be better, but we keep it simple here.
      const formattedContent = content
        .replace(/\$\$(.*?)\$\$/gs, (match, math) => {
           try {
             return `<div class="my-4 text-center text-xl">${katex.renderToString(math, { displayMode: true })}</div>`;
           } catch { return match; }
        })
        .replace(/\$(.*?)\$/g, (match, math) => {
           try {
             return katex.renderToString(math, { displayMode: false });
           } catch { return match; }
        })
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\n/g, '<br />'); // Newlines

      container.innerHTML = formattedContent;
    }
  }, [content, isLoading]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/90">
          <div className="flex items-center gap-2 text-indigo-400">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold text-lg">AI 解説</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-40 gap-4 text-zinc-400">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <p>Geminiが思考中...</p>
            </div>
          ) : (
            <div 
              ref={contentRef}
              className="prose prose-invert prose-indigo max-w-none text-zinc-200 leading-relaxed"
            />
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 bg-zinc-900 border-t border-zinc-800 text-center">
          <p className="text-xs text-zinc-500">
            AIによる回答は不正確な場合があります。重要な計算は必ず確認してください。
          </p>
        </div>
      </div>
    </div>
  );
};

export default SolutionPanel;