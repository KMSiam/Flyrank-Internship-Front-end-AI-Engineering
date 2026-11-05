# Manual Improvements, Corrections & Refactorings
**Track:** Frontend AI Engineering · **Phase:** Foundations · **Week:** 3  
**Application:** PromptCraft Studio AI  
**AI Platform:** Google Antigravity (Gemini 3.8 Flash High)  
**Repository:** [https://github.com/KMSiam/Flyrank-Internship-Front-end-AI-Engineering](https://github.com/KMSiam/Flyrank-Internship-Front-end-AI-Engineering)

---

## Overview

AI-generated code frequently appears correct at first glance but harbors subtle architectural issues, memory leaks, or missing edge-case handling. In accordance with the engineering standards established in our mentorship session with Ishak, this document details **four concrete manual refactorings** performed after reviewing AI-generated code.

---

## Refactoring 1: Streaming Timer Memory Leak & Template Switch Collision

### Context & Problem
In `src/components/Playground.jsx`, the AI generated a simulated token streaming function using `setInterval` to emit tokens every 45ms. However, if the user switched between different prompt templates while simulation was actively running, the previous interval continued running in the background. This caused:
1. Dual concurrent timers writing to the same state.
2. Erroneous telemetry calculation and memory leakage.
3. State collision when switching from a long prompt to a short prompt.

### Before (AI-Generated Code)
```javascript
// AI initial output in Playground.jsx
const handleSimulateExecution = () => {
  setIsGenerating(true);
  const words = mockResponse.split(' ');
  let idx = 0;
  
  // Bug: Interval timer is not saved to a ref and is never cleared on unmount or template change!
  setInterval(() => {
    if (idx < words.length) {
      setOutputStream(prev => prev + ' ' + words[idx]);
      idx++;
    } else {
      setIsGenerating(false);
    }
  }, 45);
};
```

### After (Manual Refactoring)
```javascript
// Refactored implementation in Playground.jsx
const streamTimerRef = useRef(null);

// Effect: Clean up active timer when switching templates or unmounting
useEffect(() => {
  return () => {
    if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current);
      streamTimerRef.current = null;
    }
  };
}, [template?.id]);

const handleSimulateExecution = () => {
  if (isGenerating) return;
  setIsGenerating(true);
  setOutputStream('');
  
  if (streamTimerRef.current) clearInterval(streamTimerRef.current);

  const words = mockResponse.split(' ');
  let currentIndex = 0;

  streamTimerRef.current = setInterval(() => {
    if (currentIndex < words.length) {
      setOutputStream(prev => prev + (currentIndex === 0 ? '' : ' ') + words[currentIndex]);
      currentIndex++;
    } else {
      clearInterval(streamTimerRef.current);
      streamTimerRef.current = null;
      setIsGenerating(false);
      // Finalize telemetry
    }
  }, 45);
};

const handleStopSimulation = () => {
  if (streamTimerRef.current) {
    clearInterval(streamTimerRef.current);
    streamTimerRef.current = null;
  }
  setIsGenerating(false);
};
```

### Impact & Review Effort
- **Correctness:** Completely eliminated memory leaks and race conditions during rapid template navigation.
- **Review Effort:** Caught during interactive runtime testing; resolved in 10 minutes.

---

## Refactoring 2: Variable Regex Deduplication & Safe Interpolation

### Context & Problem
In `src/utils/promptParser.js`, the initial AI implementation of `extractVariables` used a simple global match that returned duplicate array entries whenever a variable (such as `{{input_data}}`) appeared in multiple places within a prompt template. This resulted in duplicate input fields rendered in `VariableInputs.jsx`. Furthermore, if a user had not yet typed a value for a variable, the AI interpolation function replaced it with an empty string or `"undefined"`, destroying template readability.

### Before (AI-Generated Code)
```javascript
// AI initial output
export function extractVariables(text) {
  const matches = text.match(/\{\{(.*?)\}\}/g);
  // Bug 1: Returns raw braces e.g. ["{{input}}", "{{input}}"]
  // Bug 2: Contains duplicates if a variable is referenced multiple times
  return matches || [];
}

export function interpolatePrompt(text, variables) {
  // Bug 3: Replaces missing values with empty string or undefined
  return text.replace(/\{\{(.*?)\}\}/g, (_, key) => variables[key] || '');
}
```

### After (Manual Refactoring)
```javascript
// Refactored implementation
export function extractVariables(templateText) {
  if (!templateText || typeof templateText !== 'string') return [];
  
  const regex = /\{\{([a-zA-Z0-9_-]+)\}\}/g;
  const matches = [];
  let match;
  
  while ((match = regex.exec(templateText)) !== null) {
    matches.push(match[1]); // Extract group 1 without {{ }}
  }
  
  // Deduplicate variable names while preserving first-seen order
  return Array.from(new Set(matches));
}

export function interpolatePrompt(templateText, variables = {}) {
  if (!templateText) return '';
  
  return templateText.replace(/\{\{([a-zA-Z0-9_-]+)\}\}/g, (fullMatch, varName) => {
    // Preserve placeholder if value is null, undefined, or empty string
    if (variables[varName] !== undefined && variables[varName] !== null && variables[varName] !== '') {
      return String(variables[varName]);
    }
    return fullMatch;
  });
}
```

### Impact & Review Effort
- **Correctness:** Eliminated duplicate UI input controls; rendered prompts preserve unfilled placeholders for clear template preview.
- **Review Effort:** Identified during unit test development; resolved in 8 minutes.

---

## Refactoring 3: Schema Property Desynchronization (`systemRole` vs `systemPersona`)

### Context & Problem
The AI generated pre-seeded templates in `defaultTemplates.js` using the property name `systemRole`. However, in `App.jsx` and the initial automated test assertions, the property was referenced as `systemPersona`. Because JavaScript is dynamically typed, `template.systemPersona` evaluated to `undefined`, leaving the persona input field blank upon initial render and causing unit test failures.

### Before (AI-Generated Code)
```javascript
// In defaultTemplates.js
export const DEFAULT_TEMPLATES = [
  { id: 'tmpl-1', title: 'Architect', systemRole: 'Principal Engineer', ... }
];

// In App.jsx
const handleNewTemplate = () => ({
  id: 'new',
  systemPersona: 'You are an AI assistant', // Property mismatch!
  ...
});

// In promptcraft.test.js
assert.ok(tmpl.systemPersona); // FAILED: undefined!
```

### After (Manual Refactoring)
```javascript
// Standardized on systemRole across all files, with fallback support:
// 1. Updated App.jsx:
const newTemplate = {
  id: newId,
  title: 'New Custom Template',
  category: 'Coding',
  tags: ['Custom', 'Vite'],
  systemRole: 'You are an AI assistant designed to produce accurate, high-quality output.',
  ...
};

// 2. Updated PromptEditor.jsx with safe backward compatibility:
<input
  type="text"
  value={template.systemRole || template.systemPersona || ''}
  onChange={(e) => handleFieldChange('systemRole', e.target.value)}
  placeholder="e.g. You are a senior frontend engineer..."
/>

// 3. Updated promptcraft.test.js:
assert.ok(tmpl.systemRole, 'Template must have a systemRole');
```

### Impact & Review Effort
- **Correctness:** 10/10 automated tests passing; template persona consistently displays and persists.
- **Review Effort:** Caught immediately by automated test suite; fixed in 4 minutes.

---

## Refactoring 4: Test Environment Decoupling (Node ESM vs Vite Bundler)

### Context & Problem
The initial AI suggestion for automated testing proposed running component tests that imported `.jsx` files directly in Node.js (`node tests/app.test.js`). In a modern pure-ESM environment (`"type": "module"`), Node.js throws `ERR_UNKNOWN_FILE_EXTENSION` when encountering `.jsx` files without a pre-compilation step or complex loader hooks.

### Before (AI-Generated Suggestion)
```bash
# AI suggested running test script directly on JSX:
node tests/app.test.js
# Result: TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".jsx"
```

### After (Manual Refactoring)
Architecturally decoupled the verification pipeline into two distinct, high-efficiency layers:
1. **Algorithmic Logic Test Suite (`tests/promptcraft.test.js`):** Tests all core utilities (`promptParser.js`, `evaluator.js`, `defaultTemplates.js`) using native Node.js asserts (`assert.strictEqual`, `assert.deepStrictEqual`) with zero external dependencies. Executed via `npm test`.
2. **Production Bundle Verification:** Uses Vite's native Rollup/Oxc pipeline (`vite build`) to verify all `.jsx` components, CSS, and module imports compile into production chunks with 0 errors. Executed via `npm run build`.

### Impact & Review Effort
- **Correctness:** Fast, reliable CI/CD test execution with 0 dependency bloat.
- **Build Performance:** 2,063 modules transformed and bundled in 597ms.
- **Review Effort:** 5 minutes to architect and implement.

---

## Summary of Refactoring Lessons

| Area | AI Vulnerability | Engineering Correction |
| :--- | :--- | :--- |
| **Async Timers** | Omitted unmount/change cleanup | Added `useRef` + `useEffect` cleanup handler |
| **Regex Parsing** | Permitted duplicates & broke unfilled tags | Added `Set` deduplication & fallback placeholder retention |
| **Data Contracts** | Inconsistent schema property naming | Standardized naming with defensive fallback logic |
| **Tooling / Bundling** | Attempted to run JSX directly in Node ESM | Decoupled pure JS logic tests from Vite build checks |
