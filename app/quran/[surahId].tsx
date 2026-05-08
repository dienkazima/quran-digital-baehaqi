import { useEffect, useState, useRef, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, Share, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, Fonts, FontSize, Spacing, Radius, Shadow } from '@/constants/theme';
import { getAyat, getSurahList, type Ayat, type Surah } from '@/services/quran';
import { loadJson, saveJson, StorageKeys } from '@/services/storage';

export default function SurahDetailScreen() {
  const { surahId, ayat: ayatParam } = useLocalSearchParams<{ surahId: string; ayat?: string }>();
  const id = Number(surahId);
  const scrollToAyat = ayatParam ? Number(ayatParam) : null;

  const [surah, setSurah] = useState<Surah | null>(null);
  const [ayats, setAyats] = useState<Ayat[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const [playingId, setPlayingId] = useState<number | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const flatListRef = useRef<FlatList<Ayat>>(null);

  useEffect(() => {
    // Inisialisasi mode audio
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    }).catch(() => {});
    loadData();
    return () => {
      // Bersihkan audio saat meninggalkan halaman
      soundRef.current?.unloadAsync().catch(() => {});
    };
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [list, verses, bm] = await Promise.all([
        getSurahList(),
        getAyat(id),
        loadJson<number[]>(StorageKeys.BOOKMARKS, []),
      ]);
      setSurah(list.find(s => s.id === id) ?? null);
      setAyats(verses);
      setBookmarks(new Set(bm));

      // Scroll ke ayat yang di-bookmark setelah data terload
      if (scrollToAyat && verses.length > 0) {
        const idx = verses.findIndex(v => v.nomor === scrollToAyat);
        if (idx > 0) {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({ index: idx, animated: true, viewPosition: 0.1 });
          }, 600);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const saveLastRead = useCallback(async (nomor: number) => {
    if (!surah) return;
    await saveJson(StorageKeys.LAST_READ, { surahId: id, surahName: surah.nama_latin, ayat: nomor });
  }, [surah, id]);

  const toggleBookmark = async (nomor: number) => {
    const bm = new Set(bookmarks);
    bm.has(nomor) ? bm.delete(nomor) : bm.add(nomor);
    setBookmarks(bm);
    await saveJson(StorageKeys.BOOKMARKS, Array.from(bm));
    await saveLastRead(nomor);
  };

  const playAudio = async (ayat: Ayat) => {
    // Cek apakah ayat yang sama sedang diputar (untuk toggle stop)
    const isSameAyat = playingId === ayat.nomor;

    // Bersihkan audio yang sedang berjalan
    if (soundRef.current) {
      try { await soundRef.current.unloadAsync(); } catch {}
      soundRef.current = null;
    }
    setPlayingId(null);

    // Jika tap ayat yang sama → stop (toggle)
    if (isSameAyat) return;

    // Putar audio baru
    try {
      setPlayingId(ayat.nomor);
      saveLastRead(ayat.nomor);

      const { sound } = await Audio.Sound.createAsync(
        { uri: ayat.audio_url },
        { shouldPlay: true }
      );
      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingId(null);
          sound.unloadAsync().catch(() => {});
          soundRef.current = null;
        }
      });
    } catch (e) {
      setPlayingId(null);
      Alert.alert(
        'Audio tidak tersedia',
        'Pastikan koneksi internet Anda aktif, lalu coba lagi.'
      );
    }
  };

  const shareAyat = (ayat: Ayat) => {
    Share.share({ message: `${ayat.arab}\n\n${ayat.terjemahan}\n\n(${surah?.nama_latin} : ${ayat.nomor})` });
  };

  const renderAyat = ({ item }: { item: Ayat }) => {
    const isBookmarked = bookmarks.has(item.nomor);
    const isPlaying = playingId === item.nomor;
    return (
      <View style={styles.ayatCard}>
        <View style={styles.ayatTopRow}>
          <View style={styles.nomorBox}><Text style={styles.nomor}>{item.nomor}</Text></View>
          <View style={styles.ayatActions}>
            <TouchableOpacity onPress={() => playAudio(item)} style={styles.actionBtn}>
              <Ionicons name={isPlaying ? 'pause-circle' : 'play-circle'} size={24} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleBookmark(item.nomor)} style={styles.actionBtn}>
              <Ionicons name={isBookmarked ? 'bookmark' : 'bookmark-outline'} size={22} color={isBookmarked ? Colors.secondary : Colors.textLight} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => shareAyat(item)} style={styles.actionBtn}>
              <Ionicons name="share-social-outline" size={22} color={Colors.textLight} />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.arab}>{item.arab}</Text>
        {item.latin ? <Text style={styles.latin}>{item.latin}</Text> : null}
        <View style={styles.divider} />
        <Text style={styles.terjemahan}>{item.terjemahan}</Text>
        {item.footnotes ? <Text style={styles.footnote}>{item.footnotes}</Text> : null}
      </View>
    );
  };

  if (loading) return (
    <View style={styles.loadingView}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.loadingText}>Memuat surah...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.surahLatin}>{surah?.nama_latin}</Text>
          <Text style={styles.surahArab}>{surah?.nama_arab}</Text>
          <Text style={styles.surahMeta}>{surah?.arti} · {surah?.jumlah_ayat} Ayat · {surah?.tempat}</Text>
        </View>
      </LinearGradient>

      <FlatList
        ref={flatListRef}
        data={ayats}
        keyExtractor={(item) => String(item.nomor)}
        renderItem={renderAyat}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onScrollToIndexFailed={({ index }) => {
          // Fallback jika index tidak langsung bisa discroll
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.1 });
          }, 300);
        }}
        ListHeaderComponent={
          id !== 1 && id !== 9 ? (
            <View style={styles.basmallahCard}>
              <Text style={styles.basmallah}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>
            </View>
          ) : null
        }
        ListFooterComponent={<View style={{ height: 30 }} />}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loadingView: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontFamily: Fonts.regular, fontSize: FontSize.sm, color: Colors.textSecondary },
  header: { paddingTop: 55, paddingBottom: Spacing.lg, paddingHorizontal: Spacing.base },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  headerInfo: { alignItems: 'center' },
  surahLatin: { fontFamily: Fonts.bold, fontSize: FontSize.xl, color: '#fff' },
  surahArab: { fontFamily: 'Amiri-Bold', fontSize: 28, color: Colors.secondary, marginTop: 4 },
  surahMeta: { fontFamily: Fonts.regular, fontSize: FontSize.xs, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  list: { padding: Spacing.base },
  basmallahCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg, alignItems: 'center', marginBottom: 10, ...Shadow.sm },
  basmallah: { fontFamily: 'Amiri-Regular', fontSize: 24, color: Colors.primary, textAlign: 'center', lineHeight: 44 },
  ayatCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, ...Shadow.sm },
  ayatTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  nomorBox: { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  nomor: { fontFamily: Fonts.bold, fontSize: FontSize.xs, color: Colors.secondary },
  ayatActions: { flexDirection: 'row', gap: 4 },
  actionBtn: { padding: 6 },
  arab: { fontFamily: 'Amiri-Regular', fontSize: 26, color: Colors.text, textAlign: 'right', lineHeight: 52, marginBottom: Spacing.sm },
  latin: { fontFamily: Fonts.regular, fontSize: FontSize.xs, color: Colors.textSecondary, fontStyle: 'italic', marginBottom: Spacing.sm, lineHeight: 18 },
  divider: { height: 1, backgroundColor: Colors.divider, marginBottom: Spacing.sm },
  terjemahan: { fontFamily: Fonts.regular, fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 22 },
  footnote: { fontFamily: Fonts.regular, fontSize: 11, color: Colors.textLight, fontStyle: 'italic', marginTop: Spacing.sm, lineHeight: 17, borderLeftWidth: 2, borderLeftColor: Colors.secondary, paddingLeft: 8 },
});
