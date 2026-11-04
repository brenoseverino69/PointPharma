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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, fonts } from '@/theme';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { Farmacia, buscarFarmaciaPorId } from '@/services/farmacias';
import { listarProdutosPorFarmacia } from '@/services/produtos';
import { Product } from '@/data/types';

export default function PharmacyScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { count, add } = useCart();

    const [farmacia, setFarmacia] = useState<Farmacia | null>(null);
    const [produtos, setProdutos] = useState<Product[]>([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingProdutos, setLoadingProdutos] = useState(true);
    const [erro, setErro] = useState(false);
    const [erroProdutos, setErroProdutos] = useState(false);

    async function carregarFarmacia() {
        try {
            setLoading(true);
            setErro(false);

            const farmaciaId = Number(id);
            if (!Number.isInteger(farmaciaId) || farmaciaId <= 0) {
                throw new Error('ID de farmácia inválido.');
            }

            const dados = await buscarFarmaciaPorId(farmaciaId);
            setFarmacia(dados);
        } catch (error) {
            console.log('Erro ao buscar farmácia:', error);
            setErro(true);
            setFarmacia(null);
        } finally {
            setLoading(false);
        }
    }

    async function carregarProdutos() {
        try {
            setLoadingProdutos(true);
            setErroProdutos(false);

            const farmaciaId = Number(id);
            if (!Number.isInteger(farmaciaId) || farmaciaId <= 0) {
                throw new Error('ID de farmácia inválido.');
            }

            const dados = await listarProdutosPorFarmacia(farmaciaId);
            setProdutos(dados);
        } catch (error) {
            console.log('Erro ao buscar produtos da farmácia:', error);
            setErroProdutos(true);
            setProdutos([]);
        } finally {
            setLoadingProdutos(false);
        }
    }

    useEffect(() => {
        carregarFarmacia();
        carregarProdutos();
    }, [id]);

    const produtosFiltrados = useMemo(() => {
        const termo = query.trim().toLowerCase();
        if (!termo) return produtos;
        return produtos.filter((produto) =>
            produto.name.toLowerCase().includes(termo)
            || produto.category.toLowerCase().includes(termo)
        );
    }, [produtos, query]);

    return (
        <View style={styles.screen}>
            <Header
                title={farmacia?.nome ?? 'Farmácia'}
                onBack={() => router.back()}
                right={
                    <TouchableOpacity onPress={() => router.push('/cart')}>
                        <Ionicons name="cart-outline" size={30} color="#fff" />
                        {count > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{count}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                }
            />

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.green} />
                    <Text style={styles.message}>Carregando farmácia...</Text>
                </View>
            ) : erro || !farmacia ? (
                <View style={styles.center}>
                    <Ionicons name="alert-circle-outline" size={48} color={colors.danger} />
                    <Text style={styles.message}>
                        Não foi possível carregar esta farmácia.
                    </Text>
                    <TouchableOpacity style={styles.retryButton} onPress={carregarFarmacia}>
                        <Text style={styles.retryText}>Tentar novamente</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.banner}>
                        <View style={styles.pharmacyIcon}>
                            <Ionicons name="storefront" size={42} color={colors.green} />
                        </View>
                        <Text style={styles.name}>{farmacia.nome}</Text>
                        <Text style={styles.subtitle}>Informações da farmácia</Text>
                    </View>

                    <Text style={styles.section}>Informações</Text>

                    <View style={styles.infoCard}>
                        <View style={styles.infoItem}>
                            <View style={styles.icon}>
                                <Ionicons name="location-outline" size={23} color={colors.primary} />
                            </View>
                            <View style={styles.infoText}>
                                <Text style={styles.label}>Endereço</Text>
                                <Text style={styles.value}>{farmacia.endereco}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.infoItem}>
                            <View style={styles.icon}>
                                <Ionicons name="time-outline" size={23} color={colors.primary} />
                            </View>
                            <View style={styles.infoText}>
                                <Text style={styles.label}>Horário de funcionamento</Text>
                                <Text style={styles.value}>{farmacia.horarioFuncionamento}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.infoItem}>
                            <View style={styles.icon}>
                                <Ionicons name="call-outline" size={23} color={colors.primary} />
                            </View>
                            <View style={styles.infoText}>
                                <Text style={styles.label}>Contato</Text>
                                <Text style={styles.value}>{farmacia.contato}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.infoItem}>
                            <View style={styles.icon}>
                                <Ionicons name="mail-outline" size={23} color={colors.primary} />
                            </View>
                            <View style={styles.infoText}>
                                <Text style={styles.label}>E-mail</Text>
                                <Text style={styles.value}>{farmacia.email}</Text>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.section}>Produtos disponíveis</Text>
                    <SearchBar
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Buscar por nome ou categoria"
                    />

                    {loadingProdutos ? (
                        <View style={styles.productMessage}>
                            <ActivityIndicator color={colors.green} />
                            <Text style={styles.message}>Carregando produtos...</Text>
                        </View>
                    ) : erroProdutos ? (
                        <View style={styles.productsPlaceholder}>
                            <Ionicons name="alert-circle-outline" size={38} color={colors.danger} />
                            <Text style={styles.placeholderTitle}>
                                Não foi possível carregar os produtos
                            </Text>
                            <TouchableOpacity style={styles.retryButton} onPress={carregarProdutos}>
                                <Text style={styles.retryText}>Tentar novamente</Text>
                            </TouchableOpacity>
                        </View>
                    ) : produtosFiltrados.length === 0 ? (
                        <View style={styles.productsPlaceholder}>
                            <Ionicons name="medkit-outline" size={38} color={colors.muted} />
                            <Text style={styles.placeholderTitle}>
                                {query.trim() ? 'Nenhum produto corresponde à busca' : 'Nenhum produto cadastrado'}
                            </Text>
                            <Text style={styles.placeholderText}>
                                Esta farmácia ainda não possui produtos disponíveis no catálogo.
                            </Text>
                        </View>
                    ) : (
                        <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={produtosFiltrados}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <ProductCard product={item} onAdd={add} />
                            )}
                        />
                    )}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 16,
        paddingBottom: 30,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    message: {
        fontFamily: fonts.medium,
        color: colors.muted,
        textAlign: 'center',
        marginTop: 12,
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
    banner: {
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
        padding: 22,
        marginBottom: 22,
    },
    pharmacyIcon: {
        width: 82,
        height: 82,
        backgroundColor: '#fff',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    name: {
        fontFamily: fonts.bold,
        fontSize: 19,
        color: colors.text,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: fonts.regular,
        color: colors.muted,
        fontSize: 12,
        marginTop: 5,
    },
    section: {
        fontFamily: fonts.bold,
        fontSize: 17,
        color: colors.text,
        marginBottom: 12,
    },
    infoCard: {
        backgroundColor: '#F3F4F6',
        borderRadius: 14,
        padding: 14,
        marginBottom: 24,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 8,
    },
    icon: {
        width: 42,
        height: 42,
        backgroundColor: '#fff',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoText: {
        flex: 1,
    },
    label: {
        fontFamily: fonts.medium,
        color: colors.muted,
        fontSize: 11,
    },
    value: {
        fontFamily: fonts.bold,
        color: colors.text,
        fontSize: 13,
        marginTop: 3,
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 5,
    },
    productMessage: {
        alignItems: 'center',
        padding: 24,
    },
    productsPlaceholder: {
        backgroundColor: '#F3F4F6',
        borderRadius: 14,
        padding: 24,
        alignItems: 'center',
    },
    placeholderTitle: {
        fontFamily: fonts.bold,
        fontSize: 14,
        color: colors.text,
        marginTop: 10,
        textAlign: 'center',
    },
    placeholderText: {
        fontFamily: fonts.regular,
        fontSize: 12,
        color: colors.muted,
        textAlign: 'center',
        marginTop: 6,
        lineHeight: 19,
    },
    retryButton: {
        backgroundColor: colors.green,
        paddingVertical: 11,
        paddingHorizontal: 20,
        borderRadius: 9,
        marginTop: 16,
    },
    retryText: {
        fontFamily: fonts.bold,
        color: '#fff',
    },
});
