import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '@/components/Header';
import Button from '@/components/Button';
import { colors, fonts, money } from '@/theme';
import { listarPedidosHistorico, Pedido } from '@/services/pedidos';

export default function HistoryScreen() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState(false);

  const carregar = useCallback(async (atualizacao = false) => {
    if (atualizacao) setAtualizando(true);
    else setCarregando(true);

    setErro(false);
    try {
      setPedidos(await listarPedidosHistorico());
    } catch (error) {
      console.log('Erro ao buscar histórico de pedidos:', error);
      setErro(true);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return (
    <View style={styles.screen}>
      <Header title="Histórico de pedidos" icon="time" onBack={() => router.back()} />

      {carregando ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.green} />
          <Text style={styles.message}>Carregando pedidos...</Text>
        </View>
      ) : erro ? (
        <View style={styles.center}>
          <Text style={styles.message}>
            Não foi possível carregar o histórico. Verifique a conexão e tente novamente.
          </Text>
          <Button title="Tentar novamente" onPress={() => carregar()} />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={pedidos.length === 0 ? styles.emptyList : styles.list}
          data={pedidos}
          keyExtractor={(pedido) => pedido.codigoPedido}
          refreshControl={
            <RefreshControl refreshing={atualizando} onRefresh={() => carregar(true)} />
          }
          ListEmptyComponent={(
            <View style={styles.center}>
              <Text style={styles.message}>Você ainda não tem pedidos salvos neste aparelho.</Text>
              <Button title="Ver produtos" onPress={() => router.replace('/home')} />
            </View>
          )}
          renderItem={({ item: pedido }) => (
            <View style={styles.card}>
              <View style={styles.heading}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.code}>Pedido {pedido.codigoPedido.slice(0, 8).toUpperCase()}</Text>
                  <Text style={styles.date}>{new Date(pedido.dataPedido).toLocaleString('pt-BR')}</Text>
                </View>
                <Text style={styles.status}>{pedido.status}</Text>
              </View>

              {pedido.itens.map((item, index) => (
                <View key={`${pedido.codigoPedido}-${index}`} style={styles.item}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.productName}>{item.quantidade}x {item.nomeProduto}</Text>
                    <Text style={styles.store}>{item.nomeFarmacia}</Text>
                  </View>
                  <Text style={styles.itemPrice}>{money(item.subtotal)}</Text>
                </View>
              ))}

              <View style={styles.footer}>
                <Text style={styles.payment}>{pedido.formaPagamento}</Text>
                <Text style={styles.total}>{money(pedido.valorTotal)}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  list: { padding: 16, paddingBottom: 28 },
  emptyList: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 },
  message: { fontFamily: fonts.medium, color: colors.muted, textAlign: 'center' },
  card: { backgroundColor: '#F3F4F6', borderRadius: 14, padding: 16, marginBottom: 14 },
  heading: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  code: { fontFamily: fonts.bold, color: colors.text, fontSize: 14 },
  date: { fontFamily: fonts.regular, color: colors.muted, fontSize: 10, marginTop: 3 },
  status: { fontFamily: fonts.semi, color: colors.greenDark, fontSize: 11 },
  item: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#E0E0E0', paddingVertical: 9 },
  productName: { fontFamily: fonts.medium, color: colors.text, fontSize: 12 },
  store: { fontFamily: fonts.regular, color: colors.muted, fontSize: 10, marginTop: 2 },
  itemPrice: { fontFamily: fonts.semi, color: colors.text, fontSize: 12, marginLeft: 8 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#D2D5D9', paddingTop: 12, marginTop: 2 },
  payment: { fontFamily: fonts.regular, color: colors.muted, fontSize: 11 },
  total: { fontFamily: fonts.bold, color: colors.greenDark, fontSize: 15 },
});
