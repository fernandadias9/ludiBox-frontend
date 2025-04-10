export class DetalheAnuncioDto {
  nome: string;
  dataCadastro: Date;
  altura?: number;
  largura?: number;
  comprimento?: number;
  pesoSuportado?: number;
  descricao: string;
  estoque: number;
  preco: number;
  datasIndisponiveis: Date[];
  idAnunciante: number;
  nomeAnunciante: string;
  imagemAnunciante: string;
  imagens: string[];
}