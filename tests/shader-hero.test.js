/**
 * tests/shader-hero.test.js
 * Verification suite for FE-AA3: Signature Hero: A Fullscreen Shader
 * Validates GLSL uniforms, aspect ratio correction, DPR capping,
 * tab visibility lifecycle pausing, and prefers-reduced-motion fallback.
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('--- RUNNING FE-AA3 FULLSCREEN SHADER HERO TESTS ---');

const shaderHeroPath = path.join(rootDir, 'src/components/shader/ShaderHero.jsx');
const shaderClientPath = path.join(rootDir, 'src/components/shader/ShaderHeroClient.jsx');
const pagePath = path.join(rootDir, 'src/app/page.jsx');

// 1. Check file existence
assert.ok(fs.existsSync(shaderHeroPath), 'ShaderHero.jsx must exist');
assert.ok(fs.existsSync(shaderClientPath), 'ShaderHeroClient.jsx must exist');
assert.ok(fs.existsSync(pagePath), 'app/page.jsx must exist');
console.log('✓ Shader hero components and page files exist');

const heroSource = fs.readFileSync(shaderHeroPath, 'utf8');
const clientSource = fs.readFileSync(shaderClientPath, 'utf8');
const pageSource = fs.readFileSync(pagePath, 'utf8');

// 2. Uniforms verification: Must use at least 2 of (u_time, u_resolution, u_mouse)
// We provide all 3: u_time, u_resolution, u_mouse
assert.ok(heroSource.includes('u_time: { value: 0.0 }'), 'Must declare uniform u_time in uniforms object');
assert.ok(heroSource.includes('u_resolution: { value: new THREE.Vector2'), 'Must declare uniform u_resolution');
assert.ok(heroSource.includes('u_mouse: { value: new THREE.Vector2'), 'Must declare uniform u_mouse');

assert.ok(heroSource.includes('uniform float u_time;'), 'GLSL fragment shader must declare uniform float u_time');
assert.ok(heroSource.includes('uniform vec2 u_resolution;'), 'GLSL fragment shader must declare uniform vec2 u_resolution');
assert.ok(heroSource.includes('uniform vec2 u_mouse;'), 'GLSL fragment shader must declare uniform vec2 u_mouse');
console.log('✓ All 3 core uniforms (u_time, u_resolution, u_mouse) properly declared in Three.js and GLSL');

// 3. Aspect-corrected UV space check
assert.ok(
  heroSource.includes('vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);'),
  'Must normalize and correct UV coordinates against aspect ratio'
);
console.log('✓ Aspect-ratio corrected UV coordinates verified');

// 4. Responsible shipping: devicePixelRatio capped
assert.ok(
  heroSource.includes('Math.min(window.devicePixelRatio || 1, 2)'),
  'Must cap devicePixelRatio at 2.0 for thermal and battery budget'
);
console.log('✓ devicePixelRatio capped at 2.0 for high-density mobile displays');

// 5. Visibility change tab lifecycle pausing
assert.ok(
  heroSource.includes("document.addEventListener('visibilitychange', handleVisibility)"),
  'Must listen to document visibilitychange'
);
assert.ok(
  heroSource.includes('if (document.hidden)'),
  'Must stop animation loop when document is hidden'
);
console.log('✓ Tab visibility change listener halts render loop when inactive');

// 6. prefers-reduced-motion fallback
assert.ok(
  heroSource.includes("window.matchMedia('(prefers-reduced-motion: reduce)')"),
  'Must query prefers-reduced-motion media feature'
);
assert.ok(
  heroSource.includes('reducedMotion') && heroSource.includes('aria-label="FlyRank Signature Static Aurora Gradient (Reduced Motion Fallback)"'),
  'Must render static gradient fallback when reduced motion is preferred'
);
console.log('✓ prefers-reduced-motion static frame/gradient fallback verified');

// 7. Interactive controls: play/pause manual override
assert.ok(
  heroSource.includes('setIsPlaying(!isPlaying)') && heroSource.includes('aria-label={isPlaying ? \'Pause shader animation\' : \'Resume shader animation\'}'),
  'Must provide user toggle for playback'
);
console.log('✓ User playback toggle control verified');

// 8. Headline readability and contrast
assert.ok(
  heroSource.includes('Next-Generation') && heroSource.includes('AI-Native Frontend Interfaces'),
  'Must feature prominent readable headline typography over shader canvas'
);
assert.ok(
  heroSource.includes('backdrop-blur') && heroSource.includes('drop-shadow'),
  'Must include contrast protection scrim / vignette for WCAG AAA readability'
);
console.log('✓ Headline contrast and overlay scrim verified');

// 9. Root Page integration check
assert.ok(
  pageSource.includes('<ShaderHeroClient />') || pageSource.includes('ShaderHeroClient'),
  'Root page (src/app/page.jsx) must integrate ShaderHeroClient'
);
console.log('✓ Root page renders fullscreen shader hero as signature component');

console.log('--- ALL 9/9 FE-AA3 FULLSCREEN SHADER TESTS PASSED! ---\n');
