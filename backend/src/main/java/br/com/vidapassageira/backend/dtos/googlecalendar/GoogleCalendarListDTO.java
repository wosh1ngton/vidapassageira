package br.com.vidapassageira.backend.dtos.googlecalendar;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GoogleCalendarListDTO {
    private String calendarId;
    private String nome;
    private String cor;
    private boolean selecionado;
}
