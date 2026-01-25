package br.com.vidapassageira.backend.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import br.com.vidapassageira.backend.dtos.viagem.ViagemCreateDTO;
import br.com.vidapassageira.backend.dtos.viagem.ViagemResponseDTO;
import br.com.vidapassageira.backend.models.Viagem;


@Mapper
public interface ViagemMapper {   

    ViagemMapper INSTANCE = Mappers.getMapper(ViagemMapper.class);

    @Mapping(target = "usuario", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(source = "idDestino", target = "destino.id")
    Viagem toEntity(ViagemCreateDTO dto);

    @Mapping(source = "destino.id", target = "idDestino")
    @Mapping(target = "sub", ignore = true)
    ViagemCreateDTO toDto(Viagem entity);

    @Mapping(target = "destino.imagemBase64", ignore = true)
    @Mapping(target = "compartilhada", ignore = true)
    ViagemResponseDTO toResponseDTO(Viagem entity);

    @Mapping(target = "usuario", ignore = true)
    @Mapping(source = "idDestino", target = "destino.id")
    void updateEntity(ViagemCreateDTO dto, @MappingTarget Viagem entity);
}
