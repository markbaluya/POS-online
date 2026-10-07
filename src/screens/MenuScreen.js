import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { CATEGORIES } from '../data/menu';
import { WEB_BREAKPOINT, colors } from '../theme';
import { useCart } from '../store/CartContext';
import { useStore } from '../store/StoreContext';
import { useProducts } from '../store/ProductsContext';
import CategoryChips from '../components/CategoryChips';
import ProductCard from '../components/ProductCard';
import { CartPanel } from '../components/Cart';

export default function MenuScreen() {
  const { width } = useWindowDimensions();
  const wide = width >= WEB_BREAKPOINT;
  const { count } = useCart();
  const { store } = useStore();
  const { products, loading, online } = useProducts();
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');

  const items = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return products.filter(
      (m) =>
        (cat === 'All' || m.category === cat) &&
        (!needle || m.name.toLowerCase().includes(needle)),
    );
  }, [cat, q, products]);

  const grid = (
    <View style={styles.grid}>
      {items.map((item) => (
        <View key={item.id} style={[styles.cell, wide && styles.cellWide]}>
          <ProductCard item={item} />
        </View>
      ))}
      {!items.length && (
        <Text style={styles.empty}>No items match your search.</Text>
      )}
    </View>
  );

  const header = (
    <View style={{ gap: 8 }}>
      <Text style={styles.brand}>{store.name}</Text>
      <TextInput
        value={q}
        onChangeText={setQ}
        placeholder={online ? "Search menu (online)…" : "Search menu…"}
        placeholderTextColor={colors.muted}
        style={styles.search}
      />
      {loading && <Text style={styles.count}>Loading online products…</Text>}
      <Text style={styles.section}>Categories</Text>
      <CategoryChips categories={CATEGORIES} active={cat} onSelect={setCat} />
      <View style={styles.titleRow}>
        <Text style={styles.section}>Select Menu</Text>
        <Text style={styles.count}>
          {items.length} items{count > 0 ? ` • ${count} in cart` : ''}
        </Text>
      </View>
    </View>
  );

  if (wide) {
    return (
      <View style={styles.rootRow}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.pad}>
          {header}
          {grid}
        </ScrollView>
        <ScrollView style={styles.side} contentContainerStyle={styles.pad}>
          <CartPanel />
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView style={styles.rootCol} contentContainerStyle={styles.pad}>
      {header}
      {grid}
      <View style={{ height: 12 }} />
      <CartPanel />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  rootRow: { flex: 1, backgroundColor: colors.bg, flexDirection: 'row' },
  rootCol: { flex: 1, backgroundColor: colors.bg },
  pad: { padding: 14, gap: 8, paddingBottom: 20 },
  side: { width: 340 },
  brand: { fontSize: 20, fontWeight: '800', color: colors.accent },
  search: {
    backgroundColor: '#fff',
    borderRadius: 12,
    height: 42,
    paddingHorizontal: 12,
    fontSize: 13,
    borderWidth: 1,
    borderColor: colors.line,
  },
  section: { fontSize: 16, fontWeight: '800', color: colors.ink },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  count: { fontSize: 12, color: colors.muted },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  cell: { width: '48%', flexGrow: 1 },
  cellWide: { width: '23%', flexGrow: 1 },
  empty: { color: colors.muted, textAlign: 'center', marginTop: 32, width: '100%' },
});
