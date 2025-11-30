
import React, { useRef, useLayoutEffect } from 'react';
import katex from 'katex';

interface DisplayProps {
  expression: string;
  isFocused: boolean;
  cursorIdx?: number; // Optional cursor position index
  placeholder?: string;
}

const Display: React.FC<DisplayProps> = ({ expression, isFocused, cursorIdx = 0, placeholder = "数式を入力..." }) => {
  const containerRef = useRef<HTMLDivElement>(null); // Viewport container
  const contentRef = useRef<HTMLDivElement>(null);   // Content wrapper to scale

  useLayoutEffect(() => {
    if (contentRef.current && containerRef.current) {
      try {
        let displayExpr = expression;
        
        // Safety check: Determine if cursorIdx is inside a LaTeX macro (e.g. inside "\times").
        let isSafeToInsert = true;
        if (expression) {
           const macroRegex = /\\[a-zA-Z]+|\\./g;
           let match;
           while ((match = macroRegex.exec(expression)) !== null) {
              const start = match.index;
              const end = start + match[0].length;
              if (cursorIdx > start && cursorIdx < end) {
                 isSafeToInsert = false;
                 break;
              }
           }
        }

        // If focused and safe, inject a visual cursor into the LaTeX string
        if (isFocused && isSafeToInsert && cursorIdx >= 0 && cursorIdx <= expression.length) {
          const cursorToken = `\\htmlClass{blinking-cursor}{}`;
          
          displayExpr = 
            expression.slice(0, cursorIdx) + 
            cursorToken + 
            expression.slice(cursorIdx);
        }

        if (!displayExpr && !isFocused) {
            displayExpr = `\\text{${placeholder}}`;
        } else if (!displayExpr && isFocused) {
            displayExpr = `\\htmlClass{blinking-cursor}{}`;
        }

        // --- Logic Update for Multiline/Aligned Support ---
        // If expression contains newlines (\\) or alignment tabs (&), use the aligned environment.
        if (expression.includes('\\\\') || expression.includes('&')) {
            // Split by newline to process each line individually
            // We split by standard LaTeX newline string delimiter
            const lines = displayExpr.split('\\\\');
            
            const processedLines = lines.map(line => {
                // If the line doesn't already have an alignment point &, add one at the start.
                // This forces the content into the second column (Left Aligned) of the aligned environment,
                // preventing the "Right Align" behavior (text growing to the left) for new lines.
                if (!line.includes('&')) {
                    return '&' + line;
                }
                return line;
            });
            
            // Rejoin with the newline and wrap in aligned environment
            displayExpr = `\\begin{aligned}${processedLines.join('\\\\')}\\end{aligned}`;
        } else {
            // Single line, no alignment chars.
            // Use displaystyle for nice big math, and justify-start handles the left alignment.
            displayExpr = '\\displaystyle ' + displayExpr;
        }

        const options = {
          throwOnError: false,
          displayMode: false,
          output: 'html',
          trust: true,
          strict: false,
        };
        
        const html = katex.renderToString(displayExpr, options as any);
        contentRef.current.innerHTML = html;

        // --- Auto Scaling Logic ---
        // 1. Reset scale to verify natural width
        contentRef.current.style.transform = 'scale(1)';
        
        // 2. Measure widths
        const containerWidth = containerRef.current.clientWidth;
        const contentWidth = contentRef.current.scrollWidth;

        // 3. Calculate scale factor if content exceeds container
        if (contentWidth > containerWidth) {
            const scale = containerWidth / contentWidth;
            // Apply scale (origin is top-left)
            contentRef.current.style.transform = `scale(${scale})`;
        } else {
             contentRef.current.style.transform = 'scale(1)';
        }
        
      } catch (e) {
        console.error("KaTeX render error", e);
        try {
            if (contentRef.current) {
                const html = katex.renderToString(expression || "\\text{Error}", { 
                    throwOnError: false, 
                    displayMode: false,
                    output: 'html' 
                } as any);
                contentRef.current.innerHTML = html;
            }
        } catch (retryError) {
             if (contentRef.current) {
                contentRef.current.innerText = "Error rendering formula";
            }
        }
      }
    }
  }, [expression, cursorIdx, isFocused, placeholder]);

  return (
    <div 
      className={`
        w-full h-full flex flex-col items-start justify-start p-4 rounded-2xl
        transition-all duration-300 border-2 overflow-hidden
        ${isFocused 
          ? 'bg-zinc-900 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]' 
          : 'bg-zinc-900/50 border-zinc-800'
        }
      `}
    >
      <div 
        ref={containerRef} 
        className="w-full h-full overflow-hidden flex flex-col items-start justify-start"
      >
        <div 
            ref={contentRef}
            className="origin-top-left whitespace-nowrap text-lg md:text-2xl text-zinc-100 transition-transform duration-100 ease-out"
        />
      </div>
    </div>
  );
};

export default Display;
