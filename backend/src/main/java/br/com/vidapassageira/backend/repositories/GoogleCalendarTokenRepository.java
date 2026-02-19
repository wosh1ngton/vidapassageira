package br.com.vidapassageira.backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.vidapassageira.backend.models.GoogleCalendarToken;

@Repository
public interface GoogleCalendarTokenRepository extends JpaRepository<GoogleCalendarToken, Long> {

    Optional<GoogleCalendarToken> findByUsuario_Id(Long usuarioId);

    Optional<GoogleCalendarToken> findByUsuario_KeyCloakId(String keycloakId);

    boolean existsByUsuario_KeyCloakId(String keycloakId);

    void deleteByUsuario_Id(Long usuarioId);
}
