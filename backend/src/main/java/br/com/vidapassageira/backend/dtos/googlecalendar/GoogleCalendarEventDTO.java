package br.com.vidapassageira.backend.dtos.googlecalendar;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GoogleCalendarEventDTO {
    private String id;
    private String titulo;
    private String descricao;
    private LocalDateTime inicio;
    private LocalDateTime fim;
    private boolean diaInteiro;
    private String calendarNome;
    private String cor;
    private String localizacao;
}
