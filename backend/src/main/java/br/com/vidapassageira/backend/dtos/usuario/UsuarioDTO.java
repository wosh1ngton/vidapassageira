package br.com.vidapassageira.backend.dtos.usuario;

import lombok.Data;

@Data
public class UsuarioDTO {
    private Long id;
    private String username;
    private String email;
}
