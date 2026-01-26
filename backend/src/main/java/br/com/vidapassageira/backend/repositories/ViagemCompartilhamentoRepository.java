package br.com.vidapassageira.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;


import br.com.vidapassageira.backend.models.ViagemCompartilhamento;

@Repository
public interface ViagemCompartilhamentoRepository extends JpaRepository<ViagemCompartilhamento, Long> {
    
    
    List<ViagemCompartilhamento> findByUsuario_Id(Long usuarioId);
    
}
