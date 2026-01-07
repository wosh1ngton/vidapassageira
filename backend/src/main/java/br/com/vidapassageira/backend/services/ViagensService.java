package br.com.vidapassageira.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.resource.NoResourceFoundException;

import br.com.vidapassageira.backend.dtos.itinerario.ItinerarioCreateDto;
import br.com.vidapassageira.backend.dtos.itinerario.ItinerarioResponseDto;
import br.com.vidapassageira.backend.dtos.viagem.ViagemCreateDTO;
import br.com.vidapassageira.backend.dtos.viagem.ViagemResponseDTO;
import br.com.vidapassageira.backend.exceptions.EntityNotFoundException;
import br.com.vidapassageira.backend.mappers.ItinerarioViagemMapper;
import br.com.vidapassageira.backend.mappers.ViagemMapper;
import br.com.vidapassageira.backend.models.ItinerarioViagem;
import br.com.vidapassageira.backend.models.Viagem;
import br.com.vidapassageira.backend.repositories.ItinerarioViagemRepository;
import br.com.vidapassageira.backend.repositories.ViagemRepository;

@Service
public class ViagensService {

    @Autowired
    private ViagemRepository viagemRepository;

    @Autowired
    private ItinerarioViagemRepository itinerarioViagemRepository;

    public ViagemCreateDTO cadastrar(ViagemCreateDTO viagemCreateDTO) {
        
        Viagem viagem = ViagemMapper.INSTANCE.toEntity(viagemCreateDTO);
        this.viagemRepository.save(viagem);
        return ViagemMapper.INSTANCE.toDto(viagem);
    }

    public List<ViagemResponseDTO> listar() {
        List<Viagem> viagens = this.viagemRepository.findAll();        
        List<ViagemResponseDTO> viagensDto = viagens.stream().map(viagem -> {
            ViagemResponseDTO viagemDTO = ViagemMapper.INSTANCE.toResponseDTO(viagem);
            if (viagem.getDestino().getImagem() != null) {
                String base64 = java.util.Base64.getEncoder().encodeToString(viagem.getDestino().getImagem());
                viagemDTO.getDestino().setImagemBase64("data:image/jpeg;base64," + base64);
            }
            return viagemDTO;
        }).toList();

        return viagensDto;

    }

    public ViagemResponseDTO buscarPorId(Long id) {
        Viagem viagem = this.viagemRepository.findById(id).orElseThrow(() -> new RuntimeException("Viagem não encontrada"));
        ViagemResponseDTO viagemDTO = ViagemMapper.INSTANCE.toResponseDTO(viagem);
        if (viagem.getDestino().getImagem() != null) {
            String base64 = java.util.Base64.getEncoder().encodeToString(viagem.getDestino().getImagem());
            viagemDTO.getDestino().setImagemBase64("data:image/jpeg;base64, " + base64);
        }
        return viagemDTO;
    }


    
    public ItinerarioResponseDto cadastrarItinerario(ItinerarioCreateDto itinerarioCreateDto) {
        
        ItinerarioViagem itinerarioViagem = ItinerarioViagemMapper.INSTANCE.toEntity(itinerarioCreateDto);
        this.itinerarioViagemRepository.save(itinerarioViagem);
        return ItinerarioViagemMapper.INSTANCE.toDto(itinerarioViagem);
    }

    public ItinerarioResponseDto editarItinerario(ItinerarioCreateDto itinerarioCreateDto) {
        ItinerarioViagem itinerarioViagem = this.itinerarioViagemRepository.findById(itinerarioCreateDto.getId()).get();
        ItinerarioViagemMapper.INSTANCE.updateEntity(itinerarioCreateDto, itinerarioViagem);
        this.itinerarioViagemRepository.save(itinerarioViagem);
        return ItinerarioViagemMapper.INSTANCE.toDto(itinerarioViagem);
    }

    public List<ItinerarioResponseDto> listarItinerario(Long id) {
        List<ItinerarioViagem> itinerarioDaViagem = this.itinerarioViagemRepository.findAllByViagem_Id(id);
        if(itinerarioDaViagem.isEmpty()) {
            throw new NoResourceFoundException("item não localizado");
        }
        List<ItinerarioResponseDto> itinerarioDaViagemDTO = itinerarioDaViagem.stream()
            .map(ItinerarioViagemMapper.INSTANCE::toDto).toList();
        return itinerarioDaViagemDTO;
    }

    public boolean verificaExistenciaItinerario(Long id) {
        boolean itinerarioDaViagem = this.itinerarioViagemRepository.existsByViagem_Id(id);
        return itinerarioDaViagem;
    }

    public void deletar(Long id) {
        if (!itinerarioViagemRepository.existsById(id)) {
            throw new EntityNotFoundException("Itinerário com ID " + id + " não encontrado.");
        }
        itinerarioViagemRepository.deleteById(id);
    }
}
