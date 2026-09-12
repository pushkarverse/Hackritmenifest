'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  Calendar, 
  Target, 
  ShieldAlert, 
  Megaphone, 
  Video, 
  Clock, 
  ChevronRight,
  TrendingUp,
  Sliders,
  Layers,
  Flame,
  ArrowRight
} from 'lucide-react';
import { GrowthBlueprint, UserBrandInput } from '@/lib/intelligence/blueprint';
import Link from 'next/link';

function BlueprintContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const competitorUrl = searchParams.get('competitorUrl') || 'https://instagram.com/glowrecipe';
  const competitorHandle = searchParams.get('handle') || 'inspiration';
  const limitParam = parseInt(searchParams.get('limit') || '12', 10) || 12;

  // Brand Inputs State
  const [brandInput, setBrandInput] = useState<UserBrandInput>({
    brandName: 'Aura Skincare',
    industry: 'Clean D2C Beauty',
    targetAudience: 'Skincare enthusiasts seeking clinical barrier repair without harsh chemicals',
    valueProposition: '100% bio-compatible hydration formulated by dermatologists',
    toneOfVoice: 'Science-backed, transparent, warm, and authoritative',
    primaryProduct: 'Ceramide Barrier Recovery Serum'
  });

  const [blueprint, setBlueprint] = useState<GrowthBlueprint | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUserEdited, setIsUserEdited] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'hooks' | 'calendar' | 'ads' | 'pillars'>('hooks');

  const generateBlueprint = async (customBrand?: UserBrandInput) => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competitorUrl,
          competitorHandle,
          limit: limitParam,
          brandInput: customBrand || brandInput
        })
      });
      const data = await res.json();
      if (data.success && data.blueprint) {
        setBlueprint(data.blueprint);
        if (data.blueprint.brandInput && !isUserEdited) {
          setBrandInput(data.blueprint.brandInput);
        }
      }
    } catch (err) {
      console.error('Failed to generate blueprint:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    // Generate initial blueprint
    generateBlueprint();
  }, [competitorUrl, competitorHandle]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto p-4 sm:p-6 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-emerald text-[11px] font-mono">AI STRATEGY SYNTHESIZER</span>
            <span className="text-zinc-500 text-xs font-mono">• Grounded in @{competitorHandle} DNA</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Original Growth Blueprint
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/intelligence?url=${encodeURIComponent(competitorUrl)}`} className="btn-ghost !py-2 !px-3.5 !text-xs">
            ← Back to Content DNA
          </Link>
          <Link href="/studio" className="btn-vanilla !py-2 !px-4 !text-xs shadow-md">
            Open Content Studio
          </Link>
        </div>
      </div>

      {/* Brand Tuning Form (Collapsible/Accordion or Top Card) */}
      <div className="velvet-card p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-bold text-white font-display">
              Configure Your Startup / Brand Identity
            </h2>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            Engine fuses competitor mechanics with your unique IP
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">Brand Name</label>
            <input
              type="text"
              value={brandInput.brandName}
              onChange={(e) => { setIsUserEdited(true); setBrandInput({ ...brandInput, brandName: e.target.value }); }}
              className="input-velvet !py-2 !text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">Industry / Category</label>
            <input
              type="text"
              value={brandInput.industry}
              onChange={(e) => { setIsUserEdited(true); setBrandInput({ ...brandInput, industry: e.target.value }); }}
              className="input-velvet !py-2 !text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">Flagship Product</label>
            <input
              type="text"
              value={brandInput.primaryProduct}
              onChange={(e) => { setIsUserEdited(true); setBrandInput({ ...brandInput, primaryProduct: e.target.value }); }}
              className="input-velvet !py-2 !text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">Target Audience (ICP)</label>
            <input
              type="text"
              value={brandInput.targetAudience}
              onChange={(e) => { setIsUserEdited(true); setBrandInput({ ...brandInput, targetAudience: e.target.value }); }}
              className="input-velvet !py-2 !text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">Core Value Proposition</label>
            <input
              type="text"
              value={brandInput.valueProposition}
              onChange={(e) => { setIsUserEdited(true); setBrandInput({ ...brandInput, valueProposition: e.target.value }); }}
              className="input-velvet !py-2 !text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">Tone of Voice</label>
            <input
              type="text"
              value={brandInput.toneOfVoice}
              onChange={(e) => { setIsUserEdited(true); setBrandInput({ ...brandInput, toneOfVoice: e.target.value }); }}
              className="input-velvet !py-2 !text-xs"
            />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
          <button
            onClick={() => generateBlueprint()}
            disabled={isGenerating}
            className="btn-vanilla !py-2 !px-4 !text-xs flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                Regenerating Blueprint...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                Update Strategy Engine
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Blueprint Output */}
      {blueprint && (
        <>
          {/* Executive Diagnosis */}
          <div className="evidence-card p-6 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold uppercase">
              <Target className="w-4 h-4" /> Strategic Competitive Synthesis
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="metric-well p-4 space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold">Observed Competitor Moat</span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {blueprint.executiveDiagnosis.competitorWinningEdge}
                </p>
              </div>

              <div className="metric-well p-4 space-y-1.5 border-emerald-500/30 bg-emerald-950/10">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Your Brand Opportunity Gap</span>
                <p className="text-xs text-zinc-200 leading-relaxed">
                  {blueprint.executiveDiagnosis.brandOpportunityGap}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-xs text-zinc-300 font-sans">
              <strong className="font-mono text-emerald-400 uppercase text-[11px]">Verdict:</strong>
              <span>{blueprint.executiveDiagnosis.strategicVerdict}</span>
            </div>
          </div>

          {/* Navigation Tabs for Deliverables */}
          <div className="flex items-center gap-2 border-b border-white/5 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('hooks')}
              className={`px-4 py-2 rounded-lg text-xs font-medium font-mono transition-all flex items-center gap-2 ${
                activeTab === 'hooks' ? 'bg-white text-black font-bold shadow' : 'text-zinc-400 hover:text-white bg-white/[0.02]'
              }`}
            >
              <Video className="w-3.5 h-3.5" /> 5 Original Video Hooks
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-4 py-2 rounded-lg text-xs font-medium font-mono transition-all flex items-center gap-2 ${
                activeTab === 'calendar' ? 'bg-white text-black font-bold shadow' : 'text-zinc-400 hover:text-white bg-white/[0.02]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> 7-Day Organic Calendar
            </button>
            <button
              onClick={() => setActiveTab('ads')}
              className={`px-4 py-2 rounded-lg text-xs font-medium font-mono transition-all flex items-center gap-2 ${
                activeTab === 'ads' ? 'bg-white text-black font-bold shadow' : 'text-zinc-400 hover:text-white bg-white/[0.02]'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5" /> Paid Ad Angles
            </button>
            <button
              onClick={() => setActiveTab('pillars')}
              className={`px-4 py-2 rounded-lg text-xs font-medium font-mono transition-all flex items-center gap-2 ${
                activeTab === 'pillars' ? 'bg-white text-black font-bold shadow' : 'text-zinc-400 hover:text-white bg-white/[0.02]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Content Pillars
            </button>
          </div>

          {/* Tab 1: 5 Original Video Hooks */}
          {activeTab === 'hooks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white font-display">5 Ready-to-Record Video Hooks</h3>
                  <p className="text-xs text-zinc-400">
                    High-retention script blueprints engineered for {brandInput.brandName}.
                  </p>
                </div>
                <span className="badge badge-emerald text-xs">Algorithmic Win Optimized</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {blueprint.originalHooks.map((hook, idx) => (
                  <div key={hook.id || idx} className="velvet-card p-5 space-y-4 hover:border-white/20 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-mono font-bold text-white">
                          0{idx + 1}
                        </span>
                        <div>
                          <h4 className="font-display font-bold text-white text-sm">{hook.title}</h4>
                          <span className="text-[11px] font-mono text-zinc-400">{hook.suggestedFormat}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="badge badge-emerald text-[11px]">{hook.estimatedWinRate}</span>
                        <button
                          onClick={() => handleCopy(`${hook.hookHeadline}\n\nVisual Cue: ${hook.visualCue}\n\nOutline: ${hook.scriptOutline}\n\nCTA: ${hook.callToAction}`, hook.id)}
                          className="btn-ghost !p-2 !text-xs"
                          title="Copy Hook Script"
                        >
                          {copiedId === hook.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="bg-black/40 border border-white/5 rounded-lg p-4 space-y-2">
                      <div className="text-[10px] font-mono uppercase text-zinc-500 font-bold tracking-wider">
                        0–3 SECOND VERBAL HOOK
                      </div>
                      <p className="text-base font-semibold text-emerald-300 font-display">
                        {hook.hookHeadline}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="metric-well p-3 space-y-1">
                        <span className="text-[10px] font-mono uppercase text-zinc-500">Frame 1 Visual Pattern Interrupt</span>
                        <p className="text-zinc-200">{hook.visualCue}</p>
                      </div>
                      <div className="metric-well p-3 space-y-1">
                        <span className="text-[10px] font-mono uppercase text-zinc-500">Psychological Driver</span>
                        <p className="text-zinc-200">{hook.underlyingPsychology}</p>
                      </div>
                    </div>

                    <div className="text-xs text-zinc-300 bg-white/[0.02] border border-white/5 rounded p-3 space-y-1">
                      <strong className="font-mono text-zinc-400 text-[10px] uppercase block">Script Flow Outline:</strong>
                      <p className="leading-relaxed">{hook.scriptOutline}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-zinc-400 font-mono text-[11px]">
                        <strong>CTA:</strong> {hook.callToAction}
                      </span>
                      <Link 
                        href={`/studio?script=${encodeURIComponent(hook.hookHeadline)}`}
                        className="text-emerald-400 hover:underline font-mono text-[11px] flex items-center gap-1"
                      >
                        Draft in Studio →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: 7-Day Organic Calendar */}
          {activeTab === 'calendar' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white font-display">7-Day Organic Execution Calendar</h3>
                  <p className="text-xs text-zinc-400">
                    A balanced cadence of top-of-funnel reach, high-intent saves, and conversion triggers.
                  </p>
                </div>
                <span className="badge badge-velvet text-xs font-mono">Week 1 Sprint</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {blueprint.sevenDayCalendar.map((item, idx) => (
                  <div key={idx} className="velvet-card p-4 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                        <span className="font-mono font-bold text-emerald-400 text-sm">{item.day}</span>
                        <span className="badge badge-amber text-[10px]">{item.targetMetric}</span>
                      </div>
                      <h4 className="font-display font-semibold text-white text-xs mb-1">{item.theme}</h4>
                      <p className="text-xs text-zinc-400 font-mono mb-2">{item.format}</p>
                      
                      <div className="bg-black/30 p-2.5 rounded border border-white/5 mb-3 text-xs text-zinc-200 italic">
                        "{item.hookHeadline}"
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 text-[11px] text-zinc-400">
                      <strong className="text-zinc-300 block mb-0.5">Production Notes:</strong>
                      {item.productionNotes}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Paid Ad Angles */}
          {activeTab === 'ads' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white font-display">Conversion Paid Ad Angles</h3>
                  <p className="text-xs text-zinc-400">
                    Synthesized for Meta Ads & TikTok Spark Ads based on competitor top-converting hooks.
                  </p>
                </div>
                <span className="badge badge-emerald text-xs">ROAS Optimized</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {blueprint.adAngles.map((ad, idx) => (
                  <div key={idx} className="velvet-card p-5 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="badge badge-cyan text-[10px]">Variant #{idx + 1}</span>
                        <span className="text-[11px] font-mono text-zinc-500 truncate max-w-[120px]">{ad.targetAudienceSegment}</span>
                      </div>
                      <h4 className="font-display font-bold text-white text-sm">{ad.angleName}</h4>
                      
                      <div className="bg-black/40 p-3 rounded border border-white/5 space-y-1">
                        <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold">AD HOOK COPY</span>
                        <p className="text-xs font-medium text-emerald-300">{ad.hookCopy}</p>
                      </div>

                      <div className="text-xs text-zinc-300 space-y-1">
                        <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold">Visual Script & Angle</span>
                        <p className="leading-relaxed">{ad.bodyVisualScript}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                      <span className="font-mono text-zinc-400 font-bold">{ad.callToAction}</span>
                      <Link href="/campaigns" className="text-xs text-cyan-400 hover:underline">
                        Deploy Ad →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Content Pillars */}
          {activeTab === 'pillars' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white font-display">Strategic Content Pillars</h3>
                  <p className="text-xs text-zinc-400">
                    Allocation weights engineered to balance brand authority, viral reach, and bottom-line conversions.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blueprint.contentPillars.map((pillar, idx) => (
                  <div key={idx} className="velvet-card p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-bold text-white text-base">{pillar.title}</h4>
                      <span className="badge badge-emerald font-mono text-xs">{pillar.weightPercentage}% Weight</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">{pillar.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-zinc-400 font-mono">
                      <span>Target Cadence: {pillar.recommendedFrequency}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Guardrails and Anti-Patterns */}
          <div className="velvet-card p-5 border-amber-500/20 bg-amber-950/10 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
              <ShieldAlert className="w-4 h-4" /> Algorithmic Guardrails & Anti-Patterns
            </div>
            <ul className="space-y-2 text-xs text-zinc-300">
              {blueprint.guardrailsAndAntiPatterns.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default function GrowthBlueprintPage() {
  return (
    <Suspense fallback={
      <div className="p-12 text-center text-zinc-400 font-mono text-xs">
        Loading AI Growth Blueprint Synthesizer...
      </div>
    }>
      <BlueprintContent />
    </Suspense>
  );
}
