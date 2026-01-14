export interface AtividadeItinerario {
    nome: string;
    orcamento: string;
    duracao: string;
    categoria: string;
    dia: Date;
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
    dia: Date;
    melhorHorario: string;
    idViagem: number;
}

export interface AtividadeItinerarioEditarDTO {
    id: number;
    nome: string;
    descricao: string;
    orcamento: number;
    duracao: string;
    categoria: string;
    dia: string;
    melhorHorario: string;
    idViagem: number;
}

export interface ItinerarioResponseDto {
    id: number;
    nome: string;
    descricao: string;
    orcamento: string;
    categoria: string;
    dia: Date;
    duracaoHoras: string;
    melhorHorario: string;
    itinerarioConcluido: boolean;
}