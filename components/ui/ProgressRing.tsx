import Svg, { Circle, G } from 'react-native-svg';
import { View, Text } from 'react-native';
import { colors } from '@/lib/theme/colors';

type ProgressRingProps = {
  percent: number;
  size?: number;
  strokeWidth?: number;
  label: string;
  sublabel?: string;
  color?: string;
  alert?: boolean;
};

export function ProgressRing({
  percent,
  size = 100,
  strokeWidth = 10,
  label,
  sublabel,
  color = colors.green,
  alert,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percent));
  const strokeDashoffset = circumference - (clamped / 100) * circumference;
  const ringColor = alert && clamped >= 75 ? (clamped >= 90 ? colors.red : colors.orange) : color;

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size} style={{ position: 'absolute' }}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.grayMid}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <G transform={`rotate(-90 ${size / 2} ${size / 2})`}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={ringColor}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </G>
        </Svg>
        <Text style={{ fontSize: 20, fontWeight: '800', color: colors.black }}>{clamped}%</Text>
      </View>
      <Text style={{ fontWeight: '700', marginTop: 8, color: colors.black }}>{label}</Text>
      {sublabel ? <Text style={{ color: colors.grayDark, fontSize: 12 }}>{sublabel}</Text> : null}
    </View>
  );
}
