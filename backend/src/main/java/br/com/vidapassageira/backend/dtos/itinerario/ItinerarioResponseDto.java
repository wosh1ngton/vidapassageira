package br.com.vidapassageira.backend.dtos.itinerario;
import java.time.LocalDate;

import lombok.Data;

@Data
public class ItinerarioResponseDto {
    private Long id;
    private String nome;
    private String descricao;
    private Double orcamento;
    private String categoria;    
    private LocalDate dia;
    private String duracao;
    private String melhorHorario; 
}
