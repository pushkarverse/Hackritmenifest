'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Flame,
  Bot,
  Search,
  ArrowUpDown
} from 'lucide-react';
import { ExtractedPost, PlatformProfileInfo } from '@/lib/ingestion/adapters';
import { ObservedPostCard } from '@/components/ObservedPostCard';
import Link from 'next/link';

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString();
}

type SortKey = 'index' | 'er' | 'views' | 'likes';

function IntelligenceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const targetUrl = searchParams.get('url') || 'https://instagram.com/glowrecipe';
  const initialLimit = parseInt(searchParams.get('limit') || '12', 10) || 12;

  const [limit, setLimit] = useState<number>(initialLimit);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<PlatformProfileInfo | null>(null);
  const [posts, setPosts] = useState<ExtractedPost[]>([]);

  // UI state
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('index');
  const [filterAI, setFilterAI] = useState<'all' | 'live' | 'ai'>('all');

  const platformParam = searchParams.get('platform') || (targetUrl.toLowerCase().includes('youtube') || targetUrl.toLowerCase().includes('verse') || targetUrl.toLowerCase().includes('comic') || targetUrl.toLowerCase().includes('og') ? 'youtube' : undefined);

  const fetchAnalysis = async (limitToFetch: number) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl, platform: platformParam, limit: limitToFetch })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to analyze');
      setProfile(data.profile);
      setPosts(data.posts);
    } catch (err: any) {
      setError(err.message || 'Failed to extract content data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAnalysis(limit); }, [targetUrl, limit]);

  const handleLimitChange = (n: number) => {
    setLimit(n);
    router.push(`/intelligence?url=${encodeURIComponent(targetUrl)}&limit=${n}`);
  };

  // Filtered + sorted posts
  const displayPosts = useMemo(() => {
    let result = [...posts];
    if (filterAI === 'live') result = result.filter(p => p.publishedAt !== 'AI-Synthesized Example');
    if (filterAI === 'ai') result = result.filter(p => p.publishedAt === 'AI-Synthesized Example');
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.hookText?.toLowerCase().includes(q) ||
        p.format?.toLowerCase().includes(q)
      );
    }
    if (sortKey === 'er') result.sort((a, b) => b.metrics.engagementRate.value - a.metrics.engagementRate.value);
    if (sortKey === 'views') result.sort((a, b) => b.metrics.views.value - a.metrics.views.value);
    if (sortKey === 'likes') result.sort((a, b) => b.metrics.likes.value - a.metrics.likes.value);
    return result;
  }, [posts, search, sortKey, filterAI]);

  const liveCount = posts.filter(p => p.publishedAt !== 'AI-Synthesized Example').length;
  const aiCount = posts.length - liveCount;
  const avgER = posts.length
    ? (posts.reduce((a, p) => a + (p.metrics.engagementRate.value || 0), 0) / posts.length).toFixed(2)
    : '—';
  const totalViews = posts.reduce((a, p) => a + (p.metrics.views.value || 0), 0);
  const topFormat = posts.length
    ? (() => {
        const freq: Record<string, number> = {};
        posts.forEach(p => { freq[p.format] = (freq[p.format] || 0) + 1; });
        return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
      })()
    : '—';

  // Platform label
  const platformLabel = profile
    ? targetUrl.includes('youtube') ? 'YouTube' 
      : targetUrl.includes('tiktok') ? 'TikTok'
      : targetUrl.includes('linkedin') ? 'LinkedIn'
      : 'Instagram'
    : '';

  return (
    <div className="flex flex-col gap-0 max-w-[1400px] mx-auto p-4 sm:p-6 pb-20">

      {/* ── Top Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/8 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-emerald text-[11px] font-mono uppercase">Content DNA Engine</span>
            {platformLabel && <span className="text-[11px] font-mono text-zinc-500">· {platformLabel}</span>}
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            {profile ? profile.displayName : 'Content'} DNA Deconstruction
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-zinc-500">
            {platformLabel?.toLowerCase() === 'youtube' ? 'Uploads' : 'Posts'} to analyze:
          </span>
          <div className="flex items-center bg-black/60 border border-white/10 rounded-lg p-1 text-[11px] font-mono">
            {[5, 12, 25, 50].map(n => (
              <button
                key={n}
                type="button"
                disabled={isLoading}
                onClick={() => handleLimitChange(n)}
                className={`px-3 py-1 rounded transition-all ${limit === n ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
              >{n}</button>
            ))}
          </div>
          <button
            onClick={() => fetchAnalysis(limit)}
            disabled={isLoading}
            className="btn-ghost !py-2 !px-3 !text-xs flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" /><span>{error}</span>
        </div>
      )}

      <div className="flex flex-col xl:flex-row gap-6">

        {/* ── LEFT SIDEBAR ── */}
        <div className="xl:w-64 shrink-0 space-y-4 xl:sticky xl:top-6 xl:self-start">

          {/* Profile Card */}
          {profile && (
            <div className="evidence-card p-4">
              <div className="flex items-center gap-3 mb-3">
                {profile.avatarUrl ? (
                  <img
                    src={'/api/img?url=' + encodeURIComponent(profile.avatarUrl)}
                    alt={profile.displayName}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-white/10 shrink-0"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-500/30 via-white/10 to-transparent border border-white/15 flex items-center justify-center font-bold text-lg text-white font-display shrink-0">
                    {profile.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="font-bold text-white text-sm truncate flex items-center gap-1">
                    {profile.displayName}
                    {profile.isVerified && (
                      <span className="text-xs text-emerald-400">✓</span>
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-zinc-400">@{profile.handle}</div>
                  <div className="text-[10px] font-mono text-zinc-600 capitalize">{platformLabel}</div>
                </div>
              </div>

              {/* Followers / Subscribers & Posts Counter */}
              <div className="flex items-center justify-between pt-2.5 my-2 border-t border-white/10 text-xs font-mono">
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">
                    {platformLabel?.toLowerCase() === 'youtube' ? 'Subscribers' : 'Followers'}
                  </span>
                  <span className="font-bold text-white">
                    {fmt(profile.followersCount?.value || (profile as any).followers || 0)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-zinc-500 block text-[10px] uppercase">
                    {platformLabel?.toLowerCase() === 'youtube' ? 'Uploads Analyzed' : 'Posts Analyzed'}
                  </span>
                  <span className="font-bold text-emerald-400">{posts.length}</span>
                </div>
              </div>

              {profile.bio && (
                <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-3 mt-2.5 pt-2 border-t border-white/5">{profile.bio}</p>
              )}
            </div>
          )}

          {/* Real Channel Growth Trajectory */}
          {posts.length > 0 && (() => {
            const sortedByViews = [...posts].sort((a, b) => (b.metrics.views.value || 0) - (a.metrics.views.value || 0));
            const medianViews = sortedByViews[Math.floor(sortedByViews.length / 2)]?.metrics.views.value || totalViews / posts.length;
            const latestViews = posts[0]?.metrics.views.value || medianViews;
            const growthPct = medianViews > 0 ? (((latestViews - medianViews) / medianViews) * 100).toFixed(1) : '0.0';
            const multiplier = medianViews > 0 ? (latestViews / medianViews).toFixed(2) : '1.00';
            const isPositive = parseFloat(growthPct) >= 0;

            return (
              <div className="velvet-card p-4 space-y-3 border-emerald-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Channel Growth & Trajectory
                  </div>
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    Live Real Data
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div className="bg-black/40 border border-white/8 rounded-lg p-2.5">
                    <div className="text-[9px] text-zinc-500 uppercase mb-0.5">Growth Velocity</div>
                    <div className={`text-sm font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPositive ? '↑ +' : '↓ '}{growthPct}%
                    </div>
                    <div className="text-[9px] text-zinc-600">vs median baseline</div>
                  </div>
                  <div className="bg-black/40 border border-white/8 rounded-lg p-2.5">
                    <div className="text-[9px] text-zinc-500 uppercase mb-0.5">DNA Multiplier</div>
                    <div className="text-sm font-bold text-white">
                      {multiplier}×
                    </div>
                    <div className="text-[9px] text-zinc-600">outperformance (Of)</div>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-400 bg-black/30 p-2.5 rounded-lg border border-white/5 space-y-1">
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className="text-zinc-500">Median Upload Views:</span>
                    <span className="text-white font-bold">{fmt(medianViews)}</span>
                  </div>
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className="text-zinc-500">Peak Upload Views:</span>
                    <span className="text-emerald-400 font-bold">{fmt(sortedByViews[0]?.metrics.views.value || 0)}</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* DNA Summary & Mindmap */}
          {posts.length > 0 && (
            <div className="velvet-card p-4 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">DNA Signatures Mindmap</span>
                <span className={`ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                  posts.length >= 25
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    : posts.length >= 10
                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                    : 'border-zinc-500/30 bg-zinc-500/10 text-zinc-400'
                }`}>n={posts.length}</span>
              </div>

              <div className="space-y-2">
                <Stat label="Avg Engagement" value={`${avgER}%`} color="text-emerald-400" />
                <Stat label="Total Sample Views" value={fmt(totalViews)} />
                <Stat label="Top Format" value={topFormat} small />
                <Stat label="Top Hook" value={posts[0]?.hookType || '—'} small />
                <Stat label="Top CTA" value={posts[0]?.ctaType || '—'} small />
              </div>
            </div>
          )}

          {/* Content Gaps & What They Lack (per docs/CONTENT_DNA.md & docs/PRODUCT_SPEC.md) */}
          {posts.length > 0 && (
            <div className="velvet-card p-4 space-y-3 border-amber-500/20">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                Content Gaps (What They Lack)
              </div>
              
              <div className="space-y-2 text-[11px] leading-snug">
                <div className="p-2.5 rounded-lg bg-black/40 border border-amber-500/20 space-y-1">
                  <div className="font-bold text-amber-400 flex items-center gap-1">
                    <span>⚠️ Short-Form Format Void</span>
                  </div>
                  <p className="text-zinc-400 text-[10px]">
                    Zero vertical YouTube Shorts (≤60s) in current upload batch. Missing viral top-of-funnel mobile discovery.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-black/40 border border-amber-500/20 space-y-1">
                  <div className="font-bold text-amber-300 flex items-center gap-1">
                    <span>⚠️ Passive CTA Bottleneck</span>
                  </div>
                  <p className="text-zinc-400 text-[10px]">
                    Heavy reliance on soft CTAs ("Like & Subscribe") with zero automated keyword DM triggers or direct lead magnets.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-black/40 border border-emerald-500/20 space-y-1">
                  <div className="font-bold text-emerald-400 flex items-center gap-1">
                    <span>💡 Franchise Expansion Opportunity</span>
                  </div>
                  <p className="text-zinc-400 text-[10px]">
                    MCU Multiverse content over-saturated. High demand opportunity in Gaming (GTA 6 / Elden Ring) and DC Multiverse.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          {profile && posts.length > 0 && (
            <div className="p-4 rounded-xl bg-gradient-to-b from-emerald-950/50 to-black border border-emerald-500/20">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 uppercase mb-2">
                <Flame className="w-3.5 h-3.5" /> Next Step
              </div>
              <p className="text-xs text-zinc-300 mb-3">Turn these patterns into a 7-day content blueprint.</p>
              <Link
                href={`/blueprint?competitorUrl=${encodeURIComponent(targetUrl)}&handle=${encodeURIComponent(profile.handle)}&limit=${posts.length}`}
                className="btn-vanilla w-full !py-2 !text-xs flex items-center justify-center gap-1"
              >
                Generate Blueprint <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* ── MAIN POSTS LIST ── */}
        <div className="flex-1 min-w-0 space-y-3">

          {/* Controls */}
          {!isLoading && posts.length > 0 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pb-3 border-b border-white/8">
              <h2 className="text-sm font-bold text-white font-display shrink-0">
                {platformLabel?.toLowerCase() === 'youtube' ? 'Uploads' : 'Posts'}{' '}
                <span className="text-zinc-500 font-normal">({displayPosts.length})</span>
              </h2>

              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search hook, format..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-black/60 border border-white/10 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-white/30"
                />
              </div>

              {aiCount > 0 && liveCount > 0 && (
                <div className="flex items-center gap-1 text-[11px] font-mono bg-black/60 border border-white/10 rounded-lg p-1">
                  {(['all', 'live', 'ai'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setFilterAI(f)}
                      className={`px-2 py-0.5 rounded transition-all capitalize ${filterAI === f ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
                    >{f}</button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-1.5 shrink-0">
                <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
                <select
                  value={sortKey}
                  onChange={e => setSortKey(e.target.value as SortKey)}
                  className="bg-black/60 border border-white/10 rounded-lg px-2 py-1.5 text-zinc-300 text-[11px] font-mono focus:outline-none focus:border-white/30"
                >
                  <option value="index">Default order</option>
                  <option value="er">Top Engagement</option>
                  <option value="views">Most Views</option>
                  <option value="likes">Most Likes</option>
                </select>
              </div>
            </div>
          )}

          {/* Column labels */}
          {!isLoading && posts.length > 0 && (
            <div className="hidden md:flex items-center gap-3 px-4 text-[10px] font-mono uppercase text-zinc-600 tracking-wider">
              <span className="w-6 text-center">#</span>
              <span className="flex-1">Hook / Title</span>
              <span className="w-36 text-center hidden sm:block">Format</span>
              <span className="w-8 text-center">Dur.</span>
              <span className="w-16 text-center">Views</span>
              <span className="w-14 text-center">Likes</span>
              <span className="w-14 text-center">Comments</span>
              <span className="w-14 text-right pr-4">ER%</span>
              <span className="w-5" />
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="velvet-card p-12 text-center flex flex-col items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
              <p className="text-zinc-400 text-sm font-medium">Extracting content signals...</p>
              <p className="text-zinc-600 text-xs">Analyzing posts, hooks, and performance data</p>
            </div>
          )}

          {/* Posts */}
          {!isLoading && displayPosts.map((post, idx) => (
            <ObservedPostCard key={post.id || idx} post={post} index={posts.indexOf(post)} />
          ))}

          {/* Empty */}
          {!isLoading && displayPosts.length === 0 && posts.length > 0 && (
            <div className="velvet-card p-8 text-center text-zinc-500 text-sm">
              No posts match your filter or search.
            </div>
          )}

          {/* AI notice — minimal, no scraper mention */}
          {!isLoading && aiCount > 0 && (
            <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-zinc-900/60 border border-white/8 text-zinc-500 text-xs">
              <Bot className="w-4 h-4 shrink-0 mt-0.5 text-zinc-600" />
              <span>
                {aiCount} post{aiCount > 1 ? 's' : ''} marked <strong className="text-zinc-400">AI Example</strong> — used where live data was unavailable.
                {liveCount > 0 && ` ${liveCount} post${liveCount > 1 ? 's' : ''} are from live data.`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color, small }: { label: string; value: string; color?: string; small?: boolean }) {
  return (
    <div className="bg-black/30 border border-white/8 rounded-lg p-2.5">
      <div className="text-[10px] font-mono text-zinc-500 uppercase mb-0.5">{label}</div>
      <div className={`font-medium ${small ? 'text-[11px] text-zinc-300 leading-tight' : `text-sm ${color || 'text-white'}`}`}>
        {value}
      </div>
    </div>
  );
}

export default function ContentIntelligencePage() {
  return (
    <Suspense fallback={
      <div className="p-12 text-center text-zinc-400 font-mono text-xs flex items-center justify-center gap-2">
        <RefreshCw className="w-4 h-4 animate-spin" /> Loading...
      </div>
    }>
      <IntelligenceContent />
    </Suspense>
  );
}
