import { EnumDocumento } from "../enum/EnumDocumento";
import { EnumPerfil } from "../enum/EnumPerfil";
import { EnumStatus } from "../enum/EnumStatus";
import { Endereco } from "./endereco";

export class Pessoa{
  id: number;
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  imagemUsuarioEmBase64: string;
  ativo: boolean;
  documento: EnumDocumento;
  situacao: EnumStatus;
  perfil: EnumPerfil;
  enderecos: Array<Endereco>;
}
