package br.com.vidapassageira.backend.models;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "google_calendar_selecao")
public class GoogleCalendarSelecao {

    @Id
    @Column(name = "ID_CALENDAR_SELECAO")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_USUARIO")
    private Usuario usuario;

    @Column(name = "DS_CALENDAR_ID")
    private String calendarId;

    @Column(name = "NM_CALENDAR")
    private String nomeCalendar;

    @Column(name = "DS_COR")
    private String cor;

    @Column(name = "FG_ATIVO")
    private Boolean ativo;

    @Column(name = "DT_CRIACAO")
    private LocalDateTime dataCriacao;
}
