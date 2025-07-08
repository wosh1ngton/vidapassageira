package br.com.vidapassageira.backend.dtos.destino;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class DestinoCreateDTO {    
    private String nome;
    private String descricao;
    private String localizacao;   
}
