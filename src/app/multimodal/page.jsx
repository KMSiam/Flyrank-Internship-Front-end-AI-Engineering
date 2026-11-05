import React from 'react';
import { Eye, UploadCloud, Image, Tag, CheckCircle2, Sliders, Scan, Crosshair } from 'lucide-react';

export const metadata = {
  title: 'Multimodal Vision & Canvas — FlyRank Frontend AI',
  description: 'Multimodal image understanding, OCR extraction, bounding boxes, and visual auto-tagging workbench.',
};

export default function MultimodalPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
          <Eye className="h-4 w-4" />
          <span>Core Capstone Screen · Screen 3</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Multimodal Vision & Canvas Workbench
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Visual input processing, drag-and-drop document inspection, spatial bounding box detection, and real-time multi-label semantic tagging.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Canvas & Image Inspector */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-[#0f172a] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Scan className="h-4 w-4 text-emerald-400" />
              <span>Vision Ingestion Canvas</span>
            </span>
            <span className="text-[11px] font-mono text-slate-500">Supports PNG, JPEG, WEBP &lt; 20MB</span>
          </div>

          {/* Interactive Inspection Frame */}
          <div className="relative rounded-xl border-2 border-dashed border-border bg-[#090d16] p-8 flex flex-col items-center justify-center text-center min-h-[360px] group hover:border-emerald-500/50 transition-colors">
            <div className="rounded-full bg-emerald-950/40 border border-emerald-500/30 p-4 text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
              <UploadCloud className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Drag and drop document or canvas asset</h3>
            <p className="text-xs text-slate-400 max-w-sm mb-4">
              Pass image payloads directly to vision models for spatial object detection, OCR extraction, and automated categorization.
            </p>
            <button className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors">
              Select Sample Asset
            </button>

            {/* Simulated Bounding Box Overlay */}
            <div className="absolute top-6 left-6 border border-emerald-400/80 bg-emerald-400/10 rounded px-2 py-0.5 text-[10px] font-mono text-emerald-300 pointer-events-none">
              Detected Object: [Confidence: 0.98]
            </div>
          </div>
        </div>

        {/* Right Column: Inferred Attributes & Metadata */}
        <div className="rounded-xl border border-border bg-[#0f172a] p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Tag className="h-4 w-4 text-sky-400" />
              <span>Semantic Labels</span>
            </span>
            <span className="rounded bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
              4 LABELS
            </span>
          </div>

          <div className="space-y-2">
            {[
              { label: 'Technical Architecture Diagram', confidence: '99.2%' },
              { label: 'React 19 Component Tree', confidence: '96.8%' },
              { label: 'Vercel Deployment Preview', confidence: '94.5%' },
              { label: 'Dark Palette UI Token', confidence: '91.0%' },
            ].map((tag, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-[#090d16] border border-border/60 text-xs">
                <span className="text-slate-300 font-medium">{tag.label}</span>
                <span className="font-mono text-emerald-400 font-semibold">{tag.confidence}</span>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-[#090d16] p-3.5 border border-border text-xs text-slate-400 space-y-2">
            <div className="font-semibold text-slate-200 text-[11px] uppercase tracking-wider">Spatial OCR Summary</div>
            <p className="text-[11px] leading-relaxed">
              Extracted 14 text anchors across SVG elements. Zero OCR hallucinations detected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
