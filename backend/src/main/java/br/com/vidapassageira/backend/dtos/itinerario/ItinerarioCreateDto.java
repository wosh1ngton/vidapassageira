package br.com.vidapassageira.backend.dtos.itinerario;


import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ItinerarioCreateDto {
    private Long id;
    private String nome;
    private String descricao;
    private Double orcamento;
    private String duracao;
    private String categoria;
    private LocalDateTime dia;
    private String melhorHorario; 
    private Long idViagem;
}
