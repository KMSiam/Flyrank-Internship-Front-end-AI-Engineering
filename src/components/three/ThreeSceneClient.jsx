'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Box } from 'lucide-react';

export const ThreeSceneClient = dynamic(
  () => import('./ThreeScene').then((mod) => mod.ThreeScene),
  {
    ssr: false,
    loading: () => (
      <div className="h-[520px] rounded-2xl border border-border bg-[#090d16] p-8 flex flex-col items-center justify-center text-center space-y-3">
        <div className="h-12 w-12 rounded-2xl bg-sky-950/80 border border-sky-500/30 text-sky-400 flex items-center justify-center animate-pulse">
          <Box className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-bold text-white">Loading WebGL 3D Canvas...</h3>
        <p className="text-xs text-slate-400 font-mono">Initializing Three.js procedural shaders</p>
      </div>
    ),
  }
);
