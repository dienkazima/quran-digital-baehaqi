import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Colors, Fonts, FontSize } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function CoverScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handlePress = () => {
    router.replace('/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#134E4A', '#0F3D3E']} style={StyleSheet.absoluteFillObject} />
      
      {/* Ornamen Latar Belakang (Pola X/Silang) */}
      <View style={styles.patternContainer}>
        {Array.from({ length: 4 }).map((_, rowIndex) => (
          <View key={rowIndex} style={styles.patternRow}>
            {Array.from({ length: 8 }).map((_, colIndex) => (
              <Text key={colIndex} style={styles.patternText}>✕</Text>
            ))}
          </View>
        ))}
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        
        {/* Ikon Kaca (Glassmorphism) Qaf */}
        <View style={styles.glassIcon}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
            style={StyleSheet.absoluteFillObject}
          />
          <Text style={styles.arabicLetter}>ق</Text>
        </View>

        {/* Teks Utama */}
        <Text style={styles.title}>Qur'an Digital Baehaqi</Text>
        
        {/* Subteks */}
        <Text style={styles.subtitle}>
          Amal jariyah untuk Almarhum{'\n'}Baehaqi & warga Dusun Gejome
        </Text>

      </Animated.View>

      {/* Tombol Masuk & Teks Bawah */}
      <Animated.View style={[styles.bottomContainer, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.button} onPress={handlePress} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Buka Aplikasi</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.bottomText}>Bersih. Tenang. Bermakna.</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F3D3E',
  },
  patternContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    opacity: 0.05,
    paddingHorizontal: 20,
  },
  patternRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  patternText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '300',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  glassIcon: {
    width: 120,
    height: 120,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  arabicLetter: {
    fontFamily: 'Amiri-Bold',
    fontSize: 60,
    color: '#D4AF37',
    lineHeight: 80,
    marginTop: 10,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 32,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: Fonts.medium,
    fontSize: FontSize.base,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSize.md,
    color: '#fff',
    marginRight: 8,
  },
  bottomText: {
    fontFamily: Fonts.bold,
    fontSize: FontSize.sm,
    color: 'rgba(255, 255, 255, 0.9)',
  },
});
