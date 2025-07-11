package br.com.vidapassageira.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.vidapassageira.backend.dtos.sugestaoIa.SugestaoIaCreateDTO;
import br.com.vidapassageira.backend.dtos.sugestaoIa.SugestaoIaResponseDTO;
import br.com.vidapassageira.backend.mappers.SugestaoIAMapper;
import br.com.vidapassageira.backend.models.SugestaoIA;
import br.com.vidapassageira.backend.repositories.SugestaoIARepository;

@Service
public class SugestaoIAService {

    @Autowired
    private SugestaoIARepository sugestaoIARepository;

    public SugestaoIaCreateDTO save(SugestaoIaCreateDTO sugestao) {        
        
        SugestaoIA sugestaoIA = SugestaoIAMapper.INSTANCE.toEntity(sugestao);        
        SugestaoIaCreateDTO sugestaoIASaved = SugestaoIAMapper.INSTANCE.tCreateDTO(this.sugestaoIARepository.save(sugestaoIA));
        return sugestaoIASaved;
    }

    public SugestaoIaResponseDTO getByViagemIdAndTipo(Long viagemId, Integer tipoSugestaoId) {
        SugestaoIA sugestaoIA = this.sugestaoIARepository.findByViagem_IdAndTipoSugestaoIA_Id(viagemId, tipoSugestaoId);
        return SugestaoIAMapper.INSTANCE.tResponseDTO(sugestaoIA);
    }

    public List<SugestaoIaResponseDTO> getByViagemId(Long viagemId) {
        List<SugestaoIA> sugestoesIa = this.sugestaoIARepository.findByViagem_Id(viagemId);
        List<SugestaoIaResponseDTO> sugestoesDTO = sugestoesIa.stream()
                    .map(SugestaoIAMapper.INSTANCE::tResponseDTO).toList();
        return sugestoesDTO;
    }
}
