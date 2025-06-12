export class DetalheAnuncioDto {
  id: number;
  nome: string;
  dataCadastro: Date;
  altura?: number;
  largura?: number;
  comprimento?: number;
  pesoSuportado?: number;
  descricao: string;
  preco: number;
  datasIndisponiveis: Date[];
  idAnunciante: number;
  nomeAnunciante: string;
  imagemAnunciante: string;
  imagens: string[];
}