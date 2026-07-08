import { useEffect, useRef, useState } from 'react';
import { View, Image, StyleSheet, Platform, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '@/lib/theme/colors';

const VIDEO_SOURCE = require('@/assets/videos/connecting-phone.mp4');
const POSTER_SOURCE = require('@/assets/images/auth/connecting-phone-poster.jpg');

function resolveAssetUri(asset: number | string | { default?: string; uri?: string }): string {
  if (typeof asset === 'string') return asset;
  if (asset && typeof asset === 'object') {
    if (typeof asset.default === 'string') return asset.default;
    if (typeof asset.uri === 'string') return asset.uri;
  }
  const resolved = Image.resolveAssetSource?.(asset as number);
  return resolved?.uri ?? String(asset);
}

type ConnectingLifestyleHeroProps = {
  style?: StyleProp<ViewStyle>;
};

/**
 * Full-bleed lifestyle video of someone connecting by phone.
 * Web uses a real <video> element; poster shows until the first frame is ready.
 */
export function ConnectingLifestyleHero({ style }: ConnectingLifestyleHeroProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const videoUri = resolveAssetUri(VIDEO_SOURCE);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const host = hostRef.current;
    if (!host) return;

    host.replaceChildren();
    setReady(false);

    const video = document.createElement('video');
    video.src = videoUri;
    video.autoplay = true;
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('muted', '');
    video.setAttribute('aria-hidden', 'true');
    video.disablePictureInPicture = true;
    video.controls = false;
    video.preload = 'auto';
    video.style.cssText = [
      'position:absolute',
      'inset:0',
      'width:100%',
      'height:100%',
      'object-fit:cover',
      'display:block',
    ].join(';');

    const markReady = () => setReady(true);
    video.addEventListener('loadeddata', markReady);
    video.addEventListener('playing', markReady);
    host.appendChild(video);
    void video.play().catch(() => {
      // Autoplay can fail in some browsers; poster remains visible.
    });

    return () => {
      video.removeEventListener('loadeddata', markReady);
      video.removeEventListener('playing', markReady);
      video.pause();
      video.removeAttribute('src');
      video.load();
      video.remove();
      host.replaceChildren();
    };
  }, [videoUri]);

  return (
    <View
      style={[styles.wrap, style]}
      accessibilityRole="image"
      accessibilityLabel="People connecting by phone"
      pointerEvents="none">
      <Image source={POSTER_SOURCE} style={styles.poster} resizeMode="cover" />
      <View
        // @ts-expect-error — web-only ref for mounting a DOM video
        ref={hostRef}
        style={[styles.videoLayer, ready && styles.videoVisible]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.primaryCharcoal,
    overflow: 'hidden',
  },
  poster: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  videoLayer: {
    ...StyleSheet.absoluteFill,
    opacity: 0,
  },
  videoVisible: {
    opacity: 1,
  },
});
