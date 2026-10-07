import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius } from '../theme';
import { fmt, useCart } from '../store/CartContext';
import { useStore } from '../store/StoreContext';

const MONTHS = [
  { m: 'Jan', sales: 18400, orders: 412 },
  { m: 'Feb', sales: 21200, orders: 478 },
  { m: 'Mar', sales: 19800, orders: 445 },
  { m: 'Apr', sales: 24600, orders: 553 },
  { m: 'May', sales: 23100, orders: 519 },
  { m: 'Jun', sales: 28400, orders: 638 },
];

export default function HomeScreen({ navigation }) {
  const [sel, setSel] = useState(MONTHS.length - 1);
  const { money } = useStore();
  const { subtotal, count } = useCart();
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.body}>
      <Text style={styles.hello}>Good morning</Text>
      <Text style={styles.name}>Mark Kevin</Text>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Today's Sales</Text>
          <Text style={styles.statValue}>{money(1240.5)}</Text>
          <Text style={styles.up}>+18%</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Orders</Text>
          <Text style={styles.statValue}>86</Text>
          <Text style={styles.up}>+12%</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primary}
          onPress={() => navigation.navigate('Menu')}
          activeOpacity={0.85}>
          <Text style={styles.primaryText}>New Order</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondary}
          onPress={() => navigation.navigate('Menu')}
          activeOpacity={0.85}>
          <Text style={styles.secondaryText}>Open cart ({count})</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.section}>Monthly sales</Text>
      <View style={styles.monthCard}>
        <View style={styles.monthHead}>
          <View>
            <Text style={styles.monthValue}>{money(MONTHS[sel].sales)}</Text>
            <Text style={styles.monthLabel}>
              {MONTHS[sel].m} • {MONTHS[sel].orders} orders • tap a bar
            </Text>
          </View>
          <View style={styles.monthChip}>
            <Text style={styles.monthChipText}>2026</Text>
          </View>
        </View>
        <View style={styles.bars}>
          {MONTHS.map((d, i) => (
            <TouchableOpacity
              key={d.m}
              style={styles.barCol}
              onPress={() => setSel(i)}
              activeOpacity={0.7}>
              <View
                style={[
                  styles.bar,
                  { height: Math.round((d.sales / 30000) * 96) },
                  i === sel && { backgroundColor: colors.accent },
                ]}
              />
              <Text
                style={[
                  styles.barLabel,
                  i === sel && { color: colors.accent, fontWeight: '800' },
                ]}>
                {d.m}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <Text style={styles.section}>Live cart</Text>
      <View style={styles.card}>
        <Text style={styles.cardText}>
          {count} items • {money(subtotal)}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
          <Text style={styles.link}>Continue order →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  body: { padding: 16, gap: 12 },
  hello: { fontSize: 12, color: colors.muted },
  name: { fontSize: 22, fontWeight: '800', color: colors.ink },
  stats: { flexDirection: 'row', gap: 12 },
  stat: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: 14,
    shadowColor: '#260F06',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  statLabel: { fontSize: 11, color: colors.muted, fontWeight: '600' },
  statValue: { fontSize: 20, fontWeight: '800', color: colors.ink, marginTop: 4 },
  up: { fontSize: 11, color: colors.green, fontWeight: '700', marginTop: 8 },
  actions: { flexDirection: 'row', gap: 12 },
  primary: {
    flex: 1,
    backgroundColor: colors.accent,
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  secondary: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: { color: colors.ink, fontWeight: '700', fontSize: 14 },
  section: { fontSize: 16, fontWeight: '800', color: colors.ink, marginTop: 4 },
  card: {
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardText: { fontSize: 13, color: colors.ink, fontWeight: '600' },
  link: { color: colors.accent, fontWeight: '800', fontSize: 13 },
  monthCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#260F06',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  monthHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  monthValue: { fontSize: 24, fontWeight: '800', color: colors.ink },
  monthLabel: { fontSize: 12, color: colors.green, fontWeight: '600', marginTop: 2 },
  monthChip: {
    backgroundColor: colors.chip,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  monthChipText: { color: colors.accent, fontSize: 12, fontWeight: '800' },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 14,
    height: 130,
  },
  barCol: { alignItems: 'center', gap: 6, flex: 1 },
  bar: {
    width: '55%',
    backgroundColor: colors.chip,
    borderRadius: 6,
    minHeight: 8,
  },
  barLabel: { fontSize: 10, color: colors.muted, fontWeight: '600' },
});
