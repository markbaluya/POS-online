// Lab 05 screen: SQLite CRUD + SQL LIKE search + offline durability (CLO 2.3-2.6).
// Uses src/services/db.js. No fetch, no API, works in Airplane Mode.
import React, { useState, useEffect } from "react";
import {
  SafeAreaView, View, Text, FlatList, TextInput,
  TouchableOpacity, Modal, StyleSheet, Alert,
} from "react-native";
import { colors, radius } from "../theme";
import { initDatabase, getAllProducts, searchProductsByName, insertProduct, deleteProductById } from "../services/db";

export default function SQLitePOSScreen() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [dbError, setDbError] = useState(null);

  const loadData = (query = "") => {
    try {
      if (query.trim() === "") {
        setProducts(getAllProducts());
      } else {
        setProducts(searchProductsByName(query));
      }
    } catch (e) {
      setDbError(String(e?.message ?? e));
    }
  };

  useEffect(() => {
    try {
      initDatabase();
      loadData();
    } catch (e) {
      setDbError(String(e?.message ?? e));
    }
  }, []);

  const handleAddProduct = () => {
    if (!name || !price || !stock) {
      Alert.alert("Validation Error", "Please fill in all product fields.");
      return;
    }
    insertProduct(name, "General", parseFloat(price), parseInt(stock, 10));
    setName(""); setPrice(""); setStock("");
    setModalVisible(false);
    loadData(search);
  };

  const handleDelete = (id, prodName) => {
    Alert.alert("Delete Confirmation", `Remove ${prodName}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive",
        onPress: () => {
          deleteProductById(id);
          loadData(search);
        },
      },
    ]);
  };

  if (dbError) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Inventory Database (SQLite)</Text>
        <Text style={styles.empty}>SQLite unavailable here: {dbError}</Text>
        <Text style={styles.empty}>Open in Expo Go on a phone for the offline demo.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Inventory Database (SQLite)</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.addBtnText}>+ Add Item</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder="Search items by name (SQL LIKE)..."
        placeholderTextColor={colors.muted}
        value={search}
        onChangeText={(text) => { setSearch(text); loadData(text); }}
      />
      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemMeta}>Cat: {item.category} • Stock: {item.stock} units</Text>
            </View>
            <Text style={styles.itemPrice}>₱{Number(item.price).toFixed(2)}</Text>
            <TouchableOpacity onPress={() => handleDelete(item.id, item.name)} style={styles.delBtn}>
              <Text style={styles.delBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No products found in SQLite database.</Text>
        }
      />
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Product Entry</Text>
            <TextInput style={styles.input} placeholder="Product Name" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Price (PHP)" keyboardType="numeric" value={price} onChangeText={setPrice} />
            <TextInput style={styles.input} placeholder="Initial Stock" keyboardType="numeric" value={stock} onChangeText={setStock} />
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.accent }]} onPress={handleAddProduct}>
                <Text style={[styles.btnText, { color: "#FFF" }]}>Save to SQLite</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  title: { fontSize: 18, fontWeight: "bold", color: colors.ink },
  addBtn: { backgroundColor: colors.accent, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 6 },
  addBtnText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 13 },
  searchBar: { backgroundColor: "#FFF", borderWidth: 1, borderColor: colors.line, borderRadius: 8, padding: 10, marginBottom: 12 },
  card: { flexDirection: "row", backgroundColor: "#FFF", padding: 12, borderRadius: radius.md, marginBottom: 8, borderWidth: 1, borderColor: colors.line, alignItems: "center" },
  itemName: { fontSize: 15, fontWeight: "bold", color: colors.ink },
  itemMeta: { fontSize: 12, color: colors.muted, marginTop: 2 },
  itemPrice: { fontSize: 15, fontWeight: "bold", color: colors.accent, marginRight: 12 },
  delBtn: { backgroundColor: "#FEE2E2", paddingHorizontal: 9, paddingVertical: 5, borderRadius: 4 },
  delBtnText: { color: "#DC2626", fontWeight: "bold", fontSize: 13 },
  empty: { textAlign: "center", color: colors.muted, marginTop: 30 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 20 },
  modalCard: { backgroundColor: "#FFF", borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: colors.ink, marginBottom: 14 },
  input: { borderWidth: 1, borderColor: colors.line, borderRadius: 6, padding: 10, marginBottom: 10 },
  modalBtns: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 10 },
  cancelBtn: { padding: 10 },
  saveBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  btnText: { fontWeight: "bold", color: colors.muted },
});
