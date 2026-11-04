import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, money } from '@/theme';
import { Product } from '@/data/types';

interface Props {
  product: Product;
  onAdd: (product: Product) => void;
  width?: number;
}

export default function ProductCard({ product, onAdd, width = 150 }: Props) {
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null;
  return (
    <View style={[styles.card, { width }]}>
      <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
      <View style={styles.imgBox}>
        <Ionicons name={product.icon} size={46} color={colors.primary} />
        {discount ? (
          <View style={styles.badge}><Text style={styles.badgeText}>-{discount}%</Text></View>
        ) : null}
      </View>
      <Text style={styles.old}>
        {product.oldPrice ? `De: ${money(product.oldPrice)}` : ' '}
      </Text>
      <View style={styles.row}>
        <Text style={styles.price}>Por: {money(product.price)}</Text>
        <TouchableOpacity style={styles.add} onPress={() => onAdd(product)}>
          <Ionicons name="add" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#B8B8B8', borderRadius: 14, padding: 10, marginRight: 12 },
  name: { fontFamily: fonts.bold, fontSize: 13, color: '#000', marginBottom: 6 },
  imgBox: {
    backgroundColor: '#fff', borderRadius: 10, height: 100,
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  badge: { position: 'absolute', top: 6, left: 6, backgroundColor: colors.danger, borderRadius: 8, paddingHorizontal: 6 },
  badgeText: { color: '#fff', fontFamily: fonts.bold, fontSize: 10 },
  old: { fontFamily: fonts.regular, fontSize: 9, color: '#333', textDecorationLine: 'line-through' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontFamily: fonts.bold, fontSize: 11, color: '#000' },
  add: { backgroundColor: colors.green, borderRadius: 12, padding: 4 },
});
