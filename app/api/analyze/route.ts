import { NextRequest, NextResponse } from 'next/server';
import { SocialAdapterFactory } from '@/lib/ingestion/adapters';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, platform: platformHint } = body;

    if (!url || typeof url !== 'string' || url.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid public social media URL or handle.' },
        { status: 400 }
      );
    }

    const { adapter, platform } = SocialAdapterFactory.getAdapterForUrl(url, platformHint);

    if (!adapter.validateUrl(url)) {
      return NextResponse.json(
        { success: false, error: 'Invalid URL format. Please enter an Instagram, TikTok, YouTube, or web link or handle.' },
        { status: 400 }
      );
    }

    const rawLimit = body.limit !== undefined ? parseInt(String(body.limit), 10) : 5;
    const limit = isNaN(rawLimit) ? 5 : Math.max(1, Math.min(rawLimit, 100));

    const profile = await adapter.getProfile(url);
    const handle = profile.handle || adapter.extractAccountHandle(url) || 'creator';

    // profileOnly mode — used by the Verify step (fast, no post extraction)
    if (body.profileOnly === true) {
      return NextResponse.json({
        success: true,
        platform,
        handle,
        profile,
        posts: [],
        extractedCount: 0,
        analyzedAt: new Date().toISOString(),
        provenance: 'PROFILE_ONLY'
      });
    }

    const posts = await adapter.extractPublicPosts(url, limit);

    return NextResponse.json({
      success: true,
      platform,
      handle,
      profile,
      posts,
      requestedLimit: limit,
      extractedCount: posts.length,
      analyzedAt: new Date().toISOString(),
      provenance: 'PUBLIC_OBSERVED'
    });
  } catch (error: any) {
    console.error('Error analyzing social URL:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to extract content intelligence.' },
      { status: 500 }
    );
  }
}
