import { StatusAnuncio } from "../enum/StatusAnuncio.enum";

export class Produto {
  id: number;
  nome: string;
  descricao: string;
  altura: number;
  largura: number;
  comprimento: number;
  pesoSuportado: number;
  preco: number;
  imagens: string[];
  datasIndisponiveis: string[];
  status: StatusAnuncio;
}
