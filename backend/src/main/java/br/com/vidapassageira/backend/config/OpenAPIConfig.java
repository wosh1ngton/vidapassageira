package br.com.vidapassageira.backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenAPIConfig {

    @Value("${app.openapi.dev-url:http://localhost:8070}")
    private String devUrl;

    @Value("${app.openapi.prod-url:https://api.vidapassageira.com}")
    private String prodUrl;

    @Bean
    public OpenAPI customOpenAPI() {
        // Define o esquema de segurança OAuth2/JWT
        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("Vida Passageira API")
                        .version("1.0.0")
                        .description("""
                                API REST para o sistema Vida Passageira - Plataforma de planejamento de viagens com IA.

                                ## Funcionalidades Principais
                                - Gerenciamento de destinos e viagens
                                - Criação de itinerários personalizados
                                - Sugestões inteligentes via IA (DeepSeek)
                                - Compartilhamento de viagens entre usuários
                                - Autenticação OAuth2 via Keycloak

                                ## Autenticação
                                A API utiliza OAuth2/JWT para autenticação. Para acessar endpoints protegidos:
                                1. Obtenha um token JWT através do Keycloak
                                2. Inclua o token no header: `Authorization: Bearer {token}`

                                ## Endpoints Públicos
                                - `/api/planejamento-ia/gerar-async` - Streaming de sugestões IA (SSE)
                                - `/api/auth/register` - Registro de novos usuários
                                - `/actuator/health` - Health check da aplicação
                                """)
                        .contact(new Contact()
                                .name("Equipe Vida Passageira")
                                .email("contato@vidapassageira.com")
                                .url("https://vidapassageira.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url(devUrl)
                                .description("Servidor de Desenvolvimento"),
                        new Server()
                                .url(prodUrl)
                                .description("Servidor de Produção")
                ))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Token JWT obtido através do Keycloak OAuth2")));
    }
}
