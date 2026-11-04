import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { limparSessao, lerSessao, salvarSessao, TokenResponse } from './session';

export const API_BASE_URL = 'http://10.139.75.47:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000
});

type RetryableConfig = InternalAxiosRequestConfig & { _retryAfterRefresh?: boolean };

function isIdentityEndpoint(url = ''): boolean {
    return url.includes('/identity/login')
        || url.includes('/identity/register')
        || url.includes('/identity/refresh')
        || url.includes('/auth/register');
}

let refreshInFlight: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
    if (refreshInFlight) return refreshInFlight;

    refreshInFlight = (async () => {
        const sessao = await lerSessao();
        if (!sessao?.refreshToken) return null;

        try {
            const resposta = await axios.post<TokenResponse>(
                `${API_BASE_URL}/identity/refresh`,
                { refreshToken: sessao.refreshToken },
                { timeout: 10000 }
            );
            await salvarSessao(resposta.data);
            return resposta.data.accessToken;
        } catch {
            await limparSessao();
            return null;
        }
    })();

    try {
        return await refreshInFlight;
    } finally {
        refreshInFlight = null;
    }
}

api.interceptors.request.use(async (config) => {
    if (isIdentityEndpoint(config.url)) return config;

    try {
        const sessao = await lerSessao();
        if (sessao?.accessToken) {
            config.headers.Authorization = `Bearer ${sessao.accessToken}`;
        }
    } catch {
        // Requests as guest continue without an authorization header.
    }

    return config;
});

api.interceptors.response.use(
    (resposta) => resposta,
    async (erro: AxiosError) => {
        const original = erro.config as RetryableConfig | undefined;
        if (
            erro.response?.status !== 401
            || !original
            || original._retryAfterRefresh
            || isIdentityEndpoint(original.url)
        ) {
            return Promise.reject(erro);
        }

        original._retryAfterRefresh = true;
        const accessToken = await refreshAccessToken();
        if (!accessToken) return Promise.reject(erro);

        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
    }
);

export default api;
