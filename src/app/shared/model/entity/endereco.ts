import { Pessoa } from "./pessoa";

export class Endereco{
    id: number;
    nome: string;
    cep: number;
    rua: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
    pessoa: Pessoa;
    semNumero: boolean;
}