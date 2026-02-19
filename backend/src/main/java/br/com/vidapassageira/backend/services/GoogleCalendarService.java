package br.com.vidapassageira.backend.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.vidapassageira.backend.dtos.googlecalendar.GoogleCalendarEventDTO;
import br.com.vidapassageira.backend.dtos.googlecalendar.GoogleCalendarListDTO;
import br.com.vidapassageira.backend.dtos.googlecalendar.GoogleCalendarSelecaoDTO;
import br.com.vidapassageira.backend.dtos.googlecalendar.SugestaoViagemAgendaDTO;
import br.com.vidapassageira.backend.exceptions.GoogleCalendarException;
import br.com.vidapassageira.backend.models.GoogleCalendarSelecao;
import br.com.vidapassageira.backend.models.Usuario;
import br.com.vidapassageira.backend.repositories.GoogleCalendarSelecaoRepository;
import br.com.vidapassageira.backend.repositories.UsuarioRepository;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class GoogleCalendarService {

    private final GoogleCalendarAuthService authService;
    private final GoogleCalendarSelecaoRepository selecaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final WebClient googleCalendarWebClient;
    private final ObjectMapper objectMapper;

    public GoogleCalendarService(
            GoogleCalendarAuthService authService,
            GoogleCalendarSelecaoRepository selecaoRepository,
            UsuarioRepository usuarioRepository,
            WebClient googleCalendarWebClient,
            ObjectMapper objectMapper) {
        this.authService = authService;
        this.selecaoRepository = selecaoRepository;
        this.usuarioRepository = usuarioRepository;
        this.googleCalendarWebClient = googleCalendarWebClient;
        this.objectMapper = objectMapper;
    }

    public List<GoogleCalendarListDTO> listarCalendarios(String keycloakId) {
        String accessToken = authService.getValidAccessToken(keycloakId);
        Usuario usuario = usuarioRepository.findByKeyCloakId(keycloakId);

        try {
            String response = googleCalendarWebClient.get()
                    .uri("/calendar/v3/users/me/calendarList")
                    .header("Authorization", "Bearer " + accessToken)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode root = objectMapper.readTree(response);
            JsonNode items = root.get("items");

            // Buscar calendarios ja selecionados
            Set<String> selecionados = selecaoRepository.findByUsuario_IdAndAtivoTrue(usuario.getId())
                    .stream()
                    .map(GoogleCalendarSelecao::getCalendarId)
                    .collect(Collectors.toSet());

            List<GoogleCalendarListDTO> calendarios = new ArrayList<>();
            if (items != null && items.isArray()) {
                for (JsonNode item : items) {
                    String calId = item.get("id").asText();
                    String summary = item.has("summary") ? item.get("summary").asText() : calId;
                    String cor = item.has("backgroundColor") ? item.get("backgroundColor").asText() : "#819d6a";

                    calendarios.add(new GoogleCalendarListDTO(
                            calId,
                            summary,
                            cor,
                            selecionados.contains(calId)));
                }
            }

            return calendarios;

        } catch (org.springframework.web.reactive.function.client.WebClientResponseException e) {
            log.error("Erro ao listar calendários Google - Status: {} - Body: {}", e.getStatusCode(), e.getResponseBodyAsString(), e);
            throw new GoogleCalendarException("Erro ao listar calendários do Google: " + e.getResponseBodyAsString(), e);
        } catch (Exception e) {
            log.error("Erro ao listar calendários Google", e);
            throw new GoogleCalendarException("Erro ao listar calendários do Google.", e);
        }
    }

    @Transactional
    public void salvarSelecao(String keycloakId, GoogleCalendarSelecaoDTO dto) {
        Usuario usuario = usuarioRepository.findByKeyCloakId(keycloakId);

        // Buscar nomes dos calendarios selecionados
        List<GoogleCalendarListDTO> todosCalendarios = listarCalendarios(keycloakId);

        // Desativar todos os existentes
        List<GoogleCalendarSelecao> existentes = selecaoRepository.findByUsuario_Id(usuario.getId());
        existentes.forEach(s -> s.setAtivo(false));
        selecaoRepository.saveAll(existentes);

        // Ativar/criar os selecionados
        for (String calendarId : dto.getCalendarIds()) {
            GoogleCalendarSelecao selecao = selecaoRepository
                    .findByUsuario_IdAndCalendarId(usuario.getId(), calendarId)
                    .orElse(new GoogleCalendarSelecao());

            selecao.setUsuario(usuario);
            selecao.setCalendarId(calendarId);
            selecao.setAtivo(true);

            // Buscar nome e cor do calendario
            todosCalendarios.stream()
                    .filter(c -> c.getCalendarId().equals(calendarId))
                    .findFirst()
                    .ifPresent(c -> {
                        selecao.setNomeCalendar(c.getNome());
                        selecao.setCor(c.getCor());
                    });

            if (selecao.getDataCriacao() == null) {
                selecao.setDataCriacao(LocalDateTime.now());
            }

            selecaoRepository.save(selecao);
        }

        log.info("Seleção de calendários salva para usuário: {}", usuario.getEmail());
    }

    public List<GoogleCalendarEventDTO> buscarEventos(String keycloakId, LocalDate inicio, LocalDate fim) {
        String accessToken = authService.getValidAccessToken(keycloakId);
        Usuario usuario = usuarioRepository.findByKeyCloakId(keycloakId);

        List<GoogleCalendarSelecao> selecionados = selecaoRepository
                .findByUsuario_IdAndAtivoTrue(usuario.getId());

        if (selecionados.isEmpty()) {
            return List.of();
        }

        String timeMin = inicio.atStartOfDay().atZone(ZoneId.systemDefault())
                .format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
        String timeMax = fim.plusDays(1).atStartOfDay().atZone(ZoneId.systemDefault())
                .format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);

        List<GoogleCalendarEventDTO> todosEventos = new ArrayList<>();

        for (GoogleCalendarSelecao selecao : selecionados) {
            try {
                String response = googleCalendarWebClient.get()
                        .uri(uriBuilder -> uriBuilder
                                .path("/calendar/v3/calendars/{calendarId}/events")
                                .queryParam("timeMin", timeMin)
                                .queryParam("timeMax", timeMax)
                                .queryParam("singleEvents", true)
                                .queryParam("orderBy", "startTime")
                                .queryParam("maxResults", 250)
                                .build(selecao.getCalendarId()))
                        .header("Authorization", "Bearer " + accessToken)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();

                JsonNode root = objectMapper.readTree(response);
                JsonNode items = root.get("items");

                if (items != null && items.isArray()) {
                    for (JsonNode item : items) {
                        todosEventos.add(parseEvent(item, selecao));
                    }
                }

            } catch (Exception e) {
                log.warn("Erro ao buscar eventos do calendário: {}", selecao.getNomeCalendar(), e);
            }
        }

        todosEventos.sort(Comparator.comparing(GoogleCalendarEventDTO::getInicio,
                Comparator.nullsLast(Comparator.naturalOrder())));

        return todosEventos;
    }

    public List<SugestaoViagemAgendaDTO> detectarPeriodosLivres(String keycloakId) {
        LocalDate hoje = LocalDate.now();
        LocalDate seisMeses = hoje.plusMonths(6);

        List<GoogleCalendarEventDTO> eventos = buscarEventos(keycloakId, hoje, seisMeses);

        List<SugestaoViagemAgendaDTO> periodos = new ArrayList<>();

        for (GoogleCalendarEventDTO evento : eventos) {
            if (evento.getInicio() == null || evento.getFim() == null) continue;

            LocalDate inicioEvento = evento.getInicio().toLocalDate();
            LocalDate fimEvento = evento.getFim().toLocalDate();
            long dias = ChronoUnit.DAYS.between(inicioEvento, fimEvento);

            // Considerar eventos com 2+ dias como periodos de ferias/folga
            if (dias >= 2) {
                periodos.add(new SugestaoViagemAgendaDTO(
                        inicioEvento,
                        fimEvento,
                        (int) dias,
                        evento.getTitulo()));
            }
        }

        return periodos;
    }

    private GoogleCalendarEventDTO parseEvent(JsonNode item, GoogleCalendarSelecao selecao) {
        GoogleCalendarEventDTO event = new GoogleCalendarEventDTO();

        event.setId(item.has("id") ? item.get("id").asText() : null);
        event.setTitulo(item.has("summary") ? item.get("summary").asText() : "(Sem título)");
        event.setDescricao(item.has("description") ? item.get("description").asText() : null);
        event.setLocalizacao(item.has("location") ? item.get("location").asText() : null);
        event.setCalendarNome(selecao.getNomeCalendar());
        event.setCor(selecao.getCor());

        JsonNode start = item.get("start");
        JsonNode end = item.get("end");

        if (start != null && start.has("date")) {
            // Evento de dia inteiro
            event.setDiaInteiro(true);
            event.setInicio(LocalDate.parse(start.get("date").asText()).atStartOfDay());
            if (end != null && end.has("date")) {
                event.setFim(LocalDate.parse(end.get("date").asText()).atStartOfDay());
            }
        } else if (start != null && start.has("dateTime")) {
            // Evento com horario
            event.setDiaInteiro(false);
            event.setInicio(parseDateTime(start.get("dateTime").asText()));
            if (end != null && end.has("dateTime")) {
                event.setFim(parseDateTime(end.get("dateTime").asText()));
            }
        }

        return event;
    }

    private LocalDateTime parseDateTime(String dateTimeStr) {
        try {
            return OffsetDateTime.parse(dateTimeStr).toLocalDateTime();
        } catch (Exception e) {
            try {
                return LocalDateTime.parse(dateTimeStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            } catch (Exception e2) {
                return null;
            }
        }
    }
}
