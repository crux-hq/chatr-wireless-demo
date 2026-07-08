import { View, Text, Pressable, ScrollView } from 'react-native';
import { router, type Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeaderBar } from '@/components/layout/AppHeaderBar';
import { LanguageToggle } from '@/components/layout/LanguageToggle';
import { Button } from '@/components/ui/Button';
import { ChatrLogo } from '@/components/ui/ChatrLogo';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts, typography } from '@/lib/theme/typography';

export default function AuthLandingScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <AppHeaderBar
        trailing={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <LanguageToggle onDark={false} />
          </View>
        }
      />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: spacing.lg,
          paddingBottom: Math.max(insets.bottom, spacing.xl),
        }}
        keyboardShouldPersistTaps="handled">
        <View style={{ flex: 1, justifyContent: 'center', paddingVertical: spacing.xxl }}>
          <View style={{ alignItems: 'center', marginBottom: spacing.xl }}>
            <ChatrLogo width={120} />
          </View>

          <Text style={{ ...typography.pageTitle, textAlign: 'center', marginBottom: spacing.md }}>
            {t('auth.welcome')}
          </Text>
          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: 16,
              lineHeight: 24,
              color: colors.textMuted,
              textAlign: 'center',
              marginBottom: spacing.xxl,
              maxWidth: 320,
              alignSelf: 'center',
            }}>
            {t('auth.landingSubtitle')}
          </Text>

          <View style={{ gap: spacing.md, maxWidth: 400, width: '100%', alignSelf: 'center' }}>
            <Button title={t('common.signIn')} onPress={() => router.push('/(auth)/sign-in')} />
            <Button
              title={t('auth.createAccount')}
              onPress={() => router.push('/(auth)/register')}
              variant="outline"
            />
          </View>

          <View
            style={{
              marginTop: spacing.xxl,
              paddingTop: spacing.xl,
              borderTopWidth: 1,
              borderTopColor: colors.grayMid,
              alignItems: 'center',
              gap: spacing.sm,
            }}>
            <Text style={{ fontFamily: fonts.semiBold, fontSize: 14, color: colors.textMuted }}>
              {t('auth.landingGuestPrompt')}
            </Text>
            <Pressable onPress={() => router.push('/buy-sim' as Href)}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: colors.primary }}>{t('more.buySim')}</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/activate')}>
              <Text style={{ fontFamily: fonts.semiBold, fontSize: 16, color: colors.textMuted }}>{t('more.activate')}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
