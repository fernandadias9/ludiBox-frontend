import { StatusAnuncio } from "../enum/statusAnuncio.enum";

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
  anunciante: string; // tem que mudar posteriormente para pessoa
  status: StatusAnuncio;
  imagem: string;
}