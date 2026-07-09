import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Lock } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { ChatrLogo } from '@/components/ui/ChatrLogo';
import {
  isDemoAccessUnlocked,
  shouldSkipDemoAccessGate,
  unlockDemoAccess,
  verifyDemoAccessPassword,
} from '@/lib/demo-access';
import { colors, radius, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

const TECH_MAHINDRA_LOGO = require('@/assets/images/Tech-Mahindra-Logos/Tech-Mahindra-Logos/Color/Positive/TM_Logo_Color_Pos_RGB.jpg');

type DemoAccessGateProps = {
  children: React.ReactNode;
};

export function DemoAccessGate({ children }: DemoAccessGateProps) {
  // Skip paths (iframe / embed / session) unlock immediately so the gate never paints.
  const [unlocked, setUnlocked] = useState(() => isDemoAccessUnlocked());
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Recover if the first paint raced ahead of embed/iframe detection.
  useEffect(() => {
    if (unlocked) return;
    if (shouldSkipDemoAccessGate() || isDemoAccessUnlocked()) {
      setUnlocked(true);
    }
  }, [unlocked]);

  const handleSubmit = useCallback(() => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    if (!verifyDemoAccessPassword(password)) {
      setError('Incorrect password. Please try again.');
      setSubmitting(false);
      return;
    }

    unlockDemoAccess();
    setUnlocked(true);
    setSubmitting(false);
  }, [password, submitting]);

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#F6F2FF', '#FDFCFA', '#FFF9EC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.center}>
        <View style={styles.card}>
          <View style={styles.logoWrap}>
            <ChatrLogo width={88} />
            <View style={styles.logoDivider} />
            <Image
              source={TECH_MAHINDRA_LOGO}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="Tech Mahindra"
            />
          </View>

          <View style={styles.lockBadge}>
            <Lock color={colors.primary} size={18} strokeWidth={2.25} />
          </View>

          <Text style={styles.title}>Private demo</Text>
          <Text style={styles.subtitle}>
            Enter the access password to explore the chatr experience.
          </Text>

          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              if (error) setError(null);
            }}
            onSubmitEditing={handleSubmit}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
            returnKeyType="go"
            placeholder="Enter password"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, error ? styles.inputError : null]}
            accessibilityLabel="Demo access password"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.cta}>
            <Button
              title="Continue"
              onPress={handleSubmit}
              loading={submitting}
              disabled={!password.trim()}
            />
          </View>

          <Pressable
            onPress={() => {
              setPassword('');
              setError(null);
            }}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Clear password">
            <Text style={styles.clear}>Clear</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(84, 46, 145, 0.1)',
    shadowColor: colors.primaryCharcoal,
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
  logoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  logoDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(84, 46, 145, 0.18)',
  },
  logo: {
    width: 140,
    height: 40,
  },
  lockBadge: {
    alignSelf: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lavender,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 34,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  label: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.grayMid,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    backgroundColor: colors.surfaceElevated,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.red,
  },
  error: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.red,
    marginTop: spacing.xs,
  },
  cta: {
    marginTop: spacing.lg,
  },
  clear: {
    marginTop: spacing.md,
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
