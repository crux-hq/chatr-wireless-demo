import { ScrollView, View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ChevronRight, MapPin, Globe, HelpCircle, User, Smartphone } from 'lucide-react-native';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Button';
import { useAppStore } from '@/lib/store';
import { colors, spacing } from '@/lib/theme/colors';

function MenuItem({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <Card style={{ marginBottom: spacing.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {icon}
          <Text style={{ fontWeight: '600', fontSize: 16 }}>{label}</Text>
        </View>
        <ChevronRight color={colors.grayDark} size={20} />
      </Card>
    </Pressable>
  );
}

export default function MoreScreen() {
  const { t } = useTranslation();
  const signOut = useAppStore((s) => s.signOut);
  const locale = useAppStore((s) => s.locale);

  const items = [
    { icon: <User color={colors.primary} size={22} />, label: t('more.profile'), route: '/profile' },
    { icon: <HelpCircle color={colors.primary} size={22} />, label: t('more.support'), route: '/support' },
    { icon: <Globe color={colors.primary} size={22} />, label: t('more.coverage'), route: '/coverage' },
    { icon: <MapPin color={colors.primary} size={22} />, label: t('more.stores'), route: '/stores' },
    { icon: <Smartphone color={colors.primary} size={22} />, label: t('more.activate'), route: '/activate' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <Header title={t('more.title')} />
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        {items.map((item) => (
          <MenuItem
            key={item.route}
            icon={item.icon}
            label={item.label}
            onPress={() => router.push(item.route as '/profile')}
          />
        ))}

        <Pressable
          onPress={() => signOut()}
          style={{
            marginTop: spacing.lg,
            padding: spacing.md,
            alignItems: 'center',
            backgroundColor: colors.white,
            borderRadius: 12,
          }}>
          <Text style={{ color: colors.red, fontWeight: '700' }}>{t('more.signOut')}</Text>
        </Pressable>

        <Text style={{ textAlign: 'center', color: colors.grayDark, marginTop: spacing.lg, fontSize: 12 }}>
          My chatr Demo • {locale.toUpperCase()}
        </Text>
      </ScrollView>
    </View>
  );
}
