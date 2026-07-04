import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { ProvinceSelectDialog } from '@/components/plans/ProvinceSelectDialog';
import { DEFAULT_PROVINCE_CODE, getProvinceByCode, getProvinceName, type ProvinceCode } from '@/lib/mock/provinces';
import { colors, radius, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

type ProvinceSelectFieldProps = {
  label: string;
  value: string;
  onChange: (code: ProvinceCode) => void;
  required?: boolean;
  error?: string;
};

export function ProvinceSelectField({ label, value, onChange, required, error }: ProvinceSelectFieldProps) {
  const { i18n } = useTranslation();
  const locale = i18n.language.startsWith('fr') ? 'fr' : 'en';
  const [dialogVisible, setDialogVisible] = useState(false);
  const selectedCode = getProvinceByCode(value.trim())?.code ?? DEFAULT_PROVINCE_CODE;
  const displayName = getProvinceName(selectedCode, locale);

  return (
    <>
      <View style={{ marginBottom: spacing.md }}>
        <Text style={{ fontFamily: fonts.semiBold, marginBottom: spacing.xs, color: colors.text }}>
          {label}
          {required ? <Text style={{ color: colors.red }}> *</Text> : null}
        </Text>
        <Pressable
          onPress={() => setDialogVisible(true)}
          accessibilityRole="button"
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: error ? colors.red : colors.grayMid,
            borderRadius: radius.sm,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm + 4,
            backgroundColor: colors.surfaceElevated,
          }}>
          <Text style={{ fontFamily: fonts.regular, fontSize: 16, color: colors.text, flex: 1 }}>{displayName}</Text>
          <ChevronDown color={colors.textMuted} size={20} />
        </Pressable>
        {error ? (
          <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.red, marginTop: spacing.xs }}>
            {error}
          </Text>
        ) : null}
      </View>

      <ProvinceSelectDialog
        visible={dialogVisible}
        selected={selectedCode}
        onClose={() => setDialogVisible(false)}
        onConfirm={onChange}
      />
    </>
  );
}
