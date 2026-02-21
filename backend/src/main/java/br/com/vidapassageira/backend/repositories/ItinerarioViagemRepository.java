package br.com.vidapassageira.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.vidapassageira.backend.models.ItinerarioViagem;
import jakarta.transaction.Transactional;


public interface ItinerarioViagemRepository extends JpaRepository<ItinerarioViagem, Long> {
    List<ItinerarioViagem> findAllByViagem_Id(Long id);
    boolean existsByViagem_Id(Long id);

    @Modifying
    @Transactional
    @Query("""
            UPDATE ItinerarioViagem it
            SET it.itinerarioConcluido = true
            WHERE it.id = :id
    """)
    int marcarComoConcluido(@Param("id") Long id);

    @Modifying
    @Transactional
    void deleteAllByViagem_Id(Long viagemId);
}
