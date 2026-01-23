package br.com.vidapassageira.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@EnableWebSecurity
@Configuration

public class SecurityConfig {

    @Bean
    @Order(1)
    public SecurityFilterChain publicChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/api/auth/**", "/api/public/**", "/actuator/**")
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());

        return http.build();
    }

    @Bean
    @Order(2)
    public SecurityFilterChain securedChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
            .oauth2ResourceServer(oauth2 -> oauth2.jwt());

        return http.build();
    }
    // @Bean
    // public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    //     http
    //         .cors(cors -> Customizer.withDefaults())
    //         .csrf(csrf -> csrf.disable())
    //         .authorizeHttpRequests(auth -> auth  
    //         .requestMatchers("/api/planejamento-ia/**").permitAll()          
    //         .requestMatchers("/api/auth/**").permitAll()
    //         .requestMatchers("/api/public").permitAll()
    //         .requestMatchers("/actuator/health").permitAll()
    //         .requestMatchers("/actuator/info").permitAll()
    //         .anyRequest().authenticated())
    //     .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> Customizer.withDefaults()));

    //     return http.build();
    // }

}
