import { EnumDocumento } from '../enum/EnumDocumento';

export class Pessoa {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  tipoDocumento: EnumDocumento;
  valorDocumento: string;
  imagemUsuarioEmBase64?: string;
}
