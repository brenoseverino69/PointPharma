import axios from 'axios';
import api from './api';
import { limparSessao, salvarSessao, TokenResponse } from './session';
import type { User } from '@/data/types';

export interface CadastroRequest {
    name: string;
    email: string;
    password: string;
    birth: string;
}

export interface PerfilRequest {
    name: string;
    birth: string;
}

interface PerfilApi {
    id: string;
    email: string;
    nome: string | null;
    dataNascimento: string | null;
}

export async function cadastrarUsuario(dados: CadastroRequest): Promise<User> {
    await api.post('/auth/register', {
        nome: dados.name,
        email: dados.email.trim(),
        senha: dados.password,
        dataNascimento: dados.birth,
    });

    return entrar(dados.email, dados.password);
}

export async function entrar(email: string, password: string): Promise<User> {
    const resposta = await api.post<TokenResponse>('/identity/login?useCookies=false', {
        email: email.trim(),
        password,
    });
    await salvarSessao(resposta.data);

    try {
        return await carregarPerfil();
    } catch (error) {
        await limparSessao();
        throw error;
    }
}

export async function carregarPerfil(): Promise<User> {
    const resposta = await api.get<PerfilApi>('/auth/perfil');
    return converterPerfil(resposta.data);
}

export async function atualizarPerfil(dados: PerfilRequest): Promise<User> {
    const resposta = await api.put<PerfilApi>('/auth/perfil', {
        nome: dados.name,
        dataNascimento: dados.birth,
    });
    return converterPerfil(resposta.data);
}

function converterPerfil(perfil: PerfilApi): User {
    return {
        id: perfil.id,
        name: perfil.nome ?? '',
        email: perfil.email,
        birth: perfil.dataNascimento ?? '',
    };
}

export function mensagemErroAutenticacao(error: unknown, fallback: string): string {
    if (!axios.isAxiosError(error)) return fallback;

    const data = error.response?.data;
    if (typeof data === 'string') return data;
    if (!data || typeof data !== 'object') return fallback;

    const resposta = data as {
        message?: unknown;
        detail?: unknown;
        title?: unknown;
        errors?: unknown;
    };

    if (typeof resposta.message === 'string') return resposta.message;
    if (typeof resposta.detail === 'string') return resposta.detail;
    if (typeof resposta.title === 'string' && resposta.title !== 'One or more validation errors occurred.') {
        return resposta.title;
    }
    if (Array.isArray(resposta.errors)) {
        const mensagens = resposta.errors.filter((item): item is string => typeof item === 'string');
        if (mensagens.length > 0) return mensagens.join('\n');
    }
    if (resposta.errors && typeof resposta.errors === 'object') {
        const mensagens = Object.values(resposta.errors as Record<string, unknown>)
            .flatMap((valor) => Array.isArray(valor) ? valor : [])
            .filter((item): item is string => typeof item === 'string');
        if (mensagens.length > 0) return mensagens.join('\n');
    }

    return fallback;
}
