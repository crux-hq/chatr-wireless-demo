import { Modal, View, Text, Pressable } from 'react-native';
import { X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { AddOn } from '@/lib/mock/types';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/i18n';
import { getAddOnTermDates, getAddOnTermsKey } from '@/lib/addon-purchase';
import { colors, radius, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

type AddOnPurchaseConfirmDialogProps = {
  visible: boolean;
  addOn: AddOn;
  locale: 'en' | 'fr';
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function AddOnPurchaseConfirmDialog({
  visible,
  addOn,
  locale,
  loading,
  onClose,
  onConfirm,
}: AddOnPurchaseConfirmDialogProps) {
  const { t } = useTranslation();
  const name = locale === 'fr' ? addOn.nameFr : addOn.nameEn;
  const { purchasedAt, expiresAt } = getAddOnTermDates();
  const termsKey = getAddOnTermsKey(addOn);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.45)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: spacing.lg,
        }}>
        <View
          style={{
            backgroundColor: colors.white,
            borderRadius: radius.lg,
            padding: spacing.xl,
            width: '100%',
            maxWidth: 400,
          }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 20, color: colors.text, flex: 1, paddingRight: spacing.md }}>
              {t('addons.confirmTitle')}
            </Text>
            <Pressable onPress={onClose} hitSlop={12} accessibilityLabel={t('common.close')}>
              <X color={colors.textMuted} size={22} />
            </Pressable>
          </View>

          <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.primary, marginTop: spacing.md }}>
            {name}
          </Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 16, color: colors.grayDark, marginTop: spacing.sm }}>
            {t('addons.confirmPrice', { price: formatCurrency(addOn.price, locale) })}
          </Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 16, color: colors.grayDark, marginTop: spacing.xs }}>
            {t('addons.confirmActive', {
              start: formatDate(purchasedAt, locale),
              end: formatDate(expiresAt, locale),
            })}
          </Text>
          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: 15,
              color: colors.textMuted,
              marginTop: spacing.md,
              lineHeight: 22,
            }}>
            {t(termsKey, {
              gb: addOn.dataGb ?? 0,
              minutes: addOn.minutes ?? 0,
            })}
          </Text>

          <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg }}>
            <View style={{ flex: 1 }}>
              <Button title={t('common.cancel')} onPress={onClose} variant="outline" disabled={loading} />
            </View>
            <View style={{ flex: 1 }}>
              <Button title={t('common.confirm')} onPress={onConfirm} loading={loading} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
