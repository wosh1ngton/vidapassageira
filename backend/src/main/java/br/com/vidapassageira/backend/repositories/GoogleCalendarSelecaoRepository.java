package br.com.vidapassageira.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.vidapassageira.backend.models.GoogleCalendarSelecao;

@Repository
public interface GoogleCalendarSelecaoRepository extends JpaRepository<GoogleCalendarSelecao, Long> {

    List<GoogleCalendarSelecao> findByUsuario_IdAndAtivoTrue(Long usuarioId);

    List<GoogleCalendarSelecao> findByUsuario_Id(Long usuarioId);

    Optional<GoogleCalendarSelecao> findByUsuario_IdAndCalendarId(Long usuarioId, String calendarId);

    void deleteByUsuario_Id(Long usuarioId);
}
