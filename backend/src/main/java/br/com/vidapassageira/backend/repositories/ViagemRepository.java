package br.com.vidapassageira.backend.repositories;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.vidapassageira.backend.models.Viagem;

public interface ViagemRepository extends JpaRepository<Viagem, Long> {

        List<Viagem> findAllByUsuario_Id(Long id);
}
