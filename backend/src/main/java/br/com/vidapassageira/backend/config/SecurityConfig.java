package br.com.vidapassageira.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import br.com.vidapassageira.backend.filters.RateLimitFilter;

@EnableWebSecurity
@Configuration
public class SecurityConfig {

    private final RateLimitFilter rateLimitFilter;

    public SecurityConfig(RateLimitFilter rateLimitFilter) {
        this.rateLimitFilter = rateLimitFilter;
    }

    // @Bean
    // @Order(1)
    // SecurityFilterChain publicChain(HttpSecurity http) throws Exception {
    //     http
    //         .securityMatcher("/api/auth/**", "/api/public/**", "/actuator/**")
    //         .csrf(csrf -> csrf.disable())
    //         .oauth2ResourceServer(oauth2 -> oauth2.disable())
    //         .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());

    //     return http.build();
    // }

    // @Bean
    // @Order(2)
    // SecurityFilterChain securedChain(HttpSecurity http) throws Exception {
    //     http
    //         .cors(Customizer.withDefaults())
    //         .csrf(csrf -> csrf.disable())
            
    //         .authorizeHttpRequests(auth -> auth
    //         .requestMatchers("/api/planejamento-ia/**").permitAll()  
    //         .anyRequest()
    //         .authenticated())
    //         .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> Customizer.withDefaults()));

    //     return http.build();
    // }
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            // Adicionar rate limiting filter antes do filtro de autenticação
            .addFilterBefore(rateLimitFilter, UsernamePasswordAuthenticationFilter.class)
            .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/planejamento-ia/**").permitAll()
            .requestMatchers("/api/auth/**").permitAll()
            .requestMatchers("/api/app/**").permitAll()  // Info da aplicação (versão, etc)
            .requestMatchers("/api/public").permitAll()
            .requestMatchers("/actuator/health").permitAll()
            .requestMatchers("/actuator/info").permitAll()
            // Swagger/OpenAPI endpoints
            .requestMatchers("/v3/api-docs/**").permitAll()
            .requestMatchers("/swagger-ui/**").permitAll()
            .requestMatchers("/swagger-ui.html").permitAll()
            // Google Calendar OAuth2 callback (redirect do Google, sem JWT)
            .requestMatchers("/api/google-calendar/callback").permitAll()
            .anyRequest().authenticated())
        .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> Customizer.withDefaults()));

        return http.build();
    }

}
