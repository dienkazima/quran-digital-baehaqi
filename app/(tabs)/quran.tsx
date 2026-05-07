import { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, TextInput, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Fonts, FontSize, Spacing, Radius, Shadow } from '@/constants/theme';
import { getSurahList, type Surah } from '@/services/quran';

export default function QuranScreen() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filtered, setFiltered] = useState<Surah[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSurahList().then((data) => {
      setSurahs(data);
      setFiltered(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = query.toLowerCase();
    setFiltered(q ? surahs.filter(s =>
      s.nama_latin.toLowerCase().includes(q) ||
      s.arti.toLowerCase().includes(q) ||
      String(s.id).includes(q)
    ) : surahs);
  }, [query, surahs]);

  const renderItem = ({ item }: { item: Surah }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/quran/${item.id}`)}
      activeOpacity={0.8}
    >
      <View style={styles.numberBox}>
        <Text style={styles.number}>{item.id}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.namaLatin}>{item.nama_latin}</Text>
        <Text style={styles.arti}>{item.arti} · {item.jumlah_ayat} ayat</Text>
      </View>
      <Text style={styles.namaArab}>{item.nama_arab}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={styles.header}>
        <Text style={styles.headerTitle}>Al-Qur'an</Text>
        <Text style={styles.headerSub}>114 Surah · Terjemahan Kemenag RI</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color={Colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari surah..."
            placeholderTextColor={Colors.textLight}
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Memuat daftar surah...</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 55, paddingHorizontal: Spacing.base, paddingBottom: Spacing.lg },
  headerTitle: { fontFamily: Fonts.bold, fontSize: FontSize['2xl'], color: '#fff' },
  headerSub: { fontFamily: Fonts.regular, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', marginTop: 2, marginBottom: Spacing.md },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: Radius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, gap: 8 },
  searchInput: { flex: 1, fontFamily: Fonts.regular, fontSize: FontSize.base, color: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontFamily: Fonts.regular, fontSize: FontSize.sm, color: Colors.textSecondary },
  list: { padding: Spacing.base },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, ...Shadow.sm },
  numberBox: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  number: { fontFamily: Fonts.bold, fontSize: FontSize.sm, color: Colors.secondary },
  info: { flex: 1 },
  namaLatin: { fontFamily: Fonts.semiBold, fontSize: FontSize.base, color: Colors.text },
  arti: { fontFamily: Fonts.regular, fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  namaArab: { fontFamily: 'Amiri-Bold', fontSize: FontSize.lg, color: Colors.primary },
  separator: { height: 8 },
});
