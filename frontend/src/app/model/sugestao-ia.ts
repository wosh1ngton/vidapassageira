import { TipoSugestaoIaEnum } from "./enums/TipoSugestaoIA.enum";

export interface SugestaoIaCreateDTO {
    id: number;
    idViagem: number;
    tipoSugestaoIaEnum: TipoSugestaoIaEnum;
    sugestao: string;
}

export interface SugestaoIaResponseDTO {
    id: number;
    idViagem: number;
    idTipoSugestaoIa: number;
    sugestao: string;
}