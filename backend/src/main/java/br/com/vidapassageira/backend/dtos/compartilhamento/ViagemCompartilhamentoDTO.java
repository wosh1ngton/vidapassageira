package br.com.vidapassageira.backend.dtos.compartilhamento;

import lombok.Data;

@Data
public class ViagemCompartilhamentoDTO {
    private Long id;
    private Long idViagem;
    private Long idUsuario;

}
