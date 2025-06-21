package br.com.vidapassageira.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.vidapassageira.backend.dtos.destino.DestinoCreateDTO;
import br.com.vidapassageira.backend.dtos.destino.DestinoReponseDTO;
import br.com.vidapassageira.backend.exceptions.EntityNotFoundException;
import br.com.vidapassageira.backend.mappers.DestinoMapper;
import br.com.vidapassageira.backend.models.Destino;
import br.com.vidapassageira.backend.repositories.DestinoRepository;


import java.util.List;

@Service
public class DestinosService {

    @Autowired
    private DestinoRepository destinoRepository;

    public DestinoReponseDTO cadastrar(DestinoCreateDTO dto) {
        Destino destino = DestinoMapper.INSTANCE.toEntity(dto);
        destino = destinoRepository.save(destino);
        return DestinoMapper.INSTANCE.toResponseDto(destino);
    }

    public List<DestinoReponseDTO> listar() {
        List<Destino> destinos = destinoRepository.findAll();
        return destinos.stream().map(DestinoMapper.INSTANCE::toResponseDto).toList();
    }

    public DestinoReponseDTO atualizar(DestinoCreateDTO dto, Long id) {

        Destino destino = destinoRepository.findById(id)
                            .orElseThrow(() -> new RuntimeException("Destino não encontrado"));
        
        DestinoMapper.INSTANCE.updateEntity(dto, destino);                            
        destinoRepository.save(destino);        
        return DestinoMapper.INSTANCE.toResponseDto(destino);
    }

    public void deletar(Long id) {  
        if (!destinoRepository.existsById(id)) {
            throw new EntityNotFoundException("Destino com ID " + id + " não encontrado.");
        }      
        destinoRepository.deleteById(id);
    }

    public DestinoReponseDTO getById(Long id) {
        if (!destinoRepository.existsById(id)) {
            throw new EntityNotFoundException("Destino com ID " + id + " não encontrado.");
        } 
        return DestinoMapper.INSTANCE.toResponseDto(destinoRepository.getReferenceById(id));
    }
}
