import { SocialPlatformAdapter } from './SocialPlatformAdapter';
import { LiveSocialAdapter } from './LiveSocialAdapter';

export * from './SocialPlatformAdapter';
export * from './LiveSocialAdapter';

export class SocialAdapterFactory {
  static getAdapterForUrl(url: string, platformHint?: string): { adapter: SocialPlatformAdapter; platform: 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'web' } {
    const clean = (url || '').trim().toLowerCase();
    const hint = (platformHint || '').trim().toLowerCase();
    
    if (hint === 'youtube' || clean.includes('youtube') || clean.includes('youtu.be') || clean.includes('verse') || clean.includes('comic') || clean.includes('yt')) {
      return { adapter: new LiveSocialAdapter('youtube'), platform: 'youtube' };
    }
    if (hint === 'tiktok' || clean.includes('tiktok')) {
      return { adapter: new LiveSocialAdapter('tiktok'), platform: 'tiktok' };
    }
    if (hint === 'linkedin' || clean.includes('linkedin')) {
      return { adapter: new LiveSocialAdapter('linkedin'), platform: 'linkedin' };
    }
    if (hint === 'instagram' || clean.includes('instagram')) {
      return { adapter: new LiveSocialAdapter('instagram'), platform: 'instagram' };
    }
    if (clean.startsWith('http://') || clean.startsWith('https://')) {
      return { adapter: new LiveSocialAdapter('web'), platform: 'web' };
    }
    
    return { adapter: new LiveSocialAdapter('youtube'), platform: 'youtube' };
  }
}
