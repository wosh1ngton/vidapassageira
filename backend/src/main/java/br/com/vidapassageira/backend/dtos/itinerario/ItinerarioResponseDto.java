package br.com.vidapassageira.backend.dtos.itinerario;
import lombok.Data;

@Data
public class ItinerarioResponseDto {
    private Long id;
    private String nome;
    private String descricao;
    private Double orcamento;
    private String categoria;    
    private Double duracaoHoras;
    private String melhorHorario; 
}
