package br.com.vidapassageira.backend.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import br.com.vidapassageira.backend.dtos.destino.DestinoCreateDTO;
import br.com.vidapassageira.backend.dtos.sugestaoIa.SugestaoIaCreateDTO;
import br.com.vidapassageira.backend.dtos.sugestaoIa.SugestaoIaResponseDTO;
import br.com.vidapassageira.backend.models.Destino;
import br.com.vidapassageira.backend.models.SugestaoIA;

@Mapper
public interface SugestaoIAMapper {

    SugestaoIAMapper INSTANCE = Mappers.getMapper(SugestaoIAMapper.class);
    
    @Mapping(target = "tipoSugestaoIaEnum", source = "tipoSugestaoIA.id")
    @Mapping(target = "idViagem", source = "viagem.id")
    SugestaoIaCreateDTO toCreateDTO(SugestaoIA entity);

    @Mapping(target = "idTipoSugestaoIa", source = "tipoSugestaoIA.id")
    @Mapping(target = "idViagem", source = "viagem.id")
    SugestaoIaResponseDTO toResponseDTO(SugestaoIA entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "tipoSugestaoIA.id", source = "tipoSugestaoIaEnum")
    @Mapping(target = "viagem.id", source = "idViagem")
    SugestaoIA toEntity(SugestaoIaCreateDTO dto);

    @Mapping(target = "viagem", ignore = true)
    @Mapping(target = "tipoSugestaoIA", ignore = true)
    void updateEntity(SugestaoIaCreateDTO dto, @MappingTarget SugestaoIA destino);

}
