import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function TabIcon({ name, focused }: { name: any; focused: boolean }) {
  return (
    <View style={{
      alignItems: 'center', justifyContent: 'center',
      width: 48, height: 48,
      backgroundColor: focused ? Colors.secondary + '25' : 'transparent',
      borderRadius: 24,
    }}>
      <Ionicons name={name} size={24} color={focused ? Colors.secondary : Colors.textLight} />
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.primary,
          borderTopWidth: 0,
          height: 65 + insets.bottom,
          paddingBottom: 8 + insets.bottom,
          paddingTop: 8,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: Colors.secondary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarLabelStyle: { fontSize: 10, fontFamily: 'Poppins-Medium', marginTop: -4 },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Beranda', tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} /> }} />
      <Tabs.Screen name="quran" options={{ title: 'Al-Qur\'an', tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'book' : 'book-outline'} focused={focused} /> }} />
      <Tabs.Screen name="doa" options={{ title: 'Doa', tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'hand-left' : 'hand-left-outline'} focused={focused} /> }} />
      <Tabs.Screen name="amal" options={{ title: 'Amal', tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'heart' : 'heart-outline'} focused={focused} /> }} />
    </Tabs>
  );
}
