package br.com.vidapassageira.backend.dtos.viagem;

import java.time.LocalDate;

import lombok.Data;

@Data
public class ViagemAgendaCreateDTO {
    private String nomeDestino;
    private String localizacao;
    private LocalDate dataIda;
    private LocalDate dataVolta;
}
