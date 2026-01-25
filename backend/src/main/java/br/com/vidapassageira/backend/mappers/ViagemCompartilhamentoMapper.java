package br.com.vidapassageira.backend.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import br.com.vidapassageira.backend.dtos.compartilhamento.ViagemCompartilhamentoDTO;
import br.com.vidapassageira.backend.models.Usuario;
import br.com.vidapassageira.backend.models.Viagem;
import br.com.vidapassageira.backend.models.ViagemCompartilhamento;

@Mapper
public interface ViagemCompartilhamentoMapper {    

    ViagemCompartilhamentoMapper INSTANCE = Mappers.getMapper(ViagemCompartilhamentoMapper.class);
    
    @Mapping(target = "viagem", source = "idViagem", qualifiedByName = "viagemFromId")
    @Mapping(target = "usuario", source = "idUsuario", qualifiedByName = "usuarioFromId")    
    ViagemCompartilhamento toEntity(ViagemCompartilhamentoDTO dto);

    @Mapping(target = "idViagem", source = "viagem.id")
    @Mapping(target = "idUsuario", source = "usuario.id") 
    ViagemCompartilhamentoDTO toDto(ViagemCompartilhamento entity);

     @Named("viagemFromId")
    default Viagem viagemFromId(Long id) {
        if (id == null) return null;
        Viagem v = new Viagem();
        v.setId(id);
        return v;
    }

    @Named("usuarioFromId")
    default Usuario usuarioFromId(Long id) {
        if (id == null) return null;
        Usuario u = new Usuario();
        u.setId(id);
        return u;
    }
}
