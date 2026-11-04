import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, fonts, money } from '@/theme';
import Header from '@/components/Header';
import Button from '@/components/Button';
import { useCart } from '@/context/CartContext';
import { IconName } from '@/data/types';

interface Method {
  id: string;
  label: string;
  icon: IconName;
}

const methods: Method[] = [
  { id: 'pix', label: 'Pix', icon: 'qr-code' },
  { id: 'card', label: 'Cartão de crédito', icon: 'card' },
  { id: 'cash', label: 'Dinheiro na retirada', icon: 'cash' },
];

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, total, clear } = useCart();
  const [method, setMethod] = useState<string>('pix');

  const confirm = () => {
    const label = methods.find((m) => m.id === method)?.label ?? '';
    Alert.alert('Pedido confirmado! 🎉', `Total de ${money(total)} via ${label}.`, [
      {
        text: 'OK',
        onPress: () => {
          clear();
          router.replace('/home');
        },
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      <Header title="Pagamento" icon="card" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.section}>Resumo do pedido</Text>
        {items.map((i) => (
          <View key={i.product.id} style={styles.line}>
            <Text style={styles.lineName}>{i.qty}x {i.product.name}</Text>
            <Text style={styles.linePrice}>{money(i.qty * i.product.price)}</Text>
          </View>
        ))}
        <View style={[styles.line, { marginTop: 8 }]}>
          <Text style={[styles.lineName, { fontFamily: fonts.bold }]}>Total</Text>
          <Text style={[styles.linePrice, { fontSize: 18, color: colors.greenDark }]}>{money(total)}</Text>
        </View>

        <Text style={[styles.section, { marginTop: 24 }]}>Forma de pagamento</Text>
        {methods.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={[styles.method, method === m.id && styles.methodActive]}
            onPress={() => setMethod(m.id)}
          >
            <Ionicons name={m.icon} size={22} color={method === m.id ? colors.greenDark : '#444'} />
            <Text style={styles.methodText}>{m.label}</Text>
            <Ionicons
              name={method === m.id ? 'radio-button-on' : 'radio-button-off'}
              size={22}
              color={method === m.id ? colors.greenDark : '#999'}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={{ padding: 16, paddingBottom: 24 }}>
        <Button title="Confirmar pedido" variant="green" onPress={confirm} disabled={items.length === 0} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  section: { fontFamily: fonts.bold, fontSize: 16, marginBottom: 10 },
  line: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  lineName: { fontFamily: fonts.regular, fontSize: 13, flex: 1 },
  linePrice: { fontFamily: fonts.semi, fontSize: 13 },
  method: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#F3F4F6', padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 2, borderColor: 'transparent' },
  methodActive: { borderColor: colors.green, backgroundColor: '#E8FBF1' },
  methodText: { flex: 1, fontFamily: fonts.medium, fontSize: 14 },
});
