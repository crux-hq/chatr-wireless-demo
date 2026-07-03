import { useTranslation } from 'react-i18next';
import { AuthScreenShell } from '@/components/layout/AuthScreenShell';
import { PageSubtitle } from '@/components/layout/PageSubtitle';
import { GuestTopUpWizard } from '@/components/topup/GuestTopUpWizard';
import { PublicHomeFooter } from '@/components/layout/PublicHomeFooter';
import { spacing } from '@/lib/theme/colors';

export default function GuestTopUpScreen() {
  const { t } = useTranslation();

  return (
    <AuthScreenShell title={t('topUp.guest.title')} keyboard contentStyle={{ paddingBottom: 100 }}>
      <PageSubtitle style={{ marginBottom: spacing.lg }}>{t('topUp.guest.intro')}</PageSubtitle>
      <GuestTopUpWizard />
      <PublicHomeFooter />
    </AuthScreenShell>
  );
}
