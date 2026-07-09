import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { router, type Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowUp, Sparkles, RotateCcw } from 'lucide-react-native';
import { Header, PageTitle, PageScrollView } from '@/components/layout/Header';
import { Card } from '@/components/ui/Button';
import { PublicHomeFooter } from '@/components/layout/PublicHomeFooter';
import {
  getAiSupportSuggestionsByGroup,
  matchAiSupportQuery,
  resultFromSuggestion,
  type AiSupportLink,
  type AiSupportResult,
  type AiSupportSuggestion,
} from '@/lib/mock/ai-support';
import { useAppStore } from '@/lib/store';
import { colors, radius, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

const INPUT_GRADIENT = ['#6F58A8', '#9D8AC9', '#7DCEC0'] as const;
const SEND_GRADIENT = ['#7E67B3', '#9E8FCA', '#7FCABD'] as const;

const THINKING_MS = 1400;
const STREAM_CHARS_PER_TICK = 3;
const STREAM_TICK_MS = 28;

type Phase = 'idle' | 'thinking' | 'streaming' | 'done';

type ChatTurn = {
  question: string;
  result: AiSupportResult;
  streamedText: string;
  phase: Phase;
};

type AiSupportScreenProps = {
  /** When true, show public footer (guest / public route). */
  showPublicFooter?: boolean;
};

export function AiSupportScreen({ showPublicFooter = false }: AiSupportScreenProps) {
  const { t } = useTranslation();
  const locale = useAppStore((s) => s.locale);
  const [query, setQuery] = useState('');
  const [turn, setTurn] = useState<ChatTurn | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const suggestions = useMemo(
    () => [...getAiSupportSuggestionsByGroup('account'), ...getAiSupportSuggestionsByGroup('faq')],
    [],
  );

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const startStream = useCallback(
    (question: string, result: AiSupportResult) => {
      clearTimers();
      const fullAnswer = locale === 'fr' ? result.answerFr : result.answerEn;

      setTurn({
        question,
        result,
        streamedText: '',
        phase: 'thinking',
      });
      setQuery('');

      const thinkTimer = setTimeout(() => {
        setTurn((prev) => (prev ? { ...prev, phase: 'streaming' } : prev));

        let index = 0;
        const stream = () => {
          index = Math.min(fullAnswer.length, index + STREAM_CHARS_PER_TICK);
          const nextText = fullAnswer.slice(0, index);
          const finished = index >= fullAnswer.length;

          setTurn((prev) =>
            prev
              ? {
                  ...prev,
                  streamedText: nextText,
                  phase: finished ? 'done' : 'streaming',
                }
              : prev,
          );

          if (!finished) {
            const tick = setTimeout(stream, STREAM_TICK_MS);
            timersRef.current.push(tick);
          }
        };

        stream();
      }, THINKING_MS);

      timersRef.current.push(thinkTimer);
    },
    [clearTimers, locale],
  );

  const ask = useCallback(
    (text: string, suggestion?: AiSupportSuggestion) => {
      const trimmed = text.trim();
      if (!trimmed && !suggestion) return;

      if (suggestion) {
        const question = locale === 'fr' ? suggestion.labelFr : suggestion.labelEn;
        startStream(question, resultFromSuggestion(suggestion));
        return;
      }

      startStream(trimmed, matchAiSupportQuery(trimmed));
    },
    [locale, startStream],
  );

  const handleSubmit = useCallback(() => {
    if (turn?.phase === 'thinking' || turn?.phase === 'streaming') return;
    ask(query);
  }, [ask, query, turn?.phase]);

  const handleNewChat = useCallback(() => {
    clearTimers();
    setTurn(null);
    setQuery('');
  }, [clearTimers]);

  const inConversation = turn != null;
  const busy = turn?.phase === 'thinking' || turn?.phase === 'streaming';
  const showLinks = turn?.phase === 'done' && (turn.result.links?.length ?? 0) > 0;

  return (
    <View style={styles.screen}>
      <Header />
      <PageTitle
        titleStyle={inConversation ? styles.questionTitle : undefined}
        trailing={
          inConversation ? (
            <Pressable
              onPress={handleNewChat}
              hitSlop={8}
              style={styles.newChatBtn}
              accessibilityRole="button"
              accessibilityLabel={t('support.aiNewChat')}>
              <RotateCcw color={colors.primary} size={14} strokeWidth={2.25} />
              <Text style={styles.newChatText}>{t('support.aiNewChat')}</Text>
            </Pressable>
          ) : undefined
        }>
        {inConversation ? turn.question : t('support.aiPageTitle')}
      </PageTitle>
      <View style={styles.body}>
        <PageScrollView
          contentContainerStyle={{
            padding: spacing.md,
            paddingBottom: spacing.lg,
            flexGrow: 1,
          }}>
          {inConversation ? (
            <Card style={styles.responseCard}>
              <View style={styles.responseHeader}>
                <View style={styles.sparkleBadge}>
                  <Sparkles color={colors.primary} size={16} strokeWidth={2} />
                </View>
                <Text style={styles.responseLabel}>
                  {turn.phase === 'thinking' ? t('support.aiThinking') : t('support.aiResponseLabel')}
                </Text>
              </View>

              {turn.phase === 'thinking' ? (
                <ThinkingDots />
              ) : (
                <Text style={styles.responseBody}>
                  {turn.streamedText}
                  {turn.phase === 'streaming' ? <Text style={styles.caret}>▍</Text> : null}
                </Text>
              )}

              {showLinks ? (
                <View style={styles.links}>
                  {turn.result.links.map((link: AiSupportLink) => (
                    <Pressable
                      key={link.href + link.labelEn}
                      onPress={() => router.push(link.href as Href)}
                      style={({ pressed }) => [styles.linkRow, pressed && styles.linkRowPressed]}>
                      <Text style={styles.linkText}>
                        {locale === 'fr' ? link.labelFr : link.labelEn}
                      </Text>
                      <Text style={styles.linkChevron}>→</Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </Card>
          ) : (
            <SuggestionList
              suggestions={suggestions}
              locale={locale}
              onSelect={(suggestion) => ask('', suggestion)}
            />
          )}

          {showPublicFooter && !inConversation ? <PublicHomeFooter /> : null}
        </PageScrollView>

        <View style={styles.composer}>
          <LinearGradient
            colors={[...INPUT_GRADIENT]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBorder}>
            <View style={styles.inputInner}>
              <TextInput
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={handleSubmit}
                placeholder={
                  inConversation ? t('support.aiFollowUpPlaceholder') : t('support.aiPlaceholder')
                }
                placeholderTextColor="rgba(111, 88, 168, 0.62)"
                returnKeyType="go"
                autoCapitalize="sentences"
                autoCorrect
                editable={!busy}
                style={styles.input}
                accessibilityLabel={
                  inConversation ? t('support.aiFollowUpPlaceholder') : t('support.aiPlaceholder')
                }
              />
              <Pressable
                onPress={handleSubmit}
                disabled={!query.trim() || busy}
                style={[styles.sendBtn, (!query.trim() || busy) && styles.sendBtnDisabled]}
                accessibilityRole="button"
                accessibilityLabel={t('support.aiSend')}>
                <LinearGradient
                  colors={[...SEND_GRADIENT]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.sendBtnGradient}>
                  <ArrowUp color={colors.white} size={18} strokeWidth={2.5} />
                </LinearGradient>
              </Pressable>
            </View>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
}

function ThinkingDots() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f + 1) % 3), 380);
    return () => clearInterval(id);
  }, []);

  return (
    <Text style={styles.thinkingText}>
      {'.'.repeat(frame + 1)}
      <Text style={styles.thinkingGhost}>{'.'.repeat(2 - frame)}</Text>
    </Text>
  );
}

function SuggestionList({
  suggestions,
  locale,
  onSelect,
}: {
  suggestions: AiSupportSuggestion[];
  locale: string;
  onSelect: (suggestion: AiSupportSuggestion) => void;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.questionListShell}>
        <View style={styles.questionList}>
          {suggestions.map((suggestion) => {
            const label = locale === 'fr' ? suggestion.labelFr : suggestion.labelEn;
            return (
              <Pressable
                key={suggestion.id}
                onPress={() => onSelect(suggestion)}
                style={({ pressed }) => [styles.questionRow, pressed && styles.questionRowPressed]}
                accessibilityRole="button"
                accessibilityLabel={label}>
                <Text style={styles.questionText} numberOfLines={1}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(243,240,255,0)', 'rgba(243,240,255,0.92)', 'rgba(243,240,255,1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.questionFade}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.gray,
  },
  body: {
    flex: 1,
  },
  questionTitle: {
    fontSize: 20,
    lineHeight: 26,
  },
  newChatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingTop: 4,
    flexShrink: 0,
  },
  newChatText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.primary,
  },
  composer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.gray,
    borderTopWidth: 1,
    borderTopColor: 'rgba(84, 46, 145, 0.08)',
  },
  gradientBorder: {
    borderRadius: radius.md + 3,
    padding: 1.5,
  },
  inputInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCFBFF',
    borderRadius: radius.md,
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
    paddingVertical: Platform.OS === 'web' ? spacing.sm : spacing.xs,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
    paddingVertical: spacing.sm,
    ...Platform.select({
      web: { outlineStyle: 'none' as never },
      default: {},
    }),
  },
  sendBtn: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(84, 46, 145, 0.18)',
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
  sendBtnGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  responseCard: {
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(84, 46, 145, 0.12)',
  },
  responseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  sparkleBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.lavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  responseLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.primary,
    letterSpacing: 0.3,
  },
  responseBody: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 23,
    color: colors.text,
    minHeight: 46,
  },
  caret: {
    color: colors.primaryLight,
    fontFamily: fonts.regular,
  },
  thinkingText: {
    fontFamily: fonts.semiBold,
    fontSize: 22,
    lineHeight: 28,
    color: colors.primary,
    letterSpacing: 2,
    minHeight: 46,
  },
  thinkingGhost: {
    color: 'rgba(84, 46, 145, 0.2)',
  },
  links: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.lavender,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  linkRowPressed: {
    opacity: 0.85,
  },
  linkText: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.primary,
    flex: 1,
    paddingRight: spacing.sm,
  },
  linkChevron: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.primaryLight,
  },
  section: {
    marginBottom: spacing.lg,
    // Match TextInput left inset: gradient border (1.5) + inputInner paddingLeft (md)
    paddingLeft: 1.5 + spacing.md,
  },
  questionListShell: {
    position: 'relative',
    overflow: 'hidden',
    paddingBottom: spacing.md,
  },
  questionList: {
    gap: spacing.xs,
  },
  questionRow: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(107, 98, 128, 0.14)',
  },
  questionRowPressed: {
    opacity: 0.75,
  },
  questionText: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: 'rgba(107, 98, 128, 0.72)',
  },
  questionFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 44,
  },
});
