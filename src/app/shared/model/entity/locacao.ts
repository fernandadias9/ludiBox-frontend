import { StatusAnuncio } from "../enum/StatusAnuncio.enum";
import { Endereco } from "./endereco";
import { Pessoa } from "./pessoa";
import { ProdutoLocacao } from "./produtoLocacao";

export interface Locacao {
  id?: number;
  dataHoraEfetuada?: string;
  produtos: ProdutoLocacao[];
  valorTotal?: number;
  locador: Pessoa;
  status?: StatusAnuncio;
  cancelado?: boolean;
  dataHoraCancelamento?: string;
  formaPagamento?: string;
  dataHoraPagamento?: string;
  enderecoEntrega: Endereco;
}