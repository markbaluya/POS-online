import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../theme';

export default function CategoryChips({ categories, active, onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}>
      {categories.map((c) => {
        const sel = c === active;
        return (
          <TouchableOpacity
            key={c}
            style={[styles.chip, sel && styles.chipActive]}
            onPress={() => onSelect(c)}
            activeOpacity={0.8}>
            <Text style={[styles.label, sel && styles.labelActive]}>{c}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 8, paddingVertical: 4 },
  chip: {
    minWidth: 72,
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  label: { fontSize: 12, fontWeight: '700', color: colors.ink },
  labelActive: { color: '#fff' },
});
