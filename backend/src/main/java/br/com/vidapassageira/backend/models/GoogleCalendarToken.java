package br.com.vidapassageira.backend.models;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "google_calendar_token")
public class GoogleCalendarToken {

    @Id
    @Column(name = "ID_GOOGLE_TOKEN")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_USUARIO", unique = true)
    private Usuario usuario;

    @Column(name = "DS_ACCESS_TOKEN", columnDefinition = "TEXT")
    private String accessToken;

    @Column(name = "DS_REFRESH_TOKEN", columnDefinition = "TEXT")
    private String refreshToken;

    @Column(name = "DT_EXPIRACAO")
    private LocalDateTime expiracao;

    @Column(name = "DS_EMAIL_GOOGLE")
    private String emailGoogle;

    @Column(name = "DS_SCOPES")
    private String scopes;

    @Column(name = "DT_CRIACAO")
    private LocalDateTime dataCriacao;

    @Column(name = "DT_ATUALIZACAO")
    private LocalDateTime dataAtualizacao;
}
