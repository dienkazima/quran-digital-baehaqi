import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveJson<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('saveJson error:', e);
  }
}

export async function loadJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn('loadJson error:', e);
    return fallback;
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.warn('removeItem error:', e);
  }
}

// Keys
export const StorageKeys = {
  LAST_READ: 'qdb.lastRead',
  BOOKMARKS: 'qdb.bookmarks',
  AMAL_COUNT: 'qdb.amalCount',
  FONT_SIZE: 'qdb.fontSize',
  DARK_MODE: 'qdb.darkMode',
  SYNC_CODE: 'qdb.syncCode',
  USER_LOCATION: 'user_location',
  LOCATION_PERMISSION_REQUESTED: 'location_permission_requested',
};
