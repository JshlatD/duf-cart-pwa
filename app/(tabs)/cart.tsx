import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { Link } from "expo-router";

export default function CartScreen() {
  const [cart, setCart] = useState<any>({});

  const items = Object.values(cart);

  const total = items.reduce(
    (s: number, i: any) => s + i.PRICE * i.qty,
    0
  );

  function updateQty(id: string, qty: number) {
    setCart(prev => {
      const copy = { ...prev };
      if (qty <= 0) delete copy[id];
      else copy[id].qty = qty;
      return copy;
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>

      {items.length === 0 && <Text>Cart is empty</Text>}

      {items.map((item: any) => (
        <View key={item.NUMBER} style={styles.row}>
          <Text>{item.NUMBER}</Text>

          <View style={styles.qtyBox}>
            <TouchableOpacity onPress={() => updateQty(item.NUMBER, item.qty - 1)}>
              <Text style={styles.qtyBtn}>−</Text>
            </TouchableOpacity>

            <Text>{item.qty}</Text>

            <TouchableOpacity onPress={() => updateQty(item.NUMBER, item.qty + 1)}>
              <Text style={styles.qtyBtn}>+</Text>
            </TouchableOpacity>
          </View>

          <Text>₹{item.PRICE * item.qty}</Text>
        </View>
      ))}

      <Text style={styles.total}>Total: ₹{total}</Text>

      <Link href="/">
        <Text style={styles.back}>⬅ Back to catalog</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 26, fontWeight: "bold", marginBottom: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6
  },
  qtyBox: { flexDirection: "row", alignItems: "center", gap: 10 },
  qtyBtn: { fontSize: 20 },
  total: { fontSize: 20, fontWeight: "bold", marginTop: 10 },
  back: { marginTop: 20, color: "blue" }
});
