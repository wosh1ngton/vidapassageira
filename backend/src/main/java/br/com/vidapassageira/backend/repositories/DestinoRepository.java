package br.com.vidapassageira.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.vidapassageira.backend.models.Destino;

public interface DestinoRepository extends JpaRepository<Destino, Long> {

    boolean existsByNomeIgnoreCase(String nome);

    Optional<Destino> findFirstByNomeIgnoreCase(String nome);

    List<Destino> findByNomeContainingIgnoreCaseOrLocalizacaoContainingIgnoreCase(String nome, String localizacao);
}
