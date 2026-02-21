package br.com.vidapassageira.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import br.com.vidapassageira.backend.models.SugestaoIA;
import jakarta.transaction.Transactional;

public interface SugestaoIARepository extends JpaRepository<SugestaoIA, Long> {

    SugestaoIA findByViagem_IdAndTipoSugestaoIA_Id(Long viagemId, Integer tipoSugestaoIAId);

    boolean existsByViagem_IdAndTipoSugestaoIA_IdAndIdNot(Long viagemId, Integer tipoSugestaoIAId, Long excludeId);

    List<SugestaoIA> findByViagem_Id(Long viagemId);

    @Modifying
    @Transactional
    void deleteByViagem_IdAndTipoSugestaoIA_Id(Long viagemId, Integer tipoSugestaoIAId);

}
