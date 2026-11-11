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
                    <View style={styles.headerActions}>
                        <TouchableOpacity accessibilityLabel="Histórico de pedidos" onPress={() => router.push('/history')} style={styles.headerAction}>
                            <Ionicons name="time-outline" size={20} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity accessibilityLabel="Carrinho" onPress={() => router.push('/cart')} style={styles.headerAction}>
                            <Ionicons name="cart-outline" size={22} color="#fff" />
                            {count > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{count}</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity accessibilityLabel="Perfil" onPress={() => router.push('/profile')} style={styles.avatar}>
                            <Ionicons name="person" size={19} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                }
            />

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30 }}>
                <View style={styles.hero}>
                    <View style={styles.heroCopy}>
                        <View style={styles.heroLabel}>
                            <Ionicons name="sparkles" size={12} color={colors.greenDark} />
                            <Text style={styles.heroLabelText}>POINTPHARMA</Text>
                        </View>
                        <Text style={styles.heroTitle}>Cuidar de você ficou mais simples.</Text>
                        <Text style={styles.heroDescription}>Encontre farmácias, compare produtos e acompanhe suas ofertas.</Text>
                    </View>
                    <View style={styles.heroArt}>
                        <View style={styles.heroCircle}>
                            <Ionicons name="medical" size={34} color={colors.primary} />
                        </View>
                        <View style={styles.heroDot}><Ionicons name="add" size={15} color="#fff" /></View>
                    </View>
                </View>

                <SearchBar
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Busque produtos ou farmácias"
                />

                <View style={styles.sectionHeader}>
                    <View>
                        <Text style={styles.section}>Farmácias parceiras</Text>
                        <Text style={styles.sectionHint}>Escolha uma unidade para ver os produtos.</Text>
                    </View>
                    <Ionicons name="business-outline" size={22} color={colors.primary} />
                </View>

                <View>
                    {loading && <ActivityIndicator color={colors.primary} style={styles.loading} />}

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

                    {!loading && !erro && filtered.length > 0 && (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pharmacyList}>
                            {filtered.map((p) => (
                                <TouchableOpacity
                                    key={p.id}
                                    activeOpacity={0.88}
                                    style={styles.pharmacy}
                                    onPress={() => router.push(`/pharmacy/${p.id}`)}
                                >
                                    <View style={styles.pharmacyIcon}>
                                        <Ionicons name="storefront" size={21} color={colors.primary} />
                                    </View>
                                    <Text style={styles.pharmacyName} numberOfLines={2}>{p.nome}</Text>
                                    <View style={styles.pharmacyMeta}>
                                        <Ionicons name="location-outline" size={12} color={colors.muted} />
                                        <Text style={styles.pharmacyAddress} numberOfLines={1}>{p.endereco}</Text>
                                    </View>
                                    <View style={styles.pharmacyHours}>
                                        <Ionicons name="time-outline" size={12} color={colors.greenDark} />
                                        <Text style={styles.pharmacyInfo} numberOfLines={1}>{p.horarioFuncionamento}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}

                    {!loading && !erro && filtered.length === 0 && (
                        <Text style={styles.empty}>Nenhuma farmácia encontrada.</Text>
                    )}
                </View>

                <View style={[styles.sectionHeader, { marginTop: 24 }]}>
                    <View>
                        <Text style={styles.section}>{query.trim() ? 'Produtos encontrados' : 'Ofertas para você'}</Text>
                        <Text style={styles.sectionHint}>{query.trim() ? 'Resultados do catálogo PointPharma.' : 'Preços especiais nas farmácias parceiras.'}</Text>
                    </View>
                    <Ionicons name="pricetag-outline" size={22} color={colors.greenDark} />
                </View>

                {loadingProdutos ? (
                    <ActivityIndicator color={colors.green} style={styles.loading} />
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

                <TouchableOpacity style={styles.privacyFooter} onPress={() => router.push('/privacy')}>
                    <Ionicons name="shield-checkmark-outline" size={15} color={colors.muted} />
                    <Text style={styles.privacyFooterText}>Privacidade e uso de dados</Text>
                    <Ionicons name="chevron-forward" size={14} color={colors.muted} />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F5F9FA',
    },
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    headerAction: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' },
    badge: {
        position: 'absolute',
        top: -3,
        right: -3,
        backgroundColor: colors.danger,
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: '#fff',
        fontSize: 9,
        fontFamily: fonts.bold,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    hero: { minHeight: 157, backgroundColor: '#E1F3F4', borderRadius: 22, padding: 18, flexDirection: 'row', alignItems: 'center', overflow: 'hidden', marginBottom: 16 },
    heroCopy: { flex: 1, zIndex: 1 },
    heroLabel: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 9 },
    heroLabelText: { fontFamily: fonts.bold, color: colors.greenDark, fontSize: 9, letterSpacing: 1.2 },
    heroTitle: { fontFamily: fonts.bold, fontSize: 21, lineHeight: 26, color: '#17353D', maxWidth: 235 },
    heroDescription: { fontFamily: fonts.regular, fontSize: 10, lineHeight: 15, color: '#58747A', marginTop: 7, maxWidth: 235 },
    heroArt: { width: 75, height: 100, alignItems: 'center', justifyContent: 'center', marginLeft: -6 },
    heroCircle: { width: 66, height: 66, borderRadius: 33, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#17454E', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
    heroDot: { position: 'absolute', right: 0, top: 7, width: 24, height: 24, borderRadius: 12, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 22, marginBottom: 12, paddingHorizontal: 2 },
    sectionHint: { fontFamily: fonts.regular, fontSize: 10, color: colors.muted, marginTop: 2 },
    loading: { marginVertical: 18 },
    pharmacyList: { paddingRight: 4, gap: 11 },
    pharmacy: {
        width: 210,
        minHeight: 153,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 13,
        borderWidth: 1,
        borderColor: '#E7EFF0',
        shadowColor: '#18373E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 9,
        elevation: 2,
    },
    pharmacyIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#E9F6F7', alignItems: 'center', justifyContent: 'center', marginBottom: 9 },
    pharmacyName: {
        fontFamily: fonts.bold,
        color: colors.text,
        fontSize: 12,
        minHeight: 32,
    },
    pharmacyMeta: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3 },
    pharmacyAddress: { fontFamily: fonts.regular, color: colors.muted, fontSize: 9, flex: 1 },
    pharmacyHours: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8, paddingTop: 7, borderTopWidth: 1, borderTopColor: '#EDF1F2' },
    pharmacyInfo: {
        fontFamily: fonts.medium,
        color: colors.greenDark,
        fontSize: 9,
        flex: 1,
    },
    section: {
        fontFamily: fonts.bold,
        fontSize: 16,
        textAlign: 'left',
        color: colors.text,
    },
    empty: {
        fontFamily: fonts.regular,
        textAlign: 'center',
        color: colors.muted,
        marginVertical: 10,
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
    privacyFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 18, marginTop: 10 },
    privacyFooterText: { fontFamily: fonts.regular, fontSize: 10, color: colors.muted },
});
