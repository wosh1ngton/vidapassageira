import { DestinoResponseDTO } from "./destino";

export interface ViagemCreateDTO {
    id: number;
    dataIda: Date;
    dataVolta: Date;
    idDestino: number;
}

export interface ViagemResponseDTO {  
    id: number;  
    dataIda: Date;
    dataVolta: Date;
    destino: DestinoResponseDTO;
}