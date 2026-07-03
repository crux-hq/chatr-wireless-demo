import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { colors, spacing } from '@/lib/theme/colors';

export default function ActivateSuccessScreen() {
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', padding: spacing.xl }}>
      <Text style={{ fontSize: 64, color: colors.white }}>✓</Text>
      <Text style={{ fontSize: 28, fontWeight: '800', color: colors.white, marginTop: spacing.md, textAlign: 'center' }}>
        {t('activate.success')}
      </Text>
      <Text style={{ color: colors.white, opacity: 0.9, marginTop: spacing.sm, textAlign: 'center' }}>
        {t('activate.successSubtitle')}
      </Text>

      <View style={{ marginTop: spacing.xl, width: '100%', gap: spacing.sm }}>
        <Text style={{ color: colors.white, fontWeight: '700' }}>{t('activate.nextSteps')}</Text>
        <Button title={t('activate.topUpNow')} onPress={() => router.replace('/top-up')} variant="secondary" />
        <Button title={t('activate.exploreApp')} onPress={() => router.replace('/(tabs)')} variant="outline" />
      </View>
    </View>
  );
}
