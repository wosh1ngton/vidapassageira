package br.com.vidapassageira.backend.dtos.googlecalendar;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SugestaoViagemAgendaDTO {
    private LocalDate inicioFolga;
    private LocalDate fimFolga;
    private int diasLivres;
    private String tituloEvento;
}
