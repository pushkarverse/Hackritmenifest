'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  Camera, 
  Video, 
  Play, 
  ShieldCheck, 
  Zap, 
  BarChart2, 
  Layers, 
  ChevronDown,
  TrendingUp,
  Cpu,
  SlidersHorizontal,
  Workflow,
  Search,
  CheckCircle2,
  Atom,
  BrainCircuit
} from 'lucide-react';
import { AnalysisTransition } from '@/components/AnalysisTransition';
import InteractiveListPreview from '@/components/ui/interactive-list-preview';

export default function LaunchpadPage() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [limit, setLimit] = useState<number>(12);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModuleDropdownOpen, setIsModuleDropdownOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<'all' | 'dna' | 'agents' | 'blueprint' | 'radar'>('all');

  const analyzerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const moduleDropdownRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (moduleDropdownRef.current && !moduleDropdownRef.current.contains(event.target as Node)) {
        setIsModuleDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const scrollToSection = (elementRef: React.RefObject<HTMLDivElement | null>) => {
    setIsDropdownOpen(false);
    setIsModuleDropdownOpen(false);
    elementRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const detectPlatform = (inputUrl: string) => {
    const clean = inputUrl.toLowerCase();
    if (clean.includes('tiktok')) return 'TikTok';
    if (clean.includes('youtube') || clean.includes('youtu.be')) return 'YouTube';
    return 'Instagram';
  };

  const handleAnalyze = (targetUrl?: string) => {
    const link = targetUrl || url;
    if (!link || link.trim() === '') {
      setErrorMessage('Please enter a public social media link or creator handle.');
      return;
    }
    setErrorMessage('');
    setIsAnalyzing(true);
  };

  const handleAnalysisComplete = () => {
    const cleanUrl = encodeURIComponent(url.trim());
    router.push(`/intelligence?url=${cleanUrl}&limit=${limit}`);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fcfcf9] selection:bg-white/20">
      {/* Background Decorative Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-white/[0.05] to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Top Navigation Bar */}
      <header className="border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center font-bold text-white tracking-tighter font-display">
              C<span className="text-emerald-400">OS</span>
            </div>
            <span className="font-display font-bold text-lg tracking-tight">ContentOS</span>
            <span className="badge badge-emerald hidden sm:inline-flex text-[10px]">v2.4 Intelligence</span>
          </div>

          <nav className="flex items-center gap-4 sm:gap-6 text-sm">
            <Link href="/dashboard" className="text-zinc-400 hover:text-white transition-colors hidden md:inline-block">Dashboard</Link>
            <Link href="/intelligence" className="text-zinc-400 hover:text-white transition-colors hidden md:inline-block">Content DNA</Link>
            <Link href="/radar" className="text-zinc-400 hover:text-white transition-colors hidden md:inline-block">Trend Radar</Link>
            <Link href="/campaigns" className="text-zinc-400 hover:text-white transition-colors hidden md:inline-block">Campaigns</Link>
            
            {/* Reactive Dropdown Navigation Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-tl-xl rounded-tr-sm rounded-br-xl rounded-bl-sm bg-[#12131b] border border-white/20 hover:border-emerald-400/50 text-xs font-mono text-zinc-200 transition-all shadow-md active:scale-95"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="tracking-wide">System Menu</span>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-emerald-400' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-80 rounded-tl-[24px] rounded-tr-[8px] rounded-br-[28px] rounded-bl-[10px] bg-[#090a0f] border border-white/20 border-t-white/30 border-l-emerald-500/40 shadow-[0_24px_60px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.1)] p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* Subtle Irregular Header */}
                  <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400">ContentOS Index</span>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-tl-md rounded-br-md bg-white/10 text-zinc-300 border border-white/10">v2.4 Live</span>
                  </div>
                  
                  {/* Irregular Item 01: Hero Ingestion Card */}
                  <button
                    onClick={() => scrollToSection(analyzerRef)}
                    className="w-full text-left p-3 mb-2 rounded-tl-2xl rounded-tr-md rounded-br-lg rounded-bl-sm bg-[#12131d] border border-white/10 hover:border-emerald-400/50 hover:bg-[#181a27] transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Search className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">01. URL Reverse-Engineer</span>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">HOOKS</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-tight">Deconstruct 3s hooks, audio BPM & public creator metrics.</p>
                  </button>

                  {/* Asymmetric Dual Split: Items 02 & 03 */}
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <button
                      onClick={() => scrollToSection(previewRef)}
                      className="text-left p-2.5 rounded-tl-sm rounded-tr-xl rounded-br-sm rounded-bl-xl bg-[#11121a] border border-white/10 hover:border-cyan-400/50 hover:bg-[#161824] transition-all group flex flex-col justify-between"
                    >
                      <div className="flex items-center gap-1.5 text-cyan-400 mb-1.5">
                        <Atom className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-mono tracking-tight text-zinc-400">[02]</span>
                      </div>
                      <span className="text-xs font-semibold text-white group-hover:text-cyan-300 leading-snug">Core Modules</span>
                      <span className="text-[10px] text-zinc-400 mt-1">Interactive Hover Preview</span>
                    </button>

                    <button
                      onClick={() => scrollToSection(processRef)}
                      className="text-left p-2.5 rounded-tl-xl rounded-tr-sm rounded-br-xl rounded-bl-sm bg-[#11121a] border border-white/10 hover:border-amber-400/50 hover:bg-[#161824] transition-all group flex flex-col justify-between"
                    >
                      <div className="flex items-center gap-1.5 text-amber-400 mb-1.5">
                        <Workflow className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-mono tracking-tight text-zinc-400">[03]</span>
                      </div>
                      <span className="text-xs font-semibold text-white group-hover:text-amber-300 leading-snug">Operating Loop</span>
                      <span className="text-[10px] text-zinc-400 mt-1">From URL to Blueprint</span>
                    </button>
                  </div>

                  {/* Irregular Offset Footer Items */}
                  <div className="space-y-1.5 pt-1 border-t border-white/10">
                    <Link
                      href="/demo"
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full text-left px-3 py-2 rounded-tl-full rounded-br-full rounded-tr-md rounded-bl-md bg-[#13141f] border border-amber-500/20 hover:border-amber-400/60 hover:bg-[#1a1b2a] flex items-center justify-between text-xs font-mono text-amber-300 transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                        <span>⚡ Mock Data Lab</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20 -rotate-1">TEST</span>
                    </Link>

                    <Link
                      href="/brain"
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full text-left px-3 py-2 rounded-tl-md rounded-tr-lg rounded-br-2xl rounded-bl-xl bg-[#11121a] border border-white/10 hover:border-purple-400/50 hover:bg-[#171825] flex items-center justify-between text-xs font-mono text-zinc-300 hover:text-white transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <BrainCircuit className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
                        <span>Brand Persona Brain</span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/demo" className="text-amber-400 hover:text-amber-300 transition-colors font-mono text-xs hidden sm:flex items-center gap-1">
              ⚡ Demo Lab
            </Link>
            <Link href="/dashboard" className="btn-vanilla !py-1.5 !px-3.5 !text-xs">
              Enter Workspace
            </Link>
          </nav>
        </div>
      </header>

      {/* CLEAN & PROFESSIONAL HERO SECTION */}
      <section className="relative w-full border-b border-white/10 overflow-hidden py-16 sm:py-24 px-6 bg-gradient-to-b from-[#09090b] via-[#0d0d11] to-[#09090b]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>CONTENTOS v2.4 — REVERSE-ENGINEER COMPETITOR CONTENT DNA</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight text-white leading-[1.15]">
            Turn Public Social Content into an{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-white to-cyan-300">
              Unfair Growth Engine
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Deconstruct 3-second hooks, audio BPM pacing, psychological triggers, and real engagement velocity—synthesizing high-retention organic and paid playbooks.
          </p>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => scrollToSection(analyzerRef)}
              className="btn-vanilla !py-3 !px-6 text-sm font-semibold shadow-xl hover:scale-105 transition-all"
            >
              Analyze Public URL <ArrowRight className="w-4 h-4 ml-1" />
            </button>
            <button
              onClick={() => scrollToSection(previewRef)}
              className="btn-ghost !py-3 !px-6 text-sm font-mono bg-white/5 hover:bg-white/10"
            >
              Explore Core Modules ↓
            </button>
          </div>
        </div>
      </section>

      {/* INTERACTIVE COMPONENT PREVIEW SHOWCASE */}
      <section ref={previewRef} className="w-full border-b border-white/10 py-16 px-4 sm:px-6 bg-[#0d0d11]">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest mb-1">
                <Atom className="w-3.5 h-3.5" />
                <span>Live System Telemetry</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                Core Operating Engine Deconstruction
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mt-1">
                Inspect how ContentOS connects real-time observed public telemetry into generative creative production.
              </p>
            </div>

            {/* Interactive Irregular Dropdown Filter Selector */}
            <div className="flex items-center gap-2 relative" ref={moduleDropdownRef}>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsModuleDropdownOpen(!isModuleDropdownOpen)}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-tl-2xl rounded-tr-sm rounded-br-2xl rounded-bl-sm bg-[#12131d] border border-white/20 hover:border-cyan-400/50 text-xs font-mono text-zinc-200 transition-all shadow-lg active:scale-95"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span className="tracking-wide">
                    {selectedModule === 'all' && 'All Core Modules'}
                    {selectedModule === 'dna' && '01 // Content DNA'}
                    {selectedModule === 'agents' && '02 // Agent Swarm'}
                    {selectedModule === 'blueprint' && '03 // Growth Blueprint'}
                    {selectedModule === 'radar' && '04 // Trend Radar'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-300 ${isModuleDropdownOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                </button>

                {isModuleDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-72 rounded-tl-[22px] rounded-tr-[6px] rounded-br-[26px] rounded-bl-[10px] bg-[#0a0b10] border border-white/20 border-t-white/30 border-l-cyan-400/40 shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.1)] p-2.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-white/10 mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Filter Engine</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">Reactive</span>
                    </div>

                    <div className="space-y-1.5">
                      {[
                        { id: 'all', label: 'All 5 Core Engines', code: 'FULL' },
                        { id: 'dna', label: 'Content DNA Engine', code: 'DNA' },
                        { id: 'agents', label: 'AI Agent Swarm', code: 'LLM' },
                        { id: 'blueprint', label: 'Growth Blueprint', code: '7-DAY' },
                        { id: 'radar', label: 'Opportunity Radar', code: 'RADAR' },
                      ].map((item, idx) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setSelectedModule(item.id as any);
                            setIsModuleDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs font-mono transition-all ${
                            idx % 2 === 0
                              ? 'rounded-tl-xl rounded-tr-sm rounded-br-lg rounded-bl-sm'
                              : 'rounded-tl-sm rounded-tr-xl rounded-br-sm rounded-bl-lg'
                          } ${
                            selectedModule === item.id
                              ? 'bg-[#181a29] text-white border border-cyan-400/50 shadow-md font-semibold'
                              : 'bg-[#101118] text-zinc-400 hover:text-white hover:bg-[#151722] border border-white/5'
                          }`}
                        >
                          <span className="truncate">{item.label}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400">
                            {item.code}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => scrollToSection(analyzerRef)}
                className="px-3.5 py-2 rounded-tl-sm rounded-tr-xl rounded-br-sm rounded-bl-xl bg-[#12131d] border border-emerald-500/30 hover:border-emerald-400 text-xs font-mono text-emerald-400 hover:bg-emerald-500/10 transition-all shadow-sm"
              >
                Launch URL Analysis →
              </button>
            </div>
          </div>

          {/* InteractiveListPreview Component inside Irregular Solid-Opacity Frame */}
          <div className="rounded-tl-[32px] rounded-tr-[12px] rounded-br-[36px] rounded-bl-[14px] border border-white/15 border-t-white/30 border-l-cyan-500/30 overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.95)] bg-[#090a0f]">
            <InteractiveListPreview
              bgColor="#090a0f"
              imageSize={1.1}
              smoothness={0.3}
              className="py-4"
            />
          </div>
        </div>
      </section>

      {/* URL ANALYZER LAUNCHPAD SECTION */}
      <main ref={analyzerRef} className="max-w-6xl mx-auto px-6 pt-16 pb-24 flex flex-col items-center text-center">
        
        <div className="mb-8 max-w-2xl">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Public Extraction Engine</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mt-1">
            Input Competitor Handle or Post URL
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            No login credentials required. Analyzes public Instagram reels, TikTok videos, and YouTube Shorts safely.
          </p>
        </div>

        {/* Interactive Analyzer Input Card */}
        <div className="w-full max-w-3xl velvet-card p-4 sm:p-6 shadow-2xl relative mb-8 border border-white/15">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                {detectPlatform(url) === 'TikTok' ? (
                  <Video className="w-5 h-5 text-cyan-400" />
                ) : detectPlatform(url) === 'YouTube' ? (
                  <Play className="w-5 h-5 text-rose-500" />
                ) : (
                  <Camera className="w-5 h-5 text-pink-400" />
                )}
              </div>
              <input
                type="text"
                placeholder="Paste public link (e.g. instagram.com/glowrecipe or @notionhq)..."
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setErrorMessage('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAnalyze();
                }}
                className="w-full pl-12 pr-4 py-3.5 rounded-lg bg-black/60 border border-white/10 text-white placeholder-zinc-500 font-sans text-sm focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all"
              />
            </div>
            
            <button
              onClick={() => handleAnalyze()}
              className="btn-vanilla !py-3.5 !px-6 text-sm font-semibold justify-center shadow-lg hover:shadow-white/10 shrink-0"
            >
              Analyze Content DNA <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          {/* 1-Click Competitor Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-3 mt-2 border-t border-white/5 text-xs">
            <span className="text-zinc-500 font-mono text-[11px]">TRY COMPETITOR:</span>
            {[
              { label: '@glowrecipe (D2C Skincare)', target: 'https://instagram.com/glowrecipe' },
              { label: '@gymshark (Fitness)', target: 'https://instagram.com/gymshark' },
              { label: '@notionhq (SaaS)', target: 'https://instagram.com/notionhq' },
              { label: '@zomato (Food/Viral)', target: 'https://instagram.com/zomato' },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setUrl(preset.target);
                  setErrorMessage('');
                  handleAnalyze(preset.target);
                }}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 border border-white/10 text-zinc-300 hover:text-emerald-300 font-mono text-[11px] transition-all"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Data Extraction Limit Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 mt-3 border-t border-white/5 text-xs">
            <div className="flex items-center gap-2 text-zinc-400 font-mono text-[11px]">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
              <span>EXTRACTION DEPTH:</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { count: 5, label: '5 Posts (Fast)' },
                { count: 12, label: '12 Posts (Feed)' },
                { count: 25, label: '25 Posts (Deep Audit)' },
                { count: 50, label: '50 Posts (Exhaustive)' },
              ].map(preset => (
                <button
                  key={preset.count}
                  type="button"
                  onClick={() => setLimit(preset.count)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all ${
                    limit === preset.count
                      ? 'bg-white text-black font-semibold shadow'
                      : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {preset.label}
                </button>
              ))}

              <div className="flex items-center gap-1 pl-1">
                <span className="text-zinc-500 text-[10px] font-mono">Custom:</span>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={limit}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val)) setLimit(Math.max(1, Math.min(val, 100)));
                  }}
                  className="w-12 px-1.5 py-0.5 rounded bg-black/80 border border-white/10 text-white font-mono text-center text-[11px] focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="text-rose-400 text-xs text-left mt-2.5 font-mono">
              ⚠ {errorMessage}
            </div>
          )}
        </div>

        {/* Live System Metric Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-zinc-400 pt-2 mb-20">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            100% Policy-Safe Public Ingestion
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            400ms Hook Velocity Scoring
          </span>
          <span className="flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-cyan-400" />
            Observed vs AI Provenance Demarcation
          </span>
        </div>

        {/* 4-Step Process Section */}
        <section ref={processRef} className="w-full max-w-5xl text-left mb-24">
          <div className="mb-10 text-center">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">End-to-End Operating Loop</span>
            <h2 className="text-3xl font-display font-bold text-white mt-1">
              From Public URL to Production-Ready Blueprint
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="velvet-card p-5 relative">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-mono font-bold text-sm text-zinc-300 mb-4">
                01
              </div>
              <h3 className="font-display font-semibold text-white text-base mb-2">
                Public Extraction
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Connects to public social endpoints, retrieving the latest 4-5 media items, captions, and verified engagement rates.
              </p>
            </div>

            <div className="velvet-card p-5 relative">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-mono font-bold text-sm text-zinc-300 mb-4">
                02
              </div>
              <h3 className="font-display font-semibold text-white text-base mb-2">
                Content DNA Engine
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Deconstructs 3-second hook structures, audio BPM pacing, psychological triggers, and statistical outperformance multipliers.
              </p>
            </div>

            <div className="velvet-card p-5 relative">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-mono font-bold text-sm text-zinc-300 mb-4">
                03
              </div>
              <h3 className="font-display font-semibold text-white text-base mb-2">
                Brand Persona Fusion
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Map winning patterns against your specific startup, ICP audience desires, core product value props, and voice tone.
              </p>
            </div>

            <div className="velvet-card p-5 relative">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-sm text-emerald-400 mb-4">
                04
              </div>
              <h3 className="font-display font-semibold text-white text-base mb-2">
                Actionable Blueprint
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Receive 5 tailored video hook scripts, a 7-day organic calendar, and conversion-focused paid ad angles ready for studio export.
              </p>
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-16">
          <div className="evidence-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart2 className="w-5 h-5 text-emerald-400" />
              <h3 className="font-display font-bold text-white text-lg">Statistical Outperformance</h3>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              Replace gut feeling with statistical rigor. Identify formats and hooks that beat industry median baselines by 2.4×.
            </p>
            <Link href="/intelligence" className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1">
              Explore Content DNA →
            </Link>
          </div>

          <div className="evidence-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Layers className="w-5 h-5 text-amber-400" />
              <h3 className="font-display font-bold text-white text-lg">Company Brand Brain</h3>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              Enforce strict brand rules, negative claims, and audience personas to guarantee generated content matches your identity.
            </p>
            <Link href="/brain" className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1">
              Manage Brand Rules →
            </Link>
          </div>

          <div className="evidence-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h3 className="font-display font-bold text-white text-lg">Opportunity Radar</h3>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              Surface rising industry topics and high commercial-intent trends before your competitors saturate the algorithm.
            </p>
            <Link href="/radar" className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1">
              View Trend Signals →
            </Link>
          </div>
        </section>
      </main>

      {/* Simulated High-Tech Analysis Transition Modal */}
      {isAnalyzing && (
        <AnalysisTransition 
          url={url} 
          limit={limit} 
          onComplete={handleAnalysisComplete} 
        />
      )}
    </div>
  );
}
