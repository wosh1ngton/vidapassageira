package br.com.vidapassageira.backend.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalDateTime;

@Table(name = "usuario")
@Entity
@Data
public class Usuario {
    
    @Id    
    @Column(name = "ID_USUARIO", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "NM_USUARIO")
    private String userName;

    @Column(name = "NM_EMAIL")
    private String email;

    @Column(name = "ID_KEYCLOAK")
    private String keyCloakId;

    @Column(name = "FG_TERMOS_ACEITOS")
    private Boolean termosAceitos;

    @Column(name = "FG_PRIVACIDADE_ACEITA")
    private Boolean privacidadeAceita;

    @Column(name = "DT_CONSENTIMENTO")
    private LocalDateTime dataConsentimento;
}
