const LOGO_BASE64 = "data:image/png;base64,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";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView
} from "react-native";
import { useEffect, useState } from "react";
import jsPDF from "jspdf/dist/jspdf.es.min.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import catalog from "../../assets/catalog.json";

type Item = any;

export default function HomeScreen() {
  const [products, setProducts] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<Item[]>([]);
  const [selected, setSelected] = useState<Item | null>(null);
  const [qty, setQty] = useState("1");
  const [cart, setCart] = useState<Record<string, Item & { qty: number }>>({});

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    setProducts(catalog);
    loadCart();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  async function loadCart() {
    const saved = await AsyncStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }

  function onSearch(text: string) {
    setSearch(text);

    if (!text) {
      setSelected(null);
      return setSuggestions([]);
    }

    setSuggestions(
      products.filter(p =>
        String(p.NUMBER || "")
          .toLowerCase()
          .includes(text.toLowerCase())
      ).slice(0, 6)
    );
  }

  function selectProduct(p: Item) {
    setSelected(p);
    setSearch(p.NUMBER);
    setSuggestions([]);
  }

  function addToCart() {
    if (!selected) return;

    const q = parseInt(qty) || 1;

    setCart(prev => ({
      ...prev,
      [selected.NUMBER]: {
        ...selected,
        qty: (prev[selected.NUMBER]?.qty || 0) + q
      }
    }));

    setSearch("");
    setSelected(null);
    setQty("1");
  }

  function updateQty(id: string, q: number) {
    setCart(prev => {
      const copy = { ...prev };
      if (q <= 0) delete copy[id];
      else copy[id].qty = q;
      return copy;
    });
  }

  const items = Object.values(cart);
  const total = items.reduce((s, i) => s + i.PRICE * i.qty, 0);

  function exportPDF() {
    const doc = new jsPDF();

    // Logo
    doc.addImage(LOGO_BASE64, "PNG", 14, 10, 55, 20);

    // Title
    doc.setFontSize(18);
    doc.text("QUOTATION", 150, 22);

    // Customer Box
    doc.rect(14, 38, 182, 22);
    doc.setFontSize(12);
    doc.text(`Name : ${customerName}`, 16, 46);
    doc.text(`Phone : ${phone}`, 100, 46);
    doc.text(`Date : ${new Date().toLocaleDateString()}`, 150, 46);

    let y = 70;

    // Header Row
    doc.rect(14, y, 182, 10);
    doc.text("Cat No", 16, y + 7);
    doc.text("Description", 42, y + 7);
    doc.text("Unit Price", 112, y + 7);
    doc.text("Qty", 142, y + 7);
    doc.text("Subtotal", 162, y + 7);

    y += 10;

    // Items
    items.forEach((i, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(240, 240, 240);
        doc.rect(14, y, 182, 10, "F");
      }

      doc.rect(14, y, 182, 10);

      doc.setTextColor(0);
      doc.text(String(i.NUMBER), 16, y + 7);
      doc.text(String(i.DISCR || ""), 42, y + 7);
      doc.text(String(i.PRICE), 112, y + 7);
      doc.text(String(i.qty), 142, y + 7);
      doc.text(String(i.PRICE * i.qty), 162, y + 7);

      y += 10;
    });

    // Total
    doc.rect(14, y + 4, 182, 12);
    doc.setFontSize(14);
    doc.text(`Total: ${total}`, 150, y + 13);

    doc.save("quotation.pdf");
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={styles.title}>Quick Order</Text>

        <View style={styles.customerBox}>
          <TextInput
            style={styles.customerInput}
            placeholder="Customer Name"
            value={customerName}
            onChangeText={setCustomerName}
          />
          <TextInput
            style={styles.customerInput}
            placeholder="Phone Number"
            keyboardType="numeric"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <TextInput
          style={styles.search}
          placeholder="Search catalog number"
          value={search}
          onChangeText={onSearch}
        />

        {suggestions.length > 0 && (
          <View style={styles.dropdown}>
            {suggestions.map(p => (
              <TouchableOpacity
                key={p.NUMBER}
                style={styles.option}
                onPress={() => selectProduct(p)}
              >
                <Text>
                  {p.NUMBER} • {p.DISCR} • {p.PRICE}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {selected && (
          <View style={styles.addRow}>
            <TextInput
              style={styles.qty}
              keyboardType="numeric"
              value={qty}
              onChangeText={setQty}
            />
            <TouchableOpacity style={styles.addBtn} onPress={addToCart}>
              <Text style={styles.addText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.cartTitle}>Cart</Text>

        <FlatList
          data={items}
          keyExtractor={i => i.NUMBER}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.code}>{item.NUMBER}</Text>
              <Text style={styles.desc}>{item.DISCR}</Text>

              <View style={styles.qtyControl}>
                <TouchableOpacity
                  style={styles.qtyBtnBox}
                  onPress={() => updateQty(item.NUMBER, item.qty - 1)}
                >
                  <Text style={styles.qtyBtnText}>−</Text>
                </TouchableOpacity>

                <Text style={styles.qtyDisplay}>{item.qty}</Text>

                <TouchableOpacity
                  style={styles.qtyBtnBox}
                  onPress={() => updateQty(item.NUMBER, item.qty + 1)}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.subtotal}>
                {item.PRICE * item.qty}
              </Text>

              <TouchableOpacity onPress={() => updateQty(item.NUMBER, 0)}>
                <Text style={styles.delete}>🗑</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </ScrollView>

      <View style={styles.bottomBar}>
        <Text style={styles.totalText}>Total: {total}</Text>
        <TouchableOpacity style={styles.exportBtn} onPress={exportPDF}>
          <Text style={styles.exportText}>Export PDF</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f8", paddingHorizontal: 12 },

  title: { fontSize: 28, fontWeight: "bold", marginBottom: 12 },

  customerBox: { gap: 8, marginBottom: 12 },

  customerInput: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#cbd5e1"
  },

  search: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#cbd5e1"
  },

  dropdown: { backgroundColor: "#fff", borderRadius: 8, marginTop: 4 },

  option: { padding: 12, borderBottomWidth: 1, borderColor: "#eee" },

  addRow: { flexDirection: "row", marginTop: 12, gap: 10 },

  qty: {
    backgroundColor: "#fff",
    padding: 12,
    width: 90,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    textAlign: "center"
  },

  addBtn: {
    backgroundColor: "#ff9900",
    borderRadius: 8,
    paddingHorizontal: 24,
    justifyContent: "center"
  },

  addText: { color: "white", fontWeight: "bold" },

  cartTitle: { fontSize: 22, fontWeight: "bold", marginVertical: 20 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee"
  },

  code: { width: 80, fontWeight: "600" },
  desc: { flex: 1 },

  qtyControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    width: 70,
    justifyContent: "center"
  },

  qtyBtnBox: {
    backgroundColor: "#e5e7eb",
    width: 24,
    height: 24,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center"
  },

  qtyBtnText: { fontSize: 16, fontWeight: "bold" },

  qtyDisplay: { minWidth: 20, textAlign: "center", fontWeight: "bold" },

  subtotal: { width: 90, textAlign: "right", fontWeight: "600" },

  delete: { fontSize: 18, color: "#e11d48", marginLeft: 10 },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#111827",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  totalText: { color: "white", fontSize: 18, fontWeight: "bold" },

  exportBtn: {
    backgroundColor: "#ff9900",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8
  },

  exportText: { color: "white", fontWeight: "bold" }
});
