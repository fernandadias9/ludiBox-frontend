import { Pessoa } from "./pessoa";
import { ProdutoLocacao } from "./produtoLocacao";

export class Avaliacao {
  id: number;
  estrelas: number;
  produtoLocacao: ProdutoLocacao;
  avaliador: Pessoa;
  dataAvaliacao: string;
  ativo: boolean;
  comentario: string;
}