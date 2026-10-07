import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius } from '../theme';

const DEALS = [
  { big: '20%', name: 'Weekend Sale', desc: 'Off all burgers • Ends Sunday', bg: '#FCEDE3' },
  { big: 'B1G1', name: 'Coffee Hour', desc: 'Buy 1 get 1 free • 2-5 PM', bg: '#DFF0E3' },
  { big: 'FREE', name: 'Free Delivery', desc: 'On all orders over $50', bg: '#DCE8F7' },
];

const PERF = [
  ['Weekend Sale', '214 used', '$1,022'],
  ['Coffee Hour', '98 used', '$411'],
  ['Free Delivery', '301 used', '$0'],
];

export default function PromoScreen() {
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.body}>
      <Text style={styles.title}>Promos</Text>
      <Text style={styles.sub}>3 active deals</Text>
      {DEALS.map((d) => (
        <View key={d.name} style={[styles.deal, { backgroundColor: d.bg }]}>
          <Text style={styles.big}>{d.big}</Text>
          <Text style={styles.dealName}>{d.name}</Text>
          <Text style={styles.dealDesc}>{d.desc}</Text>
          <TouchableOpacity style={styles.apply} activeOpacity={0.85}>
            <Text style={styles.applyText}>Apply deal</Text>
          </TouchableOpacity>
        </View>
      ))}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Deal performance</Text>
        {PERF.map((r) => (
          <View key={r[0]} style={styles.perfRow}>
            <View>
              <Text style={styles.perfName}>{r[0]}</Text>
              <Text style={styles.perfMeta}>{r[1]}</Text>
            </View>
            <Text style={styles.perfVal}>{r[2]}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  body: { padding: 16, gap: 12 },
  title: { fontSize: 22, fontWeight: '800', color: colors.ink },
  sub: { fontSize: 12, color: colors.muted },
  deal: { borderRadius: 18, padding: 16, gap: 2 },
  big: { fontSize: 34, fontWeight: '800', color: colors.accent },
  dealName: { fontSize: 15, fontWeight: '800', color: colors.ink },
  dealDesc: { fontSize: 12, color: colors.muted },
  apply: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    height: 40,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  applyText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  card: { backgroundColor: '#fff', borderRadius: radius.lg, padding: 14, gap: 12 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: colors.ink },
  perfRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  perfName: { fontSize: 14, fontWeight: '700', color: colors.ink },
  perfMeta: { fontSize: 12, color: colors.muted },
  perfVal: { fontSize: 14, fontWeight: '800', color: colors.ink },
});
