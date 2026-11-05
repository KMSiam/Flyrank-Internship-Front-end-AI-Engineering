'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import {
  RotateCcw,
  Sun,
  Eye,
  Sliders,
  Sparkles,
  Layers,
  Palette,
  Maximize2,
  RefreshCw,
  Cpu
} from 'lucide-react';

const COLOR_PRESETS = [
  { name: 'FlyRank Sky', hex: 0x0284c7, label: '#0284C7' },
  { name: 'Emerald AI', hex: 0x10b981, label: '#10B981' },
  { name: 'Amber Core', hex: 0xf59e0b, label: '#F59E0B' },
  { name: 'Rose FinOps', hex: 0xf43f5e, label: '#F43F5E' },
  { name: 'Cyber Violet', hex: 0x8b5cf6, label: '#8B5CF6' },
  { name: 'Deep Space', hex: 0x1e293b, label: '#1E293B' },
];

const GEOMETRY_TYPES = [
  { id: 'icosahedron', label: 'Quantum Node (Icosahedron)' },
  { id: 'torus', label: 'Tensor Flux (Torus Knot)' },
  { id: 'dodecahedron', label: 'Neural Matrix (Dodecahedron)' },
];

export function ThreeScene() {
  const mountRef = useRef(null);
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [activeColor, setActiveColor] = useState(COLOR_PRESETS[0]);
  const [geometryType, setGeometryType] = useState('icosahedron');
  const [roughness, setRoughness] = useState(0.2);
  const [metalness, setMetalness] = useState(0.85);
  const [fps, setFps] = useState(60);
  const [reducedMotion, setReducedMotion] = useState(false);

  // References for live Three.js object updates without recreating the scene
  const meshRef = useRef(null);
  const innerMeshRef = useRef(null);
  const materialRef = useRef(null);
  const sceneRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // Check for prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        setReducedMotion(true);
        setAutoRotate(false);
      }
    }
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);

    // 2. High-Performance WebGL Renderer with Anti-Aliasing
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Guard against melting mobile GPUs
    container.appendChild(renderer.domElement);

    // 3. Lighting Rig (Key, Fill, Rim Light)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x0284c7, 3, 20);
    fillLight.position.set(-5, -2, -3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x10b981, 2.5, 20);
    rimLight.position.set(3, -4, 2);
    scene.add(rimLight);

    // 4. Outer Core Mesh with Physical Material
    const outerGeo = new THREE.IcosahedronGeometry(1.4, 1);
    const outerMat = new THREE.MeshStandardMaterial({
      color: activeColor.hex,
      metalness: metalness,
      roughness: roughness,
      wireframe: wireframe,
    });
    materialRef.current = outerMat;

    const mesh = new THREE.Mesh(outerGeo, outerMat);
    scene.add(mesh);
    meshRef.current = mesh;

    // 5. Inner Orbiting Quantum Particle Ring
    const innerGeo = new THREE.TorusGeometry(1.85, 0.03, 16, 100);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const innerRing = new THREE.Mesh(innerGeo, innerMat);
    innerRing.rotation.x = Math.PI / 3;
    scene.add(innerRing);
    innerMeshRef.current = innerRing;

    // 6. Interactive Touch & Drag Orbit Controls (No bulky external OrbitControls dependency)
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const onPointerDown = (e) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e) => {
      if (!isDragging || !meshRef.current) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      meshRef.current.rotation.y += deltaX * 0.008;
      meshRef.current.rotation.x += deltaY * 0.008;
      if (innerMeshRef.current) {
        innerMeshRef.current.rotation.y -= deltaX * 0.004;
      }

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // 7. Render Loop with FPS telemetry
    let frameCount = 0;
    let lastTime = performance.now();

    const animate = (time) => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      frameCount++;
      if (time - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (time - lastTime)));
        frameCount = 0;
        lastTime = time;
      }

      if (autoRotate && meshRef.current) {
        const rotDelta = 0.01 * speed;
        meshRef.current.rotation.y += rotDelta;
        meshRef.current.rotation.x += rotDelta * 0.4;
      }

      if (innerMeshRef.current) {
        innerMeshRef.current.rotation.z += 0.005 * speed;
        innerMeshRef.current.rotation.y += 0.003 * speed;
      }

      renderer.render(scene, camera);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // 8. Responsive Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);
      if (container && domElement) {
        container.removeChild(domElement);
      }
      outerGeo.dispose();
      outerMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      renderer.dispose();
    };
  }, []);

  // Update Geometry dynamically
  useEffect(() => {
    if (!meshRef.current) return;
    let newGeo;
    if (geometryType === 'icosahedron') {
      newGeo = new THREE.IcosahedronGeometry(1.4, 1);
    } else if (geometryType === 'torus') {
      newGeo = new THREE.TorusKnotGeometry(0.9, 0.32, 100, 16);
    } else if (geometryType === 'dodecahedron') {
      newGeo = new THREE.DodecahedronGeometry(1.3, 0);
    }
    meshRef.current.geometry.dispose();
    meshRef.current.geometry = newGeo;
  }, [geometryType]);

  // Update Material dynamically
  useEffect(() => {
    if (!materialRef.current) return;
    materialRef.current.color.setHex(activeColor.hex);
    materialRef.current.wireframe = wireframe;
    materialRef.current.roughness = roughness;
    materialRef.current.metalness = metalness;
    materialRef.current.needsUpdate = true;
  }, [activeColor, wireframe, roughness, metalness]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 3D Canvas Viewport */}
      <div className="lg:col-span-2 relative h-[520px] rounded-2xl border border-border bg-gradient-to-b from-[#090d16] via-[#0f172a] to-[#090d16] shadow-2xl overflow-hidden flex flex-col">
        {/* Telemetry Overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 pointer-events-none">
          <div className="flex items-center gap-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 px-3 py-1 text-[11px] font-mono text-slate-300 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>WebGL 2.0 · Three.js r170</span>
          </div>
          <div className="rounded-full bg-slate-900/80 border border-slate-700/60 px-3 py-1 text-[11px] font-mono text-sky-400 backdrop-blur">
            <span>{fps} FPS</span>
          </div>
        </div>

        {/* 3D Mounting Canvas */}
        <div
          ref={mountRef}
          className="w-full flex-1 cursor-grab active:cursor-grabbing touch-none select-none"
          role="img"
          aria-label="Interactive 3D Quantum Neural Node scene"
        />

        {/* Instruction Footer */}
        <div className="p-3 border-t border-border/60 bg-[#090d16]/80 backdrop-blur flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Drag to orbit • Mobile Touch Optimized</span>
          <span>Zero CLS • Budget &lt; 250KB</span>
        </div>
      </div>

      {/* Mini Configurator Panel */}
      <div className="rounded-2xl border border-border bg-[#0f172a] p-5 shadow-2xl space-y-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-sky-400" />
              <h3 className="text-sm font-bold text-white">3D Scene Configurator</h3>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-500/30">
              FE-AA2
            </span>
          </div>

          <div className="space-y-4">
            {/* Geometry Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                1. Geometry Node
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {GEOMETRY_TYPES.map((geo) => (
                  <button
                    key={geo.id}
                    type="button"
                    onClick={() => setGeometryType(geo.id)}
                    className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      geometryType === geo.id
                        ? 'bg-sky-600 text-white font-semibold shadow-md shadow-sky-600/30'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {geo.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color & Material Palette */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <Palette className="h-3.5 w-3.5 text-emerald-400" />
                <span>2. Quantum Material Preset</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setActiveColor(preset)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-[10px] font-mono transition-all ${
                      activeColor.name === preset.name
                        ? 'border-sky-400 bg-sky-950/60 text-white'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span
                      className="h-4 w-4 rounded-full shadow-sm"
                      style={{ backgroundColor: preset.label }}
                    />
                    <span>{preset.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Material Sliders: Metalness & Roughness */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Metalness</span>
                  <span className="font-mono text-sky-400">{metalness}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={metalness}
                  onChange={(e) => setMetalness(parseFloat(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Roughness</span>
                  <span className="font-mono text-emerald-400">{roughness}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={roughness}
                  onChange={(e) => setRoughness(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Interaction Toggles */}
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={() => setWireframe(!wireframe)}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  wireframe
                    ? 'border-sky-500 bg-sky-950/60 text-sky-300'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                Wireframe: {wireframe ? 'ON' : 'OFF'}
              </button>

              <button
                type="button"
                onClick={() => setAutoRotate(!autoRotate)}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  autoRotate
                    ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                Rotation: {autoRotate ? 'ON' : 'PAUSED'}
              </button>
            </div>
          </div>
        </div>

        {/* Responsible Shipping Notes */}
        <div className="pt-3 border-t border-border/80 text-[11px] text-slate-400 font-mono space-y-1">
          <div className="flex items-center justify-between text-slate-300">
            <span>Budget Target:</span>
            <span className="text-emerald-400">Strict &lt; 250KB</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Model Generation:</span>
            <span>Procedural (0KB GLB)</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Mobile Thermal:</span>
            <span>Safe (DPR capped at 2.0)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
