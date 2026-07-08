import { Pressable, Text } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react-native';
import { useAppStore } from '@/lib/store';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

export function BackToSupport() {
  const { t } = useTranslation();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);

  return (
    <Pressable
      onPress={() => router.push(isAuthenticated ? '/(tabs)/support' : '/support')}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing.md }}>
      <ChevronLeft size={20} color={colors.primary} />
      <Text style={{ color: colors.primary, fontFamily: fonts.semiBold }}>{t('support.backToSupport')}</Text>
    </Pressable>
  );
}
