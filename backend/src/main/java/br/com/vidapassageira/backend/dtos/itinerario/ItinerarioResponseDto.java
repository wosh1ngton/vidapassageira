package br.com.vidapassageira.backend.dtos.itinerario;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ItinerarioResponseDto {
    private Long id;
    private String nome;
    private String descricao;
    private Double orcamento;
    private String categoria;    
    private LocalDateTime dia;
    private String duracao;
    private String melhorHorario; 
    private Boolean itinerarioConcluido;
}
