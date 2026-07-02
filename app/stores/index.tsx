import { ScrollView, View, Text, Pressable, Linking, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone } from 'lucide-react-native';
import { Card } from '@/components/ui/Button';
import { STORES } from '@/lib/mock/stores';
import { useAppStore } from '@/lib/store';
import { colors, spacing } from '@/lib/theme/colors';

export default function StoresScreen() {
  const { t } = useTranslation();
  const locale = useAppStore((s) => s.locale);

  const openDirections = (lat: number, lng: number, address: string) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${encodeURIComponent(address)}@${lat},${lng}`,
      android: `geo:${lat},${lng}?q=${encodeURIComponent(address)}`,
      default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    });
    if (url) void Linking.openURL(url);
  };

  return (
    <>
      <Stack.Screen options={{ title: t('stores.title'), headerShown: true }} />
      <ScrollView style={{ flex: 1, backgroundColor: colors.gray }} contentContainerStyle={{ padding: spacing.md }}>
        <Text style={{ fontWeight: '800', fontSize: 18, marginBottom: 4 }}>{t('stores.subtitle')}</Text>
        <Text style={{ color: colors.grayDark, marginBottom: spacing.lg }}>{t('common.nationWide')}</Text>

        {STORES.map((store) => (
          <Card key={store.id} style={{ marginBottom: spacing.md }}>
            <Text style={{ fontWeight: '800', fontSize: 16 }}>{store.name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <MapPin size={16} color={colors.green} />
              <Text style={{ color: colors.grayDark, flex: 1 }}>
                {store.address}, {store.city}, {store.province}
              </Text>
            </View>
            <Text style={{ color: colors.grayDark, marginTop: 4 }}>
              {t('stores.hours')}: {locale === 'fr' ? store.hoursFr : store.hoursEn}
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.md }}>
              <Pressable
                onPress={() => openDirections(store.lat, store.lng, store.address)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={{ color: colors.green, fontWeight: '700' }}>{t('stores.directions')}</Text>
              </Pressable>
              <Pressable onPress={() => Linking.openURL(`tel:${store.phone}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Phone size={16} color={colors.green} />
                <Text style={{ color: colors.green, fontWeight: '700' }}>{t('stores.call')}</Text>
              </Pressable>
            </View>
          </Card>
        ))}
      </ScrollView>
    </>
  );
}
