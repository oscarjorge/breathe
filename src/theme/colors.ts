export const colors = {
  surface: '#faf9f6',
  surfaceDim: '#dbdad7',
  surfaceBright: '#faf9f6',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f4f3f1',
  surfaceContainer: '#efeeeb',
  surfaceContainerHigh: '#e9e8e5',
  surfaceContainerHighest: '#e3e2e0',
  onSurface: '#1a1c1a',
  onSurfaceVariant: '#404849',
  inverseSurface: '#2f312f',
  inverseOnSurface: '#f2f1ee',
  outline: '#71787a',
  outlineVariant: '#c0c8c9',
  surfaceTint: '#39656c',

  primary: '#114349',
  onPrimary: '#ffffff',
  primaryContainer: '#2d5a61',
  onPrimaryContainer: '#a2d0d8',
  inversePrimary: '#a1ced6',

  secondary: '#3a6758',
  onSecondary: '#ffffff',
  secondaryContainer: '#bcedda',
  onSecondaryContainer: '#406d5e',

  tertiary: '#2b4047',
  onTertiary: '#ffffff',
  tertiaryContainer: '#42575f',
  onTertiaryContainer: '#b5ccd5',

  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',

  background: '#faf9f6',
  onBackground: '#1a1c1a',
  surfaceVariant: '#e3e2e0',

  // semantic helpers
  mintGradientStart: '#bcedda',
  mintGradientEnd: '#a1d1bf',
  glassWhite: 'rgba(255, 255, 255, 0.55)',
  shadowPrimary: 'rgba(17, 67, 73, 0.08)',
} as const;

export type ColorToken = keyof typeof colors;
