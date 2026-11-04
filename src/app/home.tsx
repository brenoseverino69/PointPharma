import React, { useMemo, useState } from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, fonts } from '@/theme';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import ProductCard from '@/components/ProductCard';
import { pharmacies, products } from '@/data/mock';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function HomeScreen() {
  const router = useRouter();
  const { count, add } = useCart();
  const { user, logout } = useAuth();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pharmacies;
    return pharmacies.filter((p) => p.name.toLowerCase().includes(q));
  }, [query]);

  const offers = products.filter((p) => p.oldPrice);

  const profile = () =>
    Alert.alert(user?.name ?? 'Perfil', user?.email ?? '', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/');
        },
      },
    ]);

  return (
    <View style={styles.screen}>
      <Header
        right={
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <TouchableOpacity onPress={() => router.push('/cart')}>
              <Ionicons name="cart-outline" size={34} color="#fff" />
              {count > 0 && (
                <View style={styles.badge}><Text style={styles.badgeText}>{count}</Text></View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={profile} style={styles.avatar}>
              <Ionicons name="person" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30 }}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Procure por farmácias" />

        <View style={{ marginTop: 18 }}>
          {filtered.map((p) => (
            <TouchableOpacity
              key={p.id}
              activeOpacity={0.9}
              style={styles.pharmacy}
              onPress={() => router.push(`/pharmacy/${p.id}`)}
            >
              <Text style={styles.pharmacyName}>{p.name}</Text>
              <Text style={styles.pharmacyInfo}>Aberto. Fecha às {p.closes}</Text>
            </TouchableOpacity>
          ))}
          {filtered.length === 0 && <Text style={styles.empty}>Nenhuma farmácia encontrada.</Text>}
        </View>

        <Text style={styles.section}>Melhores ofertas</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={offers}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => <ProductCard product={item} onAdd={add} />}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  badge: {
    position: 'absolute', top: -4, right: -6, backgroundColor: colors.danger,
    minWidth: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
  },
  badgeText: { color: '#fff', fontSize: 10, fontFamily: fonts.bold },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#9AA0A6', alignItems: 'center', justifyContent: 'center' },
  pharmacy: {
    backgroundColor: colors.green, borderRadius: 12, padding: 14, marginBottom: 12,
    borderBottomWidth: 4, borderBottomColor: colors.greenDark,
  },
  pharmacyName: { fontFamily: fonts.bold, color: '#fff', fontSize: 15 },
  pharmacyInfo: { fontFamily: fonts.medium, color: '#fff', fontSize: 11, textAlign: 'right', marginTop: 14 },
  section: { fontFamily: fonts.bold, fontSize: 17, textAlign: 'center', marginVertical: 18, color: colors.text },
  empty: { fontFamily: fonts.regular, textAlign: 'center', color: colors.muted },
});
