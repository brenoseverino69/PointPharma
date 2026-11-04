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

export default function ProductCard({ product, onAdd, width = 160 }: Props) {
  const discount = product.oldPrice && product.oldPrice > product.price
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null;

  return (
    <View style={[styles.card, { width }]}>
      <Text style={styles.name} numberOfLines={2}>{product.name}</Text>

      <View style={styles.imgBox}>
        <Ionicons name={product.icon} size={42} color={colors.primary} />
        {discount ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>-{discount}%</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.category} numberOfLines={1}>{product.category}</Text>

      {product.oldPrice ? (
        <Text style={styles.old}>De: {money(product.oldPrice)}</Text>
      ) : (
        <Text style={styles.old}> </Text>
      )}

      <View style={styles.row}>
        <Text style={styles.price}>Por: {money(product.price)}</Text>
        <TouchableOpacity
          style={[styles.add, product.stock === 0 && styles.addDisabled]}
          onPress={() => onAdd(product)}
          disabled={product.stock === 0}
        >
          <Ionicons name="add" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {product.stock !== undefined && (
        <Text style={product.stock === 0 ? styles.unavailable : styles.stock}>
          {product.stock === 0
            ? 'Sem estoque'
            : `Estoque: ${product.stock} ${product.stock === 1 ? 'unidade' : 'unidades'}`}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#B8B8B8',
    borderRadius: 14,
    padding: 10,
    marginRight: 12,
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: '#000',
    minHeight: 34,
    marginBottom: 6,
  },
  imgBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 92,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  badge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: colors.danger,
    borderRadius: 8,
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#fff',
    fontFamily: fonts.bold,
    fontSize: 10,
  },
  category: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: '#333',
  },
  old: {
    fontFamily: fonts.regular,
    fontSize: 9,
    color: '#333',
    textDecorationLine: 'line-through',
    minHeight: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: '#000',
    flex: 1,
  },
  add: {
    backgroundColor: colors.green,
    borderRadius: 12,
    padding: 4,
  },
  addDisabled: {
    backgroundColor: colors.grayDark,
  },
  unavailable: {
    fontFamily: fonts.medium,
    fontSize: 9,
    color: '#7A1111',
    marginTop: 4,
  },
  stock: {
    fontFamily: fonts.medium,
    fontSize: 9,
    color: colors.greenDark,
    marginTop: 4,
  },
});
