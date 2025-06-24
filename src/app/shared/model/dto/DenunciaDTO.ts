export interface DenunciaDTO {
  motivo: 'CONTEUDO_INDEVIDO' | 'PRECO_ABUSIVO' | 'PUBLICACAO_FALSA' | 'OUTRO';
  descricao?: string;
  produtoId: number;
  denuncianteId: number;
}