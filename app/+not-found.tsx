import { Link, Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts, FontSize } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Halaman Tidak Ditemukan' }} />
      <View style={styles.container}>
        <Text style={styles.emoji}>🕌</Text>
        <Text style={styles.title}>Halaman tidak ditemukan</Text>
        <Link href="/(tabs)/home" style={styles.link}>
          <Text style={styles.linkText}>Kembali ke Beranda</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
  emoji: { fontSize: 48, marginBottom: 16 },
  title: { fontFamily: Fonts.medium, fontSize: FontSize.lg, color: Colors.text, marginBottom: 20 },
  link: {},
  linkText: { fontFamily: Fonts.semiBold, fontSize: FontSize.base, color: Colors.primary, textDecorationLine: 'underline' },
});
