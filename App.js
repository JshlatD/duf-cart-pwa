import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jsPDF } from "jspdf";
import catalog from "./assets/catalog.json";

export default function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState({});

  useEffect(() => {
    setProducts(catalog);
    loadCart();
  }, []);

  async function loadCart() {
    const saved = await AsyncStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }

  async function saveCart(data) {
    setCart(data);
    await AsyncStorage.setItem("cart", JSON.stringify(data));
  }

  function addToCart(item) {
    const updated = {
      ...cart,
      [item.NUMBER]: { ...item, qty: (cart[item.NUMBER]?.qty || 0) + 1 }
    };
    saveCart(updated);
  }

  function updateQty(id, qty) {
    const updated = { ...cart };
    if (qty <= 0) delete updated[id];
    else updated[id].qty = qty;
    saveCart(updated);
  }

  const filtered = products.filter(p =>
    p.NUMBER.toLowerCase().includes(search.toLowerCase())
  );

  const total = Object.values(cart)
    .reduce((s, i) => s + i.PRICE * i.qty, 0);

  function exportPDF() {
    const doc = new jsPDF();
    doc.text("Shopping Cart Summary", 10, 10);
    let y = 20;

    Object.values(cart).forEach(i => {
      doc.text(`${i.NUMBER}  x${i.qty}   ₹${i.PRICE * i.qty}`, 10, y);
      y += 8;
    });

    doc.text(`Total: ₹${total}`, 10, y + 10);
    doc.save("cart.pdf");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Product Catalog</Text>

      <TextInput
        style={styles.search}
        placeholder="Search by Catalog Number"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filtered}
        keyExtractor={i => i.NUMBER}
        renderItem={({ item }) => (
          <View style={styles.product}>
            <View>
              <Text style={styles.bold}>{item.NUMBER}</Text>
              <Text>₹{item.PRICE}</Text>
            </View>
            <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(item)}>
              <Text style={styles.btnText}>Add</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Text style={styles.cartHeader}>Your Cart</Text>

      {Object.values(cart).map(item => (
        <View key={item.NUMBER} style={styles.cartRow}>
          <Text style={styles.bold}>{item.NUMBER}</Text>

          <View style={styles.qtyBox}>
            <TouchableOpacity onPress={() => updateQty(item.NUMBER, item.qty - 1)}>
              <Text style={styles.qtyBtn}>−</Text>
            </TouchableOpacity>
            <Text>{item.qty}</Text>
            <TouchableOpacity onPress={() => updateQty(item.NUMBER, item.qty + 1)}>
              <Text style={styles.qtyBtn}>+</Text>
            </TouchableOpacity>
          </View>

          <Text>₹{item.qty * item.PRICE}</Text>
        </View>
      ))}

      <Text style={styles.total}>Total: ₹{total}</Text>

      <TouchableOpacity style={styles.exportBtn} onPress={exportPDF}>
        <Text style={styles.btnText}>Export PDF</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 26, fontWeight: "bold", marginBottom: 10 },
  search: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 6,
    marginBottom: 10
  },
  product: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderWidth: 1,
    marginBottom: 6,
    borderRadius: 6
  },
  addBtn: {
    backgroundColor: "#ff9900",
    paddingHorizontal: 15,
    justifyContent: "center",
    borderRadius: 6
  },
  btnText: { color: "white", fontWeight: "bold" },
  cartHeader: { fontSize: 22, marginTop: 15 },
  cartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6
  },
  qtyBox: { flexDirection: "row", alignItems: "center", gap: 10 },
  qtyBtn: { fontSize: 22, paddingHorizontal: 8 },
  total: { fontSize: 20, fontWeight: "bold", marginTop: 10 },
  exportBtn: {
    backgroundColor: "green",
    padding: 14,
    marginTop: 10,
    alignItems: "center",
    borderRadius: 8
  },
  bold: { fontWeight: "bold" }
});
