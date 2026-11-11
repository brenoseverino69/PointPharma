import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
}

export interface AuthSession {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
}

const SESSION_KEY = 'pointpharma_auth_session';

export async function salvarSessao(tokens: TokenResponse): Promise<void> {
    const sessao: AuthSession = {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: Date.now() + tokens.expiresIn * 1000,
    };
    const valor = JSON.stringify(sessao);

    if (Platform.OS === 'web') {
        await AsyncStorage.setItem(SESSION_KEY, valor);
    } else {
        await SecureStore.setItemAsync(SESSION_KEY, valor);
    }
}

export async function lerSessao(): Promise<AuthSession | null> {
    const valor = Platform.OS === 'web'
        ? await AsyncStorage.getItem(SESSION_KEY)
        : await SecureStore.getItemAsync(SESSION_KEY);

    if (!valor) return null;

    try {
        const sessao = JSON.parse(valor) as AuthSession;
        if (!sessao.accessToken || !sessao.refreshToken || !sessao.expiresAt) return null;
        return sessao;
    } catch {
        await limparSessao();
        return null;
    }
}

export async function limparSessao(): Promise<void> {
    if (Platform.OS === 'web') {
        await AsyncStorage.removeItem(SESSION_KEY);
    } else {
        await SecureStore.deleteItemAsync(SESSION_KEY);
    }
}
