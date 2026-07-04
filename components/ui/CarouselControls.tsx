import { View, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { colors, spacing } from '@/lib/theme/colors';

function CarouselDots({ count, active, tone = 'dark' }: { count: number; active: number; tone?: 'light' | 'dark' }) {
  const inactiveColor = tone === 'dark' ? 'rgba(255,255,255,0.4)' : colors.grayMid;
  const activeColor = tone === 'dark' ? colors.white : colors.primary;

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={{
            width: i === active ? 20 : 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: i === active ? activeColor : inactiveColor,
          }}
        />
      ))}
    </View>
  );
}

type CarouselControlsProps = {
  count: number;
  active: number;
  onPrevious: () => void;
  onNext: () => void;
  tone?: 'light' | 'dark';
  style?: object;
};

export function CarouselControls({
  count,
  active,
  onPrevious,
  onNext,
  tone = 'dark',
  style,
}: CarouselControlsProps) {
  const borderColor = tone === 'dark' ? 'rgba(255,255,255,0.5)' : colors.grayMid;
  const iconColor = tone === 'dark' ? colors.white : colors.primary;

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: spacing.md,
          paddingHorizontal: spacing.lg,
        },
        style,
      ]}>
      <Pressable
        onPress={onPrevious}
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          borderWidth: 1,
          borderColor,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ChevronLeft color={iconColor} size={20} />
      </Pressable>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <CarouselDots count={count} active={active} tone={tone} />
      </View>
      <Pressable
        onPress={onNext}
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          borderWidth: 1,
          borderColor,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ChevronRight color={iconColor} size={20} />
      </Pressable>
    </View>
  );
}
