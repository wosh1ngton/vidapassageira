package br.com.vidapassageira.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.vidapassageira.backend.models.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Usuario findByKeyCloakId(String sub);
    boolean existsByKeyCloakId(String sub);
    List<Usuario> findByUserNameContainingIgnoreCase(String stringPart);
}
