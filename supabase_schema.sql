-- =============================================
-- Skema Database: Quran Digital Baehaqi
-- Jalankan di Supabase SQL Editor
-- =============================================

-- 1. Tabel surah (opsional, data dari API)
CREATE TABLE IF NOT EXISTS surah (
  id          INT PRIMARY KEY,
  nama_arab   TEXT NOT NULL,
  nama_latin  TEXT NOT NULL,
  arti        TEXT,
  jumlah_ayat INT NOT NULL,
  tempat      TEXT DEFAULT 'makkah'
);

-- 2. Tabel almarhum
CREATE TABLE IF NOT EXISTS almarhum (
  id          SERIAL PRIMARY KEY,
  nama        TEXT NOT NULL DEFAULT 'Baehaqi',
  asal        TEXT NOT NULL DEFAULT 'Dusun Gejome',
  jumlah_doa  INT NOT NULL DEFAULT 0
);

-- Seed data almarhum
INSERT INTO almarhum (nama, asal, jumlah_doa)
VALUES ('Baehaqi', 'Dusun Gejome', 0)
ON CONFLICT DO NOTHING;

-- 3. Tabel doa_log
CREATE TABLE IF NOT EXISTS doa_log (
  id           SERIAL PRIMARY KEY,
  almarhum_id  INT NOT NULL REFERENCES almarhum(id),
  tanggal      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent   TEXT
);

-- 4. Tabel bookmark (berbasis sync_code)
CREATE TABLE IF NOT EXISTS bookmark (
  id          SERIAL PRIMARY KEY,
  sync_code   TEXT NOT NULL,
  surah_id    INT NOT NULL,
  ayat_nomor  INT NOT NULL,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(sync_code, surah_id, ayat_nomor)
);

-- 5. Tabel quran_sync (last read per perangkat)
CREATE TABLE IF NOT EXISTS quran_sync (
  sync_code   TEXT PRIMARY KEY,
  surah_id    INT NOT NULL DEFAULT 1,
  ayat        INT NOT NULL DEFAULT 1,
  surah_name  TEXT,
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TRIGGER: update jumlah_doa otomatis
-- =============================================
CREATE OR REPLACE FUNCTION update_jumlah_doa()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE almarhum
  SET jumlah_doa = (SELECT COUNT(*) FROM doa_log WHERE almarhum_id = NEW.almarhum_id)
  WHERE id = NEW.almarhum_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_doa ON doa_log;
CREATE TRIGGER trigger_update_doa
AFTER INSERT ON doa_log
FOR EACH ROW EXECUTE FUNCTION update_jumlah_doa();

-- =============================================
-- RLS: Row Level Security
-- =============================================
ALTER TABLE almarhum ENABLE ROW LEVEL SECURITY;
ALTER TABLE doa_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmark ENABLE ROW LEVEL SECURITY;
ALTER TABLE quran_sync ENABLE ROW LEVEL SECURITY;

-- Policy: baca almarhum terbuka untuk umum
CREATE POLICY "Read almarhum public" ON almarhum FOR SELECT USING (true);

-- Policy: insert doa_log terbuka
CREATE POLICY "Insert doa public" ON doa_log FOR INSERT WITH CHECK (true);

-- Policy: baca/tulis bookmark & sync via sync_code
CREATE POLICY "Bookmark by sync" ON bookmark USING (true) WITH CHECK (true);
CREATE POLICY "Sync by code" ON quran_sync USING (true) WITH CHECK (true);
