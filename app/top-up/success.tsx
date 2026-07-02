import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { colors, spacing } from '@/lib/theme/colors';

export default function TopUpSuccessScreen() {
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', padding: spacing.xl }}>
      <Text style={{ fontSize: 64 }}>✓</Text>
      <Text style={{ fontSize: 24, fontWeight: '800', marginTop: spacing.md }}>{t('topUp.success')}</Text>
      <Text style={{ color: colors.grayDark, marginTop: spacing.sm, textAlign: 'center' }}>{t('topUp.receipt')}</Text>
      <View style={{ marginTop: spacing.xl, width: '100%' }}>
        <Button title={t('common.done')} onPress={() => router.replace('/(tabs)')} />
      </View>
    </View>
  );
}
