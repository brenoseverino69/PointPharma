export const colors = {
  primary: '#0099B8',
  green: '#00C471',
  greenDark: '#00A15C',
  cyan: '#00C8F0',
  dark: '#1B1F1E',
  gray: '#D9D9D9',
  grayDark: '#B3B3B3',
  text: '#1B1F1E',
  muted: '#6B7280',
  white: '#FFFFFF',
  danger: '#E5484D',
} as const;

export const fonts = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semi: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
} as const;

export const money = (v: number): string =>
  'R$' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
