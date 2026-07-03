export const fontAssets = {
  SantralRegular: require('@/assets/fonts/Santral-Regular.woff2'),
  SantralMedium: require('@/assets/fonts/Santral-Medium.woff2'),
  SantralSemiBold: require('@/assets/fonts/Santral-SemiBold.woff2'),
  SantralBold: require('@/assets/fonts/Santral-Bold.woff2'),
  SantralExtraBold: require('@/assets/fonts/Santral-ExtraBold.woff2'),
};

export const fonts = {
  regular: 'SantralRegular',
  medium: 'SantralMedium',
  semiBold: 'SantralSemiBold',
  bold: 'SantralBold',
  extraBold: 'SantralExtraBold',
};

export const typography = {
  hero: {
    fontFamily: fonts.semiBold,
    fontSize: 32,
    lineHeight: 40,
    color: '#2D263B',
    marginBottom: 16,
  },
  pageTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 32,
    lineHeight: 40,
    color: '#2D263B',
  },
  pageSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    color: '#000000',
    marginBottom: 16,
  },
  h1: {
    fontFamily: fonts.semiBold,
    fontSize: 24,
    lineHeight: 30,
    color: '#2D263B',
    marginBottom: 16,
  },
  h2: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    lineHeight: 24,
    color: '#2D263B',
    marginBottom: 12,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    color: '#2D263B',
  },
  bodySmall: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    color: '#6B6280',
  },
  label: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    lineHeight: 18,
    color: '#2D263B',
  },
  button: {
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 24,
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 32,
    color: '#542E91',
  },
  priceAccent: {
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 32,
    color: '#FFB81C',
  },
};
