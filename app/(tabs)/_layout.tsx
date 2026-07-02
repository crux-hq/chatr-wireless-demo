import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Home, BarChart3, Smartphone, Puzzle, Menu } from 'lucide-react-native';
import { colors } from '@/lib/theme/colors';

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.grayDark,
        tabBarStyle: { borderTopColor: colors.grayMid },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="usage"
        options={{
          title: t('tabs.usage'),
          tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="plans"
        options={{
          title: t('tabs.plans'),
          tabBarIcon: ({ color, size }) => <Smartphone color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="add-ons"
        options={{
          title: t('tabs.addons'),
          tabBarIcon: ({ color, size }) => <Puzzle color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: t('tabs.more'),
          tabBarIcon: ({ color, size }) => <Menu color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
