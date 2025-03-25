import { StatusAnuncio } from "../enum/StatusAnuncio.enum";

export class AnuncioLeituraDto {
  nome: string;
  dataCadastro: Date;
  altura?: number;
  largura?: number;
  comprimento?: number;
  descricao: string;
  estoque: number;
  preco: number;
  datasIndisponiveis: number;
  idAnunciante: number;
  nomeAnunciante: string;
  status: StatusAnuncio;
  imagem: string;
}