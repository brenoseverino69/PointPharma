import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, fonts, money } from '@/theme';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import { pharmacyById, products } from '@/data/mock';
import { useCart } from '@/context/CartContext';

export default function PharmacyScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const pharmacy = pharmacyById(id);
  const { add, count, items } = useCart();
  const [query, setQuery] = useState('');

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products
      .filter((p) => p.pharmacyId === id)
      .filter((p) => !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }, [query, id]);

  const qtyOf = (productId: string) => items.find((i) => i.product.id === productId)?.qty ?? 0;

  if (!pharmacy) {
    return (
      <View style={styles.screen}>
        <Header title="Farmácia" onBack={() => router.back()} />
        <Text style={styles.empty}>Farmácia não encontrada.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Header
        title={pharmacy.name}
        onBack={() => router.back()}
        right={
          <TouchableOpacity onPress={() => router.push('/cart')}>
            <Ionicons name="cart-outline" size={30} color="#fff" />
            {count > 0 && (
              <View style={styles.badge}><Text style={styles.badgeText}>{count}</Text></View>
            )}
          </TouchableOpacity>
        }
      />
      <FlatList
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
          <View style={{ marginBottom: 14 }}>
            <SearchBar value={query} onChangeText={setQuery} placeholder="Procure por produtos" />
            <Text style={styles.address}>
              {pharmacy.address} • Fecha às {pharmacy.closes}
            </Text>
          </View>
        }
        data={list}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum produto encontrado.</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.icon}>
              <Ionicons name={item.icon} size={28} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.cat}>{item.category}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.price}>{money(item.price)}</Text>
                {item.oldPrice ? <Text style={styles.old}>{money(item.oldPrice)}</Text> : null}
              </View>
            </View>
            <TouchableOpacity style={styles.add} onPress={() => add(item)}>
              <Ionicons name="add" size={22} color="#fff" />
              {qtyOf(item.id) > 0 && <Text style={styles.qty}>{qtyOf(item.id)}</Text>}
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  badge: { position: 'absolute', top: -4, right: -6, backgroundColor: colors.danger, minWidth: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#fff', fontSize: 10, fontFamily: fonts.bold },
  address: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, marginTop: 10 },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 14, padding: 12, marginBottom: 10, gap: 12 },
  icon: { width: 56, height: 56, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  name: { fontFamily: fonts.bold, fontSize: 14, color: colors.text },
  cat: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  price: { fontFamily: fonts.bold, fontSize: 14, color: colors.greenDark },
  old: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, textDecorationLine: 'line-through' },
  add: { backgroundColor: colors.green, borderRadius: 14, paddingHorizontal: 10, height: 40, flexDirection: 'row', alignItems: 'center', gap: 4 },
  qty: { color: '#fff', fontFamily: fonts.bold, fontSize: 12 },
  empty: { textAlign: 'center', fontFamily: fonts.regular, color: colors.muted, marginTop: 30 },
});
