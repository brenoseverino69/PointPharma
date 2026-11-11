import api from './api';
import { IconName, Product } from '@/data/types';

interface ProdutoApi {
    id: number;
    nome: string;
    descricao?: string | null;
    categoria: string;
    preco: number;
    precoAntigo?: number | null;
    quantidadeEstoque: number;
    farmaciaId: number;
    farmacia?: {
        nome?: string;
    } | null;
}

function escolherIcone(categoria: string): IconName {
    const valor = categoria.toLowerCase();

    if (valor.includes('vitamina') || valor.includes('suplement')) return 'nutrition';
    if (valor.includes('higiene') || valor.includes('nasal')) return 'water';
    if (valor.includes('dermo') || valor.includes('protetor')) return 'sunny';
    if (valor.includes('alerg')) return 'flower';
    if (valor.includes('respirat')) return 'fitness';
    if (valor.includes('curativo')) return 'bandage';

    return 'medkit';
}

function converterProduto(dado: ProdutoApi): Product {
    return {
        id: String(dado.id),
        pharmacyId: String(dado.farmaciaId),
        pharmacyName: dado.farmacia?.nome,
        name: dado.nome,
        description: dado.descricao ?? '',
        category: dado.categoria,
        price: Number(dado.preco),
        oldPrice: dado.precoAntigo == null ? undefined : Number(dado.precoAntigo),
        stock: Number(dado.quantidadeEstoque),
        icon: escolherIcone(dado.categoria),
    };
}

export async function listarProdutos(): Promise<Product[]> {
    const resposta = await api.get<ProdutoApi[]>('/Produtos');
    return resposta.data.map(converterProduto);
}

export async function listarProdutosPorFarmacia(farmaciaId: number): Promise<Product[]> {
    const resposta = await api.get<ProdutoApi[]>(`/Produtos/Farmacia/${farmaciaId}`);
    return resposta.data.map(converterProduto);
}
