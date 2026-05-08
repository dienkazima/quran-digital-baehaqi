import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, ActivityIndicator, Alert, Linking, AppState } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { saveJson, loadJson, StorageKeys } from '@/services/storage';

export default function LokasiScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [locationText, setLocationText] = useState('Kota Jakarta Pusat, DKI Jakarta');
  const awaitingSettingsRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const cached = await loadJson<any>(StorageKeys.USER_LOCATION, null);
        if (cached && cached.city) {
          setLocationText(cached.region ? `${cached.city}, ${cached.region}` : cached.city);
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const requestLocationPermission = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      await saveJson(StorageKeys.LOCATION_PERMISSION_REQUESTED, true);

      if (status !== 'granted') {
        setErrorMsg('Izin lokasi ditolak. Anda masih bisa melanjutkan tanpa fitur lokasi otomatis.');
        setLoading(false);
        return;
      }

      // Pastikan layanan lokasi (GPS) aktif di perangkat
      let servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        if (Platform.OS === 'android') {
          try {
            await Location.enableNetworkProviderAsync();
            servicesEnabled = await Location.hasServicesEnabledAsync();
          } catch (e) {
            console.warn('Gagal mengaktifkan provider:', e);
          }
        }
        
        if (!servicesEnabled) {
          setErrorMsg('Aktifkan GPS untuk mendapatkan jadwal sholat sesuai lokasi Anda');
          setLoading(false);
          return;
        }
      }

      // Ambil lokasi terbaru
      let location = await Location.getLastKnownPositionAsync();
      if (!location) {
        location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      }

      const { latitude, longitude } = location.coords;

      // Reverse geocoding untuk mendapatkan nama kota/region
      let city = 'Lokasi Tidak Diketahui';
      let region = '';
      try {
        const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (geocode.length > 0) {
          const g = geocode[0];
          city = g.city || g.subregion || g.district || g.name || city;
          region = g.region || g.country || '';
        }
      } catch (e) {
        console.warn('reverse geocode failed', e);
      }

      // Simpan lokasi ke storage sebagai lokasi awal
      await saveJson(StorageKeys.USER_LOCATION, { city, region, latitude, longitude });
      setLocationText(region ? `${city}, ${region}` : city);

      // Kembali ke beranda — Home akan memanggil ulang getSholatInfo pada fokus
      router.replace('/(tabs)/home');
    } catch (error) {
      setErrorMsg('Terjadi kesalahan saat mengambil lokasi. Pastikan GPS aktif.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Arahkan ke beranda jika dilewati
    router.replace('/(tabs)/home');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        {/* Ikon Kompas / Lokasi */}
        <View style={styles.iconContainer}>
          <Ionicons name="navigate" size={80} color="#E53935" style={styles.iconRotate} />
        </View>

        {/* Judul Utama */}
        <Text style={styles.title}>
          Dapatkan Informasi Waktu Shalat dan Arah Kiblat
        </Text>

        {/* Indikator Lokasi (Sesuai Gambar) */}
        <View style={styles.locationBadge}>
          <Ionicons name="location" size={18} color="#E53935" />
          <Text style={styles.locationBadgeText}>{locationText}</Text>
        </View>

        {/* Deskripsi */}
        <Text style={styles.description}>
          Untuk melanjutkan, aktifkan perizinan akses lokasi untuk perhitungan waktu shalat dan penentuan arah kiblat sesuai lokasi Anda.
        </Text>

        {/* Pesan Error (jika ditolak) */}
        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
      </View>

      <View style={styles.bottomContainer}>
        {/* Tombol Izinkan */}
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={requestLocationPermission}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>Izinkan Akses Lokasi</Text>
          )}
        </TouchableOpacity>

        {/* Tombol Lewati */}
        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={handleSkip}
          disabled={loading}
        >
          <Text style={styles.secondaryButtonText}>Lewati</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRotate: {
    transform: [{ rotate: '45deg' }], // Meniru arah jarum merah pada gambar
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 28,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationBadgeText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins-Medium',
    marginLeft: 6,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    lineHeight: 22,
  },
  errorText: {
    fontSize: 12,
    color: '#E53935',
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    marginTop: 16,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#00897B',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    fontWeight: 'bold',
  },
});
