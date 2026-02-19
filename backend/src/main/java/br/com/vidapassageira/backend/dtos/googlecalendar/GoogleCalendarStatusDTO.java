package br.com.vidapassageira.backend.dtos.googlecalendar;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GoogleCalendarStatusDTO {
    private boolean conectado;
    private String email;
}
