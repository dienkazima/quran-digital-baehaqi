import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Fonts, FontSize, Spacing, Radius, Shadow } from '@/constants/theme';
import { getSholatInfo, SholatData, SholatState, setupAdzanNotifications } from '@/services/sholat';
import { loadJson, saveJson } from '@/services/storage';

export default function SholatScreen() {
  const [notifOn, setNotifOn] = useState(false);
  const [sholatState, setSholatState] = useState<SholatState>({
    locationText: 'Mencari lokasi...',
    sholatData: [],
    isLoading: true,
    error: null,
  });

  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();

  const loadData = useCallback(async () => {
    setSholatState(prev => ({ ...prev, isLoading: true }));
    
    // Ambil preferensi notifikasi dari storage
    const savedNotif = await loadJson<boolean>('notif_adzan_on', false);
    setNotifOn(savedNotif);

    const data = await getSholatInfo();
    setSholatState(data);
    if (data.error) {
      Alert.alert('Info Lokasi', data.error);
    }

    // Refresh jadwal notifikasi
    if (savedNotif && data.sholatData.length > 0) {
      setupAdzanNotifications(data.sholatData, true);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleNotif = async (value: boolean) => {
    setNotifOn(value);
    await saveJson('notif_adzan_on', value);
    setupAdzanNotifications(sholatState.sholatData, value);
    
    if (value) {
      Alert.alert('Notifikasi Aktif', 'Aplikasi akan mengingatkan Anda saat waktu sholat tiba.');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4A148C', '#7B1FA2']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Ionicons name="time" size={36} color={Colors.secondary} />
        <Text style={styles.headerTitle}>Jadwal Sholat</Text>
        
        {sholatState.isLoading ? (
          <ActivityIndicator color={Colors.secondary} size="small" style={{ marginTop: 8 }} />
        ) : (
          <Text style={styles.headerLoc}>📍 {sholatState.locationText}</Text>
        )}
        
        <Text style={styles.headerDate}>
          {now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {sholatState.isLoading && sholatState.sholatData.length === 0 ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={{ marginTop: 10, fontFamily: Fonts.medium, color: Colors.textSecondary }}>Menghitung waktu sholat...</Text>
          </View>
        ) : (
          sholatState.sholatData.map((item) => {
            const [h, m] = item.waktu.split(':').map(Number);
            const mins = h * 60 + m;
            const isNext = mins > nowMins && (sholatState.sholatData.find(s => {
              const [sh, sm] = s.waktu.split(':').map(Number);
              return sh * 60 + sm > nowMins;
            })?.nama === item.nama);
            const isPast = mins < nowMins;
            return (
              <View key={item.nama} style={[styles.card, isNext && styles.cardActive]}>
                {isNext && <LinearGradient colors={['#7B1FA2', '#4A148C']} style={StyleSheet.absoluteFillObject} />}
                <View style={[styles.iconBox, { backgroundColor: isNext ? 'rgba(255,255,255,0.2)' : item.warna + '22' }]}>
                  <Ionicons name={item.icon as any} size={26} color={isNext ? '#fff' : item.warna} />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={[styles.sholatNama, isNext && styles.textWhite]}>{item.nama}</Text>
                  {isNext && <Text style={styles.nextLabel}>Berikutnya</Text>}
                </View>
                <Text style={[styles.sholatWaktu, isNext && styles.textWhite, isPast && !isNext && styles.textFaded]}>
                  {item.waktu}
                </Text>
              </View>
            );
          })
        )}

        <View style={styles.notifCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.notifTitle}>🔔 Notifikasi Adzan</Text>
            <Text style={styles.notifSub}>Aktifkan pengingat waktu sholat</Text>
          </View>
          <Switch
            value={notifOn}
            onValueChange={handleToggleNotif}
            trackColor={{ true: Colors.secondary, false: Colors.divider }}
            thumbColor={Colors.surface}
          />
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={18} color={Colors.textLight} />
          <Text style={styles.infoText}>Waktu dihitung otomatis berdasarkan koordinat GPS Anda secara offline. Akurasi tinggi tanpa butuh internet.</Text>
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 55, paddingBottom: Spacing['2xl'], paddingHorizontal: Spacing.base, alignItems: 'center', gap: 6 },
  backBtn: { alignSelf: 'flex-start', width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  headerTitle: { fontFamily: Fonts.bold, fontSize: FontSize['2xl'], color: '#fff' },
  headerLoc: { fontFamily: Fonts.medium, fontSize: FontSize.base, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  headerDate: { fontFamily: Fonts.regular, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.6)' },
  scroll: { padding: Spacing.base, gap: Spacing.sm },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, overflow: 'hidden', ...Shadow.sm },
  cardActive: { borderRadius: Radius.lg },
  iconBox: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  cardInfo: { flex: 1 },
  sholatNama: { fontFamily: Fonts.semiBold, fontSize: FontSize.base, color: Colors.text },
  nextLabel: { fontFamily: Fonts.regular, fontSize: FontSize.xs, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  sholatWaktu: { fontFamily: Fonts.bold, fontSize: FontSize.xl, color: Colors.text },
  textWhite: { color: '#fff' },
  textFaded: { color: Colors.textLight },
  notifCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, ...Shadow.sm, marginTop: 10 },
  notifTitle: { fontFamily: Fonts.semiBold, fontSize: FontSize.base, color: Colors.text },
  notifSub: { fontFamily: Fonts.regular, fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  infoCard: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', backgroundColor: Colors.surfaceAlt, borderRadius: Radius.md, padding: Spacing.md, marginTop: 10 },
  infoText: { flex: 1, fontFamily: Fonts.regular, fontSize: FontSize.xs, color: Colors.textLight, lineHeight: 18 },
});
