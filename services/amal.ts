import { supabase } from './supabase';
import { loadJson, saveJson, StorageKeys } from './storage';

export interface AmalStats {
  total: number;
  hari_ini: number;
}

export async function kirimFatihah(): Promise<number> {
  // Simpan ke Supabase (Trigger di database akan menambah jumlah_doa otomatis)
  const { error } = await supabase.from('doa_log').insert({
    almarhum_id: 1,
    tanggal: new Date().toISOString(),
  });
  
  if (error) {
    console.warn('Amal sync error:', error.message);
    throw new Error('Gagal mengirim doa, periksa koneksi internet Anda.');
  }

  // Ambil total terbaru langsung dari Supabase untuk konsistensi global
  const stats = await getAmalStats();
  
  // Update cache lokal hanya sebagai fallback (bukan sumber utama)
  await saveJson(StorageKeys.AMAL_COUNT, stats.total);
  
  return stats.total;
}

export async function getAmalStats(): Promise<AmalStats> {
  try {
    const { data, error } = await supabase
      .from('almarhum')
      .select('jumlah_doa')
      .eq('id', 1)
      .single();
      
    if (error) throw error;
    
    const total = data?.jumlah_doa ?? 0;
    // Simpan ke lokal untuk saat offline
    await saveJson(StorageKeys.AMAL_COUNT, total);
    
    return { total, hari_ini: 0 };
  } catch (err) {
    console.warn('Get stats error:', err);
    // Jika offline/gagal, ambil dari memori terakhir yang pernah dilihat
    const local = await loadJson<number>(StorageKeys.AMAL_COUNT, 0);
    return { total: local, hari_ini: 0 };
  }
}
