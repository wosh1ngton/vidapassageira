package br.com.vidapassageira.backend.dtos.viagem;

import java.time.LocalDate;
import lombok.Data;

@Data
public class ViagemCreateDTO {
    private Long id;
    private LocalDate dataIda;
    private LocalDate dataVolta;
    private Long idDestino;
}
