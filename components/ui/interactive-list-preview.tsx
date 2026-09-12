"use client";

import React from "react";

export interface InteractiveListItem {
  client: string;
  platform?: string;
  services: string;
  metric?: string;
  tag?: string;
}

export interface InteractiveListPreviewProps {
  items?: InteractiveListItem[];
  imageSize?: number;
  smoothness?: number;
  duration?: number;
  lerp?: number;
  bgColor?: string;
  className?: string;
}

const DEFAULT_ITEMS: InteractiveListItem[] = [
  { 
    client: "01. HOOK REVERSE-ENGINEER", 
    platform: "REELS & SHORTS", 
    services: "Deconstructs 0-3s opening retention, visual cues, audio BPM & caption psychology", 
    metric: "2.4× MEDIAN",
    tag: "PROVENANCE"
  },
  { 
    client: "02. AI AGENT SWARM", 
    platform: "4-AGENT PIPELINE", 
    services: "Strategist, Scriptwriter, Brand Critic, and Studio Director collaborate in real time", 
    metric: "GROQ / LLAMA-3.3",
    tag: "MULTI-AGENT"
  },
  { 
    client: "03. 7-DAY GROWTH BLUEPRINT", 
    platform: "ACTIONABLE PLAYBOOK", 
    services: "Synthesizes 5 winning hook scripts, 7-day organic calendar, and paid ad creative angles", 
    metric: "STUDIO READY",
    tag: "PRODUCTION"
  },
  { 
    client: "04. OPPORTUNITY RADAR", 
    platform: "VELOCITY TELEMETRY", 
    services: "Detects rising audience signals and competitor blindspots before algorithms saturate", 
    metric: "0-100 INTENT",
    tag: "ANOMALIES"
  },
  { 
    client: "05. COMPANY BRAND BRAIN", 
    platform: "PERSONA GOVERNANCE", 
    services: "Injects strict negative claims, target audience pain points, tone, and positioning guardrails", 
    metric: "100% ON-BRAND",
    tag: "GUARDRAILS"
  },
];

const TICKER_ITEMS = [
  "⚡ REAL-TIME SYSTEM TELEMETRY",
  "• 0-3s HOOK RETENTION DECONSTRUCTION",
  "• MULTI-AGENT REASONING SWARM",
  "• 7-DAY ORGANIC GROWTH BLUEPRINT",
  "• OPPORTUNITY VELOCITY RADAR",
  "• 100% OBSERVED DATA PROVENANCE",
  "• STATISTICAL OUTPERFORMANCE MULTIPLIERS (2.4x MEDIAN)",
  "• AUTOMATED VIRAL HOOK REVERSE-ENGINEERING",
];

export function InteractiveListPreview({
  items = DEFAULT_ITEMS,
  bgColor = "transparent",
  className = "",
}: InteractiveListPreviewProps) {
  return (
    <div style={{ backgroundColor: bgColor }} className={`w-full font-mono text-white ${className}`}>
      {/* Infinite Scrolling Text Marquee Ticker */}
      <div className="w-full bg-black/60 border-b border-white/10 py-3 overflow-hidden relative">
        <div className="animate-marquee">
          <div className="flex items-center gap-8 px-4 text-xs text-zinc-300 font-mono shrink-0">
            {TICKER_ITEMS.map((item, idx) => (
              <span key={idx} className="flex items-center gap-3">
                <span className={idx === 0 ? "text-emerald-400 font-bold" : "text-zinc-300"}>{item}</span>
                <span className="text-zinc-600 font-sans">|</span>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-8 px-4 text-xs text-zinc-300 font-mono shrink-0">
            {TICKER_ITEMS.map((item, idx) => (
              <span key={`dup-${idx}`} className="flex items-center gap-3">
                <span className={idx === 0 ? "text-emerald-400 font-bold" : "text-zinc-300"}>{item}</span>
                <span className="text-zinc-600 font-sans">|</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Clean, Simple & Highly Readable System Table */}
      <div className="relative w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-white/10 text-[10px] font-mono text-zinc-400 uppercase tracking-widest bg-black/40">
              <th className="px-6 py-3.5 font-semibold w-[28%]">Engine / Module</th>
              <th className="px-6 py-3.5 font-semibold w-[20%]">Architecture</th>
              <th className="px-6 py-3.5 font-semibold w-[37%]">Core Capability & Signal</th>
              <th className="px-6 py-3.5 font-semibold text-right w-[15%]">Telemetry</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((item: any, index: number) => (
              <tr
                key={`${item.client}-${index}`}
                className="transition-colors hover:bg-white/[0.04] group cursor-default"
              >
                <td className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-100 group-hover:text-emerald-400 transition-colors">
                  {item.client}
                </td>

                <td className="px-6 py-4 text-xs font-medium uppercase tracking-wider">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
                    {item.platform}
                  </span>
                </td>

                <td className="px-6 py-4 text-xs tracking-normal text-zinc-300 group-hover:text-zinc-100 leading-relaxed">
                  {item.services}
                </td>

                <td className="px-6 py-4 text-right text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[10px] text-cyan-300">
                    {item.metric || "ACTIVE"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InteractiveListPreview;
