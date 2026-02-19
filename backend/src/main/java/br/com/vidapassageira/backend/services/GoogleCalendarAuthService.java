package br.com.vidapassageira.backend.services;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.vidapassageira.backend.config.GoogleCalendarConfig;
import br.com.vidapassageira.backend.exceptions.GoogleCalendarException;
import br.com.vidapassageira.backend.models.GoogleCalendarToken;
import br.com.vidapassageira.backend.models.Usuario;
import br.com.vidapassageira.backend.repositories.GoogleCalendarSelecaoRepository;
import br.com.vidapassageira.backend.repositories.GoogleCalendarTokenRepository;
import br.com.vidapassageira.backend.repositories.UsuarioRepository;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class GoogleCalendarAuthService {

    private final GoogleCalendarConfig config;
    private final GoogleCalendarTokenRepository tokenRepository;
    private final GoogleCalendarSelecaoRepository selecaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final WebClient googleCalendarWebClient;
    private final ObjectMapper objectMapper;

    public GoogleCalendarAuthService(
            GoogleCalendarConfig config,
            GoogleCalendarTokenRepository tokenRepository,
            GoogleCalendarSelecaoRepository selecaoRepository,
            UsuarioRepository usuarioRepository,
            WebClient googleCalendarWebClient,
            ObjectMapper objectMapper) {
        this.config = config;
        this.tokenRepository = tokenRepository;
        this.selecaoRepository = selecaoRepository;
        this.usuarioRepository = usuarioRepository;
        this.googleCalendarWebClient = googleCalendarWebClient;
        this.objectMapper = objectMapper;
    }

    public String buildAuthorizationUrl(String keycloakId) {
        return "https://accounts.google.com/o/oauth2/v2/auth"
                + "?client_id=" + encode(config.getClientId())
                + "&redirect_uri=" + encode(config.getRedirectUri())
                + "&response_type=code"
                + "&scope=" + encode(config.getScopes().replace(",", " "))
                + "&access_type=offline"
                + "&prompt=consent"
                + "&state=" + encode(keycloakId);
    }

    @Transactional
    public void handleCallback(String code, String state) {
        String keycloakId = state;
        Usuario usuario = usuarioRepository.findByKeyCloakId(keycloakId);
        if (usuario == null) {
            throw new GoogleCalendarException("Usuário não encontrado.");
        }

        try {
            // Trocar authorization code por tokens
            String response = WebClient.create("https://oauth2.googleapis.com")
                    .post()
                    .uri("/token")
                    .body(BodyInserters.fromFormData("code", code)
                            .with("client_id", config.getClientId())
                            .with("client_secret", config.getClientSecret())
                            .with("redirect_uri", config.getRedirectUri())
                            .with("grant_type", "authorization_code"))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode tokenResponse = objectMapper.readTree(response);

            String accessToken = tokenResponse.get("access_token").asText();
            String refreshToken = tokenResponse.has("refresh_token")
                    ? tokenResponse.get("refresh_token").asText()
                    : null;
            int expiresIn = tokenResponse.get("expires_in").asInt();

            // Buscar email da conta Google
            String emailGoogle = fetchGoogleEmail(accessToken);

            // Salvar ou atualizar token
            GoogleCalendarToken token = tokenRepository.findByUsuario_Id(usuario.getId())
                    .orElse(new GoogleCalendarToken());

            token.setUsuario(usuario);
            token.setAccessToken(accessToken);
            if (refreshToken != null) {
                token.setRefreshToken(refreshToken);
            }
            token.setExpiracao(LocalDateTime.now().plusSeconds(expiresIn));
            token.setEmailGoogle(emailGoogle);
            token.setScopes(config.getScopes());
            token.setDataCriacao(token.getId() == null ? LocalDateTime.now() : token.getDataCriacao());
            token.setDataAtualizacao(LocalDateTime.now());

            tokenRepository.save(token);
            log.info("Google Calendar conectado para usuário: {}", usuario.getEmail());

        } catch (Exception e) {
            log.error("Erro ao trocar code por token Google", e);
            throw new GoogleCalendarException("Erro ao conectar com Google Calendar.", e);
        }
    }

    public String getValidAccessToken(String keycloakId) {
        GoogleCalendarToken token = tokenRepository.findByUsuario_KeyCloakId(keycloakId)
                .orElseThrow(() -> new GoogleCalendarException("Google Calendar não conectado."));

        if (token.getExpiracao().isBefore(LocalDateTime.now().minusMinutes(1))) {
            return refreshAccessToken(token);
        }

        return token.getAccessToken();
    }

    private String refreshAccessToken(GoogleCalendarToken token) {
        try {
            String response = WebClient.create("https://oauth2.googleapis.com")
                    .post()
                    .uri("/token")
                    .body(BodyInserters.fromFormData("refresh_token", token.getRefreshToken())
                            .with("client_id", config.getClientId())
                            .with("client_secret", config.getClientSecret())
                            .with("grant_type", "refresh_token"))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode tokenResponse = objectMapper.readTree(response);
            String newAccessToken = tokenResponse.get("access_token").asText();
            int expiresIn = tokenResponse.get("expires_in").asInt();

            token.setAccessToken(newAccessToken);
            token.setExpiracao(LocalDateTime.now().plusSeconds(expiresIn));
            token.setDataAtualizacao(LocalDateTime.now());
            tokenRepository.save(token);

            log.info("Token Google renovado para usuário ID: {}", token.getUsuario().getId());
            return newAccessToken;

        } catch (Exception e) {
            log.error("Erro ao renovar token Google", e);
            throw new GoogleCalendarException("Erro ao renovar conexão com Google Calendar.", e);
        }
    }

    @Transactional
    public void disconnect(String keycloakId) {
        GoogleCalendarToken token = tokenRepository.findByUsuario_KeyCloakId(keycloakId)
                .orElseThrow(() -> new GoogleCalendarException("Google Calendar não conectado."));

        try {
            // Revogar token no Google
            WebClient.create("https://oauth2.googleapis.com")
                    .post()
                    .uri("/revoke?token=" + token.getAccessToken())
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        } catch (Exception e) {
            log.warn("Erro ao revogar token Google (continuando com desconexão local)", e);
        }

        // Remover seleções e token do banco
        selecaoRepository.deleteByUsuario_Id(token.getUsuario().getId());
        tokenRepository.delete(token);

        log.info("Google Calendar desconectado para usuário: {}", token.getUsuario().getEmail());
    }

    public boolean isConnected(String keycloakId) {
        return tokenRepository.existsByUsuario_KeyCloakId(keycloakId);
    }

    public String getGoogleEmail(String keycloakId) {
        return tokenRepository.findByUsuario_KeyCloakId(keycloakId)
                .map(GoogleCalendarToken::getEmailGoogle)
                .orElse(null);
    }

    private String fetchGoogleEmail(String accessToken) {
        try {
            String response = googleCalendarWebClient.get()
                    .uri("/oauth2/v2/userinfo")
                    .header("Authorization", "Bearer " + accessToken)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode userInfo = objectMapper.readTree(response);
            return userInfo.has("email") ? userInfo.get("email").asText() : null;
        } catch (Exception e) {
            log.warn("Não foi possível obter email do Google", e);
            return null;
        }
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}
