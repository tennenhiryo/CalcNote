
import { ButtonCategory, MathButton } from './types';

export const MATH_BUTTONS: MathButton[] = [
  // --- BASIC TAB (6 Columns) ---
  // Row 0: Controls
  // Replaced AC with TAB. TAB is used for alignment.
  { id: 'tab', label: 'TAB', insert: '&', category: ButtonCategory.CONTROL, tab: 'basic', className: 'col-span-2', description: 'Align with previous line' },
  { id: 'undo', label: '↩', insert: '', category: ButtonCategory.CONTROL, tab: 'basic', description: 'Undo' },
  { id: 'del', label: '⌫', insert: '', category: ButtonCategory.CONTROL, tab: 'basic', description: 'Delete' },
  { id: 'left', label: '←', insert: 'LEFT', category: ButtonCategory.CONTROL, tab: 'basic', description: 'Cursor Left' },
  { id: 'right', label: '→', insert: 'RIGHT', category: ButtonCategory.CONTROL, tab: 'basic', description: 'Cursor Right' },

  // Row 1: ( ) 7 8 9 ÷
  { id: 'parens', label: '( )', insert: '()', cursorOffset: -1, category: ButtonCategory.OPERATION, tab: 'basic', description: 'Parentheses' },
  { id: 'newline', label: '⏎', insert: '\\\\ ', category: ButtonCategory.OPERATION, tab: 'basic', description: 'New Line' },
  { id: '7', label: '7', insert: '7', category: ButtonCategory.NUMBER, tab: 'basic' },
  { id: '8', label: '8', insert: '8', category: ButtonCategory.NUMBER, tab: 'basic' },
  { id: '9', label: '9', insert: '9', category: ButtonCategory.NUMBER, tab: 'basic' },
  { id: 'div', label: '\\div', insert: '\\div', category: ButtonCategory.OPERATION, tab: 'basic' },

  // Row 2: pi x 4 5 6 times
  { id: 'pi', label: '\\pi', insert: '\\pi', category: ButtonCategory.VARIABLE, tab: 'basic' },
  { id: 'x', label: 'x', insert: 'x', category: ButtonCategory.VARIABLE, tab: 'basic' },
  { id: '4', label: '4', insert: '4', category: ButtonCategory.NUMBER, tab: 'basic' },
  { id: '5', label: '5', insert: '5', category: ButtonCategory.NUMBER, tab: 'basic' },
  { id: '6', label: '6', insert: '6', category: ButtonCategory.NUMBER, tab: 'basic' },
  { id: 'times', label: '\\times', insert: '\\times', category: ButtonCategory.OPERATION, tab: 'basic' },

  // Row 3: sqrt pow2 1 2 3 minus
  { id: 'sqrt', label: '\\sqrt{\\Box}', insert: '\\sqrt{}', cursorOffset: -1, category: ButtonCategory.FUNCTION, tab: 'basic' },
  { id: 'pow2', label: '\\Box^2', insert: '^{2}', category: ButtonCategory.FUNCTION, tab: 'basic' },
  { id: '1', label: '1', insert: '1', category: ButtonCategory.NUMBER, tab: 'basic' },
  { id: '2', label: '2', insert: '2', category: ButtonCategory.NUMBER, tab: 'basic' },
  { id: '3', label: '3', insert: '3', category: ButtonCategory.NUMBER, tab: 'basic' },
  { id: 'minus', label: '-', insert: '-', category: ButtonCategory.OPERATION, tab: 'basic' },

  // Row 4: % frac . 0 = plus
  { id: 'percent', label: '%', insert: '\\%', category: ButtonCategory.OPERATION, tab: 'basic' },
  { id: 'frac_basic', label: '\\frac{\\Box}{\\Box}', insert: '\\frac{}{}', cursorOffset: -3, category: ButtonCategory.OPERATION, tab: 'basic', description: 'Fraction' },
  { id: 'dot', label: '.', insert: '.', category: ButtonCategory.NUMBER, tab: 'basic' },
  { id: '0', label: '0', insert: '0', category: ButtonCategory.NUMBER, tab: 'basic' },
  { id: 'eq', label: '=', insert: '=', category: ButtonCategory.OPERATION, tab: 'basic' },
  { id: 'plus', label: '+', insert: '+', category: ButtonCategory.OPERATION, tab: 'basic' },


  // --- FUNCTIONS TAB (Updated to remove moved items) ---
  // Row 1: Vars
  { id: 'y', label: 'y', insert: 'y', category: ButtonCategory.VARIABLE, tab: 'funcs' },
  { id: 'z', label: 'z', insert: 'z', category: ButtonCategory.VARIABLE, tab: 'funcs' },
  { id: 'e', label: 'e', insert: 'e', category: ButtonCategory.VARIABLE, tab: 'funcs' },
  { id: 'theta', label: '\\theta', insert: '\\theta', category: ButtonCategory.VARIABLE, tab: 'funcs' },

  // Row 2: Trig
  { id: 'sin', label: '\\sin', insert: '\\sin(', category: ButtonCategory.FUNCTION, tab: 'funcs' },
  { id: 'cos', label: '\\cos', insert: '\\cos(', category: ButtonCategory.FUNCTION, tab: 'funcs' },
  { id: 'tan', label: '\\tan', insert: '\\tan(', category: ButtonCategory.FUNCTION, tab: 'funcs' },
  { id: 'arcsin', label: '\\sin^{-1}', insert: '\\sin^{-1}(', category: ButtonCategory.FUNCTION, tab: 'funcs' },

  // Row 3: Log/Exp
  { id: 'log', label: '\\log', insert: '\\log ', category: ButtonCategory.FUNCTION, tab: 'funcs' },
  { id: 'ln', label: '\\ln', insert: '\\ln(', category: ButtonCategory.FUNCTION, tab: 'funcs' },
  { id: 'pow', label: 'x^\\Box', insert: '^{}', cursorOffset: -1, category: ButtonCategory.FUNCTION, tab: 'funcs' },
  { id: 'exp', label: 'e^x', insert: 'e^{}', cursorOffset: -1, category: ButtonCategory.FUNCTION, tab: 'funcs' },

  // Row 4: Roots/Abs
  { id: 'root', label: '\\sqrt[n]{x}', insert: '\\sqrt[]{}', cursorOffset: -3, category: ButtonCategory.FUNCTION, tab: 'funcs' },
  { id: 'abs', label: '|x|', insert: '|{}|', cursorOffset: -2, category: ButtonCategory.FUNCTION, tab: 'funcs' },
  { id: 'lparen_f', label: '(', insert: '(', category: ButtonCategory.OPERATION, tab: 'funcs' },
  { id: 'rparen_f', label: ')', insert: ')', category: ButtonCategory.OPERATION, tab: 'funcs' },


  // --- CALCULUS TAB ---
  // Row 1: Fraction & Basic Calc & Definite Integral Brackets
  { id: 'frac', label: '\\frac{a}{b}', insert: '\\frac{}{}', cursorOffset: -3, category: ButtonCategory.FUNCTION, tab: 'calc' },
  { id: 'int', label: '\\int', insert: '\\int ', category: ButtonCategory.FUNCTION, tab: 'calc' },
  { id: 'int_def', label: '\\int_a^b', insert: '\\int_{}^{}', cursorOffset: -4, category: ButtonCategory.FUNCTION, tab: 'calc' },
  { id: 'def_bracket', label: '[\\Box]_a^b', insert: '\\left[ \\right]_{}^{}', cursorOffset: -14, category: ButtonCategory.FUNCTION, tab: 'calc', description: 'Definite Integral Evaluation' },

  // Row 2: Sum/Prod
  { id: 'sum', label: '\\sum', insert: '\\sum_{}^{}', cursorOffset: -4, category: ButtonCategory.FUNCTION, tab: 'calc' },
  { id: 'prod', label: '\\prod', insert: '\\prod_{}^{}', cursorOffset: -4, category: ButtonCategory.FUNCTION, tab: 'calc' },
  { id: 'lim', label: '\\lim', insert: '\\lim_{x \\to }', cursorOffset: -1, category: ButtonCategory.FUNCTION, tab: 'calc' },
  { id: 'diff', label: 'd/dx', insert: '\\frac{d}{dx}', category: ButtonCategory.FUNCTION, tab: 'calc' },

  // Row 3: Structure
  { id: 'sub', label: 'x_a', insert: '_{}', cursorOffset: -1, category: ButtonCategory.FUNCTION, tab: 'calc' },
  { id: 'partial', label: '\\partial', insert: '\\partial', category: ButtonCategory.FUNCTION, tab: 'calc' },
  { id: 'prime', label: "f'", insert: "'", category: ButtonCategory.FUNCTION, tab: 'calc' },
  { id: 'dx', label: 'dx', insert: 'dx', category: ButtonCategory.VARIABLE, tab: 'calc' },
  
  // Row 4: Brackets & Infinity
  { id: 'lsq', label: '[', insert: '[', category: ButtonCategory.OPERATION, tab: 'calc' },
  { id: 'rsq', label: ']', insert: ']', category: ButtonCategory.OPERATION, tab: 'calc' },
  { id: 'inf', label: '\\infty', insert: '\\infty', category: ButtonCategory.VARIABLE, tab: 'calc' },
  { id: 'curly_brackets', label: '\\{ \\}', insert: '\\{ \\}', cursorOffset: -3, category: ButtonCategory.OPERATION, tab: 'calc' },


  // --- SYMBOLS TAB ---
  // Row 1: Greek 1
  { id: 'alpha', label: '\\alpha', insert: '\\alpha', category: ButtonCategory.VARIABLE, tab: 'symb' },
  { id: 'beta', label: '\\beta', insert: '\\beta', category: ButtonCategory.VARIABLE, tab: 'symb' },
  { id: 'lambda', label: '\\lambda', insert: '\\lambda', category: ButtonCategory.VARIABLE, tab: 'symb' },
  { id: 'mu', label: '\\mu', insert: '\\mu', category: ButtonCategory.VARIABLE, tab: 'symb' },

  // Row 2: Greek 2
  { id: 'sigma', label: '\\sigma', insert: '\\sigma', category: ButtonCategory.VARIABLE, tab: 'symb' },
  { id: 'omega', label: '\\omega', insert: '\\omega', category: ButtonCategory.VARIABLE, tab: 'symb' },
  { id: 'delta', label: '\\Delta', insert: '\\Delta', category: ButtonCategory.VARIABLE, tab: 'symb' },
  { id: 'phi', label: '\\phi', insert: '\\phi', category: ButtonCategory.VARIABLE, tab: 'symb' },

  // Row 3: Relations
  { id: 'leq', label: '\\leq', insert: '\\leq', category: ButtonCategory.OPERATION, tab: 'symb' },
  { id: 'geq', label: '\\geq', insert: '\\geq', category: ButtonCategory.OPERATION, tab: 'symb' },
  { id: 'neq', label: '\\neq', insert: '\\neq', category: ButtonCategory.OPERATION, tab: 'symb' },
  { id: 'approx', label: '\\approx', insert: '\\approx', category: ButtonCategory.OPERATION, tab: 'symb' },

  // Row 4: Operations & Sets
  { id: 'pm', label: '\\pm', insert: '\\pm', category: ButtonCategory.OPERATION, tab: 'symb' },
  { id: 'in', label: '\\in', insert: '\\in', category: ButtonCategory.OPERATION, tab: 'symb' },
  { id: 'subset', label: '\\subset', insert: '\\subset', category: ButtonCategory.OPERATION, tab: 'symb' },
  { id: 'implies', label: '\\Rightarrow', insert: '\\Rightarrow', category: ButtonCategory.OPERATION, tab: 'symb' },


  // --- ALPHA TAB (Latin a-z) ---
  { id: 'var_a', label: 'a', insert: 'a', category: ButtonCategory.VARIABLE, tab: 'alpha' },
  { id: 'var_b', label: 'b', insert: 'b', category: ButtonCategory.VARIABLE, tab: 'alpha' },
  { id: 'var_c', label: 'c', insert: 'c', category: ButtonCategory.VARIABLE, tab: 'alpha' },
  { id: 'var_d', label: 'd', insert: 'd', category: ButtonCategory.VARIABLE, tab: 'alpha' },
  { id: 'var_e', label: 'e', insert: 'e', category: ButtonCategory.VARIABLE, tab: 'alpha' },
  { id: 'var_f', label: 'f', insert: 'f', category: ButtonCategory.VARIABLE, tab: 'alpha' },
  { id: 'var_g', label: 'g', insert: 'g', category: ButtonCategory.VARIABLE, tab: 'alpha' },
  { id: 'var_h', label: 'h', insert: 'h', category: ButtonCategory.VARIABLE, tab: 'alpha' },
  { id: 'var_i', label: 'i', insert: 'i', category: ButtonCategory.VARIABLE, tab: 'alpha' },
  { id: 'var_j', label: 'j', insert: 'j', category: ButtonCategory.VARIABLE, tab: 'alpha' },
  { id: 'var_k', label: 'k', insert: 'k', category: ButtonCategory.VARIABLE, tab: 'alpha' },
  { id: 'var_l', label: 'l', insert: 'l', category: ButtonCategory.VARIABLE, tab: 'alpha' },
  { id: 'var_m', label: 'm', insert: 'm', category: ButtonCategory.VARIABLE, tab: 'alpha' },
  { id: 'var_n', label: 'n', insert: 'n', category: ButtonCategory.VARIABLE, tab: 'alpha' },
  { id: 'var_o', label: 'o', insert: 'o', category: ButtonCategory.VARIABLE, tab: 'alpha' },
  { id: 'var_p', label: 'p', insert: 'p', category: ButtonCategory.VARIABLE, tab: 'alpha' },
  { id: 'var_q', label: 'q', insert: 'q', category: ButtonCategory.VARIABLE, tab: 'alpha' },
  { id: 'var_r', label: 'r', insert: 'r', category: ButtonCategory.VARIABLE, tab: 'alpha' },
  { id: 'var_s', label: 's', insert: 's', category: ButtonCategory.VARIABLE, tab: 'alpha' },
  { id: 'var_t', label: 't', insert: 't', category: ButtonCategory.VARIABLE, tab: 'alpha' },
  { id: 'var_u', label: 'u', insert: 'u', category: ButtonCategory.VARIABLE, tab: 'alpha' },
  { id: 'var_v', label: 'v', insert: 'v', category: ButtonCategory.VARIABLE, tab: 'alpha' },
  { id: 'var_w', label: 'w', insert: 'w', category: ButtonCategory.VARIABLE, tab: 'alpha' },
  { id: 'var_x', label: 'x', insert: 'x', category: ButtonCategory.VARIABLE, tab: 'alpha' },
  { id: 'var_y', label: 'y', insert: 'y', category: ButtonCategory.VARIABLE, tab: 'alpha' },
  { id: 'var_z', label: 'z', insert: 'z', category: ButtonCategory.VARIABLE, tab: 'alpha' },

  // --- GREEK TAB (Comprehensive) ---
  { id: 'alpha_a', label: '\\alpha', insert: '\\alpha', category: ButtonCategory.VARIABLE, tab: 'greek' },
  { id: 'beta_a', label: '\\beta', insert: '\\beta', category: ButtonCategory.VARIABLE, tab: 'greek' },
  { id: 'gamma_a', label: '\\gamma', insert: '\\gamma', category: ButtonCategory.VARIABLE, tab: 'greek' },
  { id: 'delta_a', label: '\\delta', insert: '\\delta', category: ButtonCategory.VARIABLE, tab: 'greek' },
  { id: 'epsilon_a', label: '\\epsilon', insert: '\\epsilon', category: ButtonCategory.VARIABLE, tab: 'greek' },
  { id: 'zeta_a', label: '\\zeta', insert: '\\zeta', category: ButtonCategory.VARIABLE, tab: 'greek' },
  { id: 'eta_a', label: '\\eta', insert: '\\eta', category: ButtonCategory.VARIABLE, tab: 'greek' },
  { id: 'theta_a', label: '\\theta', insert: '\\theta', category: ButtonCategory.VARIABLE, tab: 'greek' },
  { id: 'iota_a', label: '\\iota', insert: '\\iota', category: ButtonCategory.VARIABLE, tab: 'greek' },
  { id: 'kappa_a', label: '\\kappa', insert: '\\kappa', category: ButtonCategory.VARIABLE, tab: 'greek' },
  { id: 'lambda_a', label: '\\lambda', insert: '\\lambda', category: ButtonCategory.VARIABLE, tab: 'greek' },
  { id: 'mu_a', label: '\\mu', insert: '\\mu', category: ButtonCategory.VARIABLE, tab: 'greek' },
  { id: 'nu_a', label: '\\nu', insert: '\\nu', category: ButtonCategory.VARIABLE, tab: 'greek' },
  { id: 'xi_a', label: '\\xi', insert: '\\xi', category: ButtonCategory.VARIABLE, tab: 'greek' },
  // omicron is just 'o'
  { id: 'pi_a', label: '\\pi', insert: '\\pi', category: ButtonCategory.VARIABLE, tab: 'greek' },
  { id: 'rho_a', label: '\\rho', insert: '\\rho', category: ButtonCategory.VARIABLE, tab: 'greek' },
  { id: 'sigma_a', label: '\\sigma', insert: '\\sigma', category: ButtonCategory.VARIABLE, tab: 'greek' },
  { id: 'tau_a', label: '\\tau', insert: '\\tau', category: ButtonCategory.VARIABLE, tab: 'greek' },
  { id: 'upsilon_a', label: '\\upsilon', insert: '\\upsilon', category: ButtonCategory.VARIABLE, tab: 'greek' },
  { id: 'phi_a', label: '\\phi', insert: '\\phi', category: ButtonCategory.VARIABLE, tab: 'greek' },
  { id: 'chi_a', label: '\\chi', insert: '\\chi', category: ButtonCategory.VARIABLE, tab: 'greek' },
  { id: 'psi_a', label: '\\psi', insert: '\\psi', category: ButtonCategory.VARIABLE, tab: 'greek' },
  { id: 'omega_a', label: '\\omega', insert: '\\omega', category: ButtonCategory.VARIABLE, tab: 'greek' },
  
  // Upper Greek (Common)
  { id: 'Gamma_u', label: '\\Gamma', insert: '\\Gamma', category: ButtonCategory.VARIABLE, tab: 'greek' },
  { id: 'Delta_u', label: '\\Delta', insert: '\\Delta', category: ButtonCategory.VARIABLE, tab: 'greek' },
  { id: 'Theta_u', label: '\\Theta', insert: '\\Theta', category: ButtonCategory.VARIABLE, tab: 'greek' },
  { id: 'Lambda_u', label: '\\Lambda', insert: '\\Lambda', category: ButtonCategory.VARIABLE, tab: 'greek' },
  { id: 'Xi_u', label: '\\Xi', insert: '\\Xi', category: ButtonCategory.VARIABLE, tab: 'greek' },
  { id: 'Pi_u', label: '\\Pi', insert: '\\Pi', category: ButtonCategory.VARIABLE, tab: 'greek' },
  { id: 'Sigma_u', label: '\\Sigma', insert: '\\Sigma', category: ButtonCategory.VARIABLE, tab: 'greek' },
  { id: 'Phi_u', label: '\\Phi', insert: '\\Phi', category: ButtonCategory.VARIABLE, tab: 'greek' },
  { id: 'Psi_u', label: '\\Psi', insert: '\\Psi', category: ButtonCategory.VARIABLE, tab: 'greek' },
  { id: 'Omega_u', label: '\\Omega', insert: '\\Omega', category: ButtonCategory.VARIABLE, tab: 'greek' },
];

export const SAMPLE_QUESTIONS = [
  "\\int_{0}^{\\pi} \\sin(x) dx",
  "\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
  "\\lim_{x \\to 0} \\frac{\\sin(x)}{x}",
  "\\sum_{n=1}^{\\infty} \\frac{1}{n^2}"
];
