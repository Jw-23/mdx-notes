// LaTeX support for Monaco Editor
// Provides completion, syntax highlighting, and auto-pairing for LaTeX in MDX/Markdown files
// Based on data structure from LaTeX Workshop project

// 内嵌LaTeX补全数据以避免模块导入问题
const latexCompletionItems = [
  // 基本数学符号
  { label: '\\alpha', insertText: 'alpha', detail: 'α', documentation: 'Greek letter alpha', kind: 'Function' },
  { label: '\\beta', insertText: 'beta', detail: 'β', documentation: 'Greek letter beta', kind: 'Function' },
  { label: '\\gamma', insertText: 'gamma', detail: 'γ', documentation: 'Greek letter gamma', kind: 'Function' },
  { label: '\\delta', insertText: 'delta', detail: 'δ', documentation: 'Greek letter delta', kind: 'Function' },
  { label: '\\epsilon', insertText: 'epsilon', detail: 'ε', documentation: 'Greek letter epsilon', kind: 'Function' },
  { label: '\\sum', insertText: 'sum_{${1:i=1}}^{${2:n}} ${3}', detail: '∑', documentation: 'Summation', kind: 'Function', insertTextRules: 'InsertAsSnippet' },
  { label: '\\int', insertText: 'int_{${1:a}}^{${2:b}} ${3} \\, d${4:x}', detail: '∫', documentation: 'Integral', kind: 'Function', insertTextRules: 'InsertAsSnippet' },
  { label: '\\frac', insertText: 'frac{${1:numerator}}{${2:denominator}}', detail: 'fraction', documentation: 'Fraction', kind: 'Function', insertTextRules: 'InsertAsSnippet' },
  { label: '\\sqrt', insertText: 'sqrt{${1:expression}}', detail: '√', documentation: 'Square root', kind: 'Function', insertTextRules: 'InsertAsSnippet' },
  { label: '\\lim', insertText: 'lim_{${1:x \\to \\infty}} ${2}', detail: 'limit', documentation: 'Limit', kind: 'Function', insertTextRules: 'InsertAsSnippet' },
  { label: '\\sin', insertText: 'sin', detail: 'sine', documentation: 'Sine function', kind: 'Function' },
  { label: '\\cos', insertText: 'cos', detail: 'cosine', documentation: 'Cosine function', kind: 'Function' },
  { label: '\\tan', insertText: 'tan', detail: 'tangent', documentation: 'Tangent function', kind: 'Function' },
  { label: '\\log', insertText: 'log', detail: 'logarithm', documentation: 'Logarithm', kind: 'Function' },
  { label: '\\ln', insertText: 'ln', detail: 'natural log', documentation: 'Natural logarithm', kind: 'Function' },
  { label: '\\infty', insertText: 'infty', detail: '∞', documentation: 'Infinity', kind: 'Function' },
  { label: '\\pi', insertText: 'pi', detail: 'π', documentation: 'Pi', kind: 'Function' },
  { label: '\\theta', insertText: 'theta', detail: 'θ', documentation: 'Greek letter theta', kind: 'Function' },
  { label: '\\lambda', insertText: 'lambda', detail: 'λ', documentation: 'Greek letter lambda', kind: 'Function' },
  { label: '\\mu', insertText: 'mu', detail: 'μ', documentation: 'Greek letter mu', kind: 'Function' },
  { label: '\\sigma', insertText: 'sigma', detail: 'σ', documentation: 'Greek letter sigma', kind: 'Function' },
  { label: '\\phi', insertText: 'phi', detail: 'φ', documentation: 'Greek letter phi', kind: 'Function' },
  { label: '\\omega', insertText: 'omega', detail: 'ω', documentation: 'Greek letter omega', kind: 'Function' },
  { label: '\\leftarrow', insertText: 'leftarrow', detail: '←', documentation: 'Left arrow', kind: 'Function' },
  { label: '\\rightarrow', insertText: 'rightarrow', detail: '→', documentation: 'Right arrow', kind: 'Function' },
  { label: '\\Rightarrow', insertText: 'Rightarrow', detail: '⇒', documentation: 'Right double arrow', kind: 'Function' },
  { label: '\\leq', insertText: 'leq', detail: '≤', documentation: 'Less than or equal', kind: 'Function' },
  { label: '\\geq', insertText: 'geq', detail: '≥', documentation: 'Greater than or equal', kind: 'Function' },
  { label: '\\neq', insertText: 'neq', detail: '≠', documentation: 'Not equal', kind: 'Function' },
  { label: '\\approx', insertText: 'approx', detail: '≈', documentation: 'Approximately equal', kind: 'Function' },
  { label: '\\in', insertText: 'in', detail: '∈', documentation: 'Element of', kind: 'Function' },
  { label: '\\subset', insertText: 'subset', detail: '⊂', documentation: 'Subset', kind: 'Function' },
  { label: '\\cap', insertText: 'cap', detail: '∩', documentation: 'Intersection', kind: 'Function' },
  { label: '\\cup', insertText: 'cup', detail: '∪', documentation: 'Union', kind: 'Function' },
  { label: '\\mathbb', insertText: 'mathbb{${1:text}}', detail: 'blackboard bold', documentation: 'Blackboard bold', kind: 'Function', insertTextRules: 'InsertAsSnippet' },
  { label: '\\mathbf', insertText: 'mathbf{${1:text}}', detail: 'bold', documentation: 'Bold face', kind: 'Function', insertTextRules: 'InsertAsSnippet' },
  { label: '\\mathcal', insertText: 'mathcal{${1:text}}', detail: 'calligraphic', documentation: 'Calligraphic', kind: 'Function', insertTextRules: 'InsertAsSnippet' },
  { label: '\\text', insertText: 'text{${1:text}}', detail: 'text', documentation: 'Text in math mode', kind: 'Function', insertTextRules: 'InsertAsSnippet' },
];

// 为Editor.js提供的接口函数
let latexSupportDisposable = null;

/**
 * 初始化LaTeX支持
 * @param {import('monaco-editor').editor.IStandaloneCodeEditor} editor 
 * @param {import('monaco-editor').editor} monaco 
 * @returns {object} disposable object
 */
export function initializeLatexSupport(editor, monaco) {
  console.log('Initializing LaTeX support...');
  
  if (!monaco) {
    console.warn('Monaco editor not found');
    return { dispose: () => {} };
  }
  
  // 测试LaTeX数据是否正确加载
  console.log('LaTeX items loaded:', latexCompletionItems.length, 'items');
  if (latexCompletionItems.length > 0) {
    console.log('First few items:', latexCompletionItems.slice(0, 3));
  }
  
  if (latexSupportDisposable) {
    latexSupportDisposable.dispose();
  }
  
  // Register LaTeX language support
  latexSupportDisposable = registerLatexLanguageSupport(monaco);
  
  console.log('LaTeX support initialized successfully');
  return latexSupportDisposable;
}

/**
 * 清理LaTeX支持
 */
export function disposeLatexSupport() {
  if (latexSupportDisposable) {
    latexSupportDisposable.dispose();
    latexSupportDisposable = null;
  }
}

/**
 * Register LaTeX language support for Monaco Editor
 * @param {import('monaco-editor').editor} monaco - Monaco editor instance
 */
/**
 * Register LaTeX language support for Monaco Editor
 * @param {import('monaco-editor').editor} monaco - Monaco editor instance
 */
export function registerLatexLanguageSupport(monaco) {
  console.log('Registering LaTeX language support...');
  
  // Register LaTeX completion provider for MDX/Markdown files
  const completionProvider = monaco.languages.registerCompletionItemProvider(['markdown'], {
    triggerCharacters: ['\\', 'a'],  // 添加'a'作为测试触发字符
    
    provideCompletionItems: (model, position, context) => {
      console.log('LaTeX completion triggered!', { position, context });
      
      const textUntilPosition = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });

      console.log('Text until position:', textUntilPosition);

      // 检查是否输入了反斜杠
      if (!textUntilPosition.includes('\\')) {
        console.log('No backslash found, returning empty suggestions');
        return { suggestions: [] };
      }

      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      // Get LaTeX completion items
      const latexItems = latexCompletionItems;
      console.log('LaTeX items count:', latexItems.length);
      
      // Convert to Monaco completion items (限制数量避免性能问题)
      const suggestions = latexItems.slice(0, 20).map(item => ({
        label: item.label,
        kind: getCompletionItemKind(monaco, item.kind),
        insertText: item.insertText,
        insertTextRules: item.insertTextRules === 'InsertAsSnippet' 
          ? monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet 
          : undefined,
        documentation: item.documentation ? {
          value: `${item.documentation}${item.detail ? `\n\n**Symbol:** ${item.detail}` : ''}`,
          isTrusted: true
        } : undefined,
        detail: item.detail,
        range: range,
        sortText: getSortText(item.label, textUntilPosition)
      }));

      console.log('Returning suggestions:', suggestions.length);
      return { suggestions };
    }
  });

  // Register LaTeX hover provider
  const hoverProvider = monaco.languages.registerHoverProvider(['markdown'], {
    provideHover: (model, position) => {
      const isMathContext = isMathEnvironment(model, position);
      if (!isMathContext) {
        return null;
      }

      const word = model.getWordAtPosition(position);
      if (!word || !word.word.startsWith('\\')) {
        return null;
      }

      const latexItems = latexCompletionItems;
      const item = latexItems.find(item => item.label === word.word);
      
      if (item && item.documentation) {
        return {
          range: {
            startLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endLineNumber: position.lineNumber,
            endColumn: word.endColumn,
          },
          contents: [
            { value: `**${item.label}**` },
            { value: item.documentation },
            ...(item.detail ? [{ value: `Symbol: ${item.detail}` }] : [])
          ]
        };
      }

      return null;
    }
  });  // Register auto-closing pairs for math environments
  monaco.languages.setLanguageConfiguration('markdown', {
    autoClosingPairs: [
      { open: '$', close: '$', notIn: ['string', 'comment'] },
      { open: '\\(', close: '\\)', notIn: ['string', 'comment'] },
      { open: '\\[', close: '\\]', notIn: ['string', 'comment'] },
      { open: '\\{', close: '\\}', notIn: ['string', 'comment'] },
      { open: '_{', close: '}', notIn: ['string', 'comment'] },
      { open: '^{', close: '}', notIn: ['string', 'comment'] }
    ],
    surroundingPairs: [
      { open: '$', close: '$' },
      { open: '\\(', close: '\\)' },
      { open: '\\[', close: '\\]' },
      { open: '\\{', close: '\\}' }
    ]
  });

  return {
    dispose: () => {
      completionProvider.dispose();
      hoverProvider.dispose();
    }
  };
}

/**
 * Check if the current position is within a math environment
 * @param {import('monaco-editor').editor.ITextModel} model 
 * @param {import('monaco-editor').Position} position 
 * @returns {boolean}
 */
function isMathEnvironment(model, position) {
  const content = model.getValue();
  const offset = model.getOffsetAt(position);
  
  // Check for inline math: $...$
  const beforeContent = content.substring(0, offset);
  const afterContent = content.substring(offset);
  
  // Count unescaped $ before current position
  let dollarCount = 0;
  let i = 0;
  while (i < beforeContent.length) {
    if (beforeContent[i] === '$' && (i === 0 || beforeContent[i-1] !== '\\')) {
      dollarCount++;
    }
    i++;
  }
  
  // If odd number of $, we're inside inline math
  if (dollarCount % 2 === 1) {
    return true;
  }
  
  // Check for display math: \[...\] or $$...$$
  const displayMathRegex = /\\\[[\s\S]*?\\\]|\$\$[\s\S]*?\$\$/g;
  let match;
  while ((match = displayMathRegex.exec(content)) !== null) {
    if (offset >= match.index && offset <= match.index + match[0].length) {
      return true;
    }
  }
  
  // Check for math environments: \begin{equation}, \begin{align}, etc.
  const mathEnvRegex = /\\begin\{(equation|align|gather|split|multline|eqnarray|cases|matrix|pmatrix|bmatrix|vmatrix|Vmatrix|smallmatrix|array)\*?\}[\s\S]*?\\end\{\1\*?\}/g;
  while ((match = mathEnvRegex.exec(content)) !== null) {
    if (offset >= match.index && offset <= match.index + match[0].length) {
      return true;
    }
  }
  
  return false;
}

/**
 * Convert completion item kind string to Monaco kind
 * @param {import('monaco-editor').editor} monaco 
 * @param {string} kind 
 * @returns {import('monaco-editor').languages.CompletionItemKind}
 */
function getCompletionItemKind(monaco, kind) {
  switch (kind) {
    case 'Function':
      return monaco.languages.CompletionItemKind.Function;
    case 'Variable':
      return monaco.languages.CompletionItemKind.Variable;
    case 'Keyword':
      return monaco.languages.CompletionItemKind.Keyword;
    case 'Snippet':
      return monaco.languages.CompletionItemKind.Snippet;
    case 'Constant':
      return monaco.languages.CompletionItemKind.Constant;
    default:
      return monaco.languages.CompletionItemKind.Text;
  }
}

/**
 * Generate sort text for completion items
 * @param {string} label 
 * @param {string} context 
 * @returns {string}
 */
function getSortText(label, context) {
  // Prioritize items that match the current context
  const lastWord = context.split(/\s+/).pop() || '';
  if (label.toLowerCase().includes(lastWord.toLowerCase())) {
    return '0' + label; // Higher priority
  }
  return '1' + label; // Lower priority
}

/**
 * Handle smart dollar sign pairing
 * @param {import('monaco-editor').editor.IStandaloneCodeEditor} editor 
 */
/**
 * Enhanced math environment detection with better handling of nested environments
 * @param {import('monaco-editor').editor.ITextModel} model 
 * @param {import('monaco-editor').Position} position 
 * @returns {{inMath: boolean, mathType: string | null, range: {start: number, end: number} | null}}
 */
export function getMathContext(model, position) {
  const content = model.getValue();
  const offset = model.getOffsetAt(position);
  
  // Check inline math first
  const beforeContent = content.substring(0, offset);
  const afterContent = content.substring(offset);
  
  // Find all $ positions
  const dollarPositions = [];
  for (let i = 0; i < content.length; i++) {
    if (content[i] === '$' && (i === 0 || content[i-1] !== '\\')) {
      dollarPositions.push(i);
    }
  }
  
  // Check if we're between two $ (inline math)
  for (let i = 0; i < dollarPositions.length - 1; i += 2) {
    if (offset > dollarPositions[i] && offset < dollarPositions[i + 1]) {
      return {
        inMath: true,
        mathType: 'inline',
        range: { start: dollarPositions[i], end: dollarPositions[i + 1] }
      };
    }
  }
  
  // Check display math environments
  const mathEnvs = [
    { start: /\\\[/g, end: /\\\]/g, type: 'display' },
    { start: /\$\$/g, end: /\$\$/g, type: 'display' },
    { start: /\\begin\{(equation|align|gather|split|multline|eqnarray|cases|matrix|pmatrix|bmatrix|vmatrix|Vmatrix|smallmatrix|array)\*?\}/g, end: /\\end\{(equation|align|gather|split|multline|eqnarray|cases|matrix|pmatrix|bmatrix|vmatrix|Vmatrix|smallmatrix|array)\*?\}/g, type: 'environment' }
  ];
  
  for (const env of mathEnvs) {
    env.start.lastIndex = 0;
    env.end.lastIndex = 0;
    
    let startMatch, endMatch;
    while ((startMatch = env.start.exec(content)) !== null) {
      env.end.lastIndex = startMatch.index + startMatch[0].length;
      endMatch = env.end.exec(content);
      
      if (endMatch && offset > startMatch.index && offset < endMatch.index + endMatch[0].length) {
        return {
          inMath: true,
          mathType: env.type,
          range: { start: startMatch.index, end: endMatch.index + endMatch[0].length }
        };
      }
    }
  }
  
  return { inMath: false, mathType: null, range: null };
}

export default {
  registerLatexLanguageSupport,
  initializeLatexSupport,
  disposeLatexSupport,
  getMathContext
};
