package br.com.vidapassageira.backend.models;

import lombok.Data;

@Data
public class UsuarioAutenticacao {
    private String username;
    private String email;
    private String password;
    private Boolean termsAccepted;
    private Boolean privacyAccepted;
}   
