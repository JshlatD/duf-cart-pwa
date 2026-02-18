import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import jsPDF from "jspdf/dist/jspdf.es.min.js";
// ADD THIS IMPORT
import Head from 'expo-router/head';
//import { jsPDF } from "jspdf";
import AsyncStorage from "@react-native-async-storage/async-storage";
import catalog from "../assets/catalog.json"; // Adjusted path for app/index.tsx
import logoFile from "../assets/logo.png";
import { Image as RNImage } from "react-native"; // Rename to avoid conflict
import { Asset } from "expo-asset";

type Item = {
  NUMBER: string;
  DISCR: string;
  DIA?: string | null;
  HEIGHT?: string | null;
  PRICE: number;
};

export default function HomeScreen() {
  const [products, setProducts] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<Item[]>([]);
  const [selected, setSelected] = useState<Item | null>(null);
  
  // Manual entry states
  const [customDiscr, setCustomDiscr] = useState("");
  const [customPrice, setCustomPrice] = useState("");
  const [showWarning, setShowWarning] = useState(false); // NEW Warning State
  
  const [qty, setQty] = useState("1");
  const [cart, setCart] = useState<Record<string, Item & { qty: number }>>({});
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    setProducts(catalog as Item[]);
    loadCart();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  async function loadCart() {
    const saved = await AsyncStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }

  // --- RESET FUNCTION ---
  async function resetCart() {
    setCart({});
    setCustomerName("");
    setPhone("");
    setSearch("");
    setSelected(null);
    setCustomDiscr("");
    setCustomPrice("");
    setShowWarning(false);
    await AsyncStorage.removeItem("cart");
  }

  function onSearch(text: string) {
    setSearch(text);
    if (showWarning) setShowWarning(false); // Clear warning as user types
    if (!text) {
      setSelected(null);
      setCustomDiscr("");
      setCustomPrice("");
      return setSuggestions([]);
    }
    setSuggestions(
      products.filter(p =>
        String(p.NUMBER || "").toLowerCase().includes(text.toLowerCase())
      ).slice(0, 5)
    );
  }

  function selectProduct(p: Item) {
    setSelected(p);
    setSearch(p.NUMBER);
    setCustomDiscr(p.DISCR);
    setCustomPrice(String(p.PRICE));
    setSuggestions([]);
    setShowWarning(false);
  }

  function addToCart() {
    // If search is empty, we don't have a catalog number
    if (!search.trim()) {
      setShowWarning(true);
      return;
    }

    const itemID = selected ? selected.NUMBER : search;
    const q = parseInt(qty) || 1;
    const p = parseFloat(customPrice) || 0;

    setCart(prev => ({
      ...prev,
      [itemID]: {
        NUMBER: itemID,
        DISCR: customDiscr || itemID,
        PRICE: p,
        qty: (prev[itemID]?.qty || 0) + q
      }
    }));

    // Reset entry fields
    setSearch("");
    setSelected(null);
    setCustomDiscr("");
    setCustomPrice("");
    setQty("1");
    setShowWarning(false);
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
    const logoUri = Asset.fromModule(logoFile).uri;
    doc.addImage(logoUri, "PNG", 14, 10, 55, 25); 

    doc.setFontSize(18);
    doc.text("QUOTATION", 150, 22);
    doc.rect(14, 38, 182, 22);
    doc.setFontSize(12);
    doc.text(`Name : ${customerName}`, 16, 46);
    doc.text(`Phone : ${phone}`, 100, 46);
    doc.text(`Date : ${new Date().toLocaleDateString()}`, 150, 46);
    let y = 70;
    doc.rect(14, y, 182, 10);
    doc.text("Cat No", 16, y + 7);
    doc.text("Description", 42, y + 7);
    doc.text("Unit Price", 112, y + 7);
    doc.text("Qty", 142, y + 7);
    doc.text("Subtotal", 162, y + 7);
    y += 10;
    items.forEach((i, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(240, 240, 240);
        doc.rect(14, y, 182, 10, "F");
      }
      doc.rect(14, y, 182, 10);
      doc.setTextColor(0);
      doc.text(String(i.NUMBER), 16, y + 7);
      doc.text(String(i.DISCR || "").substring(0, 32), 42, y + 7);
      doc.text(String(i.PRICE), 112, y + 7);
      doc.text(String(i.qty), 142, y + 7);
      doc.text(String(i.PRICE * i.qty), 162, y + 7);
      y += 10;
    });
    doc.rect(14, y + 4, 182, 12);
    doc.setFontSize(14);
    // UPDATED TOTAL WITH RUPEE SYMBOL
    doc.text(`Total: Rs. ${total}`, 150, y + 13);
    doc.save("quotation.pdf");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* THIS SECTION IS THE MISSING BRIDGE TO THE MANIFEST */}
      <Head>
        <title>DUF Catalog</title>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#111827" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* ADD THIS SCRIPT TO TRIGGER THE INSTALL */}
        <script>
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js');
              });
            }
          `}
        </script>
      </Head>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
            <Text style={styles.headerTitle}>Quick Order</Text>

            <View style={styles.card}>
              <Text style={styles.cardLabel}>Customer Details</Text>
              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#94A3B8"
                value={customerName}
                onChangeText={setCustomerName}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <View style={styles.card}>
              <Text style={styles.cardLabel}>Add Item</Text>
              
              {/* WARNING MESSAGE */}
              {showWarning && (
                <Text style={{ color: '#EF4444', fontSize: 12, fontWeight: '700', marginBottom: 5 }}>
                  ⚠️ PLEASE ENTER CATALOG NUMBER
                </Text>
              )}

              <TextInput
                style={[styles.input, { borderColor: showWarning ? "#EF4444" : "#FF9900", borderWidth: 2 }]}
                placeholder="Search Catalog Number..."
                placeholderTextColor="#94A3B8"
                value={search}
                onChangeText={onSearch}
              />

              {suggestions.length > 0 && (
                <View style={styles.dropdown}>
                  {suggestions.map(p => (
                    <TouchableOpacity key={p.NUMBER} style={styles.suggestionItem} onPress={() => selectProduct(p)}>
                      <Text style={styles.suggestionText}>{p.NUMBER} — {p.DISCR}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <View style={{ marginTop: 10 }}>
                <TextInput
                  style={styles.input}
                  placeholder="Item Description"
                  placeholderTextColor="#94A3B8"
                  value={customDiscr}
                  onChangeText={setCustomDiscr}
                />
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Price"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={customPrice}
                    onChangeText={setCustomPrice}
                  />
                  <TextInput
                    style={[styles.input, { width: 80, textAlign: 'center' }]}
                    placeholder="Qty"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={qty}
                    onChangeText={setQty}
                  />
                </View>
                <TouchableOpacity 
                  style={[styles.primaryBtn, { opacity: (search || customDiscr) ? 1 : 0.5 }]} 
                  onPress={addToCart}
                >
                  <Text style={styles.btnText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <Text style={styles.sectionTitle}>Review Cart</Text>
              <TouchableOpacity onPress={resetCart} style={styles.resetBtn}>
                <Text style={styles.resetBtnText}>Clear All</Text>
              </TouchableOpacity>
            </View>

            {items.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Your cart is empty</Text>
              </View>
            ) : (
              items.map((item) => (
                <View key={item.NUMBER} style={styles.cartCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemCode}>{item.NUMBER}</Text>
                    <Text style={styles.itemDesc} numberOfLines={1}>{item.DISCR}</Text>
                  </View>

                  <View style={styles.qtyControl}>
                    <TouchableOpacity style={styles.controlBtn} onPress={() => updateQty(item.NUMBER, item.qty - 1)}>
                      <Text style={styles.controlBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyValue}>{item.qty}</Text>
                    <TouchableOpacity style={styles.controlBtn} onPress={() => updateQty(item.NUMBER, item.qty + 1)}>
                      <Text style={styles.controlBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.itemPrice}>₹{item.PRICE * item.qty}</Text>
                  <TouchableOpacity onPress={() => updateQty(item.NUMBER, 0)}>
                    <Text style={styles.deleteIcon}>🗑</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>

          <View style={styles.footer}>
            <View>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>₹{total}</Text>
            </View>
            <TouchableOpacity style={styles.exportBtn} onPress={exportPDF}>
              <Text style={styles.exportBtnText}>Generate Quote</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8FAFC" },
  container: { flex: 1, paddingHorizontal: 20 },
  headerTitle: { fontSize: 32, fontWeight: "900", color: "#0F172A", marginVertical: 20 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  cardLabel: { fontSize: 14, fontWeight: "700", color: "#64748B", marginBottom: 12, textTransform: "uppercase" },
  input: {
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 10,
  },
  dropdown: { backgroundColor: "#F8FAFC", borderRadius: 12, overflow: "hidden", marginTop: -6, marginBottom: 10 },
  suggestionItem: { padding: 14, borderBottomWidth: 1, borderBottomColor: "#E2E8F0" },
  suggestionText: { fontSize: 14, color: "#334155" },
  primaryBtn: { width: "100%", backgroundColor: "#FF9900", height: 55, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  btnText: { color: "#FFFFFF", fontSize: 18, fontWeight: "800" },
  sectionTitle: { fontSize: 22, fontWeight: "800", color: "#1E293B", marginTop: 10, marginBottom: 15 },
  resetBtn: { backgroundColor: "#FEE2E2", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  resetBtnText: { color: "#EF4444", fontWeight: "700", fontSize: 14 },
  cartCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },
  itemCode: { fontSize: 16, fontWeight: "800", color: "#0F172A" },
  itemDesc: { fontSize: 14, color: "#64748B" },
  qtyControl: { flexDirection: "row", alignItems: "center", gap: 10, marginHorizontal: 15 },
  controlBtn: { backgroundColor: "#F1F5F9", width: 30, height: 30, borderRadius: 8, justifyContent: "center", alignItems: "center" },
  controlBtnText: { fontSize: 18, fontWeight: "bold", color: "#0F172A" },
  qtyValue: { fontSize: 16, fontWeight: "800", minWidth: 20, textAlign: "center" },
  itemPrice: { fontSize: 16, fontWeight: "800", color: "#0F172A", width: 70, textAlign: "right" },
  deleteIcon: { fontSize: 20, marginLeft: 10 },
  emptyContainer: { alignItems: "center", marginTop: 40 },
  emptyText: { color: "#94A3B8", fontSize: 16 },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#1E293B",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  totalLabel: { color: "#94A3B8", fontSize: 12, textTransform: "uppercase", fontWeight: "700" },
  totalValue: { color: "#FFFFFF", fontSize: 24, fontWeight: "900" },
  exportBtn: { backgroundColor: "#FF9900", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  exportBtnText: { color: "#FFFFFF", fontWeight: "800", fontSize: 14 }
});