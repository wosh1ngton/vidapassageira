package br.com.vidapassageira.backend.dtos.destino;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class DestinosDTO {
    private String nome;
    private String descricao;
    private String localizacao;
}
