import { DestinoResponseDTO } from "./destino";

export interface ViagemCreateDTO {
    id: number;
    dataIda: Date;
    dataVolta: Date;
    idDestino: number;
    sub: string;
}

export interface ViagemResponseDTO {
    id: number;
    dataIda: Date;
    dataVolta: Date;
    destino: DestinoResponseDTO;
    compartilhada: boolean;
}

export interface ViagemAgendaCreateDTO {
    nomeDestino: string;
    localizacao: string;
    dataIda: string;
    dataVolta: string;
}

export interface DestinoSugerido {
    nome: string;
    localizacao: string;
}