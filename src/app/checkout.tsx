import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { colors, fonts, money } from '@/theme';
import Header from '@/components/Header';
import Button from '@/components/Button';
import { useCart } from '@/context/CartContext';
import { IconName } from '@/data/types';
import { criarPedido, salvarCodigoNoHistorico } from '@/services/pedidos';

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
  const [method, setMethod] = useState<'pix' | 'card' | 'cash'>('pix');
  const [confirmando, setConfirmando] = useState(false);

  const confirm = async () => {
    if (confirmando || items.length === 0) return;

    setConfirmando(true);
    try {
      const pedido = await criarPedido({
        formaPagamento: method,
        itens: items.map((item) => ({
          produtoId: Number(item.product.id),
          quantidade: item.qty,
        })),
      });

      let historicoSalvo = true;
      try {
        await salvarCodigoNoHistorico(pedido.codigoPedido);
      } catch {
        historicoSalvo = false;
      }

      clear();
      Alert.alert(
        'Pedido confirmado!',
        `Código: ${pedido.codigoPedido}\nTotal confirmado: ${money(pedido.valorTotal)}.${historicoSalvo ? '' : '\nAnote o código para consultar este pedido depois.'}`,
        [
          {
            text: 'Ver histórico',
            onPress: () => router.replace('/history'),
          },
          {
            text: 'Voltar ao início',
            onPress: () => router.replace('/home'),
          },
        ]
      );
    } catch (error) {
      let mensagem = 'Não foi possível confirmar o pedido. Tente novamente.';
      if (axios.isAxiosError(error)) {
        const resposta = error.response?.data;
        if (typeof resposta === 'string') {
          mensagem = resposta;
        } else if (resposta && typeof resposta === 'object') {
          const detalhes = resposta as { detail?: string; title?: string; message?: string };
          mensagem = detalhes.detail ?? detalhes.message ?? detalhes.title ?? mensagem;
        }
      }
      Alert.alert('Não foi possível finalizar', mensagem);
    } finally {
      setConfirmando(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Header title="Pagamento" icon="card" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.section}>Resumo do pedido</Text>
        {items.map((i) => (
          <View key={i.product.id} style={styles.line}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.lineName}>{i.qty}x {i.product.name}</Text>
              <Text style={styles.storeName}>{i.product.pharmacyName ?? `Farmácia #${i.product.pharmacyId}`}</Text>
              <Text style={styles.unitPrice}>{money(i.product.price)} por unidade</Text>
            </View>
            <Text style={styles.linePrice}>{money(i.qty * i.product.price)}</Text>
          </View>
        ))}
        <View style={[styles.line, { marginTop: 8 }]}>
          <Text style={[styles.lineName, { fontFamily: fonts.bold }]}>Total</Text>
          <Text style={[styles.linePrice, { fontSize: 18, color: colors.greenDark }]}>{money(total)}</Text>
        </View>

        <Text style={[styles.section, { marginTop: 24 }]}>Forma de pagamento</Text>
        <Text style={styles.paymentNote}>
          A forma escolhida será registrada no pedido. O aplicativo ainda não processa pagamentos.
        </Text>
        {methods.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={[styles.method, method === m.id && styles.methodActive]}
            onPress={() => setMethod(m.id as 'pix' | 'card' | 'cash')}
            disabled={confirmando}
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
        <Button
          title={confirmando ? 'Confirmando pedido...' : 'Confirmar pedido'}
          variant="green"
          onPress={confirm}
          disabled={items.length === 0 || confirmando}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  section: { fontFamily: fonts.bold, fontSize: 16, marginBottom: 10 },
  line: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  lineName: { fontFamily: fonts.regular, fontSize: 13 },
  storeName: { fontFamily: fonts.medium, fontSize: 11, color: colors.muted, marginTop: 2 },
  unitPrice: { fontFamily: fonts.regular, fontSize: 10, color: colors.muted, marginTop: 2 },
  linePrice: { fontFamily: fonts.semi, fontSize: 13 },
  paymentNote: { fontFamily: fonts.regular, color: colors.muted, fontSize: 11, marginBottom: 10 },
  method: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#F3F4F6', padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 2, borderColor: 'transparent' },
  methodActive: { borderColor: colors.green, backgroundColor: '#E8FBF1' },
  methodText: { flex: 1, fontFamily: fonts.medium, fontSize: 14 },
});
