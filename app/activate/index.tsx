import { ScrollView, View, Text } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/layout/Header';
import { Button, Card } from '@/components/ui/Button';
import { colors, spacing } from '@/lib/theme/colors';

const STEPS = ['step1', 'step2', 'step3', 'step4'] as const;

export default function ActivateIndexScreen() {
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <Header title={t('activate.title')} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Text style={{ fontSize: 24, fontWeight: '800', marginBottom: spacing.lg }}>{t('activate.title')}</Text>
        {STEPS.map((step, i) => (
          <Card key={step} style={{ marginBottom: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: colors.green,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ color: colors.white, fontWeight: '800' }}>{i + 1}</Text>
            </View>
            <Text style={{ fontWeight: '600', flex: 1 }}>{t(`activate.${step}`)}</Text>
          </Card>
        ))}
        <Button title={t('common.continue')} onPress={() => router.push('/activate/sim')} />
      </ScrollView>
    </View>
  );
}
