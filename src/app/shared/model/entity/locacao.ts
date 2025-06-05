import { StatusLocacao } from "../enum/StatusLocacao";
import { Endereco } from "./endereco";
import { Pessoa } from "./pessoa";
import { ProdutoLocacao } from "./produtoLocacao";

export interface Locacao {
  id?: number;
  dataHoraEfetuada?: string;
  produtos: ProdutoLocacao[];
  valorTotal?: number;
  locador: Pessoa;
  status?: StatusLocacao;
  cancelado?: boolean;
  dataHoraCancelamento?: string;
  formaPagamento?: string;
  dataHoraPagamento?: string;
  enderecoEntrega: Endereco;
}