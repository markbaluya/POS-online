import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../theme';

const NOTES = [
  { t: 'Low stock', d: 'Oat milk is below 10% — reorder soon', time: '2m', unread: true },
  { t: 'New order', d: 'Order #5267 just came in (Dine-in)', time: '9m', unread: true },
  { t: 'Payment received', d: '$117.07 paid in Cash for Order #5266', time: '1h', unread: false },
  { t: 'Promo ending', d: 'Weekend Sale ends this Sunday', time: '3h', unread: false },
];

export default function AlertsScreen() {
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.body}>
      <Text style={styles.title}>Alerts</Text>
      <Text style={styles.sub}>4 unread</Text>
      {NOTES.map((n) => (
        <View key={n.t} style={[styles.card, !n.unread && styles.read]}>
          {n.unread && <View style={styles.dot} />}
          <View style={{ flex: 1 }}>
            <Text style={styles.t}>{n.t}</Text>
            <Text style={styles.d}>{n.d}</Text>
          </View>
          <Text style={styles.time}>{n.time}</Text>
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    shadowColor: '#260F06',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  read: { backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.line, elevation: 0 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent, marginTop: 5 },
  t: { fontSize: 13, fontWeight: '800', color: colors.ink },
  d: { fontSize: 12, color: colors.muted, marginTop: 2 },
  time: { fontSize: 11, color: colors.muted },
});
