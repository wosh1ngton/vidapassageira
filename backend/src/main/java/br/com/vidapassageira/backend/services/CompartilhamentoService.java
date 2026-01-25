package br.com.vidapassageira.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.vidapassageira.backend.dtos.compartilhamento.ViagemCompartilhamentoDTO;
import br.com.vidapassageira.backend.mappers.ViagemCompartilhamentoMapper;
import br.com.vidapassageira.backend.repositories.ViagemCompartilhamentoRepository;

@Service
public class CompartilhamentoService {
    
    @Autowired
    private ViagemCompartilhamentoRepository viagemCompartilhamentoRepository;

    public ViagemCompartilhamentoDTO compartilhar(ViagemCompartilhamentoDTO dto) {
        var entity = ViagemCompartilhamentoMapper.INSTANCE.toEntity(dto);
        var saved = this.viagemCompartilhamentoRepository.save(entity);
        return ViagemCompartilhamentoMapper.INSTANCE.toDto(saved);
    }
}
