import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, RefreshControl, ActivityIndicator, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { Colors, Fonts, FontSize, Spacing, Radius, Shadow } from '@/constants/theme';
import { loadJson, StorageKeys } from '@/services/storage';
import type { LastRead } from '@/services/quran';
import { getSholatInfo, SholatState } from '@/services/sholat';

const AYAT_HARIAN = [
  { arab: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', terjemahan: 'Sesungguhnya bersama kesulitan ada kemudahan.', sumber: 'QS. Al-Insyirah: 6' },
  { arab: 'وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ', terjemahan: 'Boleh jadi kamu membenci sesuatu, padahal ia amat baik bagimu.', sumber: 'QS. Al-Baqarah: 216' },
  { arab: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ', terjemahan: 'Sesungguhnya Allah bersama orang-orang yang sabar.', sumber: 'QS. Al-Baqarah: 153' },
  { arab: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', terjemahan: 'Cukuplah Allah menjadi Penolong kami dan Allah adalah sebaik-baik Pelindung.', sumber: 'QS. Ali Imran: 173' },
  { arab: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', terjemahan: 'Karena sesungguhnya sesudah kesulitan itu ada kemudahan.', sumber: 'QS. Al-Insyirah: 5' },
];

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 11) return 'Selamat Pagi';
  if (h < 15) return 'Selamat Siang';
  if (h < 18) return 'Selamat Sore';
  return 'Selamat Malam';
}

export default function HomeScreen() {
  const [lastRead, setLastRead] = useState<LastRead | null>(null);
  const [ayatIdx] = useState(() => new Date().getDate() % AYAT_HARIAN.length);
  const [loading, setLoading] = useState(true);
  
  const [sholatState, setSholatState] = useState<SholatState>({
    locationText: 'Mencari...',
    sholatData: [],
    isLoading: true,
    error: null,
  });

  const loadData = useCallback(async (forceRequest: boolean = false) => {
    setLoading(true);
    const lr = await loadJson<LastRead | null>(StorageKeys.LAST_READ, null);
    setLastRead(lr);
    
    // Ambil Data Sholat
    const sData = await getSholatInfo(forceRequest);
    setSholatState(sData);
    
    setLoading(false);
  }, []);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const ayat = AYAT_HARIAN[ayatIdx];
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  
  // Tentukan sholat sekarang (fallback subuh jika belum terload)
  const sholatSekarang = sholatState.sholatData.length > 0 
    ? (sholatState.sholatData.find((s) => {
        const [h, m] = s.waktu.split(':').map(Number);
        return h * 60 + m > nowMins;
      }) ?? sholatState.sholatData[0])
    : { nama: 'Menghitung...', waktu: '--:--', icon: 'time-outline' };

  return (
    <View style={styles.container}>
      {/* Header Gradient */}
      <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{getGreeting()} 👋</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Ionicons name="location" size={14} color={Colors.secondary} />
              <Text style={[styles.subGreeting, { marginTop: 0, marginLeft: 8 }]}> {sholatState.locationText} </Text>
              <TouchableOpacity onPress={() => loadData(true)} style={{ marginLeft: 8 }} disabled={loading}>
                <Ionicons name={loading ? 'refresh-circle' : 'refresh'} size={16} color={Colors.secondary} />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={() => router.push('/tentang')} style={styles.aboutBtn}>
            <Ionicons name="information-circle-outline" size={26} color={Colors.secondary} />
          </TouchableOpacity>
        </View>

        {/* Sholat Berikutnya */}
        <TouchableOpacity 
          style={styles.sholatCard} 
          onPress={() => router.push('/sholat')} 
          activeOpacity={0.85}
        >
          <View>
            <Text style={styles.sholatLabel}>Sholat Berikutnya</Text>
            <Text style={styles.sholatNama}>{sholatSekarang.nama}</Text>
          </View>
          <View style={styles.sholatRight}>
            <Ionicons name={sholatSekarang.icon as any} size={20} color={Colors.secondary} />
            <Text style={styles.sholatWaktu}>{sholatSekarang.waktu}</Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => loadData(true)} tintColor={Colors.primary} />}
      >
        {/* Last Read */}
        <TouchableOpacity
          style={styles.lastReadCard}
          onPress={() => lastRead && router.push(`/quran/${lastRead.surahId}?ayat=${lastRead.ayat}`)}
          activeOpacity={0.85}
        >
          <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={styles.lastReadGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <View style={styles.lastReadLeft}>
              <Ionicons name="book-outline" size={22} color={Colors.secondary} />
              <View style={{ marginLeft: Spacing.sm }}>
                <Text style={styles.lastReadLabel}>Terakhir Dibaca</Text>
                {lastRead ? (
                  <Text style={styles.lastReadTitle}>{lastRead.surahName} · Ayat {lastRead.ayat}</Text>
                ) : (
                  <Text style={styles.lastReadTitle}>Mulai membaca Al-Qur'an</Text>
                )}
              </View>
            </View>
            <View style={styles.lastReadArrow}>
              <Ionicons name="chevron-forward" size={20} color={Colors.secondary} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Ayat Harian */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ayat Hari Ini ✨</Text>
          <View style={styles.ayatCard}>
            <Text style={styles.ayatArab}>{ayat.arab}</Text>
            <View style={styles.divider} />
            <Text style={styles.ayatTerjemahan}>"{ayat.terjemahan}"</Text>
            <Text style={styles.ayatSumber}>{ayat.sumber}</Text>
          </View>
        </View>

        {/* Tentang Ayah */}
        <TouchableOpacity style={styles.ayahCard} onPress={() => router.push('/tentang')} activeOpacity={0.85}>
          <LinearGradient colors={['#D4AF37', '#B8960C']} style={styles.ayahGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Ionicons name="moon" size={24} color="#fff" />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.ayahTitle}>Untuk Almarhum Baehaqi</Text>
              <Text style={styles.ayahSub}>Semoga menjadi amal jariyah yang terus mengalir 🤲</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 55, paddingHorizontal: Spacing.base, paddingBottom: Spacing.lg },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.md },
  greeting: { fontFamily: Fonts.bold, fontSize: FontSize.xl, color: '#fff' },
  subGreeting: { fontFamily: Fonts.regular, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  aboutBtn: { padding: 4 },
  sholatCard: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: Radius.md, padding: Spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sholatLabel: { fontFamily: Fonts.regular, fontSize: FontSize.xs, color: 'rgba(255,255,255,0.7)' },
  sholatNama: { fontFamily: Fonts.bold, fontSize: FontSize.lg, color: '#fff', marginTop: 2 },
  sholatRight: { alignItems: 'flex-end', gap: 4 },
  sholatWaktu: { fontFamily: Fonts.semiBold, fontSize: FontSize['2xl'], color: Colors.secondary },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.base, paddingTop: Spacing.lg },
  lastReadCard: { borderRadius: Radius.lg, overflow: 'hidden', marginBottom: Spacing.lg, ...Shadow.md },
  lastReadGradient: { padding: Spacing.base, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  lastReadLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  lastReadLabel: { fontFamily: Fonts.regular, fontSize: FontSize.xs, color: 'rgba(255,255,255,0.7)' },
  lastReadTitle: { fontFamily: Fonts.semiBold, fontSize: FontSize.base, color: '#fff', marginTop: 2 },
  lastReadArrow: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  section: { marginBottom: Spacing.lg },
  sectionTitle: { fontFamily: Fonts.semiBold, fontSize: FontSize.md, color: Colors.text, marginBottom: Spacing.sm },
  ayatCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg, ...Shadow.sm, borderLeftWidth: 4, borderLeftColor: Colors.secondary },
  ayatArab: { fontFamily: 'Amiri-Regular', fontSize: 24, color: Colors.primary, textAlign: 'right', lineHeight: 44 },
  divider: { height: 1, backgroundColor: Colors.divider, marginVertical: Spacing.sm },
  ayatTerjemahan: { fontFamily: Fonts.regular, fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 22, fontStyle: 'italic' },
  ayatSumber: { fontFamily: Fonts.medium, fontSize: FontSize.xs, color: Colors.secondary, marginTop: Spacing.xs },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  menuItem: { width: '47%', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, alignItems: 'center', ...Shadow.sm },
  menuIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  menuLabel: { fontFamily: Fonts.medium, fontSize: FontSize.sm, color: Colors.text, textAlign: 'center' },
  ayahCard: { borderRadius: Radius.lg, overflow: 'hidden', ...Shadow.md },
  ayahGradient: { padding: Spacing.base, flexDirection: 'row', alignItems: 'center' },
  ayahTitle: { fontFamily: Fonts.semiBold, fontSize: FontSize.base, color: '#fff' },
  ayahSub: { fontFamily: Fonts.regular, fontSize: FontSize.xs, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
});
