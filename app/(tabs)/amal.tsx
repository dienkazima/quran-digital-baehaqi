import { useEffect, useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Animated, Share, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, FontSize, Spacing, Radius, Shadow } from '@/constants/theme';
import { kirimFatihah, getAmalStats } from '@/services/amal';

const AL_FATIHAH = [
  'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
  'الرَّحْمَٰنِ الرَّحِيمِ',
  'مَالِكِ يَوْمِ الدِّينِ',
  'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
  'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
  'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
];

export default function AmalScreen() {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showFatihah, setShowFatihah] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getAmalStats().then(s => setTotal(s.total));
  }, []);

  const handleKirim = async () => {
    if (loading) return;
    setLoading(true);
    setShowFatihah(true);

    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1.05, duration: 200, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      ]),
      { iterations: 3 }
    ).start();

    const newTotal = await kirimFatihah();
    setTotal(newTotal);
    setLoading(false);
    Alert.alert('Jazakumullah Khayran 🤲', 'Al-Fatihah telah dikirim.\nSemoga menjadi cahaya untuk Almarhum Baehaqi.');
  };

  const handleShare = () => {
    Share.share({
      message:
        'Ayo kirimkan Al-Fatihah untuk Almarhum Baehaqi melalui aplikasi Quran Digital Baehaqi. ' +
        'Sudah ' + total.toLocaleString('id-ID') + ' orang ikut membaca. ' +
        'Semoga menjadi amal jariyah yang terus mengalir. 🤲',
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#B71C1C', '#7B1FA2']} style={styles.header}>
        <Ionicons name="heart" size={32} color="#fff" />
        <Text style={styles.headerTitle}>Amal Jariyah</Text>
        <Text style={styles.headerSub}>untuk Almarhum Baehaqi</Text>
        <Text style={styles.headerSub2}>Dusun Gejome</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Counter */}
        <View style={styles.counterCard}>
          <Text style={styles.counterNumber}>{total.toLocaleString('id-ID')}</Text>
          <Text style={styles.counterLabel}>orang telah membaca Al-Fatihah</Text>
          <View style={styles.counterDivider} />
          <Text style={styles.counterQuote}>
            "Semoga setiap huruf menjadi cahaya{'\n'}untuk beliau di alam sana" 🌟
          </Text>
        </View>

        {/* Al-Fatihah Preview */}
        {showFatihah && (
          <View style={styles.fatihahCard}>
            <Text style={styles.fatihahTitle}>Al-Fatihah</Text>
            {AL_FATIHAH.map((ayat, i) => (
              <Text key={i} style={styles.fatihahAyat}>{ayat}</Text>
            ))}
          </View>
        )}

        {/* Tombol Kirim */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity style={styles.kirimBtn} onPress={handleKirim} activeOpacity={0.8} disabled={loading}>
            <LinearGradient colors={['#D4AF37', '#B8960C']} style={styles.kirimGradient}>
              <Ionicons name="hand-left" size={28} color="#fff" />
              <Text style={styles.kirimText}>
                {loading ? 'Mengirim...' : 'Kirim Al-Fatihah'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Niat */}
        <View style={styles.niatCard}>
          <Text style={styles.niatTitle}>نِيَّة</Text>
          <Text style={styles.niatText}>
            "Saya membaca Al-Fatihah ini dan menghadiahkan pahalanya kepada Almarhum Baehaqi dari Dusun Gejome. Semoga Allah menerimanya."
          </Text>
        </View>

        {/* Share */}
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.85}>
          <Ionicons name="share-social-outline" size={20} color={Colors.primary} />
          <Text style={styles.shareText}>Ajak orang lain ikut membaca</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 55, paddingHorizontal: Spacing.base, paddingBottom: Spacing['2xl'], alignItems: 'center', gap: 4 },
  headerTitle: { fontFamily: Fonts.bold, fontSize: FontSize['2xl'], color: '#fff', marginTop: 8 },
  headerSub: { fontFamily: Fonts.semiBold, fontSize: FontSize.base, color: 'rgba(255,255,255,0.9)' },
  headerSub2: { fontFamily: Fonts.regular, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)' },
  scroll: { padding: Spacing.base, gap: Spacing.md },
  counterCard: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.xl, alignItems: 'center', ...Shadow.md },
  counterNumber: { fontFamily: Fonts.bold, fontSize: 48, color: Colors.primary },
  counterLabel: { fontFamily: Fonts.medium, fontSize: FontSize.base, color: Colors.textSecondary, marginTop: 4 },
  counterDivider: { width: 60, height: 2, backgroundColor: Colors.secondary, marginVertical: Spacing.md },
  counterQuote: { fontFamily: Fonts.regular, fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, fontStyle: 'italic' },
  fatihahCard: { backgroundColor: Colors.primary, borderRadius: Radius.lg, padding: Spacing.lg, alignItems: 'center', gap: 8 },
  fatihahTitle: { fontFamily: Fonts.bold, fontSize: FontSize.base, color: Colors.secondary, marginBottom: 8 },
  fatihahAyat: { fontFamily: 'Amiri-Regular', fontSize: 20, color: '#fff', textAlign: 'center', lineHeight: 38 },
  kirimBtn: { borderRadius: Radius.xl, overflow: 'hidden', ...Shadow.lg },
  kirimGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: Spacing.lg, gap: 12 },
  kirimText: { fontFamily: Fonts.bold, fontSize: FontSize.lg, color: '#fff' },
  niatCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg, borderLeftWidth: 4, borderLeftColor: Colors.secondary },
  niatTitle: { fontFamily: 'Amiri-Bold', fontSize: 24, color: Colors.primary, textAlign: 'center', marginBottom: 8 },
  niatText: { fontFamily: Fonts.regular, fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 22, fontStyle: 'italic', textAlign: 'center' },
  shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.surface, borderRadius: Radius.full, padding: Spacing.md, gap: 8, borderWidth: 1.5, borderColor: Colors.primary, ...Shadow.sm },
  shareText: { fontFamily: Fonts.semiBold, fontSize: FontSize.base, color: Colors.primary },
});
