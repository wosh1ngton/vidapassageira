package br.com.vidapassageira.backend.services;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.vidapassageira.backend.dtos.sugestaoIa.SugestaoIaCreateDTO;
import br.com.vidapassageira.backend.dtos.sugestaoIa.SugestaoIaResponseDTO;
import br.com.vidapassageira.backend.dtos.viagem.ViagemResponseDTO;
import br.com.vidapassageira.backend.exceptions.SugestaoDuplicadaException;
import br.com.vidapassageira.backend.mappers.SugestaoIAMapper;
import br.com.vidapassageira.backend.models.SugestaoIA;
import br.com.vidapassageira.backend.models.enums.TipoSugestaoEnum;
import br.com.vidapassageira.backend.repositories.SugestaoIARepository;

@Service
public class SugestaoIAService {

    @Autowired
    private SugestaoIARepository sugestaoIARepository;

    private static final Map<TipoSugestaoEnum, Function<ViagemResponseDTO, String>> IA_PROMPTS = Map.of(
        
        TipoSugestaoEnum.ONDE_IR, dto -> """
                 O que fazer em  "%s"?   
                """.formatted(dto.getDestino().getLocalizacao()),

        TipoSugestaoEnum.ONDE_FICAR, dto -> """
            Me dê as melhores localizações para hospedagem em "%s"
            """.formatted(dto.getDestino().getLocalizacao()),

        TipoSugestaoEnum.COMO_CHEGAR, dto -> """
            Me dê sugestões de melhor meio de transporte para chegar em "%s",
            considere custo-benefício e tempo de viagem
            """.formatted(dto.getDestino().getLocalizacao()),

        TipoSugestaoEnum.ONDE_COMER, dto -> """
            Me dê sugestões de almoço, lanche e jantar em "%s",
            considere custo-benefício e intervalo da viagem, entre "%s" e "%s"
            """.formatted(dto.getDestino().getLocalizacao(), dto.getDataIda(), dto.getDataVolta())
    );

     public String gerarPrompt(TipoSugestaoEnum tipo, ViagemResponseDTO dto) {
        Function<ViagemResponseDTO, String> promptFunction = IA_PROMPTS.get(tipo);
        if (promptFunction == null) {
            throw new IllegalArgumentException("TipoSugestaoIA inválido: " + tipo);
        }
        return promptFunction.apply(dto);
    }

    public SugestaoIaCreateDTO save(SugestaoIaCreateDTO sugestao) {        
        boolean exists = sugestaoIARepository.existsByViagem_IdAndTipoSugestaoIA_IdAndIdNot(
            sugestao.getIdViagem(), sugestao.getTipoSugestaoIaEnum() , sugestao.getId() == null ? -1L : sugestao.getId());
        
        if(exists) {
            throw new SugestaoDuplicadaException("Já existe sugestão para esta viagem e para este tipo de pergunta");
        }
        SugestaoIA sugestaoIA = SugestaoIAMapper.INSTANCE.toEntity(sugestao);        
        SugestaoIaCreateDTO sugestaoIASaved = SugestaoIAMapper.INSTANCE.toCreateDTO(this.sugestaoIARepository.save(sugestaoIA));
        return sugestaoIASaved;
    }

    public SugestaoIaResponseDTO getByViagemIdAndTipo(Long viagemId, Integer tipoSugestaoId) {
        SugestaoIA sugestaoIA = this.sugestaoIARepository.findByViagem_IdAndTipoSugestaoIA_Id(viagemId, tipoSugestaoId);
        return SugestaoIAMapper.INSTANCE.toResponseDTO(sugestaoIA);
    }

    public List<SugestaoIaResponseDTO> getByViagemId(Long viagemId) {
        List<SugestaoIA> sugestoesIa = this.sugestaoIARepository.findByViagem_Id(viagemId);
        List<SugestaoIaResponseDTO> sugestoesDTO = sugestoesIa.stream()
                    .map(SugestaoIAMapper.INSTANCE::toResponseDTO).toList();
        return sugestoesDTO;
    }
}
