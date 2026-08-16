
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Menu, Calculator, Settings, Trash2, RotateCcw } from 'lucide-react';
import Display from './components/Display';
import Keypad from './components/Keypad';
import SolutionPanel from './components/SolutionPanel';
import { solveMathProblem } from './services/geminiService';
import { MathButton, ButtonCategory } from './types';

const App: React.FC = () => {
  const [expression, setExpression] = useState<string>('');
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [solutionContent, setSolutionContent] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  
  // History Stack for Undo
  const [history, setHistory] = useState<{expr: string, cursor: number}[]>([]);
  
  // Ref for the hidden input to manage cursor position
  const inputRef = useRef<HTMLInputElement>(null);
  const [cursorPos, setCursorPos] = useState<number>(0);

  // Sync cursor position when user clicks directly in input (if we were showing it)
  // or after operations.
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(cursorPos, cursorPos);
      inputRef.current.focus();
    }
  }, [cursorPos, isSolving]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Basic fallback for other keys, but mainly we rely on onKeyDown for precise control
    // If we preventDefault in onKeyDown, this won't fire for those keys.
    saveToHistory();
    setExpression(e.target.value);
    setCursorPos(e.target.selectionStart || 0);
  };

  /**
   * Push current state to history stack
   */
  const saveToHistory = () => {
      setHistory(prev => {
          const newState = [...prev, { expr: expression, cursor: cursorPos }];
          // Optional: Limit history size to last 50 steps to prevent memory issues
          if (newState.length > 50) return newState.slice(1);
          return newState;
      });
  };

  /**
   * Undo last action
   */
  const handleUndo = () => {
      if (history.length === 0) return;
      
      const lastState = history[history.length - 1];
      const newHistory = history.slice(0, -1);
      
      setExpression(lastState.expr);
      setCursorPos(lastState.cursor);
      setHistory(newHistory);
  };

  /**
   * Handle physical keyboard input
   * Specifically for 0-9 and Arrow keys as requested
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle Undo shortcut (Ctrl+Z)
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
        return;
    }

    // Handle Arrows with custom logic
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setCursorPos(prev => moveCursorLeft(prev, expression));
      return;
    }
    
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setCursorPos(prev => moveCursorRight(prev, expression));
      return;
    }

    // Handle Backspace
    if (e.key === 'Backspace') {
        e.preventDefault();
        saveToHistory();
        const start = inputRef.current?.selectionStart || 0;
        const end = inputRef.current?.selectionEnd || 0;
        if (start !== end) {
            const newVal = expression.substring(0, start) + expression.substring(end);
            setExpression(newVal);
            setCursorPos(start);
        } else {
            handleSmartDelete(expression, start);
        }
        return;
    }

    // Handle Numbers 0-9
    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      saveToHistory();
      const valToInsert = e.key;
      
      const currentVal = expression;
      const before = currentVal.substring(0, cursorPos);
      const after = currentVal.substring(cursorPos);
      const newVal = before + valToInsert + after;

      setExpression(newVal);
      setCursorPos(cursorPos + 1);
      return;
    }
  };

  /**
   * Helper to find the new cursor position when moving LEFT.
   * Handles macros (\sin, \frac) and structural operators (^, _, {}, []) intelligently.
   */
  const moveCursorLeft = (currentPos: number, text: string): number => {
    if (currentPos <= 0) return 0;
    
    // Check for 'dx' block (length 2)
    if (currentPos >= 2) {
      const twoCharBlock = text.slice(currentPos - 2, currentPos);
      if (twoCharBlock === 'dx') {
        return currentPos - 2;
      }
    }

    // Check for Newline block (length 3: '\\ ' or length 2: '\\')
    if (currentPos >= 3) {
      const threeCharBlock = text.slice(currentPos - 3, currentPos);
      if (threeCharBlock === '\\\\ ') {
        return currentPos - 3;
      }
    }
    if (currentPos >= 2) {
      const twoCharBlock = text.slice(currentPos - 2, currentPos);
      if (twoCharBlock === '\\\\') {
        return currentPos - 2;
      }
    }

    const prevChar = text[currentPos - 1];

    // Case 0: Step over alignment character '&'
    if (prevChar === '&') {
      return currentPos - 1;
    }

    // Case 1: Entering a group from the right '}' or ']'
    if (prevChar === '}') {
      return currentPos - 1;
    }
    if (prevChar === ']') {
      // Check for \right]
      if (currentPos >= 7 && text.slice(currentPos - 7, currentPos) === '\\right]') {
         return currentPos - 7;
      }
      return currentPos - 1;
    }

    // Case 2: Exiting a group to the left '{'
    if (prevChar === '{') {
      if (currentPos >= 2) {
        const charBeforeBrace = text[currentPos - 2];
        
        // Sub/Superscript: x^{|2} -> |x^{2} (Jump over '{' and '^')
        if (charBeforeBrace === '^' || charBeforeBrace === '_') {
          return currentPos - 2; 
        }

        // Between Arguments: \frac{a}{|b} -> \frac{a|}{b} (Jump over '{' and '}')
        if (charBeforeBrace === '}') {
          return currentPos - 2;
        }

        // Between Arguments: \sqrt[n]{|x} -> \sqrt[n|]{x} (Jump over '{' and ']')
        if (charBeforeBrace === ']') {
          return currentPos - 2;
        }

        // Macro: \frac{|a}{b} -> |\frac{a}{b}
        if (/[a-zA-Z]/.test(charBeforeBrace)) {
           let i = currentPos - 2;
           while (i >= 0 && /[a-zA-Z]/.test(text[i])) {
             i--;
           }
           if (i >= 0 && text[i] === '\\') {
             return i; // Jump to before the backslash
           }
        }
      }
      return currentPos - 1; // Default: just step over '{'
    }

    // Case 3: Exiting a bracket group to the left '[' (e.g. \sqrt[)
    if (prevChar === '[') {
      if (currentPos >= 2) {
         // Check for \left[
         if (currentPos >= 6 && text.slice(currentPos - 6, currentPos) === '\\left[') {
            return currentPos - 6;
         }

        const charBeforeBrace = text[currentPos - 2];
        // Check for macro: \sqrt[|n] -> |\sqrt[n]
        if (/[a-zA-Z]/.test(charBeforeBrace)) {
           let i = currentPos - 2;
           while (i >= 0 && /[a-zA-Z]/.test(text[i])) {
             i--;
           }
           if (i >= 0 && text[i] === '\\') {
             return i;
           }
        }
      }
      return currentPos - 1;
    }

    // Case 4: Skip LaTeX macros (e.g. \times|) -> |\times
    if (/[a-zA-Z]/.test(prevChar)) {
      let i = currentPos - 1;
      while (i >= 0 && /[a-zA-Z]/.test(text[i])) {
        i--;
      }
      if (i >= 0 && text[i] === '\\') {
        return i; 
      }
    }
    
    // Case 5: Skip simple superscripts/subscripts (without braces)
    if (currentPos >= 2) {
       const charTwoBack = text[currentPos - 2];
       if (charTwoBack === '^' || charTwoBack === '_') {
         return currentPos - 2;
       }
    }

    // Default: move one char
    return currentPos - 1;
  };

  /**
   * Helper to find the new cursor position when moving RIGHT.
   * Handles macros and structural operators intelligently.
   */
  const moveCursorRight = (currentPos: number, text: string): number => {
    if (currentPos >= text.length) return text.length;

    const currChar = text[currentPos];

    // Case 0: Step over alignment character '&'
    if (currChar === '&') {
      return currentPos + 1;
    }

    // Case 1: LaTeX Macro (starts with \)
    if (currChar === '\\') {
      // Check for Newline macro \\ or \\ 
      if (currentPos + 2 <= text.length && text.slice(currentPos, currentPos + 2) === '\\\\') {
          if (currentPos + 3 <= text.length && text.slice(currentPos, currentPos + 3) === '\\\\ ') {
             return currentPos + 3;
          }
          return currentPos + 2;
      }

      let i = currentPos + 1;
      // Scan forward through letters
      while (i < text.length && /[a-zA-Z]/.test(text[i])) {
        i++;
      }
      
      // If the macro is followed by a brace or bracket, enter it automatically
      if (i < text.length) {
         if (text[i] === '{' || text[i] === '[') {
           return i + 1; // Jump inside the group
         }
         // Special case: \right] -> Jump OVER it, not inside.
         // 'i' points to the char after \right. If it is ']', we want to end up after ']'.
         if (text.slice(currentPos, i) === '\\right' && text[i] === ']') {
             return i + 1;
         }
      }

      // Special case for single-char macros like \{
      if (i === currentPos + 1 && i < text.length && /[^a-zA-Z]/.test(text[i])) {
          return i + 1; 
      }
      return i;
    }

    // Case 2: Crossing between groups: \frac{a|}{b} -> \frac{a}{|b}
    if (currChar === '}' || currChar === ']') {
       if (currentPos + 1 < text.length) {
         const nextChar = text[currentPos + 1];
         
         // Subcase A: Direct group sequence \frac{a}{b} -> } follows {
         if (nextChar === '{') {
           return currentPos + 2; // Skip '}' and '{'
         }

         // Subcase B: Subscript to Superscript
         if (nextChar === '^') {
            if (currentPos + 2 < text.length && text[currentPos + 2] === '{') {
               return currentPos + 3; // Skip '}', '^', '{'
            }
         }
         
         // Subcase C: Superscript to Subscript
         if (nextChar === '_') {
            if (currentPos + 2 < text.length && text[currentPos + 2] === '{') {
               return currentPos + 3; // Skip '}', '_', '{'
            }
         }
       }
       return currentPos + 1;
    }

    // Case 3: Superscripts/Subscripts (^ or _)
    if (currChar === '^' || currChar === '_') {
      if (currentPos + 1 < text.length) {
        const nextChar = text[currentPos + 1];
        if (nextChar === '{') {
          return currentPos + 2; // Jump into braces
        } else {
          return currentPos + 2; // Jump over single char arg
        }
      }
    }
    
    // Case 4: Skip 'dx' block as one unit
    if (currChar === 'd' && currentPos + 1 < text.length && text[currentPos + 1] === 'x') {
        return currentPos + 2;
    }

    // Default: move one char
    return currentPos + 1;
  };

  /**
   * Smart Deletion Logic to prevent invalid LaTeX states
   */
  const handleSmartDelete = (currentVal: string, pos: number) => {
    if (pos === 0) return;
    
    const beforeCursor = currentVal.slice(0, pos);
    const prevChar = currentVal[pos - 1];

    // 0. Special Handling for Alignment Tab '&'
    if (prevChar === '&') {
        const strBefore = currentVal.slice(0, pos - 1);
        const lastNewlineIdx = strBefore.lastIndexOf('\\\\');
        const contentAfterNewline = lastNewlineIdx === -1 
             ? strBefore 
             : strBefore.slice(lastNewlineIdx + 2);

        if (contentAfterNewline.trim() === '') {
            if (lastNewlineIdx !== -1) {
                 const prevNewlineIdx = strBefore.lastIndexOf('\\\\', lastNewlineIdx - 1);
                 const prevLineStart = prevNewlineIdx === -1 ? 0 : prevNewlineIdx + 2;
                 const prevLine = currentVal.slice(prevLineStart, lastNewlineIdx);
                 
                 const ampInPrevLineIdx = prevLine.indexOf('&');
                 if (ampInPrevLineIdx !== -1) {
                     const absAmpPrevIdx = prevLineStart + ampInPrevLineIdx;
                     const part1 = currentVal.slice(0, absAmpPrevIdx);
                     const part2 = currentVal.slice(absAmpPrevIdx + 1, pos - 1);
                     const part3 = currentVal.slice(pos);
                     setExpression(part1 + part2 + part3);
                     setCursorPos(pos - 2); 
                     return;
                 }
            }
        }
        const newVal = currentVal.slice(0, pos - 1) + currentVal.slice(pos);
        setExpression(newVal);
        setCursorPos(pos - 1);
        return;
    }

    // 0. Special Handling for 'dx'
    if (beforeCursor.endsWith('dx')) {
        const newVal = currentVal.slice(0, pos - 2) + currentVal.slice(pos);
        setExpression(newVal);
        setCursorPos(pos - 2);
        return;
    }

    // 0. Special Handling for Newlines
    if (beforeCursor.endsWith('\\\\ ')) {
        const newVal = currentVal.slice(0, pos - 3) + currentVal.slice(pos);
        setExpression(newVal);
        setCursorPos(pos - 3);
        return;
    }
    if (beforeCursor.endsWith('\\\\')) {
        const newVal = currentVal.slice(0, pos - 2) + currentVal.slice(pos);
        setExpression(newVal);
        setCursorPos(pos - 2);
        return;
    }
    
    // 0. Special Handling for \right] (Unwrap)
    if (prevChar === ']') {
        if (beforeCursor.endsWith('\\right]')) {
             // Find matching \left[
             // Simple bracket counting for [ ]
             let balance = 1;
             let i = pos - 7; // Start before \right]
             while (i >= 0) {
                 // Check for \right]
                 if (currentVal.slice(i-6, i+1) === '\\right]') {
                     balance++;
                     i -= 7;
                     continue;
                 }
                 // Check for \left[
                 if (currentVal.slice(i-5, i+1) === '\\left[') {
                     balance--;
                     if (balance === 0) {
                         // Found it. 'i' is end index of [
                         // Start index of \left[ is i - 5
                         const startLeft = i - 5;
                         const endLeft = i + 1;
                         const startRight = pos - 7;
                         const endRight = pos;
                         
                         const part1 = currentVal.slice(0, startLeft);
                         const inner = currentVal.slice(endLeft, startRight);
                         const part2 = currentVal.slice(endRight);
                         
                         setExpression(part1 + inner + part2);
                         setCursorPos(startRight - 6); // Shifted back by length of \left[ (6)
                         return;
                     }
                     i -= 6;
                     continue;
                 }
                 i--;
             }
        }
    }

    // 1. Check for Macro (ends in letter, starts with \)
    const macroMatch = beforeCursor.match(/\\[a-zA-Z]+$/);
    if (macroMatch) {
      const macroLength = macroMatch[0].length;
      const newVal = currentVal.slice(0, pos - macroLength) + currentVal.slice(pos);
      setExpression(newVal);
      setCursorPos(pos - macroLength);
      return;
    }

    // 2. Check for Closing Brace '}'
    if (prevChar === '}') {
       let balance = 1;
       let i = pos - 2;
       while (i >= 0) {
         if (currentVal[i] === '}') balance++;
         if (currentVal[i] === '{') balance--;
         if (balance === 0) break;
         i--;
       }
       
       if (i >= 0) {
         const contentInside = currentVal.slice(i + 1, pos - 1);
         const charBeforeBrace = i > 0 ? currentVal[i-1] : '';

         if (contentInside === '') {
            if (charBeforeBrace === '^' || charBeforeBrace === '_') {
               const newVal = currentVal.slice(0, i - 1) + currentVal.slice(pos);
               setExpression(newVal);
               setCursorPos(i - 1);
               return;
            }
            const beforeBrace = currentVal.slice(0, i);
            const funcMatch = beforeBrace.match(/\\[a-zA-Z]+$/);
            if (funcMatch) {
                const funcLen = funcMatch[0].length;
                const newVal = currentVal.slice(0, i - funcLen) + currentVal.slice(pos);
                setExpression(newVal);
                setCursorPos(i - funcLen);
                return;
            }
            if (charBeforeBrace === '}') {
               let bal2 = 1;
               let j = i - 2;
               while (j >= 0) {
                 if (currentVal[j] === '}') bal2++;
                 if (currentVal[j] === '{') bal2--;
                 if (bal2 === 0) break;
                 j--;
               }
               if (j >= 0) {
                   const beforeFirstBrace = currentVal.slice(0, j);
                   const fracMatch = beforeFirstBrace.match(/\\frac$/);
                   if (fracMatch) {
                       const startOfFrac = j - 5;
                       const newVal = currentVal.slice(0, startOfFrac) + currentVal.slice(pos);
                       setExpression(newVal);
                       setCursorPos(startOfFrac);
                       return;
                   }
               }
            }
         }
         setCursorPos(pos - 1);
         return;
       }
    }

    // 3. Check for Opening Brace '{'
    if (prevChar === '{') {
        let balance = 1;
        let j = pos;
        while (j < currentVal.length) {
            if (currentVal[j] === '{') balance++;
            if (currentVal[j] === '}') balance--;
            if (balance === 0) break;
            j++;
        }

        if (balance === 0) {
            const charBefore = pos >= 2 ? currentVal[pos - 2] : '';
            
            if (charBefore === '}') {
                let bal2 = 1;
                let k = pos - 3;
                while (k >= 0) {
                   if (currentVal[k] === '}') bal2++;
                   if (currentVal[k] === '{') bal2--;
                   if (bal2 === 0) break;
                   k--;
                }
                
                if (k >= 0) {
                   const beforeFirstArg = currentVal.slice(0, k);
                   if (beforeFirstArg.endsWith('\\frac')) {
                       const fracStart = beforeFirstArg.lastIndexOf('\\frac');
                       const arg1 = currentVal.slice(k + 1, pos - 2);
                       const arg2 = currentVal.slice(pos, j);
                       
                       const prefix = currentVal.slice(0, fracStart);
                       const suffix = currentVal.slice(j + 1);
                       
                       const newVal = prefix + arg1 + arg2 + suffix;
                       setExpression(newVal);
                       setCursorPos(prefix.length + arg1.length);
                       return;
                   }
                }
            }

            const isSupSub = charBefore === '^' || charBefore === '_';
            const content = currentVal.slice(pos, j);
            const remainder = currentVal.slice(j + 1);
            let prefixEndIndex = pos - 1; 
            let prefixStartIndex = pos - 1; 

            if (isSupSub) {
                 prefixStartIndex = pos - 2;
            } else {
                 const beforeBrace = currentVal.slice(0, pos - 1);
                 const funcMatch = beforeBrace.match(/\\[a-zA-Z]+$/);
                 if (funcMatch) {
                     prefixStartIndex = pos - 1 - funcMatch[0].length;
                 }
            }
            
            const prefix = currentVal.slice(0, prefixStartIndex);
            const newVal = prefix + content + remainder;
            setExpression(newVal);
            setCursorPos(prefixStartIndex);
            return;
        }
    }

    // Default: Simple Delete
    const newVal = currentVal.slice(0, pos - 1) + currentVal.slice(pos);
    setExpression(newVal);
    setCursorPos(pos - 1);
  };

  /**
   * Handle Tab Press for alignment
   * Checks the line above for an equals sign and aligns the current position to it.
   */
  const handleTabPress = () => {
    const lineIndices: {start: number, end: number}[] = [];
    let searchIdx = 0;
    const regex = /\\\\ ?/g;
    let match;
    
    while ((match = regex.exec(expression)) !== null) {
        lineIndices.push({ start: searchIdx, end: match.index });
        searchIdx = match.index + match[0].length;
    }
    lineIndices.push({ start: searchIdx, end: expression.length });

    let currentLineIdx = -1;
    for (let i = 0; i < lineIndices.length; i++) {
        if (cursorPos >= lineIndices[i].start && cursorPos <= lineIndices[i].end) {
            currentLineIdx = i;
            break;
        }
    }

    if (currentLineIdx <= 0) return;

    const prevLineRange = lineIndices[currentLineIdx - 1];
    const prevLineStr = expression.slice(prevLineRange.start, prevLineRange.end);

    const equalIdxRel = prevLineStr.indexOf('=');
    if (equalIdxRel === -1) return;

    let newExpression = expression;
    let offsetAdjustment = 0;

    if (prevLineStr.indexOf('&') === -1) {
        const insertAtAbs = prevLineRange.start + equalIdxRel;
        newExpression = newExpression.slice(0, insertAtAbs) + '&' + newExpression.slice(insertAtAbs);
        offsetAdjustment += 1;
    }

    const adjustCursorPos = cursorPos + offsetAdjustment;
    newExpression = newExpression.slice(0, adjustCursorPos) + '&' + newExpression.slice(adjustCursorPos);
    
    setExpression(newExpression);
    setCursorPos(adjustCursorPos + 1);
  };

  const handleButtonPress = (btn: MathButton) => {
    inputRef.current?.focus();
    
    const currentVal = expression;
    const start = inputRef.current?.selectionStart || 0;
    const end = inputRef.current?.selectionEnd || 0;

    if (btn.id === 'clear') {
      saveToHistory();
      setExpression('');
      setCursorPos(0);
      return;
    }

    if (btn.id === 'undo') {
        handleUndo();
        return;
    }
    
    if (btn.id === 'tab') {
      saveToHistory();
      handleTabPress();
      return;
    }

    if (btn.id === 'del') {
      saveToHistory();
      if (start !== end) {
        const newVal = currentVal.substring(0, start) + currentVal.substring(end);
        setExpression(newVal);
        setCursorPos(start);
      } else {
        handleSmartDelete(currentVal, start);
      }
      return;
    }

    if (btn.id === 'left') {
      setCursorPos(prev => moveCursorLeft(prev, expression));
      return;
    }

    if (btn.id === 'right') {
      setCursorPos(prev => moveCursorRight(prev, expression));
      return;
    }

    saveToHistory();
    const before = currentVal.substring(0, start);
    const after = currentVal.substring(end);
    const newVal = before + btn.insert + after;

    setExpression(newVal);

    let newPos = start + btn.insert.length;
    if (btn.cursorOffset) {
      newPos += btn.cursorOffset;
    }
    setCursorPos(newPos);
  };

  const handleSolve = async () => {
    setIsMenuOpen(false);
    if (!expression.trim()) return;

    setIsSolving(true);
    setShowSolution(true);
    setSolutionContent('');

    const result = await solveMathProblem(expression);
    setSolutionContent(result);
    setIsSolving(false);
  };

  const handleClearAll = () => {
      saveToHistory();
      setExpression('');
      setCursorPos(0);
      setIsMenuOpen(false);
  };

  return (
    <div className="h-[100dvh] bg-zinc-950 flex flex-col overflow-hidden font-sans relative">
      
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none" />

      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
      />

      <div 
        className={`
          fixed inset-y-0 left-0 w-64 bg-zinc-900 border-r border-zinc-800 z-50 transform transition-transform duration-300 ease-in-out
          flex flex-col
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="font-bold text-white">∫</span>
            </div>
            <span className="font-bold text-lg text-zinc-100">CalcNote</span>
          </div>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="p-1 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 p-4 flex flex-col gap-2">
          <button 
            onClick={handleSolve}
            disabled={!expression || isSolving}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
              ${!expression 
                ? 'bg-zinc-800/50 text-zinc-600 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
              }
            `}
          >
            <Sparkles className="w-5 h-5" />
            <span>AI 解説</span>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 transition-colors">
            <Calculator className="w-5 h-5" />
            <span>エディタ</span>
          </button>

          <button 
            onClick={handleClearAll}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            <span>すべて消去</span>
          </button>

          <div className="mt-auto">
             <div className="h-px bg-zinc-800 my-2" />
             <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 transition-colors">
              <Settings className="w-5 h-5" />
              <span>設定</span>
            </button>
          </div>
        </div>
      </div>


      <main className="flex-1 flex flex-col w-full max-w-3xl mx-auto z-10 overflow-hidden">
        
        <header className="flex-none flex items-center justify-between px-4 h-14 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-colors active:scale-95"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-zinc-100 tracking-tight">CalcNote</h1>
              <p className="text-xs text-zinc-400">Visual Math Editor</p>
            </div>
          </div>
        </header>

        <section className="flex-1 relative min-h-0 px-2 pb-2 group flex flex-col">
           <input
            ref={inputRef}
            type="text"
            value={expression}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="absolute opacity-0 w-px h-px overflow-hidden"
            autoFocus
            autoComplete="off"
            inputMode="none"
          />
          
          <div onClick={() => inputRef.current?.focus()} className="flex-1 h-full min-h-0">
            <Display 
              expression={expression} 
              isFocused={true} 
              cursorIdx={cursorPos}
            />
          </div>

          <div className="absolute bottom-6 right-6 text-zinc-500 text-xs font-mono pointer-events-none">
            LaTeX Mode
          </div>
        </section>

        <section className="flex-none px-2 pb-2 safe-area-bottom">
          <Keypad onButtonPress={handleButtonPress} />
          
          <footer className="text-center text-zinc-600 text-[10px] opacity-50 mt-1">
            <p>Powered by Google Gemini 2.5 & KaTeX</p>
          </footer>
        </section>

      </main>

      <SolutionPanel 
        isOpen={showSolution} 
        isLoading={isSolving} 
        content={solutionContent} 
        onClose={() => setShowSolution(false)} 
      />

    </div>
  );
};

export default App;
