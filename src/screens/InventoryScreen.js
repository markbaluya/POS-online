import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { colors, radius } from "../theme";
import { useProducts } from "../store/ProductsContext";
import { CATEGORIES } from "../data/menu";

// Demonstrates online CRUD for instructor inspection:
// search -> GET searchProducts, add -> POST addProduct, delete -> DELETE deleteProduct.
export default function InventoryScreen() {
  const { products, loading, online, error, search, create, remove, refresh } = useProducts();
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Coffee");
  const [price, setPrice] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const onSearch = (t) => {
    setQ(t);
    search(t);
  };

  const onAdd = async () => {
    if (!name.trim() || !price.trim()) {
      setMsg("Enter name and price.");
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      await create({ name: name.trim(), category, price: parseFloat(price) });
      setMsg("Added online.");
      setName("");
      setPrice("");
    } catch (e) {
      setMsg(`Add failed: ${e.message}`);
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async (id) => {
    setBusy(true);
    try {
      await remove(id);
      setMsg(`Deleted ${id}.`);
    } catch (e) {
      setMsg(`Delete failed: ${e.message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.body}>
      <Text style={styles.title}>Inventory (Online DB)</Text>
      <Text style={styles.sub}>
        {online ? "Connected to Supabase" : "Offline demo — set keys in src/config.js"} • {products.length} items
      </Text>
      {!!error && <Text style={styles.err}>{error}</Text>}
      {!!msg && <Text style={styles.msg}>{msg}</Text>}

      <Text style={styles.label}>GET + SEARCH (online)</Text>
      <TextInput value={q} onChangeText={onSearch} placeholder="Search products (server)…" placeholderTextColor={colors.muted} style={styles.input} />
      <TouchableOpacity style={styles.secondary} onPress={refresh} disabled={loading}>
        <Text style={styles.secondaryText}>{loading ? "Loading…" : "Refresh (GET)"}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>POST (add product)</Text>
      <TextInput value={name} onChangeText={setName} placeholder="Name e.g. Spanish Latte" placeholderTextColor={colors.muted} style={styles.input} />
      <View style={styles.row}>
        {CATEGORIES.filter((c) => c !== "All").map((c) => (
          <TouchableOpacity key={c} onPress={() => setCategory(c)} style={[styles.chip, category === c && styles.chipOn]}>
            <Text style={[styles.chipText, category === c && styles.chipTextOn]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput value={price} onChangeText={setPrice} placeholder="Price e.g. 5.50" keyboardType="decimal-pad" placeholderTextColor={colors.muted} style={styles.input} />
      <TouchableOpacity style={styles.primary} onPress={onAdd} disabled={busy}>
        <Text style={styles.primaryText}>{busy ? "Working…" : "Add (POST)"}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>DELETE</Text>
      {products.map((p) => (
        <View key={String(p.id)} style={styles.card}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{p.name}</Text>
            <Text style={styles.meta}>{p.category} • ${Number(p.price).toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.del} onPress={() => onDelete(p.id)} disabled={busy}>
            <Text style={styles.delText}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  body: { padding: 16, gap: 10, paddingBottom: 40 },
  title: { fontSize: 20, fontWeight: "800", color: colors.ink },
  sub: { fontSize: 12, color: colors.muted },
  err: { fontSize: 12, color: colors.red },
  msg: { fontSize: 12, color: colors.green, fontWeight: "700" },
  label: { fontSize: 14, fontWeight: "800", color: colors.ink, marginTop: 8 },
  input: { backgroundColor: "#fff", borderRadius: 12, height: 44, paddingHorizontal: 12, borderWidth: 1, borderColor: colors.line },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderWidth: 1, borderColor: colors.line, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "#fff" },
  chipOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { fontSize: 12, color: colors.ink },
  chipTextOn: { color: "#fff", fontWeight: "800" },
  primary: { backgroundColor: colors.accent, borderRadius: 14, height: 48, alignItems: "center", justifyContent: "center" },
  primaryText: { color: "#fff", fontWeight: "800" },
  secondary: { backgroundColor: "#fff", borderWidth: 1, borderColor: colors.line, borderRadius: 14, height: 44, alignItems: "center", justifyContent: "center" },
  secondaryText: { color: colors.ink, fontWeight: "700" },
  card: { backgroundColor: "#fff", borderRadius: radius.lg, padding: 12, flexDirection: "row", alignItems: "center", gap: 10 },
  name: { fontSize: 14, fontWeight: "700", color: colors.ink },
  meta: { fontSize: 12, color: colors.muted },
  del: { backgroundColor: colors.red, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  delText: { color: "#fff", fontWeight: "800", fontSize: 12 },
});
