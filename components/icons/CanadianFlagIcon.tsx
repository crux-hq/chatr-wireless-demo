import Svg, { Path, Rect } from 'react-native-svg';
import { colors } from '@/lib/theme/colors';

type CanadianFlagIconProps = {
  size?: number;
};

/** Stylized Canadian flag using chatr purple + gold accent (complementary brand colours). */
export function CanadianFlagIcon({ size = 32 }: CanadianFlagIconProps) {
  const width = size;
  const height = Math.round(size * 0.6);

  return (
    <Svg width={width} height={height} viewBox="0 0 90 54" fill="none">
      <Rect width={90} height={54} rx={4} fill={colors.primary} />
      <Rect x={30} width={30} height={54} fill={colors.white} />
      <Path
        fill={colors.accent}
        d="M45 12c1.2 1.8 2.6 2.4 4.4 2.1 1.2-.2 2.2-.8 3-1.6-.4 2.1.5 3.8 2.4 4.9 1.2.7 2.6.9 4 .6-1.2 1.6-1.3 3.4-.2 5.1-.8-.3-1.6-.3-2.4 0-.9.4-1.6 1.1-2.1 2-.3.5-.5 1.1-.6 1.7h-3.8c-.1-.6-.3-1.2-.6-1.7-.5-.9-1.2-1.6-2.1-2-.8-.3-1.6-.3-2.4 0 1.1-1.7 1-3.5-.2-5.1 1.4.3 2.8.1 4-.6 1.9-1.1 2.8-2.8 2.4-4.9.8.8 1.8 1.4 3 1.6 1.8.3 3.2-.3 4.4-2.1z"
      />
      <Path
        fill={colors.accent}
        d="M43.2 36.5h3.6v7.2c0 .7-.6 1.3-1.3 1.3h-1c-.7 0-1.3-.6-1.3-1.3v-7.2z"
      />
    </Svg>
  );
}
