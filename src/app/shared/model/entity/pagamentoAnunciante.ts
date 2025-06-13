export class PagamentosAnunciante {
  dataLimiteLiberacao: string; 
  nomeAnunciante: string;
  tipoChavePix: 'cpf' | 'telefone' | 'email';
  valorChavePix: string;
  valor: number;
}