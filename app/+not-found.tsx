import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/Themed';
import { Header, PageTitle } from '@/components/layout/Header';
import { colors } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

export default function NotFoundScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Header />
      <PageTitle>{t('errors.notFoundTitle')}</PageTitle>
      <Text style={styles.title}>{t('errors.notFoundBody')}</Text>

      <Link href="/" style={styles.link}>
        <Text style={styles.linkText}>{t('errors.goHome')}</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.bold,
    paddingHorizontal: 24,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 24,
  },
  linkText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: '#2e78b7',
  },
});
