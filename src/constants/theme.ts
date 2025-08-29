
// Constantes del tema según ANEXO E: ESPECIFICACIONES UI v1.1

export const COLORS = {
  primary: '#D32F2F',
  background: '#FFFFFF',
  surface: '#F5F5F5', 
  textPrimary: '#212121',
  textSecondary: '#757575',
  accent: '#FFA000',
  statusSuccess: '#2E7D32',
  disabled: '#BDBDBD',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const TYPOGRAPHY = {
  h1: {
    fontSize: 24,
    fontWeight: '700' as const,
  },
  h2: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  h3: {
    fontSize: 18,
    fontWeight: '500' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
  },
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
} as const;
