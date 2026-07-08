import { View } from 'react-native';
import { Header } from '@/components/layout/Header';

type MarketingHeaderProps = {
  onLaunchJourney?: (journeyId: string) => void;
};

export function MarketingHeader(_props: MarketingHeaderProps) {
  return (
    <View style={{ zIndex: 10 }}>
      <Header />
    </View>
  );
}
