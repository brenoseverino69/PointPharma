import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
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
import { useCart } from '@/context/CartContext';
import { Farmacia, buscarFarmaciaPorId } from '@/services/farmacias';

export default function PharmacyScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const { count } = useCart();

    const [farmacia, setFarmacia] = useState<Farmacia | null>(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(false);

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

    useEffect(() => {
        carregarFarmacia();
    }, [id]);

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

                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={carregarFarmacia}
                    >
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

                        <Text style={styles.subtitle}>
                            Informações da farmácia
                        </Text>
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
                                <Text style={styles.value}>
                                    {farmacia.horarioFuncionamento}
                                </Text>
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

                    <View style={styles.productsPlaceholder}>
                        <Ionicons name="medkit-outline" size={38} color={colors.muted} />

                        <Text style={styles.placeholderTitle}>
                            Catálogo em preparação
                        </Text>

                        <Text style={styles.placeholderText}>
                            Em breve você poderá consultar os medicamentos e produtos disponíveis nesta farmácia.
                        </Text>
                    </View>
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