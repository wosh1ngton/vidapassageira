package br.com.vidapassageira.backend.resources;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import br.com.vidapassageira.backend.services.AgendaIAService;

@RestController
@RequestMapping("/api/agenda-ia")
public class AgendaIAResource {

    private final AgendaIAService agendaIAService;

    public AgendaIAResource(AgendaIAService agendaIAService) {
        this.agendaIAService = agendaIAService;
    }

    @GetMapping(value = "/sugestao-viagem", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter gerarSugestaoViagem(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim) {

        SseEmitter emitter = new SseEmitter(120000L);
        agendaIAService.streamSugestaoViagem(inicio, fim, emitter);
        return emitter;
    }
}
