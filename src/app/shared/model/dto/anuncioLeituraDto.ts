import { Endereco } from "../entity/endereco";
import { StatusAnuncio } from "../enum/StatusAnuncio.enum";

export class AnuncioLeituraDto {
  id: number;
  nome: string;
  preco: number;
  idAnunciante: number;
  nomeAnunciante: string;
  imagemanunciante: string;
  status: StatusAnuncio;
  imagem: string;
  endereco: Endereco;
}