// Sumber: https://github.com/dyazincahya/quran-json-kemenag (Kemenag RI)
const BASE = 'https://raw.githubusercontent.com/dyazincahya/quran-json-kemenag/main/surah';
// Audio: everyayah.com (MP3, Alafasy) - lebih kompatibel dengan expo-av
const AUDIO_BASE = 'https://everyayah.com/data/Alafasy_128kbps';

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
  footnotes?: string | null;
  juz?: number;
  halaman?: number;
}

export interface LastRead {
  surahId: number;
  surahName: string;
  ayat: number;
}

// Daftar surah statis dari Kemenag RI (114 surah)
const SURAH_LIST: Surah[] = [
  {id:1,nama_arab:'الفاتحة',nama_latin:'Al-Fatihah',arti:'Pembuka',jumlah_ayat:7,tempat:'Makkiyah'},
  {id:2,nama_arab:'البقرة',nama_latin:'Al-Baqarah',arti:'Sapi Betina',jumlah_ayat:286,tempat:'Madaniyah'},
  {id:3,nama_arab:'آل عمران',nama_latin:'Ali Imran',arti:'Keluarga Imran',jumlah_ayat:200,tempat:'Madaniyah'},
  {id:4,nama_arab:'النساء',nama_latin:'An-Nisa',arti:'Perempuan',jumlah_ayat:176,tempat:'Madaniyah'},
  {id:5,nama_arab:'المائدة',nama_latin:'Al-Maidah',arti:'Hidangan',jumlah_ayat:120,tempat:'Madaniyah'},
  {id:6,nama_arab:'الأنعام',nama_latin:'Al-Anam',arti:'Binatang Ternak',jumlah_ayat:165,tempat:'Makkiyah'},
  {id:7,nama_arab:'الأعراف',nama_latin:'Al-Araf',arti:'Tempat Tertinggi',jumlah_ayat:206,tempat:'Makkiyah'},
  {id:8,nama_arab:'الأنفال',nama_latin:'Al-Anfal',arti:'Rampasan Perang',jumlah_ayat:75,tempat:'Madaniyah'},
  {id:9,nama_arab:'التوبة',nama_latin:'At-Taubah',arti:'Pengampunan',jumlah_ayat:129,tempat:'Madaniyah'},
  {id:10,nama_arab:'يونس',nama_latin:'Yunus',arti:'Nabi Yunus',jumlah_ayat:109,tempat:'Makkiyah'},
  {id:11,nama_arab:'هود',nama_latin:'Hud',arti:'Nabi Hud',jumlah_ayat:123,tempat:'Makkiyah'},
  {id:12,nama_arab:'يوسف',nama_latin:'Yusuf',arti:'Nabi Yusuf',jumlah_ayat:111,tempat:'Makkiyah'},
  {id:13,nama_arab:'الرعد',nama_latin:'Ar-Rad',arti:'Guruh',jumlah_ayat:43,tempat:'Madaniyah'},
  {id:14,nama_arab:'إبراهيم',nama_latin:'Ibrahim',arti:'Nabi Ibrahim',jumlah_ayat:52,tempat:'Makkiyah'},
  {id:15,nama_arab:'الحجر',nama_latin:'Al-Hijr',arti:'Daerah Al-Hijr',jumlah_ayat:99,tempat:'Makkiyah'},
  {id:16,nama_arab:'النحل',nama_latin:'An-Nahl',arti:'Lebah',jumlah_ayat:128,tempat:'Makkiyah'},
  {id:17,nama_arab:'الإسراء',nama_latin:'Al-Isra',arti:'Perjalanan Malam',jumlah_ayat:111,tempat:'Makkiyah'},
  {id:18,nama_arab:'الكهف',nama_latin:'Al-Kahf',arti:'Gua',jumlah_ayat:110,tempat:'Makkiyah'},
  {id:19,nama_arab:'مريم',nama_latin:'Maryam',arti:'Maryam',jumlah_ayat:98,tempat:'Makkiyah'},
  {id:20,nama_arab:'طه',nama_latin:'Ta Ha',arti:'Ta Ha',jumlah_ayat:135,tempat:'Makkiyah'},
  {id:21,nama_arab:'الأنبياء',nama_latin:'Al-Anbiya',arti:'Para Nabi',jumlah_ayat:112,tempat:'Makkiyah'},
  {id:22,nama_arab:'الحج',nama_latin:'Al-Hajj',arti:'Haji',jumlah_ayat:78,tempat:'Madaniyah'},
  {id:23,nama_arab:'المؤمنون',nama_latin:'Al-Muminun',arti:'Orang-orang Mukmin',jumlah_ayat:118,tempat:'Makkiyah'},
  {id:24,nama_arab:'النور',nama_latin:'An-Nur',arti:'Cahaya',jumlah_ayat:64,tempat:'Madaniyah'},
  {id:25,nama_arab:'الفرقان',nama_latin:'Al-Furqan',arti:'Pembeda',jumlah_ayat:77,tempat:'Makkiyah'},
  {id:26,nama_arab:'الشعراء',nama_latin:'Asy-Syuara',arti:'Para Penyair',jumlah_ayat:227,tempat:'Makkiyah'},
  {id:27,nama_arab:'النمل',nama_latin:'An-Naml',arti:'Semut',jumlah_ayat:93,tempat:'Makkiyah'},
  {id:28,nama_arab:'القصص',nama_latin:'Al-Qasas',arti:'Cerita-cerita',jumlah_ayat:88,tempat:'Makkiyah'},
  {id:29,nama_arab:'العنكبوت',nama_latin:'Al-Ankabut',arti:'Laba-laba',jumlah_ayat:69,tempat:'Makkiyah'},
  {id:30,nama_arab:'الروم',nama_latin:'Ar-Rum',arti:'Bangsa Romawi',jumlah_ayat:60,tempat:'Makkiyah'},
  {id:31,nama_arab:'لقمان',nama_latin:'Luqman',arti:'Luqman',jumlah_ayat:34,tempat:'Makkiyah'},
  {id:32,nama_arab:'السجدة',nama_latin:'As-Sajdah',arti:'Sujud',jumlah_ayat:30,tempat:'Makkiyah'},
  {id:33,nama_arab:'الأحزاب',nama_latin:'Al-Ahzab',arti:'Golongan yang Bersekutu',jumlah_ayat:73,tempat:'Madaniyah'},
  {id:34,nama_arab:'سبأ',nama_latin:'Saba',arti:'Kaum Saba',jumlah_ayat:54,tempat:'Makkiyah'},
  {id:35,nama_arab:'فاطر',nama_latin:'Fatir',arti:'Pencipta',jumlah_ayat:45,tempat:'Makkiyah'},
  {id:36,nama_arab:'يس',nama_latin:'Ya Sin',arti:'Ya Sin',jumlah_ayat:83,tempat:'Makkiyah'},
  {id:37,nama_arab:'الصافات',nama_latin:'As-Saffat',arti:'Yang Bershaf-shaf',jumlah_ayat:182,tempat:'Makkiyah'},
  {id:38,nama_arab:'ص',nama_latin:'Sad',arti:'Sad',jumlah_ayat:88,tempat:'Makkiyah'},
  {id:39,nama_arab:'الزمر',nama_latin:'Az-Zumar',arti:'Rombongan-rombongan',jumlah_ayat:75,tempat:'Makkiyah'},
  {id:40,nama_arab:'غافر',nama_latin:'Gafir',arti:'Yang Maha Pengampun',jumlah_ayat:85,tempat:'Makkiyah'},
  {id:41,nama_arab:'فصلت',nama_latin:'Fussilat',arti:'Yang Dijelaskan',jumlah_ayat:54,tempat:'Makkiyah'},
  {id:42,nama_arab:'الشورى',nama_latin:'Asy-Syura',arti:'Musyawarah',jumlah_ayat:53,tempat:'Makkiyah'},
  {id:43,nama_arab:'الزخرف',nama_latin:'Az-Zukhruf',arti:'Perhiasan',jumlah_ayat:89,tempat:'Makkiyah'},
  {id:44,nama_arab:'الدخان',nama_latin:'Ad-Dukhan',arti:'Kabut',jumlah_ayat:59,tempat:'Makkiyah'},
  {id:45,nama_arab:'الجاثية',nama_latin:'Al-Jasiyah',arti:'Yang Berlutut',jumlah_ayat:37,tempat:'Makkiyah'},
  {id:46,nama_arab:'الأحقاف',nama_latin:'Al-Ahqaf',arti:'Bukit-bukit Pasir',jumlah_ayat:35,tempat:'Makkiyah'},
  {id:47,nama_arab:'محمد',nama_latin:'Muhammad',arti:'Nabi Muhammad',jumlah_ayat:38,tempat:'Madaniyah'},
  {id:48,nama_arab:'الفتح',nama_latin:'Al-Fath',arti:'Kemenangan',jumlah_ayat:29,tempat:'Madaniyah'},
  {id:49,nama_arab:'الحجرات',nama_latin:'Al-Hujurat',arti:'Kamar-kamar',jumlah_ayat:18,tempat:'Madaniyah'},
  {id:50,nama_arab:'ق',nama_latin:'Qaf',arti:'Qaf',jumlah_ayat:45,tempat:'Makkiyah'},
  {id:51,nama_arab:'الذاريات',nama_latin:'Az-Zariyat',arti:'Angin yang Menerbangkan',jumlah_ayat:60,tempat:'Makkiyah'},
  {id:52,nama_arab:'الطور',nama_latin:'At-Tur',arti:'Bukit Sinai',jumlah_ayat:49,tempat:'Makkiyah'},
  {id:53,nama_arab:'النجم',nama_latin:'An-Najm',arti:'Bintang',jumlah_ayat:62,tempat:'Makkiyah'},
  {id:54,nama_arab:'القمر',nama_latin:'Al-Qamar',arti:'Bulan',jumlah_ayat:55,tempat:'Makkiyah'},
  {id:55,nama_arab:'الرحمن',nama_latin:'Ar-Rahman',arti:'Yang Maha Pengasih',jumlah_ayat:78,tempat:'Madaniyah'},
  {id:56,nama_arab:'الواقعة',nama_latin:'Al-Waqiah',arti:'Hari Kiamat',jumlah_ayat:96,tempat:'Makkiyah'},
  {id:57,nama_arab:'الحديد',nama_latin:'Al-Hadid',arti:'Besi',jumlah_ayat:29,tempat:'Madaniyah'},
  {id:58,nama_arab:'المجادلة',nama_latin:'Al-Mujadilah',arti:'Wanita yang Mengajukan Gugatan',jumlah_ayat:22,tempat:'Madaniyah'},
  {id:59,nama_arab:'الحشر',nama_latin:'Al-Hasyr',arti:'Pengusiran',jumlah_ayat:24,tempat:'Madaniyah'},
  {id:60,nama_arab:'الممتحنة',nama_latin:'Al-Mumtahanah',arti:'Perempuan yang Diuji',jumlah_ayat:13,tempat:'Madaniyah'},
  {id:61,nama_arab:'الصف',nama_latin:'As-Saf',arti:'Barisan',jumlah_ayat:14,tempat:'Madaniyah'},
  {id:62,nama_arab:'الجمعة',nama_latin:'Al-Jumuah',arti:'Hari Jumat',jumlah_ayat:11,tempat:'Madaniyah'},
  {id:63,nama_arab:'المنافقون',nama_latin:'Al-Munafiqun',arti:'Orang-orang Munafik',jumlah_ayat:11,tempat:'Madaniyah'},
  {id:64,nama_arab:'التغابن',nama_latin:'At-Tagabun',arti:'Hari Ditampakkan Kesalahan',jumlah_ayat:18,tempat:'Madaniyah'},
  {id:65,nama_arab:'الطلاق',nama_latin:'At-Talaq',arti:'Talak',jumlah_ayat:12,tempat:'Madaniyah'},
  {id:66,nama_arab:'التحريم',nama_latin:'At-Tahrim',arti:'Mengharamkan',jumlah_ayat:12,tempat:'Madaniyah'},
  {id:67,nama_arab:'الملك',nama_latin:'Al-Mulk',arti:'Kerajaan',jumlah_ayat:30,tempat:'Makkiyah'},
  {id:68,nama_arab:'القلم',nama_latin:'Al-Qalam',arti:'Pena',jumlah_ayat:52,tempat:'Makkiyah'},
  {id:69,nama_arab:'الحاقة',nama_latin:'Al-Haqqah',arti:'Hari Kiamat',jumlah_ayat:52,tempat:'Makkiyah'},
  {id:70,nama_arab:'المعارج',nama_latin:'Al-Maarij',arti:'Tempat-tempat Naik',jumlah_ayat:44,tempat:'Makkiyah'},
  {id:71,nama_arab:'نوح',nama_latin:'Nuh',arti:'Nabi Nuh',jumlah_ayat:28,tempat:'Makkiyah'},
  {id:72,nama_arab:'الجن',nama_latin:'Al-Jin',arti:'Jin',jumlah_ayat:28,tempat:'Makkiyah'},
  {id:73,nama_arab:'المزمل',nama_latin:'Al-Muzzammil',arti:'Orang yang Berselimut',jumlah_ayat:20,tempat:'Makkiyah'},
  {id:74,nama_arab:'المدثر',nama_latin:'Al-Muddassir',arti:'Orang yang Berkemul',jumlah_ayat:56,tempat:'Makkiyah'},
  {id:75,nama_arab:'القيامة',nama_latin:'Al-Qiyamah',arti:'Hari Kiamat',jumlah_ayat:40,tempat:'Makkiyah'},
  {id:76,nama_arab:'الإنسان',nama_latin:'Al-Insan',arti:'Manusia',jumlah_ayat:31,tempat:'Madaniyah'},
  {id:77,nama_arab:'المرسلات',nama_latin:'Al-Mursalat',arti:'Malaikat yang Diutus',jumlah_ayat:50,tempat:'Makkiyah'},
  {id:78,nama_arab:'النبأ',nama_latin:'An-Naba',arti:'Berita Besar',jumlah_ayat:40,tempat:'Makkiyah'},
  {id:79,nama_arab:'النازعات',nama_latin:'An-Naziat',arti:'Malaikat yang Mencabut',jumlah_ayat:46,tempat:'Makkiyah'},
  {id:80,nama_arab:'عبس',nama_latin:'Abasa',arti:'Ia Bermuka Masam',jumlah_ayat:42,tempat:'Makkiyah'},
  {id:81,nama_arab:'التكوير',nama_latin:'At-Takwir',arti:'Penggulungan',jumlah_ayat:29,tempat:'Makkiyah'},
  {id:82,nama_arab:'الانفطار',nama_latin:'Al-Infitar',arti:'Terbelah',jumlah_ayat:19,tempat:'Makkiyah'},
  {id:83,nama_arab:'المطففين',nama_latin:'Al-Mutaffifin',arti:'Orang-orang yang Curang',jumlah_ayat:36,tempat:'Makkiyah'},
  {id:84,nama_arab:'الانشقاق',nama_latin:'Al-Insyiqaq',arti:'Terbelah',jumlah_ayat:25,tempat:'Makkiyah'},
  {id:85,nama_arab:'البروج',nama_latin:'Al-Buruj',arti:'Gugusan Bintang',jumlah_ayat:22,tempat:'Makkiyah'},
  {id:86,nama_arab:'الطارق',nama_latin:'At-Tariq',arti:'Yang Datang di Malam Hari',jumlah_ayat:17,tempat:'Makkiyah'},
  {id:87,nama_arab:'الأعلى',nama_latin:'Al-Ala',arti:'Yang Paling Tinggi',jumlah_ayat:19,tempat:'Makkiyah'},
  {id:88,nama_arab:'الغاشية',nama_latin:'Al-Gasiyah',arti:'Hari Pembalasan',jumlah_ayat:26,tempat:'Makkiyah'},
  {id:89,nama_arab:'الفجر',nama_latin:'Al-Fajr',arti:'Fajar',jumlah_ayat:30,tempat:'Makkiyah'},
  {id:90,nama_arab:'البلد',nama_latin:'Al-Balad',arti:'Negeri',jumlah_ayat:20,tempat:'Makkiyah'},
  {id:91,nama_arab:'الشمس',nama_latin:'Asy-Syams',arti:'Matahari',jumlah_ayat:15,tempat:'Makkiyah'},
  {id:92,nama_arab:'الليل',nama_latin:'Al-Lail',arti:'Malam',jumlah_ayat:21,tempat:'Makkiyah'},
  {id:93,nama_arab:'الضحى',nama_latin:'Ad-Duha',arti:'Waktu Dhuha',jumlah_ayat:11,tempat:'Makkiyah'},
  {id:94,nama_arab:'الشرح',nama_latin:'Asy-Syarh',arti:'Kelapangan',jumlah_ayat:8,tempat:'Makkiyah'},
  {id:95,nama_arab:'التين',nama_latin:'At-Tin',arti:'Buah Tin',jumlah_ayat:8,tempat:'Makkiyah'},
  {id:96,nama_arab:'العلق',nama_latin:'Al-Alaq',arti:'Segumpal Darah',jumlah_ayat:19,tempat:'Makkiyah'},
  {id:97,nama_arab:'القدر',nama_latin:'Al-Qadr',arti:'Malam Kemuliaan',jumlah_ayat:5,tempat:'Makkiyah'},
  {id:98,nama_arab:'البينة',nama_latin:'Al-Bayyinah',arti:'Bukti Nyata',jumlah_ayat:8,tempat:'Madaniyah'},
  {id:99,nama_arab:'الزلزلة',nama_latin:'Az-Zalzalah',arti:'Guncangan',jumlah_ayat:8,tempat:'Madaniyah'},
  {id:100,nama_arab:'العاديات',nama_latin:'Al-Adiyat',arti:'Kuda Perang yang Berlari Kencang',jumlah_ayat:11,tempat:'Makkiyah'},
  {id:101,nama_arab:'القارعة',nama_latin:'Al-Qariah',arti:'Hari Kiamat',jumlah_ayat:11,tempat:'Makkiyah'},
  {id:102,nama_arab:'التكاثر',nama_latin:'At-Takasur',arti:'Bermegah-megahan',jumlah_ayat:8,tempat:'Makkiyah'},
  {id:103,nama_arab:'العصر',nama_latin:'Al-Asr',arti:'Masa',jumlah_ayat:3,tempat:'Makkiyah'},
  {id:104,nama_arab:'الهمزة',nama_latin:'Al-Humazah',arti:'Pengumpat',jumlah_ayat:9,tempat:'Makkiyah'},
  {id:105,nama_arab:'الفيل',nama_latin:'Al-Fil',arti:'Gajah',jumlah_ayat:5,tempat:'Makkiyah'},
  {id:106,nama_arab:'قريش',nama_latin:'Quraisy',arti:'Suku Quraisy',jumlah_ayat:4,tempat:'Makkiyah'},
  {id:107,nama_arab:'الماعون',nama_latin:'Al-Maun',arti:'Barang yang Berguna',jumlah_ayat:7,tempat:'Makkiyah'},
  {id:108,nama_arab:'الكوثر',nama_latin:'Al-Kausar',arti:'Nikmat yang Banyak',jumlah_ayat:3,tempat:'Makkiyah'},
  {id:109,nama_arab:'الكافرون',nama_latin:'Al-Kafirun',arti:'Orang-orang Kafir',jumlah_ayat:6,tempat:'Makkiyah'},
  {id:110,nama_arab:'النصر',nama_latin:'An-Nasr',arti:'Pertolongan',jumlah_ayat:3,tempat:'Madaniyah'},
  {id:111,nama_arab:'المسد',nama_latin:'Al-Masad',arti:'Sabut',jumlah_ayat:5,tempat:'Makkiyah'},
  {id:112,nama_arab:'الإخلاص',nama_latin:'Al-Ikhlas',arti:'Ikhlas',jumlah_ayat:4,tempat:'Makkiyah'},
  {id:113,nama_arab:'الفلق',nama_latin:'Al-Falaq',arti:'Waktu Subuh',jumlah_ayat:5,tempat:'Makkiyah'},
  {id:114,nama_arab:'الناس',nama_latin:'An-Nas',arti:'Manusia',jumlah_ayat:6,tempat:'Makkiyah'},
];

// Cache sederhana di memori
const surahCache: Record<number, Ayat[]> = {};

export async function getSurahList(): Promise<Surah[]> {
  return SURAH_LIST;
}

export async function getAyat(surahId: number): Promise<Ayat[]> {
  if (surahCache[surahId]) return surahCache[surahId];

  const res = await fetch(`${BASE}/${surahId}.json`);
  if (!res.ok) throw new Error(`Gagal mengambil data surah ${surahId}`);
  const data: any[] = await res.json();

  const result: Ayat[] = data.map((v: any) => ({
    id: String(v.id),
    surah_id: v.surah_id,
    nomor: v.ayah,
    arab: v.arabic,
    latin: v.latin ?? '',
    terjemahan: v.translation ?? '',
    footnotes: v.footnotes ?? null,
    juz: v.juz,
    halaman: v.page,
    audio_url: `${AUDIO_BASE}/${String(v.surah_id).padStart(3, '0')}${String(v.ayah).padStart(3, '0')}.mp3`,
  }));

  surahCache[surahId] = result;
  return result;
}
