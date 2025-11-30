
export enum ButtonCategory {
  NUMBER = 'NUMBER',
  OPERATION = 'OPERATION',
  FUNCTION = 'FUNCTION',
  CONTROL = 'CONTROL',
  VARIABLE = 'VARIABLE'
}

export type KeypadTab = 'basic' | 'funcs' | 'calc' | 'symb' | 'alpha' | 'greek';

export interface MathButton {
  id: string;
  label: string; // Visual label (can be LaTeX)
  insert: string; // What actually gets inserted into the string
  category: ButtonCategory;
  tab: KeypadTab;
  cursorOffset?: number; // How far back to move the cursor after insertion (e.g. for \frac{}{})
  description?: string; // For accessibility
  className?: string; // Tailwind classes for grid spanning etc.
}

export interface HistoryItem {
  id: string;
  expression: string;
  solution: string;
  timestamp: number;
}
