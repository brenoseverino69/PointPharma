import api from './api';

export interface Farmacia {
    id: number;
    nome: string;
    endereco: string;
    contato: string;
    horarioFuncionamento: string;
    cnpj: string;
    email: string;
}

export async function listarFarmacias(): Promise<Farmacia[]> {
    const resposta = await api.get<Farmacia[]>('/Farmacias');
    return resposta.data;
}

export async function buscarFarmaciaPorId(id: number): Promise<Farmacia> {
    const resposta = await api.get<Farmacia>(`/Farmacias/${id}`);
    return resposta.data;
}