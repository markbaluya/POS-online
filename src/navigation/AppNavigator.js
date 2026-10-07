import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import { WEB_BREAKPOINT, colors } from '../theme';
import HomeScreen from '../screens/HomeScreen';
import MenuScreen from '../screens/MenuScreen';
import OrdersScreen from '../screens/OrdersScreen';
import PromoScreen from '../screens/PromoScreen';
import AlertsScreen from '../screens/AlertsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import WebShell from './WebShell';

const Tab = createBottomTabNavigator();

export const TABS = [
  { name: 'Home', component: HomeScreen, icon: 'home-outline', activeIcon: 'home' },
  { name: 'Menu', component: MenuScreen, icon: 'grid-outline', activeIcon: 'grid' },
  { name: 'Orders', component: OrdersScreen, icon: 'receipt-outline', activeIcon: 'receipt' },
  { name: 'Promo', component: PromoScreen, icon: 'pricetag-outline', activeIcon: 'pricetag' },
  { name: 'Alerts', component: AlertsScreen, icon: 'notifications-outline', activeIcon: 'notifications' },
  { name: 'Profile', component: ProfileScreen, icon: 'person-outline', activeIcon: 'person' },
];

export default function AppNavigator() {
  const { width } = useWindowDimensions();
  const wide = width >= WEB_BREAKPOINT;

  return (
    <NavigationContainer
      linking={{
        prefixes: [],
        config: {
          screens: {
            Home: '',
            Menu: 'menu',
            Orders: 'orders',
            Promo: 'promo',
            Alerts: 'alerts',
            Profile: 'profile',
          },
        },
      }}>
      {wide ? (
        <WebShell tabs={TABS} />
      ) : (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: colors.accent,
            tabBarInactiveTintColor: colors.muted,
            tabBarIcon: ({ color, size, focused }) => {
              const t = TABS.find((x) => x.name === route.name);
              return (
                <Ionicons
                  name={focused ? t.activeIcon : t.icon}
                  size={size}
                  color={color}
                />
              );
            },
          })}>
          {TABS.map((t) => (
            <Tab.Screen key={t.name} name={t.name} component={t.component} />
          ))}
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
}
