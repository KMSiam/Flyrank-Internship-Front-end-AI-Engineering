'use client';

import React from 'react';
import dynamic from 'next/dynamic';

export const ShaderHeroClient = dynamic(
  () => import('./ShaderHero').then((mod) => mod.ShaderHero),
  {
    ssr: false,
    loading: () => (
      <div className="w-full min-h-[580px] rounded-3xl border border-border bg-[#090D16] p-8 flex items-center justify-center text-center">
        <div className="space-y-3">
          <div className="h-10 w-10 mx-auto rounded-xl bg-sky-950/80 border border-sky-500/30 animate-pulse" />
          <h3 className="text-sm font-bold text-white">Initializing GLSL Fragment Shader...</h3>
          <p className="text-xs text-slate-400 font-mono">Compiling GPU shader pipeline</p>
        </div>
      </div>
    ),
  }
);
