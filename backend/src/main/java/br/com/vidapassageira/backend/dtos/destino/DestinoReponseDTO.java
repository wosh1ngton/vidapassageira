package br.com.vidapassageira.backend.dtos.destino;

import lombok.Data;

@Data
public class DestinoReponseDTO {
    private Long id;
    private String nome;
    private String localizacao;
    private String descricao;
}
