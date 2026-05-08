import * as Location from 'expo-location';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';
import { loadJson, saveJson, StorageKeys } from './storage';
import { Alert, Platform } from 'react-native';

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


export const getSholatInfo = async (forceRequest: boolean = false): Promise<SholatState> => {
  try {
    const cached = await loadJson<UserLocation | null>(StorageKeys.USER_LOCATION, null);

    // 1. Cek Izin
    const permInfo = await Location.getForegroundPermissionsAsync();
    let status = permInfo.status;

    if (status !== 'granted') {
      const askedBefore = await loadJson<boolean>(StorageKeys.LOCATION_PERMISSION_REQUESTED, false);
      if (forceRequest || !askedBefore) {
        const permission = await Location.requestForegroundPermissionsAsync();
        status = permission.status;
        await saveJson(StorageKeys.LOCATION_PERMISSION_REQUESTED, true);
      }
    }

    if (status !== 'granted') {
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
        error: 'Aktifkan izin lokasi untuk jadwal akurat',
      };
    }

    // 2. Cek apakah GPS HP sedang dinyalakan
    let gpsEnabled = await Location.hasServicesEnabledAsync();
    
    if (!gpsEnabled) {
      if (Platform.OS === 'android') {
        try {
          await Location.enableNetworkProviderAsync();
          gpsEnabled = await Location.hasServicesEnabledAsync();
        } catch (e) {
          console.warn('Gagal mengaktifkan provider:', e);
        }
      }
      
      if (!gpsEnabled) {
        // Tampilkan dialog sesuai permintaan
        Alert.alert(
          'GPS Tidak Aktif',
          'Aktifkan GPS untuk mendapatkan jadwal sholat sesuai lokasi Anda',
          [{ text: 'OK' }]
        );

        if (cached) {
          return {
            locationText: `${cached.city}, ${cached.region}`,
            sholatData: hitungWaktuSholat(cached.latitude, cached.longitude),
            isLoading: false,
            error: null, // Pakai cache dengan mulus
          };
        } else {
          return {
            locationText: DEFAULT_LOC_TEXT,
            sholatData: hitungWaktuSholat(DEFAULT_LAT, DEFAULT_LON),
            isLoading: false,
            error: 'Aktifkan GPS HP Anda untuk mendeteksi lokasi awal',
          };
        }
      }
    }

    // 3. Dapatkan Koordinat dengan cepat karena Izin dan GPS sudah aktif
    let location = await Location.getLastKnownPositionAsync();
    if (!location) {
      location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    }
    const { latitude, longitude } = location.coords;

    let city = 'Lokasi Tidak Diketahui';
    let region = '';

    if (
      cached && 
      Math.abs(cached.latitude - latitude) < 0.05 && 
      Math.abs(cached.longitude - longitude) < 0.05
    ) {
      city = cached.city;
      region = cached.region;
    } else {
      // Reverse Geocoding
      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (geocode.length > 0) {
        const g = geocode[0];
        city = g.city || g.subregion || g.district || city;
        region = g.region || g.country || '';
      }
    }
    
    const locationText = region ? `${city}, ${region}` : city;
    await saveJson(StorageKeys.USER_LOCATION, { city, region, latitude, longitude });

    return {
      locationText,
      sholatData: hitungWaktuSholat(latitude, longitude),
      isLoading: false,
      error: null,
    };

  } catch (error) {
    const cached = await loadJson<UserLocation | null>(StorageKeys.USER_LOCATION, null);
    if (cached) {
      return {
        locationText: `${cached.city}, ${cached.region}`,
        sholatData: hitungWaktuSholat(cached.latitude, cached.longitude),
        isLoading: false,
        error: null,
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


import * as Notifications from 'expo-notifications';

// Konfigurasi tampilan notifikasi saat aplikasi sedang dibuka
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const setupAdzanNotifications = async (sholatData: SholatData[], isEnabled: boolean) => {
  // 1. Batalkan semua notifikasi lama terlebih dahulu
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (!isEnabled || sholatData.length === 0) {
    console.log('[Notif Adzan] Notifikasi dinonaktifkan, semua jadwal dibatalkan.');
    return;
  }

  // 2. Minta izin notifikasi dari pengguna
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('[Notif Adzan] Izin notifikasi ditolak oleh pengguna.');
    return;
  }

  // Khusus Android: buat channel notifikasi
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('adzan', {
      name: 'Pengingat Waktu Sholat',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  // 3. Jadwalkan notifikasi untuk setiap waktu sholat hari ini
  const now = new Date();
  let scheduledCount = 0;

  for (const sholat of sholatData) {
    const [jam, menit] = sholat.waktu.split(':').map(Number);
    const waktuSholat = new Date();
    waktuSholat.setHours(jam, menit, 0, 0);

    // Hanya jadwalkan jika waktunya belum lewat
    if (waktuSholat > now) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `🕌 Waktu ${sholat.nama}`,
          body: `Telah masuk waktu ${sholat.nama} pukul ${sholat.waktu}. Segera tunaikan sholat.`,
          sound: 'default',
          data: { sholat: sholat.nama },
          ...(Platform.OS === 'android' && { channelId: 'adzan' }),
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: waktuSholat,
        },
      });
      scheduledCount++;
      console.log(`[Notif Adzan] ✅ Dijadwalkan: ${sholat.nama} pukul ${sholat.waktu}`);
    } else {
      console.log(`[Notif Adzan] ⏩ Dilewati (sudah lewat): ${sholat.nama} pukul ${sholat.waktu}`);
    }
  }

  console.log(`[Notif Adzan] Total ${scheduledCount} notifikasi berhasil dijadwalkan untuk hari ini.`);
};
