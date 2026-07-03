import { useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react-native';
import { Button, Card } from '@/components/ui/Button';
import { DEMO_SCENARIOS } from '@/lib/demo-scenarios';
import { useAppStore } from '@/lib/store';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

export default function DemoScreen() {
  const { t } = useTranslation();
  const locale = useAppStore((s) => s.locale);
  const currentScenario = useAppStore((s) => s.currentScenario);
  const applyScenario = useAppStore((s) => s.applyScenario);
  const [selected, setSelected] = useState(currentScenario);
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    setLoading(true);
    await applyScenario(selected);
    setLoading(false);
    router.replace('/(tabs)');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: spacing.md,
          backgroundColor: colors.green,
        }}>
        <Text style={{ color: colors.white, fontFamily: fonts.extraBold, fontSize: 20 }}>{t('demo.title')}</Text>
        <Pressable onPress={() => router.back()}>
          <X color={colors.white} size={28} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <Text style={{ color: colors.grayDark, marginBottom: spacing.lg }}>{t('demo.subtitle')}</Text>

        {DEMO_SCENARIOS.map((scenario) => (
          <Pressable key={scenario.id} onPress={() => setSelected(scenario.id)}>
            <Card
              style={{
                marginBottom: spacing.sm,
                borderWidth: selected === scenario.id ? 2 : 0,
                borderColor: colors.green,
              }}>
              <Text style={{ fontFamily: fonts.extraBold, fontSize: 16 }}>
                {locale === 'fr' ? scenario.labelFr : scenario.labelEn}
              </Text>
              <Text style={{ color: colors.grayDark, marginTop: 4, fontSize: 16 }}>
                {locale === 'fr' ? scenario.descriptionFr : scenario.descriptionEn}
              </Text>
              {currentScenario === scenario.id ? (
                <Text style={{ color: colors.green, fontFamily: fonts.semiBold, marginTop: 8 }}>{t('demo.current')}</Text>
              ) : null}
            </Card>
          </Pressable>
        ))}

        <Button title={t('demo.apply')} onPress={handleApply} loading={loading} />
      </ScrollView>
    </View>
  );
}
