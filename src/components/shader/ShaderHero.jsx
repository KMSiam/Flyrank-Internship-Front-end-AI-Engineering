'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import Link from 'next/link';
import { Sparkles, ArrowRight, Play, Pause, Eye, ShieldCheck, Zap } from 'lucide-react';

/**
 * Custom GLSL Fragment Shader: FlyRank Signature Quantum Aurora
 * Uniforms: u_time, u_resolution, u_mouse
 * 
 * Pipeline:
 * 1. Normalized Aspect-Corrected UV Coordinate Space
 * 2. Mouse-Driven Flow Field Distortion (Interactivity)
 * 3. Fractional Brownian Motion (fBm) Layered Sine Noise
 * 4. FlyRank Signature Deep Navy -> Cyan -> Emerald Color Mapping
 * 5. High-Frequency Subtle Procedural Film Grain
 * 6. Vignette Radial Shadow (Preserving AAA Content Readability)
 */
const fragmentShader = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;

  // 1. Hash & 2D Noise Primitives
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f); // Hermite cubic smoothstep
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // 2. Fractional Brownian Motion (fBm) Flow Octaves
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = rot * p * 2.0 + vec2(100.0);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    // 3. Normalized & Aspect-Corrected UVs
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);

    // 4. Interactive Mouse Influence Field
    vec2 mouseNorm = (u_mouse * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float mouseDist = length(p - mouseNorm);
    vec2 mouseDistort = (p - mouseNorm) * exp(-mouseDist * 2.0) * 0.25;
    p += mouseDistort;

    // 5. Time-Evolving Fluid Flow Waves
    float t = u_time * 0.25;
    vec2 flow = vec2(
      fbm(p + vec2(t * 0.2, -t * 0.1)),
      fbm(p + vec2(-t * 0.15, t * 0.25))
    );

    float n = fbm(p * 1.5 + flow * 2.2 + vec2(0.0, t * 0.3));

    // 6. FlyRank Brand Color Palette Grading
    // Deep Base Navy (#090D16) -> Vivid Cyan (#0284C7) -> Emerald Aurora (#10B981)
    vec3 colDeepNavy = vec3(0.035, 0.051, 0.086);
    vec3 colCyan     = vec3(0.008, 0.518, 0.780);
    vec3 colEmerald  = vec3(0.063, 0.725, 0.506);
    vec3 colElectric = vec3(0.220, 0.741, 0.973);

    vec3 color = mix(colDeepNavy, colCyan, smoothstep(0.15, 0.65, n));
    color = mix(color, colEmerald, smoothstep(0.45, 0.85, n * flow.x));
    color += colElectric * pow(n, 4.0) * 0.45; // Specular aurora crest

    // 7. Subtle Procedural Film Grain (Anti-Banding)
    float grain = (hash(gl_FragCoord.xy + fract(u_time * 12.34)) - 0.5) * 0.035;
    color += grain;

    // 8. Radial Vignette (Ensures AAA Typography Readability)
    float vignette = 1.0 - smoothstep(0.5, 1.4, length(uv - 0.5));
    color *= mix(0.55, 1.0, vignette);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

export function ShaderHero() {
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fps, setFps] = useState(60);

  const rendererRef = useRef(null);
  const uniformsRef = useRef(null);
  const animIdRef = useRef(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (media.matches) {
        setReducedMotion(true);
        setIsPlaying(false);
      }
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reducedMotion) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Orthographic Fullscreen Quad Camera
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // 2. High Performance WebGL Renderer with Capped DPR
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: 'high-performance',
      stencil: false,
      depth: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); // Capped DPR protects mobile thermal ceiling
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Shader Material with Core Uniforms
    const uniforms = {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(width, height) },
      u_mouse: { value: new THREE.Vector2(width * 0.5, height * 0.5) }
    };
    uniformsRef.current = uniforms;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    // 4. Mouse Move Tracking
    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = rect.height - (e.clientY - rect.top);
      uniforms.u_mouse.value.set(x, y);
    };

    window.addEventListener('pointermove', handlePointerMove);

    // 5. Visibility Change (Pause when tab is hidden to conserve power)
    const handleVisibility = () => {
      if (document.hidden) {
        if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      } else if (isPlaying) {
        lastTime = performance.now();
        animIdRef.current = requestAnimationFrame(animate);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // 6. Animation Loop
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTime = lastTime;

    const animate = (now) => {
      animIdRef.current = requestAnimationFrame(animate);
      const delta = (now - lastTime) * 0.001;
      lastTime = now;

      if (isPlaying) {
        uniforms.u_time.value += delta;
      }

      // Live FPS telemetry
      frameCount++;
      if (now - fpsTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - fpsTime)));
        frameCount = 0;
        fpsTime = now;
      }

      renderer.render(scene, camera);
    };

    animIdRef.current = requestAnimationFrame(animate);

    // 7. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      renderer.setSize(newWidth, newHeight);
      uniforms.u_resolution.value.set(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animIdRef.current);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      material.dispose();
      renderer.dispose();
    };
  }, [reducedMotion, isPlaying]);

  return (
    <div className="relative w-full min-h-[580px] sm:min-h-[640px] rounded-3xl overflow-hidden border border-border/80 shadow-2xl flex items-center justify-center">
      {/* Fallback Static Gradient for Reduced-Motion or Low-Power */}
      {reducedMotion ? (
        <div
          className="absolute inset-0 bg-gradient-to-tr from-[#090D16] via-[#0284C7] to-[#10B981] opacity-90"
          role="img"
          aria-label="FlyRank Signature Static Aurora Gradient (Reduced Motion Fallback)"
        />
      ) : (
        /* Fullscreen WebGL Shader Canvas */
        <div
          ref={containerRef}
          className="absolute inset-0 w-full h-full"
          role="img"
          aria-label="Interactive Fullscreen GLSL Quantum Aurora Shader"
        />
      )}

      {/* Contrast Overlay Mesh (Protects WCAG 2.1 AA Typography Contrast) */}
      <div className="absolute inset-0 bg-[#090D16]/50 backdrop-blur-[1px] pointer-events-none" />

      {/* Top Floating Controls & Shader Telemetry */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-slate-900/80 border border-sky-500/30 px-3 py-1 text-[11px] font-mono text-sky-400 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>GLSL Fragment Shader · FE-AA3</span>
          </div>
          <div className="hidden sm:flex rounded-full bg-slate-900/80 border border-slate-700/60 px-3 py-1 text-[11px] font-mono text-slate-300 backdrop-blur">
            <span>{fps} FPS · Capped DPR 2.0</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Play/Pause Animation Toggle */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 px-3 py-1 text-[11px] font-mono text-slate-300 hover:text-white backdrop-blur transition-all"
            aria-label={isPlaying ? 'Pause shader animation' : 'Resume shader animation'}
          >
            {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            <span>{isPlaying ? 'Pause' : 'Resume'}</span>
          </button>
        </div>
      </div>

      {/* Hero Headline & Content Layer (100% Readable) */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/40 bg-sky-950/70 px-4 py-1 text-xs font-semibold text-sky-300 shadow-lg backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-sky-400" />
          <span>KM Siam · FlyRank Frontend AI Engineering Capstone</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
          Next-Generation <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
            AI-Native Frontend Interfaces
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed drop-shadow">
          Engineered with Google Antigravity. Combining token-streamed LLM dialogues, generative schema rendering, compositor-clean micro-interactions, and WebGL shader architectures.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-xs sm:text-sm font-semibold text-white shadow-xl shadow-sky-600/30 hover:bg-sky-500 transition-all focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <span>Launch Streaming Chat</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/three-d"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-[#0f172a]/80 px-5 py-3 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-[#162036] backdrop-blur transition-all"
          >
            <span>Explore 3D Neural Node</span>
          </Link>
        </div>

        {/* Uniform Diagnostics Card */}
        <div className="pt-6">
          <div className="inline-flex flex-wrap items-center justify-center gap-4 rounded-2xl border border-border/80 bg-[#090d16]/70 backdrop-blur px-5 py-2.5 text-xs text-slate-400 font-mono">
            <span>Uniforms: <code className="text-sky-300">u_time</code>, <code className="text-emerald-300">u_resolution</code>, <code className="text-amber-300">u_mouse</code></span>
            <span>•</span>
            <span>Cursor Flow Distortion: <span className="text-emerald-400">Active</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
