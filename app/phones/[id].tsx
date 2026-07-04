import { useState } from 'react';
import { ScrollView, View, Text, Linking, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react-native';
import { Header } from '@/components/layout/Header';
import { Button, Card } from '@/components/ui/Button';
import { PhoneImage } from '@/components/phones/PhoneImage';
import { PhoneImageLightbox } from '@/components/phones/PhoneImageLightbox';
import { PhoneSpecs } from '@/components/phones/PhoneSpecs';
import { getPhoneById } from '@/lib/mock/phones';
import { useAppStore } from '@/lib/store';
import { formatCurrency } from '@/lib/i18n';
import { PublicHomeFooter } from '@/components/layout/PublicHomeFooter';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

const TSC_URL = 'https://www.tsc.ca';

export default function PhoneDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const locale = useAppStore((s) => s.locale);
  const [imageOpen, setImageOpen] = useState(false);

  const phone = getPhoneById(id ?? '');
  if (!phone) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.gray }}>
        <Header />
        <Text style={{ padding: spacing.md }}>{t('errors.phoneNotFound')}</Text>
      </View>
    );
  }

  const name = locale === 'fr' ? phone.nameFr : phone.nameEn;
  const description = locale === 'fr' ? phone.descriptionFr : phone.descriptionEn;
  const inBox = locale === 'fr' ? phone.inBoxFr : phone.inBoxEn;

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <PhoneImageLightbox visible={imageOpen} phone={phone} onClose={() => setImageOpen(false)} />
      <Header />
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingTop: spacing.lg, paddingBottom: 100 }}>
        <Pressable
          onPress={() => router.push('/phones')}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing.md }}>
          <ChevronLeft size={20} color={colors.primary} />
          <Text style={{ color: colors.primary, fontFamily: fonts.semiBold }}>{t('phones.backToPhones')}</Text>
        </Pressable>

        <Text style={{ fontSize: 32, fontFamily: fonts.bold, color: colors.text, marginBottom: spacing.md }}>
          {name}
        </Text>

        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <PhoneImage phone={phone} height={260} badgePosition="right" onPress={() => setImageOpen(true)} />

          <View style={{ padding: spacing.lg }}>
            <Text style={{ fontFamily: fonts.extraBold, fontSize: 32, color: colors.primary }}>
              {formatCurrency(phone.price, locale)}
            </Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted, marginTop: 2 }}>
              {t('phones.noTermPrice')}
            </Text>

            <Text style={{ fontFamily: fonts.bold, fontSize: 16, marginTop: spacing.lg, marginBottom: spacing.sm }}>
              {t('phones.inTheBox')}
            </Text>
            {inBox.map((item) => (
              <Text key={item} style={{ fontFamily: fonts.regular, color: colors.text, marginBottom: 4 }}>
                • {item}
              </Text>
            ))}

            <View style={{ height: 1, backgroundColor: colors.grayMid, marginVertical: spacing.lg }} />
            <Text style={{ fontFamily: fonts.regular, fontSize: 16, lineHeight: 24, color: colors.text }}>
              {description}
            </Text>
          </View>
        </Card>

        <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
          {phone.buyAtTsc ? (
            <Button title={t('phones.buyAtTsc')} onPress={() => void Linking.openURL(TSC_URL)} />
          ) : null}
          <Button title={t('phones.findStore')} variant="secondary" onPress={() => router.push('/stores')} />
        </View>

        {phone.buyAtTsc ? (
          <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted, marginTop: spacing.md }}>
            {t('phones.tscNote')}
          </Text>
        ) : null}

        <Text style={{ fontFamily: fonts.bold, fontSize: 20, marginTop: spacing.xl, marginBottom: spacing.md }}>
          {t('phones.specs')}
        </Text>
        <PhoneSpecs sections={phone.specs} />

        <PublicHomeFooter />
      </ScrollView>
    </View>
  );
}
