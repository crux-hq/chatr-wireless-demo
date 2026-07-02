import { useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, Linking } from 'react-native';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MessageCircle, Phone, MapPin } from 'lucide-react-native';
import { Card, Button } from '@/components/ui/Button';
import { FAQ_ITEMS } from '@/lib/mock/stores';
import { useAppStore } from '@/lib/store';
import { colors, spacing } from '@/lib/theme/colors';

export default function SupportScreen() {
  const { t } = useTranslation();
  const locale = useAppStore((s) => s.locale);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: t('support.chatWelcome') },
  ]);
  const [chatInput, setChatInput] = useState('');

  const filtered = FAQ_ITEMS.filter((f) => {
    const q = locale === 'fr' ? f.questionFr : f.questionEn;
    return q.toLowerCase().includes(search.toLowerCase());
  });

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages([
      ...chatMessages,
      { role: 'user', text: chatInput },
      { role: 'bot', text: t('support.chatResponse') },
    ]);
    setChatInput('');
  };

  return (
    <>
      <Stack.Screen options={{ title: t('support.title'), headerShown: true }} />
      <ScrollView style={{ flex: 1, backgroundColor: colors.gray }} contentContainerStyle={{ padding: spacing.md }}>
        <Text style={{ fontWeight: '800', fontSize: 18, marginBottom: spacing.md }}>{t('support.contact')}</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg }}>
          <Pressable style={{ flex: 1, backgroundColor: colors.green, padding: spacing.md, borderRadius: 12, alignItems: 'center' }}>
            <MessageCircle color={colors.white} size={24} />
            <Text style={{ color: colors.white, fontWeight: '600', marginTop: 4 }}>{t('support.chat')}</Text>
          </Pressable>
          <Pressable
            onPress={() => Linking.openURL('tel:611')}
            style={{ flex: 1, backgroundColor: colors.white, padding: spacing.md, borderRadius: 12, alignItems: 'center' }}>
            <Phone color={colors.green} size={24} />
            <Text style={{ color: colors.green, fontWeight: '600', marginTop: 4 }}>{t('support.phone')}</Text>
          </Pressable>
          <Pressable style={{ flex: 1, backgroundColor: colors.white, padding: spacing.md, borderRadius: 12, alignItems: 'center' }}>
            <MapPin color={colors.green} size={24} />
            <Text style={{ color: colors.green, fontWeight: '600', marginTop: 4 }}>{t('support.visitStore')}</Text>
          </Pressable>
        </View>

        <Card style={{ marginBottom: spacing.lg }}>
          {chatMessages.map((msg, i) => (
            <View
              key={i}
              style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.role === 'user' ? colors.green : colors.gray,
                padding: spacing.sm,
                borderRadius: 12,
                marginBottom: spacing.sm,
                maxWidth: '85%',
              }}>
              <Text style={{ color: msg.role === 'user' ? colors.white : colors.black }}>{msg.text}</Text>
            </View>
          ))}
          <TextInput
            value={chatInput}
            onChangeText={setChatInput}
            placeholder={t('support.chat')}
            style={{ borderWidth: 1, borderColor: colors.grayMid, borderRadius: 8, padding: spacing.sm, marginTop: spacing.sm }}
          />
          <View style={{ marginTop: spacing.sm }}>
            <Button title={t('common.confirm')} onPress={sendChat} />
          </View>
        </Card>

        <Text style={{ fontWeight: '800', fontSize: 18, marginBottom: spacing.sm }}>{t('support.faq')}</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={t('common.search')}
          style={{
            backgroundColor: colors.white,
            borderRadius: 12,
            padding: spacing.md,
            marginBottom: spacing.md,
          }}
        />
        {filtered.map((faq) => (
          <Card key={faq.id} style={{ marginBottom: spacing.sm }}>
            <Text
              onPress={() => setExpanded(expanded === faq.id ? null : faq.id)}
              style={{ fontWeight: '700' }}>
              {locale === 'fr' ? faq.questionFr : faq.questionEn}
            </Text>
            {expanded === faq.id ? (
              <Text style={{ color: colors.grayDark, marginTop: 8 }}>
                {locale === 'fr' ? faq.answerFr : faq.answerEn}
              </Text>
            ) : null}
          </Card>
        ))}
      </ScrollView>
    </>
  );
}
