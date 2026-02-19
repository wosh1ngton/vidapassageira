package br.com.vidapassageira.backend.resources;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.vidapassageira.backend.config.GoogleCalendarConfig;
import br.com.vidapassageira.backend.dtos.googlecalendar.GoogleCalendarEventDTO;
import br.com.vidapassageira.backend.dtos.googlecalendar.GoogleCalendarListDTO;
import br.com.vidapassageira.backend.dtos.googlecalendar.GoogleCalendarSelecaoDTO;
import br.com.vidapassageira.backend.dtos.googlecalendar.GoogleCalendarStatusDTO;
import br.com.vidapassageira.backend.dtos.googlecalendar.SugestaoViagemAgendaDTO;
import br.com.vidapassageira.backend.services.GoogleCalendarAuthService;
import br.com.vidapassageira.backend.services.GoogleCalendarService;

@RestController
@RequestMapping("/api/google-calendar")
public class GoogleCalendarResource {

    private final GoogleCalendarAuthService authService;
    private final GoogleCalendarService calendarService;
    private final GoogleCalendarConfig config;

    public GoogleCalendarResource(
            GoogleCalendarAuthService authService,
            GoogleCalendarService calendarService,
            GoogleCalendarConfig config) {
        this.authService = authService;
        this.calendarService = calendarService;
        this.config = config;
    }

    @GetMapping("/status")
    public ResponseEntity<GoogleCalendarStatusDTO> getStatus(@AuthenticationPrincipal Jwt jwt) {
        String keycloakId = jwt.getSubject();
        boolean conectado = authService.isConnected(keycloakId);
        String email = conectado ? authService.getGoogleEmail(keycloakId) : null;
        return ResponseEntity.ok(new GoogleCalendarStatusDTO(conectado, email));
    }

    @GetMapping("/auth-url")
    public ResponseEntity<Map<String, String>> getAuthUrl(@AuthenticationPrincipal Jwt jwt) {
        String keycloakId = jwt.getSubject();
        String url = authService.buildAuthorizationUrl(keycloakId);
        return ResponseEntity.ok(Map.of("url", url));
    }

    @GetMapping("/callback")
    public ResponseEntity<Void> handleCallback(
            @RequestParam String code,
            @RequestParam String state) {
        authService.handleCallback(code, state);
        String redirectUrl = config.getFrontendRedirectUri() + "?google-connected=true";
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(redirectUrl))
                .build();
    }

    @GetMapping("/calendarios")
    public ResponseEntity<List<GoogleCalendarListDTO>> listarCalendarios(@AuthenticationPrincipal Jwt jwt) {
        String keycloakId = jwt.getSubject();
        return ResponseEntity.ok(calendarService.listarCalendarios(keycloakId));
    }

    @PostMapping("/calendarios/selecao")
    public ResponseEntity<Void> salvarSelecao(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody GoogleCalendarSelecaoDTO dto) {
        String keycloakId = jwt.getSubject();
        calendarService.salvarSelecao(keycloakId, dto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/eventos")
    public ResponseEntity<List<GoogleCalendarEventDTO>> buscarEventos(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim) {
        String keycloakId = jwt.getSubject();
        return ResponseEntity.ok(calendarService.buscarEventos(keycloakId, inicio, fim));
    }

    @DeleteMapping("/desconectar")
    public ResponseEntity<Void> desconectar(@AuthenticationPrincipal Jwt jwt) {
        String keycloakId = jwt.getSubject();
        authService.disconnect(keycloakId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/periodos-livres")
    public ResponseEntity<List<SugestaoViagemAgendaDTO>> getPeriodosLivres(@AuthenticationPrincipal Jwt jwt) {
        String keycloakId = jwt.getSubject();
        return ResponseEntity.ok(calendarService.detectarPeriodosLivres(keycloakId));
    }
}
