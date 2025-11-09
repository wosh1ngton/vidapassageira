package br.com.vidapassageira.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;


import br.com.vidapassageira.backend.models.ItinerarioViagem;


public interface ItinerarioViagemRepository extends JpaRepository<ItinerarioViagem, Long> {
    
}
