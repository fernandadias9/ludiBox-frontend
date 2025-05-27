import { Produto } from "./produto";

export interface ProdutoLocacao {
  id?: number;
  produto: Produto;
  dataInicio: Date;
  dataFim: Date;
  valorDiario: number;
}
