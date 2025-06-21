package br.com.vidapassageira.backend.models;

import lombok.Data;

@Data
public class Usuario {
    private String username;
    private String email;
    private String password;
}   
