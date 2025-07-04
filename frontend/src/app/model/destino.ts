export interface DestinoCreateDTO {
  nome: string;
  descricao: string;
  localizacao: string;
  imagem: File | undefined;
}

export interface DestinoResponseDTO {
  id: number;
  nome: string;
  descricao: string;
  localizacao: string;
  imagemBase64: string;
}

