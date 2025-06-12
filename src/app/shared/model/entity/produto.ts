import { StatusAnuncio } from "../enum/StatusAnuncio.enum";
import { Pessoa } from "./pessoa";

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
  anunciante: Pessoa;
}
