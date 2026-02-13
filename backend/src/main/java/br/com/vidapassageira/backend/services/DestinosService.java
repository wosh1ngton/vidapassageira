package br.com.vidapassageira.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.vidapassageira.backend.dtos.destino.DestinoCreateDTO;
import br.com.vidapassageira.backend.dtos.destino.DestinoReponseDTO;
import br.com.vidapassageira.backend.exceptions.EntityNotFoundException;
import br.com.vidapassageira.backend.mappers.DestinoMapper;
import br.com.vidapassageira.backend.models.Destino;
import br.com.vidapassageira.backend.repositories.DestinoRepository;

import java.util.Base64;
import java.util.List;

@Service
public class DestinosService {

    @Autowired
    private DestinoRepository destinoRepository;

    public DestinoReponseDTO cadastrar(String nome, String descricao, String localizacao, byte[] imagem) {
        if (destinoRepository.existsByNomeIgnoreCase(nome)) {
            throw new IllegalArgumentException("Já existe um destino cadastrado com o nome '" + nome + "'.");
        }

        DestinoCreateDTO dto = new DestinoCreateDTO(nome, descricao, localizacao);

        Destino destino = DestinoMapper.INSTANCE.toEntity(dto);

        if (imagem != null) {
            destino.setImagem(imagem);
        }
        destino = destinoRepository.save(destino);
        return DestinoMapper.INSTANCE.toResponseDto(destino);
    }

    public List<DestinoReponseDTO> listar() {
        List<Destino> destinos = destinoRepository.findAll();

        return destinos.stream().map(destino -> {
            DestinoReponseDTO dto = DestinoMapper.INSTANCE.toResponseDto(destino);
            if (destino.getImagem() != null) {
                String base64 = Base64.getEncoder().encodeToString(destino.getImagem());
                dto.setImagemBase64("data:image/jpeg;base64," + base64);
            }
            return dto;
        }).toList();

    }

    public DestinoReponseDTO atualizar(DestinoCreateDTO dto, Long id, byte[] imagem) {

        Destino destino = destinoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Destino não encontrado"));

        DestinoMapper.INSTANCE.updateEntity(dto, destino);

        if (imagem != null) {
            destino.setImagem(imagem);
        }

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

    public List<DestinoReponseDTO> buscar(String termo) {
        List<Destino> destinos = destinoRepository.findByNomeContainingIgnoreCaseOrLocalizacaoContainingIgnoreCase(termo, termo);

        return destinos.stream().map(destino -> {
            DestinoReponseDTO dto = DestinoMapper.INSTANCE.toResponseDto(destino);
            if (destino.getImagem() != null) {
                String base64 = Base64.getEncoder().encodeToString(destino.getImagem());
                dto.setImagemBase64("data:image/jpeg;base64," + base64);
            }
            return dto;
        }).toList();
    }
}
