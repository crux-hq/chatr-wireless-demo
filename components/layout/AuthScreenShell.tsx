import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Header, PageTitle } from '@/components/layout/Header';
import { colors, spacing } from '@/lib/theme/colors';

type AuthScreenShellProps = {
  title: string;
  children: React.ReactNode;
  keyboard?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  leading?: React.ReactNode;
};

export function AuthScreenShell({ title, children, keyboard, contentStyle, leading }: AuthScreenShellProps) {
  const body = (
    <>
      <Header />
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.surface }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled">
        <View style={{ backgroundColor: colors.white, width: '100%', paddingVertical: spacing.xl }}>
          <PageTitle backgroundColor={colors.white} leading={leading}>
            {title}
          </PageTitle>
          <View style={[{ paddingHorizontal: spacing.lg }, contentStyle]}>{children}</View>
        </View>
      </ScrollView>
    </>
  );

  if (keyboard) {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.surface }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {body}
      </KeyboardAvoidingView>
    );
  }

  return <View style={{ flex: 1, backgroundColor: colors.surface }}>{body}</View>;
}
