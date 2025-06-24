import { EnumStatusDenuncia } from "../enum/EnumStatusDenuncia";
import { EnumStatusProdutoDenunciado } from "../enum/EnumStatusProdutoDenunciado";

export class Denuncia {
  id?: number;
  motivo: string;
  descricao?: string;
  status?: EnumStatusDenuncia;
  produtoId: number;
  nomeDenunciado: string;
  statusProdutoDenunciado?: EnumStatusProdutoDenunciado;
  dataCriacao?: string;
  denunciante?: { id: number; nome: string };

  constructor(data: Partial<Denuncia>) {
    Object.assign(this, data);
  }
}