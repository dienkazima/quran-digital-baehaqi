// ============================================================
// TEMA UTAMA – Quran Digital Baehaqi
// Warna Islami Modern: Hijau Tua, Emas, Putih
// ============================================================

export const Colors = {
  primary: '#0F3D3E',      // Hijau tua utama
  primaryLight: '#1a5c5e', // Hijau tua terang
  primaryDark: '#082829',  // Hijau tua gelap
  secondary: '#D4AF37',    // Emas aksen
  secondaryLight: '#F0D060',
  background: '#E2F3F5',   // Hijau lembut background
  surface: '#FFFFFF',      // Putih kartu
  surfaceAlt: '#F7FAFA',
  text: '#1A2E2F',         // Teks gelap
  textSecondary: '#4A6B6C',
  textLight: '#8AA8A9',
  textOnPrimary: '#FFFFFF',
  accent: '#E8F5E9',
  error: '#C62828',
  success: '#2E7D32',
  divider: '#D0E8EA',
  overlay: 'rgba(15, 61, 62, 0.7)',
  cardShadow: 'rgba(15, 61, 62, 0.12)',
  gold: '#D4AF37',
  goldLight: '#F5E6A0',
};

export const Fonts = {
  // Latin
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
  // Arab
  arabic: 'Amiri-Regular',
  arabicBold: 'Amiri-Bold',
};

export const FontSize = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 34,
  arabic: 26,
  arabicLg: 32,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const Shadow = {
  sm: {
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 6,
  },
  lg: {
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 10,
  },
};
