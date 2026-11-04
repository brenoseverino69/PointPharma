
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, fonts, money } from '@/theme';
import Header, { Logo } from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import Button from '@/components/Button';
import { useCart } from '@/context/CartContext';
import { pharmacyById } from '@/data/mock';
import { CartItem } from '@/data/types';
import api from '../services/api';

export default function CartScreen() {
    const router = useRouter();
    const { items, add, dec, remove, total } = useCart();
    const [query, setQuery] = useState('');

    useEffect(() => {
        buscarProdutos();
    }, []);

    async function buscarProdutos() {
        try {
            const resposta = await api.get('/ProdutosApi');

            console.log(resposta.data);

        } catch (error) {
            console.log('Erro ao buscar produtos:', error);
        }
    }

    const list = useMemo(() => {
        const q = query.trim().toLowerCase();

        return items.filter((i) =>
            !q || i.product.name.toLowerCase().includes(q)
        );
    }, [items, query]);

    const confirmRemove = (item: CartItem) =>
        Alert.alert('Remover item', `Remover ${item.product.name} do carrinho?`, [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Remover', style: 'destructive', onPress: () => remove(item.product.id) },
        ]);

    return (
        <View style={styles.screen}>
            <Header title="Meu carrinho" icon="cart" onBack={() => router.back()} right={<Logo />} />

            <FlatList
                contentContainerStyle={{ padding: 16, flexGrow: 1 }}
                ListHeaderComponent={
                    <View style={{ marginBottom: 14 }}>
                        <SearchBar value={query} onChangeText={setQuery} placeholder="Veja suas compras" />
                    </View>
                }
                data={list}
                keyExtractor={(i) => i.product.id}
                ListEmptyComponent={
                    <View style={styles.emptyBox}>
                        <Ionicons name="cart-outline" size={64} color={colors.grayDark} />
                        <Text style={styles.empty}>Seu carrinho está vazio.</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={{ marginBottom: 14 }}>
                        <View style={styles.card}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.name} numberOfLines={1}>{item.product.name}</Text>
                                <TouchableOpacity onPress={() => confirmRemove(item)}>
                                    <Ionicons name="trash-outline" size={18} color="#fff" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.row}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                    <Ionicons name="location-sharp" size={12} color="#fff" />
                                    <Text style={styles.store} numberOfLines={1}>
                                        {pharmacyById(item.product.pharmacyId)?.name}
                                    </Text>
                                </View>

                                <Text style={styles.price}>
                                    {money(item.product.price * item.qty)}
                                </Text>
                            </View>

                            <View style={styles.qtyRow}>
                                <TouchableOpacity style={styles.qtyBtn} onPress={() => dec(item.product.id)}>
                                    <Ionicons name="remove" size={16} color="#fff" />
                                </TouchableOpacity>

                                <Text style={styles.qty}>{item.qty}</Text>

                                <TouchableOpacity style={styles.qtyBtn} onPress={() => add(item.product)}>
                                    <Ionicons name="add" size={16} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.divider} />
                    </View>
                )}
            />

            <View style={styles.footer}>
                {items.length > 0 && (
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>{money(total)}</Text>
                    </View>
                )}

                <Button
                    title="Continuar comprando"
                    variant="cyan"
                    onPress={() => router.replace('/home')}
                    style={{ marginBottom: 10 }}
                />

                <Button
                    title={'Avançar para o\npagamento'}
                    variant="green"
                    disabled={items.length === 0}
                    onPress={() => router.push('/checkout')}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#fff' },
    card: { backgroundColor: colors.green, borderRadius: 12, padding: 14, borderBottomWidth: 4, borderBottomColor: colors.greenDark },
    name: { fontFamily: fonts.bold, color: '#fff', fontSize: 15, flex: 1, marginRight: 8 },
    row: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
    store: { fontFamily: fonts.semi, color: '#fff', fontSize: 11, marginLeft: 3, flex: 1 },
    price: { fontFamily: fonts.bold, color: '#fff', fontSize: 11 },
    qtyRow: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginTop: 10, gap: 10 },
    qtyBtn: { backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: 4 },
    qty: { color: '#fff', fontFamily: fonts.bold, fontSize: 14, minWidth: 18, textAlign: 'center' },
    divider: { height: 1, backgroundColor: '#ddd', marginTop: 14 },
    emptyBox: { alignItems: 'center', marginTop: 60 },
    empty: { fontFamily: fonts.medium, color: colors.muted, marginTop: 10 },
    footer: { padding: 16, paddingBottom: 24, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    totalLabel: { fontFamily: fonts.semi, fontSize: 16 },
    totalValue: { fontFamily: fonts.bold, fontSize: 18, color: colors.greenDark },
});
