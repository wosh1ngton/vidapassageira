package br.com.vidapassageira.backend.dtos.viagem;

import java.time.LocalDate;

import br.com.vidapassageira.backend.dtos.destino.DestinoReponseDTO;
import lombok.Data;

@Data
public class ViagemResponseDTO {
    private Long id;
    private LocalDate dataIda;
    private LocalDate dataVolta;
    private DestinoReponseDTO destino;
    private boolean compartilhada;
}
