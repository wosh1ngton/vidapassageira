package br.com.vidapassageira.backend.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import br.com.vidapassageira.backend.dtos.itinerario.ItinerarioCreateDto;
import br.com.vidapassageira.backend.dtos.itinerario.ItinerarioResponseDto;
import br.com.vidapassageira.backend.models.ItinerarioViagem;

@Mapper
public interface ItinerarioViagemMapper {    

    ItinerarioViagemMapper INSTANCE = Mappers.getMapper(ItinerarioViagemMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(source = "idViagem", target = "viagem.id")    
    ItinerarioViagem toEntity(ItinerarioCreateDto dto);

    ItinerarioResponseDto toDto(ItinerarioViagem entity);

    
}
