import { TextStyle } from 'react-native';

export const fontFamily = {
  displayRegular: 'Outfit_400Regular',
  displayMedium: 'Outfit_500Medium',
  displaySemibold: 'Outfit_600SemiBold',
  bodyRegular: 'Manrope_400Regular',
  bodyMedium: 'Manrope_500Medium',
  bodySemibold: 'Manrope_600SemiBold',
  bodyBold: 'Manrope_700Bold',
} as const;

type T = TextStyle;

export const typography = {
  displayHero: {
    fontFamily: fontFamily.displaySemibold,
    fontSize: 48,
    lineHeight: 56,
    letterSpacing: -0.96,
  } satisfies T,
  headlineLg: {
    fontFamily: fontFamily.displaySemibold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.32,
  } satisfies T,
  headlineLgMobile: {
    fontFamily: fontFamily.displaySemibold,
    fontSize: 28,
    lineHeight: 34,
  } satisfies T,
  titleMd: {
    fontFamily: fontFamily.bodySemibold,
    fontSize: 20,
    lineHeight: 28,
  } satisfies T,
  bodyLg: {
    fontFamily: fontFamily.bodyRegular,
    fontSize: 17,
    lineHeight: 26,
  } satisfies T,
  bodySm: {
    fontFamily: fontFamily.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
  } satisfies T,
  labelCaps: {
    fontFamily: fontFamily.bodyBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  } satisfies T,
} as const;

export type TypographyToken = keyof typeof typography;
