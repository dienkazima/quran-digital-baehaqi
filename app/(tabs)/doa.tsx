import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, LayoutAnimation,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, FontSize, Spacing, Radius, Shadow } from '@/constants/theme';

const DOA_DATA = {
  'Doa Harian': [
    { judul: 'Doa Sebelum Tidur', arab: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', latin: 'Bismika Allahumma amuutu wa ahyaa', arti: 'Dengan nama-Mu ya Allah, aku mati dan aku hidup.' },
    { judul: 'Doa Bangun Tidur', arab: 'اَلْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا', latin: 'Alhamdulillahilladzi ahyaanaa ba\'da maa amaatanaa', arti: 'Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami.' },
    { judul: 'Doa Sebelum Makan', arab: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ', latin: 'Bismillahi wa \'alaa barakatillah', arti: 'Dengan nama Allah dan atas berkah Allah.' },
    { judul: 'Doa Setelah Makan', arab: 'اَلْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ', latin: 'Alhamdulillahilladzi ath\'amanaa wa saqaanaa wa ja\'alanaa muslimiin', arti: 'Segala puji bagi Allah yang telah memberi kami makan, minum, dan menjadikan kami Muslim.' },
    { judul: 'Doa Masuk Masjid', arab: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ', latin: 'Allahummaf-tah lii abwaaba rahmatik', arti: 'Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.' },
  ],
  'Dzikir Pagi': [
    { judul: 'Ayat Kursi', arab: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ', latin: 'Allahu laa ilaaha illaa huwal hayyul qayyuum', arti: 'Allah, tidak ada tuhan selain Dia, Yang Maha Hidup, Yang terus menerus mengurus (makhluk-Nya).' },
    { judul: 'Istighfar', arab: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ', latin: 'Astaghfirullahal \'azhiim', arti: 'Aku memohon ampun kepada Allah Yang Maha Agung.' },
    { judul: 'Subhanallah', arab: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', latin: 'Subhanallahi wa bihamdih', arti: 'Maha Suci Allah dan segala puji bagi-Nya.' },
  ],
  'Dzikir Petang': [
    { judul: 'Ta\'awudz', arab: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ', latin: "A'uudzu billahi minasy syaithanir rajiim", arti: 'Aku berlindung kepada Allah dari godaan setan yang terkutuk.' },
    { judul: 'Tasbih Petang', arab: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ', latin: 'Subhanallahi wa bihamdih \'adada khalqih', arti: 'Maha Suci Allah dan segala puji bagi-Nya sebanyak jumlah makhluk-Nya.' },
  ],
  'Doa Setelah Sholat': [
    { judul: 'Memohon Kebaikan Dunia Akhirat', arab: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً', latin: 'Rabbanaa aatinaa fid-dunyaa hasanah wa fil-aakhirati hasanah', arti: 'Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat.' },
    { judul: 'Doa Perlindungan', arab: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ', latin: "Allahumma innii a'uudzu bika min 'adzaabil qabr", arti: 'Ya Allah, sesungguhnya aku berlindung kepada-Mu dari azab kubur.' },
  ],
};

type Kategori = keyof typeof DOA_DATA;

function DoaCard({ item }: { item: typeof DOA_DATA['Doa Harian'][0] }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <TouchableOpacity
      style={styles.doaCard}
      onPress={() => { LayoutAnimation.easeInEaseOut(); setExpanded(e => !e); }}
      activeOpacity={0.85}
    >
      <View style={styles.doaHeader}>
        <Text style={styles.doaJudul}>{item.judul}</Text>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={Colors.textSecondary} />
      </View>
      {expanded && (
        <View>
          <View style={styles.doaDivider} />
          <Text style={styles.doaArab}>{item.arab}</Text>
          <Text style={styles.doaLatin}>{item.latin}</Text>
          <Text style={styles.doaArti}>"{item.arti}"</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function DoaScreen() {
  const [activeTab, setActiveTab] = useState<Kategori>('Doa Harian');
  const tabs = Object.keys(DOA_DATA) as Kategori[];

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={styles.header}>
        <Text style={styles.headerTitle}>Doa & Dzikir</Text>
        <Text style={styles.headerSub}>Amalan sehari-hari penuh berkah</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {DOA_DATA[activeTab].map((item, i) => <DoaCard key={i} item={item} />)}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 55, paddingHorizontal: Spacing.base, paddingBottom: Spacing.base },
  headerTitle: { fontFamily: Fonts.bold, fontSize: FontSize['2xl'], color: '#fff' },
  headerSub: { fontFamily: Fonts.regular, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', marginTop: 2, marginBottom: Spacing.md },
  tabs: { flexDirection: 'row' },
  tabBtn: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.full, marginRight: Spacing.xs, backgroundColor: 'rgba(255,255,255,0.15)' },
  tabBtnActive: { backgroundColor: Colors.secondary },
  tabText: { fontFamily: Fonts.medium, fontSize: FontSize.xs, color: 'rgba(255,255,255,0.8)' },
  tabTextActive: { color: Colors.primary },
  list: { padding: Spacing.base, gap: Spacing.sm },
  doaCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, ...Shadow.sm },
  doaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  doaJudul: { fontFamily: Fonts.semiBold, fontSize: FontSize.base, color: Colors.text, flex: 1 },
  doaDivider: { height: 1, backgroundColor: Colors.divider, marginVertical: Spacing.sm },
  doaArab: { fontFamily: 'Amiri-Regular', fontSize: 22, color: Colors.primary, textAlign: 'right', lineHeight: 40, marginBottom: Spacing.sm },
  doaLatin: { fontFamily: Fonts.regular, fontSize: FontSize.sm, color: Colors.textSecondary, fontStyle: 'italic', marginBottom: Spacing.xs },
  doaArti: { fontFamily: Fonts.regular, fontSize: FontSize.sm, color: Colors.text, lineHeight: 20 },
});
