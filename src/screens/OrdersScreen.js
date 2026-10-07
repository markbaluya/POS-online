import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius } from '../theme';

const ORDERS = [
  { id: '#5266', meta: '3 items • Dine-in • 2:40 PM', total: '$117.07', status: 'Active' },
  { id: '#5265', meta: '2 items • Takeaway • 2:15 PM', total: '$42.40', status: 'Active' },
  { id: '#5264', meta: '5 items • Dine-in • 1:58 PM', total: '$89.10', status: 'Done' },
  { id: '#5263', meta: '1 item • Delivery • 1:30 PM', total: '$21.20', status: 'Done' },
  { id: '#5262', meta: '4 items • Dine-in • 12:44 PM', total: '$76.30', status: 'Done' },
];

const FILTERS = ['All', 'Active', 'Done'];

export default function OrdersScreen() {
  const [f, setF] = useState('All');
  const rows = ORDERS.filter((o) => f === 'All' || o.status === f);
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.body}>
      <Text style={styles.title}>Orders</Text>
      <Text style={styles.sub}>12 today • 4 active</Text>
      <View style={styles.chips}>
        {FILTERS.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.chip, f === c && styles.chipActive]}
            onPress={() => setF(c)}>
            <Text style={[styles.chipText, f === c && styles.chipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {rows.map((o) => (
        <View key={o.id} style={styles.card}>
          <View>
            <Text style={styles.orderId}>Order {o.id}</Text>
            <Text style={styles.meta}>{o.meta}</Text>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 6 }}>
            <Text style={styles.total}>{o.total}</Text>
            <View
              style={[
                styles.pill,
                o.status === 'Active' ? styles.pillActive : styles.pillDone,
              ]}>
              <Text
                style={[
                  styles.pillText,
                  o.status === 'Active' ? styles.pillTextActive : styles.pillTextDone,
                ]}>
                {o.status}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  body: { padding: 16, gap: 10 },
  title: { fontSize: 22, fontWeight: '800', color: colors.ink },
  sub: { fontSize: 12, color: colors.muted },
  chips: { flexDirection: 'row', gap: 8 },
  chip: {
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { fontSize: 12, fontWeight: '700', color: colors.ink },
  chipTextActive: { color: '#fff' },
  card: {
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#260F06',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  orderId: { fontSize: 14, fontWeight: '800', color: colors.ink },
  meta: { fontSize: 12, color: colors.muted, marginTop: 4 },
  total: { fontSize: 15, fontWeight: '800', color: colors.ink },
  pill: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 5 },
  pillActive: { backgroundColor: colors.chip },
  pillDone: { backgroundColor: colors.greenBg },
  pillText: { fontSize: 10, fontWeight: '800' },
  pillTextActive: { color: colors.accent },
  pillTextDone: { color: colors.green },
});
