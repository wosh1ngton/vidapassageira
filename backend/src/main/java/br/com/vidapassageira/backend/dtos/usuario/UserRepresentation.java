package br.com.vidapassageira.backend.dtos.usuario;

import lombok.Data;

@Data
public class UserRepresentation {
    private String id;          // Keycloak UUID
    private String username;
    private String email;
    private boolean enabled;
    private String firstName;
    private String lastName;
    // You can add more fields if needed
}