import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router, type Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { AppHeaderBar } from '@/components/layout/AppHeaderBar';
import { LanguageToggle } from '@/components/layout/LanguageToggle';
import { ConnectingLifestyleHero } from '@/components/auth/ConnectingLifestyleHero';
import { Button } from '@/components/ui/Button';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

export default function AuthLandingScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <AppHeaderBar
        trailing={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <LanguageToggle onDark={false} />
          </View>
        }
      />

      <View style={styles.hero}>
        <ConnectingLifestyleHero />

        <LinearGradient
          colors={['transparent', 'rgba(45, 38, 59, 0.55)', 'rgba(45, 38, 59, 0.9)']}
          locations={[0.35, 0.7, 1]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        <View
          style={[
            styles.bottomOverlay,
            { paddingBottom: Math.max(insets.bottom, spacing.xl) },
          ]}>
          <Text style={styles.welcome}>{t('auth.landingHeadline')}</Text>

          <View style={styles.actions}>
            <Button title={t('common.signIn')} onPress={() => router.push('/(auth)/sign-in')} />
            <Button
              title={t('auth.createAccount')}
              onPress={() => router.push('/(auth)/register')}
              variant="outline"
            />
          </View>

          <View style={styles.guestRow}>
            <Text style={styles.guestPrompt}>{t('auth.landingGuestPrompt')}</Text>
            <View style={styles.guestLinks}>
              <Pressable onPress={() => router.push('/buy-sim' as Href)}>
                <Text style={styles.guestLinkPrimary}>{t('more.buySim')}</Text>
              </Pressable>
              <Text style={styles.guestDot}>·</Text>
              <Pressable onPress={() => router.push('/activate')}>
                <Text style={styles.guestLinkMuted}>{t('more.activate')}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  hero: {
    flex: 1,
    position: 'relative',
    backgroundColor: colors.primaryCharcoal,
  },
  bottomOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
  },
  welcome: {
    fontFamily: fonts.bold,
    fontSize: 32,
    lineHeight: 40,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  actions: {
    gap: spacing.md,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  guestRow: {
    marginTop: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  guestPrompt: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.72)',
  },
  guestLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  guestLinkPrimary: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.accent,
  },
  guestLinkMuted: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
  },
  guestDot: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: 'rgba(255,255,255,0.45)',
  },
});
