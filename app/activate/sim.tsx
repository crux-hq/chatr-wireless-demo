import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAppStore } from '@/lib/store';
import { colors, spacing } from '@/lib/theme/colors';

export default function ActivateSimScreen() {
  const { t } = useTranslation();
  const draft = useAppStore((s) => s.activationDraft);
  const setActivationDraft = useAppStore((s) => s.setActivationDraft);

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <Header title={`2. ${t('activate.step2')}`} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Input
          label={t('activate.simNumber')}
          value={draft.simNumber}
          onChangeText={(simNumber) => setActivationDraft({ simNumber })}
          placeholder="89014103211118510720"
          keyboardType="numeric"
        />
        <Input
          label={t('activate.phoneNumber')}
          value={draft.phoneNumber}
          onChangeText={(phoneNumber) => setActivationDraft({ phoneNumber })}
          keyboardType="phone-pad"
        />
        <Button
          title={t('common.continue')}
          onPress={() => {
            setActivationDraft({ simNumber: draft.simNumber || '89014103211118510720' });
            router.push('/activate/plan');
          }}
        />
      </ScrollView>
    </View>
  );
}
