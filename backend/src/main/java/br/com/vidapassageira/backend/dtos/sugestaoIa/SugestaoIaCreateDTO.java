package br.com.vidapassageira.backend.dtos.sugestaoIa;

import lombok.Data;

@Data
public class SugestaoIaCreateDTO {
    private Long id;
    private Integer tipoSugestaoIaEnum;
    private Long idViagem;
    private String sugestao;
}
