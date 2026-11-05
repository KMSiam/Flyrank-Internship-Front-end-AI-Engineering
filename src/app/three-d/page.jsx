import React from 'react';
import { ThreeSceneClient } from '../../components/three/ThreeSceneClient';
import { Box } from 'lucide-react';

export const metadata = {
  title: '3D Experience (FE-AA2) — FlyRank Frontend AI',
  description: 'Interactive WebGL 3D Experience on the web featuring real-time shader materials, geometry configurator, mobile touch orbit, and responsible performance budgeting.',
};

export default function ThreeExperiencePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
          <Box className="h-4 w-4" />
          <span>Week 7 · FE-AA2 Build+ Experience</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Your First 3D Experience on the Web
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Interactive 3D Quantum Neural Node built on Three.js r170. Stage geometries, adjust physical lighting rigs, configure roughness/metalness materials, and drag to orbit with mobile touch support.
        </p>
      </div>

      {/* Main 3D Experience */}
      <ThreeSceneClient />
    </div>
  );
}
