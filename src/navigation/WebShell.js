import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { useCart } from '../store/CartContext';
import { useStore } from '../store/StoreContext';

const RAIL = [
  { name: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { name: 'Menu', icon: 'grid-outline', activeIcon: 'grid' },
  { name: 'Inventory', icon: 'cube-outline', activeIcon: 'cube' },
  { name: 'Online', icon: 'cloud-outline', activeIcon: 'cloud' },
  { name: 'Orders', icon: 'receipt-outline', activeIcon: 'receipt' },
  { name: 'Promo', icon: 'pricetag-outline', activeIcon: 'pricetag' },
  { name: 'Alerts', icon: 'notifications-outline', activeIcon: 'notifications' },
  { name: 'Profile', icon: 'person-outline', activeIcon: 'person' },
];

export default function WebShell({ tabs }) {
  const [active, setActive] = useState('Menu');
  const { count } = useCart();
  const { store } = useStore();
  const found = tabs.find((t) => t.name === active);
  const Screen = found ? found.component : tabs[0].component;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.rail}>
        <View style={[styles.tile, styles.darkTile]}>
          <Ionicons name="home" size={20} color="#fff" />
        </View>
        {RAIL.map((r) => {
          const on = r.name === active;
          return (
            <TouchableOpacity
              key={r.name}
              style={[styles.tile, on && styles.tileActive]}
              onPress={() => setActive(r.name)}
              activeOpacity={0.8}>
              <Ionicons
                name={on ? r.activeIcon : r.icon}
                size={20}
                color={on ? '#fff' : colors.muted}
              />
            </TouchableOpacity>
          );
        })}
        <View style={{ flex: 1 }} />
        <View style={styles.tile}>
          <Ionicons name="settings-outline" size={20} color={colors.muted} />
        </View>
        <View style={styles.tile}>
          <Ionicons name="log-out-outline" size={20} color={colors.muted} />
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.topbar}>
          <View style={styles.search}>
            <Ionicons name="search" size={16} color={colors.muted} />
            <TextInput
              placeholder="Search menu…"
              placeholderTextColor={colors.muted}
              style={styles.searchInput}
            />
          </View>
          <Text style={styles.brand}>● {store.name}</Text>
          <View style={styles.topActions}>
            <View style={styles.circle}>
              <Ionicons name="notifications-outline" size={18} color={colors.ink} />
              {count > 0 && <View style={styles.dot} />}
            </View>
            <View style={styles.circle}>
              <Ionicons name="settings-outline" size={18} color={colors.ink} />
            </View>
            <View style={styles.pill}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>M</Text>
              </View>
              <View>
                <Text style={styles.cashier}>Mark Kevin</Text>
                <Text style={styles.role}>Cashier</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.screen}>
          <Screen navigation={{ navigate: (name) => setActive(name) }} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: colors.bg },
  rail: {
    width: 64,
    backgroundColor: '#FFFBF7',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 10,
    borderRightWidth: 1,
    borderRightColor: colors.line,
  },
  tile: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  darkTile: { backgroundColor: colors.ink },
  tileActive: { backgroundColor: colors.accent },
  content: { flex: 1 },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
    backgroundColor: colors.bg,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    height: 40,
    paddingHorizontal: 12,
    width: 260,
  },
  searchInput: { flex: 1, fontSize: 13 },
  brand: { flex: 1, textAlign: 'center', fontSize: 15, fontWeight: '800', color: colors.ink },
  topActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.red,
    borderWidth: 2,
    borderColor: '#fff',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 20,
    height: 40,
    paddingHorizontal: 6,
    paddingRight: 12,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  cashier: { fontSize: 11, fontWeight: '700', color: colors.ink },
  role: { fontSize: 10, color: colors.muted },
  screen: { flex: 1 },
});
