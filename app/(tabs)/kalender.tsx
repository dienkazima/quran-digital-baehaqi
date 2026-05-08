import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PASARAN = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'];

const HOLIDAYS_DB: Record<string, { title: string, type: 'national' | 'islamic' }[]> = {
  '2026-01-01': [{ title: 'Tahun Baru Masehi', type: 'national' }],
  '2026-02-14': [{ title: 'Isra Mi\'raj Nabi Muhammad SAW', type: 'islamic' }],
  '2026-02-17': [{ title: 'Tahun Baru Imlek', type: 'national' }],
  '2026-03-20': [{ title: 'Hari Raya Idul Fitri 1447 Hijriah', type: 'islamic' }],
  '2026-03-21': [{ title: 'Hari Raya Idul Fitri 1447 Hijriah', type: 'islamic' }],
  '2026-04-03': [{ title: 'Wafat Yesus Kristus', type: 'national' }],
  '2026-05-01': [{ title: 'Hari Buruh Internasional', type: 'national' }],
  '2026-05-14': [{ title: 'Kenaikan Yesus Kristus', type: 'national' }],
  '2026-05-27': [{ title: 'Hari Raya Idul Adha 1447 Hijriah', type: 'islamic' }],
  '2026-05-31': [{ title: 'Hari Raya Waisak', type: 'national' }],
  '2026-06-01': [{ title: 'Hari Lahir Pancasila', type: 'national' }],
  '2026-06-17': [{ title: 'Tahun Baru Islam 1448 Hijriah', type: 'islamic' }],
  '2026-08-17': [{ title: 'Hari Kemerdekaan Republik Indonesia', type: 'national' }],
  '2026-08-26': [{ title: 'Maulid Nabi Muhammad SAW', type: 'islamic' }],
  '2026-12-25': [{ title: 'Hari Raya Natal', type: 'national' }],
};

const getPasaran = (year: number, month: number, date: number) => {
  const target = Date.UTC(year, month, date);
  const anchor = Date.UTC(2021, 0, 1);
  const diff = Math.round((target - anchor) / (1000 * 60 * 60 * 24));
  return PASARAN[((diff % 5) + 5) % 5];
};

const toArabic = (num: number | string) => String(num).replace(/[0-9]/g, d => "٠١٢٣٤٥٦٧٨٩"[d as any]);

const HIJRI_MONTHS = [
  'Muharram', 'Safar', 'Rabiul Awal', 'Rabiul Akhir',
  'Jumadil Awal', 'Jumadil Akhir', 'Rajab', "Sya'ban",
  'Ramadhan', 'Syawal', "Dzulqa'dah", 'Dzulhijjah',
];

// Konversi Masehi → Hijriah murni JavaScript (tidak butuh Intl)
const getHijriDate = (year: number, month: number, date: number) => {
  const gm = month + 1; // konversi ke 1-indexed

  // Gregorian → Julian Day Number (algoritma Jean Meeus)
  const a = Math.floor((14 - gm) / 12);
  const y = year + 4800 - a;
  const m = gm + 12 * a - 3;
  const jd = date
    + Math.floor((153 * m + 2) / 5)
    + 365 * y
    + Math.floor(y / 4)
    - Math.floor(y / 100)
    + Math.floor(y / 400)
    - 32045;

  // Julian Day Number → Hijriah
  let l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
    Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l = l
    - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50)
    - Math.floor(j / 16) * Math.floor((15238 * j) / 43)
    + 29;
  const hMonth = Math.floor((24 * l) / 709);
  const hDay = l - Math.floor((709 * hMonth) / 24);
  const hYear = 30 * n + j - 30;

  return {
    day: hDay,
    monthName: HIJRI_MONTHS[hMonth - 1] ?? '',
    year: String(hYear),
  };
};

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function KalenderScreen() {
  const insets = useSafeAreaInsets();
  const [currentDate, setCurrentDate] = useState(new Date()); 
  
  useEffect(() => {
    // Current date is now default
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const calendarGrid = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const startingDayOfWeek = firstDay.getDay(); // 0 is Sunday
    const daysInPrevMonth = getDaysInMonth(year, month - 1);
    const daysInMonth = getDaysInMonth(year, month);
    
    const grid = [];
    
    // Padding prev month
    for (let i = 0; i < startingDayOfWeek; i++) {
      const d = daysInPrevMonth - startingDayOfWeek + i + 1;
      grid.push({
        date: d,
        monthOffset: -1,
        isCurrentMonth: false,
        fullDate: new Date(year, month - 1, d)
      });
    }
    
    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      grid.push({
        date: i,
        monthOffset: 0,
        isCurrentMonth: true,
        fullDate: new Date(year, month, i)
      });
    }
    
    // Padding next month
    const cellsToFill = grid.length % 7 === 0 ? 0 : 7 - (grid.length % 7);
    for (let i = 1; i <= cellsToFill; i++) {
      grid.push({
        date: i,
        monthOffset: 1,
        isCurrentMonth: false,
        fullDate: new Date(year, month + 1, i)
      });
    }
    
    // Attach details
    return grid.map(item => {
      const gDate = item.fullDate;
      const y = gDate.getFullYear();
      const m = gDate.getMonth();
      const d = gDate.getDate();
      
      const hijri = getHijriDate(y, m, d);
      const pasaran = getPasaran(y, m, d);
      
      const dateKey = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const holidays = HOLIDAYS_DB[dateKey] || [];
      const isSunday = gDate.getDay() === 0;
      const isFriday = gDate.getDay() === 5;
      const isHoliday = holidays.length > 0;
      
      return {
        ...item,
        hijri,
        pasaran,
        holidays,
        isSunday,
        isFriday,
        isHoliday,
        dateKey
      };
    });
  }, [year, month]);

  const hijriMonthHeader = useMemo(() => {
    if (calendarGrid.length === 0) return { month: '', year: '' };
    const currentMonthDays = calendarGrid.filter(d => d.isCurrentMonth);
    if (currentMonthDays.length === 0) return { month: '', year: '' };
    
    const firstHijri = currentMonthDays[0].hijri;
    const lastHijri = currentMonthDays[currentMonthDays.length - 1].hijri;
    
    if (firstHijri.monthName === lastHijri.monthName) {
      return { month: firstHijri.monthName, year: firstHijri.year + ' H' };
    } else {
      return { month: `${firstHijri.monthName} - ${lastHijri.monthName}`, year: lastHijri.year + ' H' };
    }
  }, [calendarGrid]);

  const holidaysInMonth = useMemo(() => {
    return calendarGrid
      .filter(item => item.isCurrentMonth && item.holidays.length > 0)
      .map(item => ({
        dateKey: item.dateKey,
        day: item.date,
        monthName: MONTH_NAMES[item.fullDate.getMonth()].slice(0, 3),
        holidays: item.holidays,
        hijriDay: item.hijri.day,
        hijriMonthName: item.hijri.monthName,
        hijriYear: item.hijri.year,
        fullDate: item.fullDate
      }));
  }, [calendarGrid]);

  const formatHeaderDate = (d: Date, hijri: any) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return `${days[d.getDay()]}, ${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()} / ${hijri.day} ${hijri.monthName} ${hijri.year}`;
  };

  const todayStr = useMemo(() => {
    const d = new Date(); // Use actual today for header
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const pasaran = getPasaran(d.getFullYear(), d.getMonth(), d.getDate());
    const hijri = getHijriDate(d.getFullYear(), d.getMonth(), d.getDate());
    return {
      top: `${days[d.getDay()]} ${pasaran}, ${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`,
      bottom: `${hijri.day} ${hijri.monthName} ${hijri.year}`
    };
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Header App */}
      <View style={styles.appHeader}>
        <Text style={styles.appTitle}>
          {todayStr.top}{'\n'}{todayStr.bottom}
        </Text>
        <View style={styles.appHeaderIcons}>
          <Ionicons name="information-circle-outline" size={24} color="#fff" style={{ marginRight: 16 }} />
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Calendar Header */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={prevMonth} style={styles.navButton}>
            <Ionicons name="chevron-back" size={20} color={Colors.primary} />
          </TouchableOpacity>
          <View style={styles.monthYearContainer}>
            <Text style={styles.monthYearText}>{MONTH_NAMES[month]} {year}</Text>
            <Text style={styles.hijriMonthText}>{hijriMonthHeader.month} {hijriMonthHeader.year}</Text>
          </View>
          <TouchableOpacity onPress={nextMonth} style={styles.navButton}>
            <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Days of Week Header */}
        <View style={styles.daysHeader}>
          {['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((day, idx) => (
            <View key={day} style={styles.dayBox}>
              <Text style={styles.dayText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.grid}>
          {calendarGrid.map((item, index) => {
            const isRed = item.isSunday || item.isHoliday;
            const isGreen = item.isFriday && !isRed;
            
            const today = new Date();
            const isToday = item.date === today.getDate() && 
                            item.fullDate.getMonth() === today.getMonth() && 
                            item.fullDate.getFullYear() === today.getFullYear();
            
            let mainColor = '#333';
            if (isRed) mainColor = '#E53935';
            else if (isGreen) mainColor = '#00897B';

            if (!item.isCurrentMonth) {
              mainColor = '#BDBDBD'; // Fade out
            }
            
            if (isToday) {
              mainColor = '#fff';
            }

            return (
              <View key={index} style={styles.cell}>
                <View style={[styles.cellInner, isToday && styles.todayCell]}>
                  {/* Hijri Date (Top Left) */}
                  <Text style={[styles.hijriCellText, { color: isToday ? '#E0F2F1' : mainColor }]}>
                    {toArabic(item.hijri.day)}
                  </Text>
                  
                  {/* Gregorian Date (Center) */}
                  <Text style={[styles.gregorianCellText, { color: mainColor }]}>
                    {item.date}
                  </Text>
                  
                  {/* Pasaran (Bottom) */}
                  <Text style={[styles.pasaranCellText, { color: mainColor }]}>
                    {item.pasaran}
                  </Text>
                  
                  {/* Dots Container */}
                  <View style={styles.dotsContainer}>
                    {item.holidays.map((h, i) => (
                      <View 
                        key={i} 
                        style={[
                          styles.dot, 
                          { backgroundColor: h.type === 'national' ? '#E53935' : (h.type === 'islamic' ? '#0288D1' : '#FBC02D') }
                        ]} 
                      />
                    ))}
                    {item.isFriday && <View style={[styles.dot, { backgroundColor: '#FBC02D' }]} />}
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Holidays List */}
        <View style={styles.holidaysSection}>
          <View style={styles.holidaysHeader}>
            <View style={styles.holidaysIndicator} />
            <Text style={styles.holidaysTitle}>Hari Besar & Libur Nasional</Text>
            <Ionicons name="chevron-up" size={20} color={Colors.primary} style={{ marginLeft: 'auto' }} />
          </View>

          {holidaysInMonth.map((item, index) => {
            const isNational = item.holidays.some(h => h.type === 'national');
            return (
            <View key={index} style={styles.holidayItem}>
              <View style={[styles.holidayIcon, isNational ? { borderColor: '#FFCDD2' } : null]}>
                <Text style={styles.holidayIconMonth}>{item.monthName}</Text>
                <Text style={[styles.holidayIconDay, { color: isNational ? '#E53935' : '#0288D1' }]}>{item.day}</Text>
              </View>
              <View style={styles.holidayContent}>
                {item.holidays.map((h, i) => (
                  <View key={i}>
                    <Text style={styles.holidayName}>{h.title}</Text>
                    <Text style={styles.holidayDateSub}>
                      {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][item.fullDate.getDay()]}, {item.day} {MONTH_NAMES[item.fullDate.getMonth()]} {item.fullDate.getFullYear()} / {item.hijriDay} {item.hijriMonthName} {item.hijriYear}
                    </Text>
                  </View>
                ))}
              </View>
              <Ionicons name="information-circle" size={18} color="#BDBDBD" />
            </View>
          )})}
          
          {holidaysInMonth.length === 0 && (
            <Text style={styles.noHolidayText}>Tidak ada hari besar di bulan ini.</Text>
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  appHeader: {
    backgroundColor: '#00897B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  appHeaderIcons: {
    flexDirection: 'row',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  navButton: {
    padding: 8,
  },
  monthYearContainer: {
    alignItems: 'center',
  },
  monthYearText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  hijriMonthText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Poppins-Regular',
    marginTop: 2,
  },
  hijriYearText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Poppins-Medium',
  },
  daysHeader: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  dayBox: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  dayText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Poppins-Medium',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  cell: {
    width: '14.28%',
    height: 70,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
  },
  cellInner: {
    flex: 1,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
  },
  todayCell: {
    backgroundColor: '#00897B',
    margin: 2,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#00897B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  hijriCellText: {
    fontSize: 10,
    alignSelf: 'flex-start',
    fontFamily: 'Poppins-Regular',
  },
  gregorianCellText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  pasaranCellText: {
    fontSize: 9,
    fontFamily: 'Poppins-Regular',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 1,
  },
  holidaysSection: {
    backgroundColor: '#fff',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  holidaysHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  holidaysIndicator: {
    width: 4,
    height: 16,
    backgroundColor: '#8D6E63',
    marginRight: 8,
    borderRadius: 2,
  },
  holidaysTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  holidayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  holidayIcon: {
    width: 44,
    height: 48,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  holidayIconMonth: {
    fontSize: 10,
    color: '#999',
    fontFamily: 'Poppins-Regular',
  },
  holidayIconDay: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  holidayContent: {
    flex: 1,
  },
  holidayName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Poppins-Medium',
  },
  holidayDateSub: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
  },
  noHolidayText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    marginTop: 16,
  }
});
