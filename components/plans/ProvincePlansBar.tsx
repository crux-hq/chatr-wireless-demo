import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { MapPin, ChevronRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { ProvinceSelectDialog } from '@/components/plans/ProvinceSelectDialog';
import { getProvinceName, type ProvinceCode } from '@/lib/mock/provinces';
import { useAppStore } from '@/lib/store';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

export function ProvincePlansBar() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith('fr') ? 'fr' : 'en';
  const plansProvince = useAppStore((s) => s.plansProvince);
  const setPlansProvince = useAppStore((s) => s.setPlansProvince);
  const [dialogVisible, setDialogVisible] = useState(false);

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: spacing.xs,
          marginBottom: spacing.lg,
        }}>
        <MapPin color={colors.text} size={18} strokeWidth={2} />
        <Text style={{ fontFamily: fonts.regular, fontSize: 15, color: colors.text }}>
          {t('plans.province.shownFor')}
        </Text>
        <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.text }}>
          {getProvinceName(plansProvince, locale)}
        </Text>
        <Pressable
          onPress={() => setDialogVisible(true)}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}
          accessibilityRole="button">
          <Text
            style={{
              fontFamily: fonts.semiBold,
              fontSize: 15,
              color: colors.primary,
              textDecorationLine: 'underline',
            }}>
            {t('plans.province.change')}
          </Text>
          <ChevronRight color={colors.primary} size={16} strokeWidth={2.5} />
        </Pressable>
      </View>

      <ProvinceSelectDialog
        visible={dialogVisible}
        selected={plansProvince}
        onClose={() => setDialogVisible(false)}
        onConfirm={(code: ProvinceCode) => setPlansProvince(code)}
      />
    </>
  );
}
