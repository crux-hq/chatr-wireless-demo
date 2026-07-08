import { View, Text } from 'react-native';

export default function MapView({ children, style }: { children?: React.ReactNode; style?: object }) {
  return (
    <View
      style={[
        {
          backgroundColor: '#E8E0F5',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 200,
        },
        style,
      ]}>
      <Text style={{ color: '#542E91', fontFamily: 'system-ui' }}>Map preview (Storybook)</Text>
      {children}
    </View>
  );
}

export function Marker() {
  return null;
}

export function Callout({ children }: { children?: React.ReactNode }) {
  return <View>{children}</View>;
}

export function PROVIDER_GOOGLE() {
  return 'google';
}
