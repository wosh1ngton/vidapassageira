package br.com.vidapassageira.backend.dtos.googlecalendar;

import java.util.List;

import lombok.Data;

@Data
public class GoogleCalendarSelecaoDTO {
    private List<String> calendarIds;
}
