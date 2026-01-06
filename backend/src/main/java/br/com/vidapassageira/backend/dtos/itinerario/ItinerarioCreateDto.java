package br.com.vidapassageira.backend.dtos.itinerario;

import lombok.Data;

@Data
public class ItinerarioCreateDto {
    private Long id;
    private String nome;
    private String descricao;
    private Double orcamento;
    private String duracao;
    private String categoria;
    private String melhorHorario; 
    private Long idViagem;
}
