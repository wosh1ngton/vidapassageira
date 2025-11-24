package br.com.vidapassageira.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;


import br.com.vidapassageira.backend.models.ItinerarioViagem;


public interface ItinerarioViagemRepository extends JpaRepository<ItinerarioViagem, Long> {
    List<ItinerarioViagem> findAllByViagem_Id(Long id);
    boolean existsByViagem_Id(Long id);
}
