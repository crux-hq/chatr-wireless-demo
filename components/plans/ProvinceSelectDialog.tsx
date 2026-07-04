import { useEffect, useState } from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { X, Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { CANADIAN_PROVINCES, getProvinceName, type ProvinceCode } from '@/lib/mock/provinces';
import { colors, radius, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

type ProvinceSelectDialogProps = {
  visible: boolean;
  selected: ProvinceCode;
  onClose: () => void;
  onConfirm: (code: ProvinceCode) => void;
};

const LEFT_COLUMN = CANADIAN_PROVINCES.slice(0, 5);
const RIGHT_COLUMN = CANADIAN_PROVINCES.slice(5);

export function ProvinceSelectDialog({ visible, selected, onClose, onConfirm }: ProvinceSelectDialogProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith('fr') ? 'fr' : 'en';
  const [pending, setPending] = useState<ProvinceCode>(selected);

  useEffect(() => {
    if (visible) setPending(selected);
  }, [visible, selected]);

  const renderColumn = (provinces: typeof CANADIAN_PROVINCES) => (
    <View style={{ flex: 1, gap: spacing.sm }}>
      {provinces.map((province) => {
        const isSelected = pending === province.code;
        return (
          <Pressable
            key={province.code}
            onPress={() => setPending(province.code)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: spacing.xs,
            }}>
            <Text
              style={{
                fontFamily: isSelected ? fonts.bold : fonts.regular,
                fontSize: 16,
                color: colors.text,
                flex: 1,
                paddingRight: spacing.sm,
              }}>
              {getProvinceName(province.code, locale)}
            </Text>
            {isSelected ? <Check color={colors.primary} size={18} strokeWidth={2.5} /> : null}
          </Pressable>
        );
      })}
    </View>
  );

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
            maxWidth: 560,
          }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 22, color: colors.text, flex: 1, paddingRight: spacing.md }}>
              {t('plans.province.dialogTitle')}
            </Text>
            <Pressable onPress={onClose} hitSlop={12} accessibilityLabel={t('common.close')}>
              <X color={colors.textMuted} size={22} />
            </Pressable>
          </View>

          <Text style={{ fontFamily: fonts.regular, fontSize: 15, color: colors.textMuted, marginTop: spacing.md }}>
            {t('plans.province.yourProvince')}
          </Text>

          <View style={{ flexDirection: 'row', gap: spacing.lg, marginTop: spacing.sm, marginBottom: spacing.xl }}>
            {renderColumn(LEFT_COLUMN)}
            {renderColumn(RIGHT_COLUMN)}
          </View>

          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <View style={{ flex: 1 }}>
              <Button
                title={t('common.continue')}
                onPress={() => {
                  onConfirm(pending);
                  onClose();
                }}
                variant="secondary"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Button title={t('common.cancel')} onPress={onClose} variant="outline" />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
