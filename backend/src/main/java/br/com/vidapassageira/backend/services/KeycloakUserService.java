package br.com.vidapassageira.backend.services;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import br.com.vidapassageira.backend.dtos.usuario.UserRepresentation;

@Service
public class KeycloakUserService {

    @Value("${keycloak.server-url}")
    private String serverUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.target-realm}")
    private String targetRealm;

    @Value("${keycloak.client-id}")
    private String clientId;

    @Value("${keycloak.username}")
    private String adminUsername;

    @Value("${keycloak.password}")
    private String adminPassword;

    public String createUser(String username, String email, String password) {
        String token = getAdminAccessToken();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> user = new HashMap<>();
        user.put("username", username);
        user.put("email", email);
        user.put("enabled", true);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(user, headers);

        String url = serverUrl + "/admin/realms/" + targetRealm + "/users";

        ResponseEntity<Void> response = new RestTemplate().postForEntity(url, request, Void.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            setPasswordForUser(username, password, token);
        } else {
            throw new RuntimeException("Failed to create user in Keycloak");
        }
        URI location = response.getHeaders().getLocation();
        if (location == null) {
            throw new RuntimeException("Keycloak did not return Location header");
        }

        String path = location.getPath();
        return path.substring(path.lastIndexOf('/') + 1);
    }

    private String getAdminAccessToken() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "password");
        body.add("client_id", clientId);
        body.add("username", adminUsername);
        body.add("password", adminPassword);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        String tokenUrl = serverUrl + "/realms/master/protocol/openid-connect/token";

        ResponseEntity<Map> response = new RestTemplate().postForEntity(tokenUrl, request, Map.class);
        return (String) response.getBody().get("access_token");
    }

    private void setPasswordForUser(String username, String password, String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        String searchUrl = serverUrl + "/admin/realms/" + targetRealm + "/users?username=" + username;

        ResponseEntity<UserRepresentation[]> response = new RestTemplate()
                .exchange(searchUrl, HttpMethod.GET, new HttpEntity<>(headers), UserRepresentation[].class);

        UserRepresentation[] users = response.getBody();
        if (users == null || users.length == 0) {
            throw new RuntimeException("User not found in Keycloak");
        }

        String userId = users[0].getId();

        Map<String, Object> passwordPayload = new HashMap<>();
        passwordPayload.put("type", "password");
        passwordPayload.put("value", password);
        passwordPayload.put("temporary", false);

        String resetUrl = serverUrl + "/admin/realms/" + targetRealm + "/users/" + userId + "/reset-password";

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(passwordPayload, headers);
        new RestTemplate().put(resetUrl, request);
    }

}
