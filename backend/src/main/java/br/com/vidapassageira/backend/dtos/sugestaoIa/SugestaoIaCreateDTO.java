package br.com.vidapassageira.backend.dtos.sugestaoIa;

import lombok.Data;

@Data
public class SugestaoIaCreateDTO {
    private Long id;
    private Long idTipoSugestaoIa;
    private Long idViagem;
    private String sugestao;
}
