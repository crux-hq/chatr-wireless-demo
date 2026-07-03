import { View, Text, Pressable, Linking, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, X } from 'lucide-react-native';
import type { Store } from '@/lib/mock/types';
import { useAppStore } from '@/lib/store';
import { Card, Badge } from '@/components/ui/Button';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

type StoreDetailCardProps = {
  store: Store;
  onClose?: () => void;
};

export function StoreDetailCard({ store, onClose }: StoreDetailCardProps) {
  const { t } = useTranslation();
  const locale = useAppStore((s) => s.locale);

  const openDirections = () => {
    const address = `${store.address}, ${store.city}, ${store.province}`;
    const url = Platform.select({
      ios: `maps:0,0?q=${encodeURIComponent(address)}@${store.lat},${store.lng}`,
      android: `geo:${store.lat},${store.lng}?q=${encodeURIComponent(address)}`,
      default: `https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`,
    });
    if (url) void Linking.openURL(url);
  };

  const typeLabel =
    store.storeType === 'chatr' ? t('stores.chatrStore') : t('stores.retailPartner');

  return (
    <Card style={{ marginBottom: spacing.md, borderWidth: 2, borderColor: colors.primary }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1, paddingRight: spacing.sm }}>
          <Badge
            label={typeLabel}
            color={store.storeType === 'chatr' ? colors.primary : colors.accent}
          />
          <Text style={{ fontFamily: fonts.extraBold, fontSize: 17, marginTop: spacing.sm }}>
            {store.name}
          </Text>
        </View>
        {onClose ? (
          <Pressable onPress={onClose} hitSlop={8}>
            <X size={20} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginTop: spacing.sm }}>
        <MapPin size={16} color={colors.primary} style={{ marginTop: 2 }} />
        <Text style={{ color: colors.grayDark, flex: 1, lineHeight: 20 }}>
          {store.address}, {store.city}, {store.province}
          {store.postalCode ? ` ${store.postalCode}` : ''}
        </Text>
      </View>

      <Text style={{ color: colors.grayDark, marginTop: spacing.xs }}>
        {t('stores.hours')}: {locale === 'fr' ? store.hoursFr : store.hoursEn}
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.sm }}>
        {store.sellsSim ? <Badge label={t('stores.sellsSim')} color={colors.primaryLight} /> : null}
        {store.sellsTopUp ? <Badge label={t('stores.sellsTopUp')} color={colors.primaryDark} /> : null}
      </View>

      <View style={{ flexDirection: 'row', gap: spacing.lg, marginTop: spacing.md }}>
        <Pressable onPress={openDirections}>
          <Text style={{ color: colors.primary, fontFamily: fonts.bold }}>{t('stores.directions')}</Text>
        </Pressable>
        <Pressable
          onPress={() => Linking.openURL(`tel:${store.phone}`)}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Phone size={16} color={colors.primary} />
          <Text style={{ color: colors.primary, fontFamily: fonts.bold }}>{t('stores.call')}</Text>
        </Pressable>
      </View>
    </Card>
  );
}
