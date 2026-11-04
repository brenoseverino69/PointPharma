import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, fonts } from '@/theme';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { Farmacia, listarFarmacias } from '@/services/farmacias';
import { listarProdutos } from '@/services/produtos';
import { Product } from '@/data/types';

export default function HomeScreen() {
    const router = useRouter();
    const { count, add } = useCart();

    const [query, setQuery] = useState('');
    const [farmacias, setFarmacias] = useState<Farmacia[]>([]);
    const [produtos, setProdutos] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingProdutos, setLoadingProdutos] = useState(true);
    const [erro, setErro] = useState(false);
    const [erroProdutos, setErroProdutos] = useState(false);

    useEffect(() => {
        buscarFarmacias();
        buscarProdutos();
    }, []);

    async function buscarFarmacias() {
        try {
            setLoading(true);
            setErro(false);
            const dados = await listarFarmacias();
            setFarmacias(dados);
        } catch (error) {
            console.log('Erro ao buscar farmácias:', error);
            setErro(true);
        } finally {
            setLoading(false);
        }
    }

    async function buscarProdutos() {
        try {
            setLoadingProdutos(true);
            setErroProdutos(false);
            const dados = await listarProdutos();
            setProdutos(dados);
        } catch (error) {
            console.log('Erro ao buscar produtos:', error);
            setErroProdutos(true);
        } finally {
            setLoadingProdutos(false);
        }
    }

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();

        if (!q) return farmacias;

        return farmacias.filter((p) =>
            p.nome.toLowerCase().includes(q) || p.endereco.toLowerCase().includes(q)
        );
    }, [query, farmacias]);

    const offers = useMemo(
        () => produtos.filter((p) => p.oldPrice != null && p.oldPrice > p.price),
        [produtos]
    );

    const produtosExibidos = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return offers;

        return produtos.filter((produto) => {
            const farmacia = produto.pharmacyName
                ?? farmacias.find((item) => String(item.id) === produto.pharmacyId)?.nome
                ?? '';
            return produto.name.toLowerCase().includes(q)
                || produto.category.toLowerCase().includes(q)
                || farmacia.toLowerCase().includes(q);
        });
    }, [query, produtos, offers, farmacias]);

    return (
        <View style={styles.screen}>
            <Header
                right={
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                        <TouchableOpacity onPress={() => router.push('/history')}>
                            <Ionicons name="time-outline" size={28} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push('/cart')}>
                            <Ionicons name="cart-outline" size={34} color="#fff" />
                            {count > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{count}</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push('/profile')} style={styles.avatar}>
                            <Ionicons name="person" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                }
            />

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30 }}>
                <SearchBar
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Busque produtos ou farmácias"
                />

                <View style={{ marginTop: 18 }}>
                    {loading && (
                        <Text style={styles.empty}>Carregando farmácias...</Text>
                    )}

                    {erro && (
                        <View style={styles.messageContainer}>
                            <Text style={styles.empty}>
                                Não foi possível carregar as farmácias.
                            </Text>
                            <TouchableOpacity style={styles.retryButton} onPress={buscarFarmacias}>
                                <Text style={styles.retryText}>Tentar novamente</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {!loading && !erro && filtered.map((p) => (
                        <TouchableOpacity
                            key={p.id}
                            activeOpacity={0.9}
                            style={styles.pharmacy}
                            onPress={() => router.push(`/pharmacy/${p.id}`)}
                        >
                            <Text style={styles.pharmacyName}>{p.nome}</Text>
                            <Text style={styles.pharmacyInfo}>{p.horarioFuncionamento}</Text>
                        </TouchableOpacity>
                    ))}

                    {!loading && !erro && filtered.length === 0 && (
                        <Text style={styles.empty}>Nenhuma farmácia encontrada.</Text>
                    )}
                </View>

                <Text style={styles.section}>{query.trim() ? 'Produtos encontrados' : 'Melhores ofertas'}</Text>

                {loadingProdutos ? (
                    <ActivityIndicator color={colors.green} style={{ marginVertical: 18 }} />
                ) : erroProdutos ? (
                    <View style={styles.messageContainer}>
                        <Text style={styles.empty}>Não foi possível carregar as ofertas.</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={buscarProdutos}>
                            <Text style={styles.retryText}>Tentar novamente</Text>
                        </TouchableOpacity>
                    </View>
                ) : produtosExibidos.length > 0 ? (
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={produtosExibidos}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <ProductCard product={item} onAdd={add} />
                        )}
                    />
                ) : (
                    <Text style={styles.empty}>
                        {query.trim() ? 'Nenhum produto corresponde à busca.' : 'Nenhuma oferta cadastrada no momento.'}
                    </Text>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff',
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -6,
        backgroundColor: colors.danger,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontFamily: fonts.bold,
    },
    avatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#9AA0A6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pharmacy: {
        backgroundColor: colors.green,
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        borderBottomWidth: 4,
        borderBottomColor: colors.greenDark,
    },
    pharmacyName: {
        fontFamily: fonts.bold,
        color: '#fff',
        fontSize: 15,
    },
    pharmacyInfo: {
        fontFamily: fonts.medium,
        color: '#fff',
        fontSize: 11,
        textAlign: 'right',
        marginTop: 14,
    },
    section: {
        fontFamily: fonts.bold,
        fontSize: 17,
        textAlign: 'center',
        marginVertical: 18,
        color: colors.text,
    },
    empty: {
        fontFamily: fonts.regular,
        textAlign: 'center',
        color: colors.muted,
        marginVertical: 12,
    },
    messageContainer: {
        alignItems: 'center',
        marginVertical: 12,
    },
    retryButton: {
        backgroundColor: colors.green,
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 8,
        marginTop: 8,
    },
    retryText: {
        color: '#fff',
        fontFamily: fonts.bold,
    },
});
