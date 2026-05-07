import { supabase } from './supabase';
import { loadJson, saveJson, StorageKeys } from './storage';

export interface AmalStats {
  total: number;
  hari_ini: number;
}

export async function kirimFatihah(): Promise<number> {
  // Simpan ke Supabase
  const { error } = await supabase.from('doa_log').insert({
    almarhum_id: 1,
    tanggal: new Date().toISOString(),
  });
  if (error) console.warn('Amal sync error:', error.message);

  // Update counter lokal
  const current = await loadJson<number>(StorageKeys.AMAL_COUNT, 0);
  const next = current + 1;
  await saveJson(StorageKeys.AMAL_COUNT, next);
  return next;
}

export async function getAmalStats(): Promise<AmalStats> {
  try {
    const { data } = await supabase
      .from('almarhum')
      .select('jumlah_doa')
      .eq('id', 1)
      .single();
    return { total: data?.jumlah_doa ?? 0, hari_ini: 0 };
  } catch {
    const local = await loadJson<number>(StorageKeys.AMAL_COUNT, 0);
    return { total: local, hari_ini: 0 };
  }
}
