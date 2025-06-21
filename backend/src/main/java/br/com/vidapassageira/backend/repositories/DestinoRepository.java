package br.com.vidapassageira.backend.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import br.com.vidapassageira.backend.models.Destino;


public interface DestinoRepository extends JpaRepository<Destino, Long> {

}
