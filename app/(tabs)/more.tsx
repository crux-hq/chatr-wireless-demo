import { ScrollView, View, Text, Pressable } from 'react-native';
import { router, type Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ChevronRight, MapPin, Globe, HelpCircle, User, Smartphone, ShoppingBag } from 'lucide-react-native';
import { Header, PageTitle } from '@/components/layout/Header';
import { Card } from '@/components/ui/Button';
import { useAppStore } from '@/lib/store';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

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
          <Text style={{ fontFamily: fonts.semiBold, fontSize: 16 }}>{label}</Text>
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
    { icon: <ShoppingBag color={colors.primary} size={22} />, label: t('more.buySim'), route: '/buy-sim' },
    { icon: <Smartphone color={colors.primary} size={22} />, label: t('more.activate'), route: '/activate' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <Header />
      <PageTitle>{t('more.title')}</PageTitle>
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        {items.map((item) => (
          <MenuItem
            key={item.route}
            icon={item.icon}
            label={item.label}
            onPress={() => router.push(item.route as Href)}
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
          <Text style={{ color: colors.red, fontFamily: fonts.bold }}>{t('more.signOut')}</Text>
        </Pressable>

        <Text style={{ textAlign: 'center', color: colors.grayDark, marginTop: spacing.lg, fontSize: 12 }}>
          Demo app by Tech Mahindra • {locale.toUpperCase()}
        </Text>
      </ScrollView>
    </View>
  );
}
