import { Locacao } from "./locacao";
import { Produto } from "./produto";

export interface ProdutoLocacao {
  id?: number;
  produto: Produto;
  locacao: Locacao;
  dataInicio: Date;
  dataFim: Date;
  valorDiario: number;
  diasLocados?: number;
  totalProduto?: number;
}
