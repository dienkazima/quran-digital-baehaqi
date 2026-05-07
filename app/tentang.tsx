import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Fonts, FontSize, Spacing, Radius, Shadow } from '@/constants/theme';

export default function TentangScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.primary, '#0a2829']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.portrait}>
          <Ionicons name="moon" size={48} color={Colors.secondary} />
        </View>
        <Text style={styles.nama}>Almarhum Baehaqi</Text>
        <Text style={styles.asal}>Dusun Gejome</Text>
        <Text style={styles.rahmat}>رَحِمَهُ اللَّهُ</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>💚 Tentang Aplikasi Ini</Text>
          <Text style={styles.cardText}>
            Aplikasi ini dibuat sebagai bentuk cinta, doa, dan penghormatan kepada Almarhum Baehaqi dari Dusun Gejome.{'\n\n'}
            Semoga setiap huruf Al-Qur'an yang dibaca melalui aplikasi ini menjadi amal jariyah yang terus mengalir, menerangi beliau di alam sana.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🤲 Niat Pembuatan</Text>
          <Text style={styles.arabNiat}>اَللَّهُمَّ اجْعَلْ هَذَا صَدَقَةً جَارِيَةً</Text>
          <Text style={styles.cardText}>
            "Ya Allah, jadikanlah ini sebagai sedekah jariyah."{'\n\n'}
            Aplikasi ini dibangun semata-mata untuk memudahkan umat Islam membaca Al-Qur'an, berdoa, dan mengirimkan bacaan untuk orang yang telah mendahului kita.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📖 Sumber Data</Text>
          {[
            { icon: 'book-outline', label: 'Teks Arab', val: 'Tanzil Project (Utsmani)' },
            { icon: 'flag-outline', label: 'Terjemahan', val: 'Kementerian Agama RI' },
            { icon: 'musical-notes-outline', label: 'Audio Murottal', val: 'Quran.com API' },
          ].map(item => (
            <View key={item.label} style={styles.sourceRow}>
              <Ionicons name={item.icon as any} size={18} color={Colors.primary} />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.sourceLabel}>{item.label}</Text>
                <Text style={styles.sourceVal}>{item.val}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.doaCard}>
          <Text style={styles.doaArab}>اَللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ</Text>
          <Text style={styles.doaTrans}>
            "Ya Allah, ampunilah dia, sayangilah dia, selamatkan dia dan maafkanlah dia."
          </Text>
        </View>

        <Text style={styles.versi}>Quran Digital Baehaqi v1.0.0</Text>
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 55, paddingBottom: Spacing['2xl'], paddingHorizontal: Spacing.base, alignItems: 'center' },
  backBtn: { alignSelf: 'flex-start', width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg },
  portrait: { width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(212,175,55,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.secondary, marginBottom: Spacing.md },
  nama: { fontFamily: Fonts.bold, fontSize: FontSize.xl, color: '#fff' },
  asal: { fontFamily: Fonts.regular, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  rahmat: { fontFamily: 'Amiri-Regular', fontSize: 20, color: Colors.secondary, marginTop: 8 },
  scroll: { padding: Spacing.base, gap: Spacing.md },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg, ...Shadow.sm },
  cardTitle: { fontFamily: Fonts.semiBold, fontSize: FontSize.base, color: Colors.text, marginBottom: Spacing.sm },
  cardText: { fontFamily: Fonts.regular, fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 22 },
  arabNiat: { fontFamily: 'Amiri-Regular', fontSize: 20, color: Colors.primary, textAlign: 'center', lineHeight: 40, marginBottom: Spacing.sm },
  sourceRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.xs, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  sourceLabel: { fontFamily: Fonts.medium, fontSize: FontSize.xs, color: Colors.textSecondary },
  sourceVal: { fontFamily: Fonts.regular, fontSize: FontSize.sm, color: Colors.text },
  doaCard: { backgroundColor: Colors.primary, borderRadius: Radius.lg, padding: Spacing.lg, alignItems: 'center', ...Shadow.md },
  doaArab: { fontFamily: 'Amiri-Regular', fontSize: 20, color: '#fff', textAlign: 'center', lineHeight: 40, marginBottom: Spacing.sm },
  doaTrans: { fontFamily: Fonts.regular, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)', textAlign: 'center', fontStyle: 'italic' },
  versi: { fontFamily: Fonts.regular, fontSize: FontSize.xs, color: Colors.textLight, textAlign: 'center', marginTop: Spacing.sm },
});
