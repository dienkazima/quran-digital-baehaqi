// Sumber: Quran.com API + Tanzil
const BASE = 'https://api.quran.com/api/v4';
const AUDIO_BASE = 'https://verses.quran.com';

export interface Surah {
  id: number;
  nama_arab: string;
  nama_latin: string;
  arti: string;
  jumlah_ayat: number;
  tempat: string;
}

export interface Ayat {
  id: string;
  surah_id: number;
  nomor: number;
  arab: string;
  latin: string;
  terjemahan: string;
  audio_url: string;
}

export interface LastRead {
  surahId: number;
  surahName: string;
  ayat: number;
}

// Cache sederhana di memori
const surahCache: Record<number, Ayat[]> = {};
let surahListCache: Surah[] | null = null;

export async function getSurahList(): Promise<Surah[]> {
  if (surahListCache) return surahListCache;
  const res = await fetch(`${BASE}/chapters?language=id`);
  const data = await res.json();
  surahListCache = data.chapters.map((c: any) => ({
    id: c.id,
    nama_arab: c.name_arabic,
    nama_latin: c.name_simple,
    arti: c.translated_name?.name ?? '',
    jumlah_ayat: c.verses_count,
    tempat: c.revelation_place,
  }));
  return surahListCache!;
}

export async function getAyat(surahId: number): Promise<Ayat[]> {
  if (surahCache[surahId]) return surahCache[surahId];
  const [arabRes, transRes] = await Promise.all([
    fetch(`${BASE}/verses/by_chapter/${surahId}?language=id&words=false&per_page=300&fields=text_uthmani`),
    fetch(`${BASE}/verses/by_chapter/${surahId}?language=id&words=false&per_page=300&translations=33`),
  ]);
  const arabData = await arabRes.json();
  const transData = await transRes.json();
  const result: Ayat[] = arabData.verses.map((v: any, i: number) => {
    const trans = transData.verses[i];
    return {
      id: v.id,
      surah_id: surahId,
      nomor: v.verse_number,
      arab: v.text_uthmani,
      latin: `Ayat ${v.verse_number}`,
      terjemahan: trans?.translations?.[0]?.text?.replace(/<[^>]+>/g, '') ?? '',
      audio_url: `https://everyayah.com/data/Alafasy_128kbps/${String(surahId).padStart(3,'0')}${String(v.verse_number).padStart(3,'0')}.mp3`,
    };
  });
  surahCache[surahId] = result;
  return result;
}
