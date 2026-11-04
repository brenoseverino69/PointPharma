import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import api from './api';
import { lerSessao } from './session';

export interface ItemPedidoRequest {
    produtoId: number;
    quantidade: number;
}

export interface CriarPedidoRequest {
    formaPagamento: 'pix' | 'card' | 'cash';
    itens: ItemPedidoRequest[];
}

export interface ItemPedido {
    produtoId: number | null;
    nomeProduto: string;
    farmaciaId: number;
    nomeFarmacia: string;
    quantidade: number;
    precoUnitario: number;
    subtotal: number;
}

export interface Pedido {
    codigoPedido: string;
    dataPedido: string;
    status: string;
    formaPagamento: string;
    valorTotal: number;
    itens: ItemPedido[];
}

const CHAVE_HISTORICO = '@pointpharma/codigos-pedidos';
const FORMATO_GUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function criarPedido(request: CriarPedidoRequest): Promise<Pedido> {
    const resposta = await api.post<Pedido>('/Pedidos', request);
    return resposta.data;
}

export async function salvarCodigoNoHistorico(codigo: string): Promise<void> {
    const codigos = await lerCodigosHistorico();
    if (!codigos.includes(codigo)) {
        await AsyncStorage.setItem(CHAVE_HISTORICO, JSON.stringify([codigo, ...codigos]));
    }
}

export async function listarPedidosHistorico(): Promise<Pedido[]> {
    const codigos = await lerCodigosHistorico();
    const visitantes = await Promise.all(codigos.map(async (codigo) => {
        const resposta = await api.get<Pedido>(`/Pedidos/${codigo}`);
        return resposta.data;
    }));

    let pedidosDaConta: Pedido[] = [];
    if (await lerSessao()) {
        try {
            const resposta = await api.get<Pedido[]>('/Pedidos/minhas');
            pedidosDaConta = resposta.data;
        } catch (error) {
            if (!axios.isAxiosError(error) || error.response?.status !== 401) throw error;
        }
    }

    const unicos = new Map<string, Pedido>();
    [...visitantes, ...pedidosDaConta].forEach((pedido) => unicos.set(pedido.codigoPedido, pedido));

    return [...unicos.values()].sort((a, b) =>
        new Date(b.dataPedido).getTime() - new Date(a.dataPedido).getTime()
    );
}

export async function vincularPedidosAoUsuario(): Promise<number> {
    const codigos = await lerCodigosHistorico();
    if (codigos.length === 0) return 0;

    const resposta = await api.post<{ pedidosVinculados: number }>(
        '/Pedidos/vincular-visitante',
        { codigos }
    );
    return resposta.data.pedidosVinculados;
}

export async function lerCodigosHistorico(): Promise<string[]> {
    const salvo = await AsyncStorage.getItem(CHAVE_HISTORICO);
    if (!salvo) return [];

    try {
        const valor: unknown = JSON.parse(salvo);
        if (!Array.isArray(valor)) return [];
        return valor.filter((codigo): codigo is string =>
            typeof codigo === 'string' && FORMATO_GUID.test(codigo)
        );
    } catch {
        return [];
    }
}
