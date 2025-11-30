
import React, { useState } from 'react';
import katex from 'katex';
import { MATH_BUTTONS } from '../constants';
import { ButtonCategory, MathButton, KeypadTab } from '../types';
import { Calculator, FunctionSquare, Sigma, Binary, Type, Globe } from 'lucide-react';

interface KeypadProps {
  onButtonPress: (btn: MathButton) => void;
}

const Keypad: React.FC<KeypadProps> = ({ onButtonPress }) => {
  const [activeTab, setActiveTab] = useState<KeypadTab>('basic');
  
  // Helper to render label (text or LaTeX)
  const renderLabel = (label: string) => {
    // Basic heuristics to decide if we should render as LaTeX
    if (label.startsWith('\\') || label.includes('^') || label.includes('_') || label.includes('|') || label === 'd/dx') {
      try {
        const html = katex.renderToString(label, { throwOnError: false });
        return <span dangerouslySetInnerHTML={{ __html: html }} />;
      } catch (e) {
        return label;
      }
    }
    return label;
  };

  const getButtonColor = (category: ButtonCategory) => {
    switch (category) {
      case ButtonCategory.NUMBER:
        return 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100';
      case ButtonCategory.OPERATION:
        return 'bg-indigo-600 hover:bg-indigo-500 text-white font-semibold';
      case ButtonCategory.CONTROL:
        return 'bg-red-500/10 hover:bg-red-500/20 text-red-400';
      case ButtonCategory.FUNCTION:
        return 'bg-zinc-700 hover:bg-zinc-600 text-zinc-200';
      case ButtonCategory.VARIABLE:
        return 'bg-zinc-800 hover:bg-zinc-700 text-indigo-300 italic font-serif';
      default:
        return 'bg-zinc-800';
    }
  };

  const tabs: { id: KeypadTab; label: string; icon: React.ReactNode }[] = [
    { id: 'basic', label: '基本', icon: <Calculator className="w-4 h-4" /> },
    { id: 'funcs', label: '関数', icon: <FunctionSquare className="w-4 h-4" /> },
    { id: 'calc', label: '微積', icon: <Sigma className="w-4 h-4" /> },
    { id: 'symb', label: '記号', icon: <Binary className="w-4 h-4" /> },
    { id: 'alpha', label: '英字', icon: <Type className="w-4 h-4" /> },
    { id: 'greek', label: 'ギリシャ', icon: <Globe className="w-4 h-4" /> },
  ];

  const filteredButtons = MATH_BUTTONS.filter(btn => btn.tab === activeTab);

  // Dynamic grid configuration based on active tab
  let gridColsClass = 'grid-cols-4';
  if (activeTab === 'basic') {
     gridColsClass = 'grid-cols-6';
  } else if (activeTab === 'alpha' || activeTab === 'greek') {
     gridColsClass = 'grid-cols-6 md:grid-cols-8';
  }

  // Use denser buttons for 6+ column layouts
  const isDenseTab = activeTab === 'alpha' || activeTab === 'greek' || activeTab === 'basic';
  const buttonHeightClass = isDenseTab ? 'h-11 md:h-14 text-lg' : 'h-14 md:h-16 text-xl';

  return (
    <div className="bg-zinc-950 rounded-xl select-none flex flex-col gap-2">
      {/* Tab Navigation */}
      <div className="flex p-1 bg-zinc-900 rounded-lg gap-1 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 py-2 px-3 min-w-[70px] rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap
              ${activeTab === tab.id 
                ? 'bg-zinc-800 text-indigo-400 shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
              }
            `}
          >
            <span className="hidden sm:inline">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Button Grid */}
      <div className={`grid ${gridColsClass} gap-2 p-2 md:p-3 bg-zinc-900/50 rounded-xl border border-zinc-800/50`}>
        {filteredButtons.map((btn) => (
          <button
            key={btn.id}
            onClick={() => onButtonPress(btn)}
            className={`
              relative ${buttonHeightClass} rounded-lg md:rounded-xl flex items-center justify-center
              transition-all duration-150 active:scale-95 shadow-lg shadow-black/20
              ${getButtonColor(btn.category)}
              ${btn.className || ''}
            `}
            aria-label={btn.description || btn.label}
          >
            {renderLabel(btn.label)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Keypad;
