import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius } from '../theme';
import { useCart } from '../store/CartContext';
import { useStore } from '../store/StoreContext';

export default function ProductCard({ item, onPress }) {
  const { add } = useCart();
  const { money } = useStore();
  return (
    <View style={styles.card}>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        <Image source={item.image} style={styles.thumb} resizeMode="cover" />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>★ {item.rating}</Text>
        </View>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.price}>{money(item.price)}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.add} onPress={() => add(item.id)} activeOpacity={0.8}>
        <Text style={styles.addText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 8,
    flex: 1,
    shadowColor: '#260F06',
    shadowOpacity: 0.09,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
    position: 'relative',
  },
  thumb: { width: '100%', height: 110, borderRadius: 12, backgroundColor: '#EDEDEF' },
  badge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: colors.blue,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  name: { fontSize: 13, fontWeight: '700', color: colors.ink, marginTop: 8 },
  price: { fontSize: 12, color: colors.muted, marginTop: 2, marginBottom: 26 },
  add: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  addText: { color: '#fff', fontSize: 18, fontWeight: '700', lineHeight: 20 },
});
