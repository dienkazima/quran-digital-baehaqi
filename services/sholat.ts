import * as Location from 'expo-location';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';
import { loadJson, saveJson, StorageKeys } from './storage';

export interface SholatData {
  nama: string;
  waktu: string;
  icon: string;
  warna: string;
}

export interface UserLocation {
  city: string;
  region: string;
  latitude: number;
  longitude: number;
}

export interface SholatState {
  locationText: string;
  sholatData: SholatData[];
  isLoading: boolean;
  error: string | null;
}

const DEFAULT_LAT = -8.6500; // Denpasar default
const DEFAULT_LON = 115.2167;
const DEFAULT_LOC_TEXT = 'Denpasar, Bali';

// Format jam (HH:mm) agar konsisten dan tidak terkena bug pemisah titik/koma dari OS lokal
const formatTime = (date: Date) => {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// Fungsi perhitungan offline dengan Adhan Library
const hitungWaktuSholat = (lat: number, lon: number): SholatData[] => {
  const coordinates = new Coordinates(lat, lon);
  // Gunakan metode Kementerian Agama RI (atau setara seperti Muslim World League/Singapura)
  const params = CalculationMethod.Singapore(); 
  
  const date = new Date();
  const prayerTimes = new PrayerTimes(coordinates, date, params);

  return [
    { nama: 'Subuh', waktu: formatTime(prayerTimes.fajr), icon: 'partly-sunny-outline', warna: '#1565C0' },
    { nama: 'Dzuhur', waktu: formatTime(prayerTimes.dhuhr), icon: 'sunny', warna: '#F57F17' },
    { nama: 'Ashar', waktu: formatTime(prayerTimes.asr), icon: 'sunny-outline', warna: '#E65100' },
    { nama: 'Maghrib', waktu: formatTime(prayerTimes.maghrib), icon: 'moon-outline', warna: '#4A148C' },
    { nama: 'Isya', waktu: formatTime(prayerTimes.isha), icon: 'star-outline', warna: '#1A237E' },
  ];
};

export const getSholatInfo = async (): Promise<SholatState> => {
  try {
    // 1. Minta Izin
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      // Jika ditolak, gunakan cache atau default
      const cached = await loadJson<UserLocation | null>('user_location', null);
      if (cached) {
        return {
          locationText: `${cached.city}, ${cached.region}`,
          sholatData: hitungWaktuSholat(cached.latitude, cached.longitude),
          isLoading: false,
          error: 'Menggunakan lokasi terakhir (Izin GPS ditolak)',
        };
      }
      return {
        locationText: DEFAULT_LOC_TEXT,
        sholatData: hitungWaktuSholat(DEFAULT_LAT, DEFAULT_LON),
        isLoading: false,
        error: 'Aktifkan lokasi untuk melihat jadwal akurat',
      };
    }

    // 2. Dapatkan Koordinat dengan cepat
    let location = await Location.getLastKnownPositionAsync();
    
    // Jika tidak ada cache posisi di HP, baru cari paksa (tapi dengan akurasi rendah biar cepat)
    if (!location) {
      location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Lowest });
    }
    const { latitude, longitude } = location.coords;

    // Cek cache daerah agar tidak selalu memanggil API Geocoding (yang bikin lambat)
    const cached = await loadJson<UserLocation | null>('user_location', null);
    let city = 'Lokasi Tidak Diketahui';
    let region = '';

    // Jika koordinatnya masih mirip dengan cache sebelumnya (geser dikit), pakai nama kota dari cache
    if (
      cached && 
      Math.abs(cached.latitude - latitude) < 0.05 && 
      Math.abs(cached.longitude - longitude) < 0.05
    ) {
      city = cached.city;
      region = cached.region;
    } else {
      // 3. Reverse Geocoding (hanya jika tempatnya berpindah jauh / baru)
      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (geocode.length > 0) {
        const g = geocode[0];
        city = g.city || g.subregion || g.district || city;
        region = g.region || g.country || '';
      }
    }
    
    const locationText = region ? `${city}, ${region}` : city;

    // Simpan ke cache
    await saveJson('user_location', { city, region, latitude, longitude });

    // 4. Hitung Waktu
    const sholatData = hitungWaktuSholat(latitude, longitude);

    return {
      locationText,
      sholatData,
      isLoading: false,
      error: null,
    };

  } catch (error) {
    // Fallback error (misal GPS mati/timeout)
    const cached = await loadJson<UserLocation | null>('user_location', null);
    if (cached) {
      return {
        locationText: `${cached.city}, ${cached.region}`,
        sholatData: hitungWaktuSholat(cached.latitude, cached.longitude),
        isLoading: false,
        error: 'Gagal mendeteksi lokasi baru',
      };
    }
    return {
      locationText: DEFAULT_LOC_TEXT,
      sholatData: hitungWaktuSholat(DEFAULT_LAT, DEFAULT_LON),
      isLoading: false,
      error: 'Terjadi kesalahan sistem lokasi',
    };
  }
};

import { Platform } from 'react-native';

export const setupAdzanNotifications = async (sholatData: SholatData[], isEnabled: boolean) => {
  // Peringatan: 
  // Expo Go versi terbaru (SDK 53+) secara ketat memblokir package 'expo-notifications'.
  // Jika kode ini diaktifkan (bahkan dengan require sekalipun), Metro Bundler akan 
  // tetap memindai dan memasukkannya, sehingga menyebabkan "Bundling failed / Unexpected undefined".
  // Untuk saat ini, fitur notifikasi hanya bisa dites menggunakan build APK asli (EAS Build).
  
  if (isEnabled) {
    console.log("Tombol notifikasi ditekan. (Simulasi: Notifikasi dimatikan sementara di Expo Go).");
  }
};
