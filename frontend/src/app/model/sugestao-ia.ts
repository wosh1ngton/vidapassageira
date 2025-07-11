export interface SugestaoIaCreateDTO {
    id: number;
    idViagem: number;
    idTipoSugestaoIa: number;
    sugestao: string;
}

export interface SugestaoIaResponseDTO {
    id: number;
    idViagem: number;
    idTipoSugestaoIa: number;
    sugestao: string;
}