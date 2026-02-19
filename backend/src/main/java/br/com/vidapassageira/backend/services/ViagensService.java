package br.com.vidapassageira.backend.services;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.resource.NoResourceFoundException;

import br.com.vidapassageira.backend.dtos.itinerario.ItinerarioCreateDto;
import br.com.vidapassageira.backend.dtos.itinerario.ItinerarioResponseDto;
import br.com.vidapassageira.backend.dtos.viagem.ViagemAgendaCreateDTO;
import br.com.vidapassageira.backend.dtos.viagem.ViagemCreateDTO;
import br.com.vidapassageira.backend.dtos.viagem.ViagemResponseDTO;
import br.com.vidapassageira.backend.exceptions.EntityNotFoundException;
import br.com.vidapassageira.backend.mappers.ItinerarioViagemMapper;
import br.com.vidapassageira.backend.mappers.ViagemMapper;
import br.com.vidapassageira.backend.models.Destino;
import br.com.vidapassageira.backend.models.ItinerarioViagem;
import br.com.vidapassageira.backend.models.Usuario;
import br.com.vidapassageira.backend.models.Viagem;
import br.com.vidapassageira.backend.models.ViagemCompartilhamento;
import br.com.vidapassageira.backend.repositories.DestinoRepository;
import br.com.vidapassageira.backend.repositories.ItinerarioViagemRepository;
import br.com.vidapassageira.backend.repositories.UsuarioRepository;
import br.com.vidapassageira.backend.repositories.ViagemCompartilhamentoRepository;
import br.com.vidapassageira.backend.repositories.ViagemRepository;

@Service
public class ViagensService {

    @Autowired
    private ViagemRepository viagemRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ViagemCompartilhamentoRepository viagemCompartilhamentoRepository;

    @Autowired
    private ItinerarioViagemRepository itinerarioViagemRepository;

    @Autowired
    private DestinoRepository destinoRepository;

    public ViagemCreateDTO cadastrar(ViagemCreateDTO viagemCreateDTO) {
        
        Viagem viagem = ViagemMapper.INSTANCE.toEntity(viagemCreateDTO);
        Usuario user = usuarioRepository.findByKeyCloakId(viagemCreateDTO.getSub());
        viagem.setUsuario(user);
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

    public List<ViagemResponseDTO> listarPorUsuario(String keyCloakId) {

        Usuario usuario = usuarioRepository.findByKeyCloakId(keyCloakId);
        List<Viagem> viagens = this.viagemRepository.findAllByUsuario_Id(usuario.getId());

        List<Viagem> compartilhadasPara = this.viagemCompartilhamentoRepository.findByUsuario_Id(usuario.getId())
            .stream().map(viagem -> {
                viagem.getViagem().setCompartilhada(true);
                return viagem.getViagem();
            }).toList();

        Map<Long, Viagem> viagensUnicas = new LinkedHashMap<>();
        
        viagens.forEach(viagem -> viagensUnicas.put(viagem.getId(), viagem));
        compartilhadasPara.forEach(viagem -> viagensUnicas.put(viagem.getId(), viagem));
        
        List<ViagemResponseDTO> viagensDto = viagensUnicas.values()
            .stream()
            .map(viagem -> {
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

    public ViagemCreateDTO editar(ViagemCreateDTO viagemCreateDTO) {
        Viagem viagemRecuperada = this.viagemRepository.findById(viagemCreateDTO.getId()).orElseThrow(() -> new RuntimeException("Viagem não encontrada"));
        ViagemMapper.INSTANCE.updateEntity(viagemCreateDTO, viagemRecuperada);        
        this.viagemRepository.save(viagemRecuperada);
        return ViagemMapper.INSTANCE.toDto(viagemRecuperada);
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

    public void deletarViagem(Long id) {
        if (!viagemRepository.existsById(id)) {
            throw new EntityNotFoundException("Viagem com ID " + id + " não encontrado.");
        }
        viagemRepository.deleteById(id);
    }
    
    public Integer marcarComoConcluido(Long id) {
        if (!itinerarioViagemRepository.existsById(id)) {
            throw new EntityNotFoundException("Itinerário com ID " + id + " não encontrado.");
        }
        return itinerarioViagemRepository.marcarComoConcluido(id);
    }

    public ViagemResponseDTO criarDaAgenda(ViagemAgendaCreateDTO dto, String keycloakId) {
        Usuario usuario = usuarioRepository.findByKeyCloakId(keycloakId);

        Destino destino = destinoRepository.findFirstByNomeIgnoreCase(dto.getNomeDestino())
                .orElseGet(() -> {
                    Destino novo = new Destino();
                    novo.setNome(dto.getNomeDestino());
                    novo.setLocalizacao(dto.getLocalizacao() != null ? dto.getLocalizacao() : "");
                    return destinoRepository.save(novo);
                });

        Viagem viagem = new Viagem();
        viagem.setDestino(destino);
        viagem.setDataIda(dto.getDataIda());
        viagem.setDataVolta(dto.getDataVolta());
        viagem.setUsuario(usuario);

        viagemRepository.save(viagem);
        return ViagemMapper.INSTANCE.toResponseDTO(viagem);
    }
}
