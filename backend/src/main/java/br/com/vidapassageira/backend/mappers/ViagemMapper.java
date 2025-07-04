package br.com.vidapassageira.backend.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import br.com.vidapassageira.backend.dtos.viagem.ViagemCreateDTO;
import br.com.vidapassageira.backend.dtos.viagem.ViagemResponseDTO;
import br.com.vidapassageira.backend.models.Viagem;


@Mapper
public interface ViagemMapper {   

    ViagemMapper INSTANCE = Mappers.getMapper(ViagemMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(source = "idDestino", target = "destino.id")
    Viagem toEntity(ViagemCreateDTO dto);

    @Mapping(source = "destino.id", target = "idDestino")
    ViagemCreateDTO toDto(Viagem entity);

    @Mapping(target = "destino.imagemBase64", ignore = true)
    ViagemResponseDTO toResponseDTO(Viagem entity);
}
