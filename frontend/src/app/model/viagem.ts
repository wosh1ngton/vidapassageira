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