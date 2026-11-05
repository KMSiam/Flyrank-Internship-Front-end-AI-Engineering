import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Starting FE-AA2 3D Web Experience Automated Test Suite...\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
    process.exitCode = 1;
  }
}

// 1. Component Invariants & Three.js Scene Setup
console.log('--- 1. ThreeScene Component Architecture ---');

runTest('ThreeScene.jsx exists and imports Three.js', () => {
  const filePath = path.join(rootDir, 'src/components/three/ThreeScene.jsx');
  assert.ok(fs.existsSync(filePath), 'ThreeScene.jsx must exist');
  const code = fs.readFileSync(filePath, 'utf-8');

  assert.ok(code.includes('three'), 'Must import Three.js');
  assert.ok(code.includes('WebGLRenderer'), 'Must initialize WebGLRenderer');
  assert.ok(code.includes('PerspectiveCamera'), 'Must initialize PerspectiveCamera');
});

runTest('ThreeScene.jsx implements multiple geometries and material configurator', () => {
  const filePath = path.join(rootDir, 'src/components/three/ThreeScene.jsx');
  const code = fs.readFileSync(filePath, 'utf-8');

  assert.ok(code.includes('GEOMETRY_TYPES'), 'Must define multiple geometry types');
  assert.ok(code.includes('COLOR_PRESETS'), 'Must define material color presets');
  assert.ok(code.includes('metalness'), 'Must configure metalness');
  assert.ok(code.includes('roughness'), 'Must configure roughness');
  assert.ok(code.includes('wireframe'), 'Must configure wireframe toggle');
});

runTest('ThreeScene.jsx caps DPR and supports prefers-reduced-motion', () => {
  const filePath = path.join(rootDir, 'src/components/three/ThreeScene.jsx');
  const code = fs.readFileSync(filePath, 'utf-8');

  assert.ok(code.includes('devicePixelRatio'), 'Must handle device pixel ratio');
  assert.ok(code.includes('prefers-reduced-motion'), 'Must honor reduced motion preferences');
});

// 2. Page & Lazy-Loading Invariants
console.log('\n--- 2. Responsible Shipping & Dynamic Route ---');

runTest('three-d/page.jsx and ThreeSceneClient.jsx lazy-load canvas with fallback', () => {
  const filePath = path.join(rootDir, 'src/components/three/ThreeSceneClient.jsx');
  assert.ok(fs.existsSync(filePath), 'src/components/three/ThreeSceneClient.jsx must exist');
  const code = fs.readFileSync(filePath, 'utf-8');

  assert.ok(code.includes('dynamic('), 'Must use dynamic import for lazy loading');
  assert.ok(code.includes('ssr: false'), 'Must disable SSR for WebGL canvas');
  assert.ok(code.includes('loading:'), 'Must provide fallback loading state');
});

console.log('\n==========================================');
console.log(`Summary: ${passedTests}/${totalTests} tests passed.`);
console.log('==========================================\n');

if (passedTests === totalTests) {
  console.log('🎉 All FE-AA2 3D Experience tests passed successfully!');
} else {
  process.exit(1);
}
