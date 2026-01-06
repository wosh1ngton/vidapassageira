export interface AtividadeItinerario {
    nome: string;
    orcamento: string;
    duracao: string;
    categoria: string;
    descricao: string;
    melhorHorario: string;
}

export interface AtividadeItinerarioCreateDTO {
    id: number;
    nome: string;
    descricao: string;
    orcamento: number;
    duracao: string;
    categoria: string;
    melhorHorario: string;
    idViagem: number;
}

export interface ItinerarioResponseDto {
    id: number;
    nome: string;
    descricao: string;
    orcamento: string;
    categoria: string;
    duracaoHoras: string;
    melhorHorario: string;
}