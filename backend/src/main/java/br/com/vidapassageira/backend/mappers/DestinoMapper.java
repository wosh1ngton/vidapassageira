package br.com.vidapassageira.backend.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import br.com.vidapassageira.backend.dtos.destino.DestinoCreateDTO;
import br.com.vidapassageira.backend.dtos.destino.DestinoReponseDTO;
import br.com.vidapassageira.backend.models.Destino;

@Mapper
public interface DestinoMapper {

    DestinoMapper INSTANCE = Mappers.getMapper(DestinoMapper.class);   
    
    @Mapping(target = "id", ignore = true)
    Destino toEntity(DestinoCreateDTO dto);

    @Mapping(target = "imagemBase64", ignore = true)
    DestinoReponseDTO toResponseDto(Destino destino);    
    
    void updateEntity(DestinoCreateDTO dto, @MappingTarget Destino destino);

}
