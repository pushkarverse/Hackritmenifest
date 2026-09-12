import { ExtractedPost } from '@/lib/ingestion/adapters';

export interface UserBrandInput {
  brandName: string;
  industry: string;
  targetAudience: string;
  valueProposition: string;
  toneOfVoice: string;
  primaryProduct: string;
}

export interface BlueprintHook {
  id: string;
  title: string;
  hookHeadline: string;
  visualCue: string;
  underlyingPsychology: string;
  scriptOutline: string;
  suggestedFormat: string;
  callToAction: string;
  estimatedWinRate: string;
  inspiredByCompetitorPost: string;
}

export interface CalendarDayPlan {
  day: string;
  theme: string;
  format: string;
  hookHeadline: string;
  productionNotes: string;
  targetMetric: 'Reach / Top of Funnel' | 'Saves / High Intent' | 'Comments / Community' | 'Conversions';
}

export interface AdVariantAngle {
  angleName: string;
  hookCopy: string;
  bodyVisualScript: string;
  primaryBenefit: string;
  callToAction: string;
  targetAudienceSegment: string;
}

export interface GrowthBlueprint {
  id: string;
  generatedAt: string;
  competitorHandle: string;
  brandInput: UserBrandInput;
  executiveDiagnosis: {
    competitorWinningEdge: string;
    brandOpportunityGap: string;
    strategicVerdict: string;
  };
  contentPillars: Array<{
    title: string;
    description: string;
    weightPercentage: number;
    recommendedFrequency: string;
  }>;
  originalHooks: BlueprintHook[];
  sevenDayCalendar: CalendarDayPlan[];
  adAngles: AdVariantAngle[];
  guardrailsAndAntiPatterns: string[];
}

function formatCount(num: number | undefined): string {
  if (!num || isNaN(num)) return '0';
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString();
}

function extractBrandProfileFromData(posts: ExtractedPost[], handle: string) {
  const validPosts = (posts || []).filter(p => p && (p.title || p.caption));
  const topPost = validPosts[0];

  // Derive account name from post data or handle
  const cleanHandle = (handle && handle !== 'inspiration') ? handle.replace(/^@/, '') : '';
  const rawAccountName = topPost?.accountName || cleanHandle || 'Analyzed Channel';
  const brandName = rawAccountName.charAt(0).toUpperCase() + rawAccountName.slice(1);

  // Extract distinct topics or prominent keywords from real titles
  const observedTopics = new Set<string>();
  validPosts.forEach(p => {
    if (p.topic && p.topic.trim()) observedTopics.add(p.topic.trim());
  });

  if (observedTopics.size === 0 && validPosts.length > 0) {
    const stopWords = new Set(['the', 'and', 'for', 'with', 'this', 'that', 'you', 'from', 'how', 'why', 'what', 'are', 'your', 'about', 'more', 'have', 'will', 'been', 'post', 'video', 'real', 'full']);
    const wordCounts: Record<string, number> = {};
    validPosts.forEach(p => {
      const text = `${p.title} ${p.caption || ''}`.toLowerCase().replace(/[^a-z0-9 ]/g, '');
      text.split(/\s+/).forEach(w => {
        if (w.length > 3 && !stopWords.has(w)) {
          wordCounts[w] = (wordCounts[w] || 0) + 1;
        }
      });
    });
    const topKeywords = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .map(e => e[0].charAt(0).toUpperCase() + e[0].slice(1));
    topKeywords.slice(0, 3).forEach(k => observedTopics.add(k));
  }

  const topicArray = Array.from(observedTopics);
  const primaryCategory = topicArray.length > 0 ? topicArray.slice(0, 2).join(' & ') : 'Digital Content & Media';

  const industry = topicArray.length > 0 ? `${primaryCategory} Sector` : 'Digital Media & Content';
  
  const audience = topPost?.title
    ? `Viewers interested in ${primaryCategory.toLowerCase()} and topics like "${topPost.title.slice(0, 40)}"`
    : `Engaged followers & target audience interested in ${primaryCategory}`;

  const valueProp = topPost?.contentSignals?.keyTakeaway || (topPost?.title
    ? `High-retention breakdowns & actionable insights on ${topPost.title.slice(0, 45)}`
    : `High-impact visual storytelling & authority positioning`);

  const product = topPost?.title
    ? `Flagship Breakdown Series around ${topicArray[0] || 'Core Content'}`
    : `Flagship Content & Growth Ecosystem`;

  return {
    brandName,
    industry,
    targetAudience: audience,
    valueProposition: valueProp,
    primaryProduct: product
  };
}

export function generateGrowthBlueprint(
  competitorPosts: ExtractedPost[],
  brand: UserBrandInput,
  competitorHandle: string = 'inspiration'
): GrowthBlueprint {
  const validPosts = (competitorPosts || []).filter(p => p && (p.title || p.caption));
  const sortedByViews = [...validPosts].sort((a, b) => (b.metrics?.views?.value || 0) - (a.metrics?.views?.value || 0));
  
  const topPost = sortedByViews[0] || validPosts[0];
  const secondPost = sortedByViews[1] || validPosts[1] || topPost;
  const thirdPost = sortedByViews[2] || validPosts[2] || topPost;

  // Dynamically extract brand identity directly from fetched post data
  const extractedProfile = extractBrandProfileFromData(validPosts, competitorHandle);

  const cleanHandle = competitorHandle.replace(/^@/, '');
  const isDefaultBrand = !brand?.brandName || brand.brandName === 'Aura Skincare' || brand.brandName === 'Your Brand Name' || brand.brandName.trim() === '';

  const brandName = isDefaultBrand
    ? extractedProfile.brandName
    : brand.brandName.trim();

  const industry = isDefaultBrand || !brand?.industry?.trim() ? extractedProfile.industry : brand.industry.trim();
  const audience = isDefaultBrand || !brand?.targetAudience?.trim() ? extractedProfile.targetAudience : brand.targetAudience.trim();
  const valueProp = isDefaultBrand || !brand?.valueProposition?.trim() ? extractedProfile.valueProposition : brand.valueProposition.trim();
  const tone = (brand?.toneOfVoice || (validPosts.find(p => p.tone)?.tone) || 'Authoritative, fast-paced, and analytical').trim();
  const product = isDefaultBrand || !brand?.primaryProduct?.trim() ? extractedProfile.primaryProduct : brand.primaryProduct.trim();

  // Compute total observed views and average ER
  const totalViews = validPosts.reduce((acc, p) => acc + (p.metrics?.views?.value || 0), 0);
  const totalViewsFormatted = formatCount(totalViews);
  const avgER = validPosts.length
    ? (validPosts.reduce((acc, p) => acc + (p.metrics?.engagementRate?.value || 4.2), 0) / validPosts.length).toFixed(1)
    : '4.8';

  // Executive Diagnosis grounded in real posts
  const executiveDiagnosis = {
    competitorWinningEdge: topPost
      ? `@${cleanHandle} achieves massive virality (${formatCount(topPost.metrics?.views?.value)} views on top upload "${topPost.title}") with an average ${avgER}% engagement rate across ${validPosts.length} observed uploads.`
      : `@${cleanHandle} demonstrates strong audience retention with an average ${avgER}% engagement rate.`,
    brandOpportunityGap: topPost
      ? `While @${cleanHandle} dominates broad interest around topics like "${topPost.title.slice(0, 55)}", ${brandName} can capture high-converting intent by launching ${product} tailored to ${audience}.`
      : `While @${cleanHandle} captures top-of-funnel reach in ${industry}, ${brandName} can capture market share with ${valueProp}.`,
    strategicVerdict: `Deploy a 7-day organic sprint utilizing ${brandName}'s tone ("${tone}") while taking visual interrupt frameworks directly proven by @${cleanHandle}'s top uploads.`
  };

  // Build originalHooks grounded in the top 5 REAL posts
  const sourcePosts = sortedByViews.length > 0 ? sortedByViews : validPosts;
  const originalHooks: BlueprintHook[] = sourcePosts.slice(0, 5).map((post, idx) => {
    const postViews = post.metrics?.views?.value ? formatCount(post.metrics.views.value) + ' Views' : 'Observed Upload';
    const postLikes = post.metrics?.likes?.value ? formatCount(post.metrics.likes.value) + ' Likes' : '';
    const cleanTitle = post.title || post.caption?.slice(0, 50) || `Observed Upload #${idx + 1}`;
    
    return {
      id: `hook_${idx + 1}`,
      title: `The "${cleanTitle.slice(0, 40)}" Hook Angle`,
      hookHeadline: `"The critical detail about ${cleanTitle.slice(0, 50)} that 90% of people completely missed."`,
      visualCue: `Frame 1 pattern interrupt: 400ms zoom overlay with high-contrast text highlighting '${cleanTitle.slice(0, 30)}'.`,
      underlyingPsychology: `Curiosity & High-Intent Agitation: Leans into the viral hook mechanics that drove ${postViews} on @${cleanHandle}.`,
      scriptOutline: `1. 0-3s Verbal Hook: State the contrarian premise about ${cleanTitle.slice(0, 35)}.\n2. 3-12s Evidence & Breakdown: Reveal key insight or proof point.\n3. 12-25s Value Bridge: Connect to how ${brandName}'s ${product} delivers ${valueProp}.\n4. 25-30s CTA: Direct viewers to save & follow for part 2.`,
      suggestedFormat: post.format || 'Short Video / Reel (25-35s)',
      callToAction: `Comment "${brandName.toUpperCase()}" for the complete deep-dive breakdown.`,
      estimatedWinRate: `${Math.min(98, 88 + idx * 2)}% Algorithmic Win Rate (${postViews})`,
      inspiredByCompetitorPost: `"${cleanTitle}" — ${postViews} ${postLikes ? '(' + postLikes + ')' : ''}`
    };
  });

  // Fill up to 5 if fewer than 5 posts
  while (originalHooks.length < 5) {
    const idx = originalHooks.length;
    originalHooks.push({
      id: `hook_${idx + 1}`,
      title: `The ${industry} High-Intent Breakdown`,
      hookHeadline: `"Stop making this critical error when dealing with ${industry.toLowerCase()}."`,
      visualCue: `Direct camera eye-contact with bold yellow on-screen captions.`,
      underlyingPsychology: `Pain Agitation & Authority Positioning.`,
      scriptOutline: `1. Call out common mistake.\n2. Show fast visual proof of solution.\n3. Present ${brandName}'s ${product}.`,
      suggestedFormat: 'POV Reel (25s)',
      callToAction: `Save this before your next purchase.`,
      estimatedWinRate: `88% Win Rate`,
      inspiredByCompetitorPost: `@${cleanHandle} Top Framework`
    });
  }

  // Build 7-Day Organic Calendar grounded in actual post topics & formats
  const sevenDayCalendar: CalendarDayPlan[] = [
    {
      day: 'Monday',
      theme: topPost ? `Breakout Topic: ${topPost.title.slice(0, 40)}` : `Industry Teardown`,
      format: topPost?.format || 'Talking Head Reel (28s)',
      hookHeadline: topPost ? `The secret behind ${topPost.title.slice(0, 45)}` : `The #1 mistake in ${industry}`,
      productionNotes: `High-energy opening frame. Jump cuts every 2.5s. Yellow captions.`,
      targetMetric: 'Reach / Top of Funnel'
    },
    {
      day: 'Tuesday',
      theme: secondPost ? `Deep-Dive Analysis: ${secondPost.title.slice(0, 40)}` : `Product Demonstration`,
      format: secondPost?.format || 'Macro Visual Reel (18s)',
      hookHeadline: secondPost ? `Why nobody is talking about ${secondPost.title.slice(0, 45)}` : `Listen to this before buying`,
      productionNotes: `Crisp audio focus, clear visual demonstration of ${product}.`,
      targetMetric: 'Saves / High Intent'
    },
    {
      day: 'Wednesday',
      theme: thirdPost ? `Contrarian Breakdown: ${thirdPost.title.slice(0, 40)}` : `Radical Transparency`,
      format: thirdPost?.format || 'Behind the Scenes Vlog (35s)',
      hookHeadline: thirdPost ? `The unexpected truth about ${thirdPost.title.slice(0, 45)}` : `Why we built ${brandName}`,
      productionNotes: `Show raw production data, notes, or analytical proof.`,
      targetMetric: 'Saves / High Intent'
    },
    {
      day: 'Thursday',
      theme: `Side-by-Side Comparison & Value Proof`,
      format: 'Split-Screen Case Study (25s)',
      hookHeadline: `Standard ${industry} solutions vs ${brandName} ${product}`,
      productionNotes: `High-contrast comparative visuals demonstrating ${valueProp}.`,
      targetMetric: 'Conversions'
    },
    {
      day: 'Friday',
      theme: `Direct Community AMA & Review Crusher`,
      format: 'Founder Uncut Response (45s)',
      hookHeadline: `Answering the top question about ${product} from our community`,
      productionNotes: `Conversational tone matching ${tone}. Seated, direct framing.`,
      targetMetric: 'Comments / Community'
    },
    {
      day: 'Saturday',
      theme: `User Case Study & Transformation Timeline`,
      format: 'Story-Driven Reel (30s)',
      hookHeadline: `What happened after using ${brandName} ${product}`,
      productionNotes: `Fast-paced proof narrative with real user milestones.`,
      targetMetric: 'Conversions'
    },
    {
      day: 'Sunday',
      theme: `Weekly Vision & Industry Synthesis`,
      format: 'Carousel / Narrative Voiceover (20s)',
      hookHeadline: `Why ${brandName} is changing the standard in ${industry}`,
      productionNotes: `Weekend reflection anchoring brand mission and core values.`,
      targetMetric: 'Reach / Top of Funnel'
    }
  ];

  // Content Pillars
  const contentPillars = [
    {
      title: `${product} Performance & Breakdown`,
      description: `Deconstruct why ${brandName}'s ${product} delivers ${valueProp} in ${industry}.`,
      weightPercentage: 35,
      recommendedFrequency: '3x / week'
    },
    {
      title: `Target ICP Pain Agitation (${audience})`,
      description: `Directly address key frustrations of ${audience} based on observed audience interest in @${cleanHandle}.`,
      weightPercentage: 30,
      recommendedFrequency: '2x / week'
    },
    {
      title: `Deep-Dive Analysis & Proof`,
      description: `Analytical, high-trust teardowns modeled after @${cleanHandle}'s top uploads.`,
      weightPercentage: 20,
      recommendedFrequency: '1-2x / week'
    },
    {
      title: `Instant Visual & Tactical Demonstration`,
      description: `High-retention macro visual hooks proving immediate value.`,
      weightPercentage: 15,
      recommendedFrequency: '1x / week'
    }
  ];

  // Paid Ad Angles
  const adAngles: AdVariantAngle[] = [
    {
      angleName: `The Agitation & Conversion Angle`,
      hookCopy: topPost ? `Tired of generic takes on ${topPost.title.slice(0, 35)}? Here is what you need to know.` : `Tired of ${industry.toLowerCase()} options that fail ${audience}?`,
      bodyVisualScript: `Fast zoom opening. Cutaway proving ${valueProp} with clean on-screen evidence.`,
      primaryBenefit: valueProp,
      callToAction: `Explore ${product} Now →`,
      targetAudienceSegment: audience
    },
    {
      angleName: `The Deep Transparency & Proof Angle`,
      hookCopy: `We analyzed top performers in ${industry}. See why thousands are turning to ${brandName}.`,
      bodyVisualScript: `Split-screen comparative graphic showing product specs, formulation, or analytical proof.`,
      primaryBenefit: `Verified quality and transparent proof`,
      callToAction: `Get Started Risk-Free →`,
      targetAudienceSegment: `Analytical buyers & researchers`
    },
    {
      angleName: `The Immediate Proof Angle`,
      hookCopy: `Watch what happens when ${audience} switches to ${brandName} ${product}.`,
      bodyVisualScript: `Dynamic compilation of rapid user feedback, high-contrast visual hooks, and tangible results.`,
      primaryBenefit: `Instant visible value & performance`,
      callToAction: `Claim Your Order Today →`,
      targetAudienceSegment: `High-intent social proof seekers`
    }
  ];

  return {
    id: `bp_${Date.now()}`,
    generatedAt: new Date().toISOString(),
    competitorHandle: cleanHandle,
    brandInput: {
      brandName,
      industry,
      targetAudience: audience,
      valueProposition: valueProp,
      toneOfVoice: tone,
      primaryProduct: product
    },
    executiveDiagnosis,
    contentPillars,
    originalHooks,
    sevenDayCalendar,
    adAngles,
    guardrailsAndAntiPatterns: [
      `NEVER run static uninspired ads—observed data on @${cleanHandle} shows video retention relies heavily on dynamic 0-3s visual pattern interrupts.`,
      `NEVER delay the primary visual motion or key hook headline past the 400ms threshold.`,
      `NEVER make claims without anchoring in verifiable proof, authentic breakdown, or clear demonstration of ${product}.`
    ]
  };
}

