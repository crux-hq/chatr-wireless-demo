import { ScrollView, View, Text, Pressable } from 'react-native';
import { router, type Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ChevronRight, MapPin, Globe, HelpCircle, User, Smartphone, ShoppingBag, Phone } from 'lucide-react-native';
import { Header, PageTitle, PageScrollView } from '@/components/layout/Header';
import { Card } from '@/components/ui/Button';
import { openJourneyExplorer } from '@/lib/journey-explorer';
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
    { icon: <User color={colors.primary} size={22} />, label: t('more.profile'), route: '/(tabs)/profile' },
    { icon: <HelpCircle color={colors.primary} size={22} />, label: t('more.support'), route: '/(tabs)/support' },
    { icon: <Globe color={colors.primary} size={22} />, label: t('more.coverage'), route: '/(tabs)/coverage' },
    { icon: <MapPin color={colors.primary} size={22} />, label: t('more.stores'), route: '/(tabs)/stores' },
    { icon: <Phone color={colors.primary} size={22} />, label: t('more.shopPhones'), route: '/(tabs)/phones' },
    { icon: <ShoppingBag color={colors.primary} size={22} />, label: t('more.buySim'), route: '/buy-sim' },
    { icon: <Smartphone color={colors.primary} size={22} />, label: t('more.activate'), route: '/activate' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <Header />
      <PageTitle>{t('more.title')}</PageTitle>
      <PageScrollView contentContainerStyle={{ padding: spacing.md }}>
        {items.map((item) => (
          <MenuItem
            key={item.route}
            icon={item.icon}
            label={item.label}
            onPress={() => router.push(item.route as Href)}
          />
        ))}

        <Pressable
          onPress={() => {
            signOut();
            router.replace('/(auth)');
          }}
          style={{
            marginTop: spacing.lg,
            padding: spacing.md,
            alignItems: 'center',
            backgroundColor: colors.white,
            borderRadius: 12,
          }}>
          <Text style={{ color: colors.red, fontFamily: fonts.bold }}>{t('more.signOut')}</Text>
        </Pressable>

        <View
          style={{
            marginTop: spacing.lg,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 6,
          }}>
          <Text style={{ textAlign: 'center', color: colors.grayDark, fontSize: 12 }}>
            Demo app by Tech Mahindra • {locale.toUpperCase()}
          </Text>
          <Text style={{ color: colors.grayDark, fontSize: 12 }}>•</Text>
          <Pressable onPress={openJourneyExplorer} accessibilityRole="link" accessibilityLabel={t('demo.debug')}>
            <Text style={{ color: colors.primary, fontFamily: fonts.semiBold, fontSize: 12 }}>{t('demo.debug')}</Text>
          </Pressable>
        </View>
      </PageScrollView>
    </View>
  );
}
