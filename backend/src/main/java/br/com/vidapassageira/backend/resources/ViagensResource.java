package br.com.vidapassageira.backend.resources;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.vidapassageira.backend.dtos.itinerario.ItinerarioCreateDto;
import br.com.vidapassageira.backend.dtos.itinerario.ItinerarioResponseDto;
import br.com.vidapassageira.backend.dtos.viagem.ViagemCreateDTO;
import br.com.vidapassageira.backend.dtos.viagem.ViagemResponseDTO;
import br.com.vidapassageira.backend.services.CompartilhamentoService;
import br.com.vidapassageira.backend.services.ViagensService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/viagens")
@Tag(name = "Viagens", description = "Endpoints para gerenciamento de viagens e itinerários")
@SecurityRequirement(name = "bearerAuth")
public class ViagensResource {

    @Autowired
    private ViagensService viagensService;

    

    @Operation(
        summary = "Cadastrar nova viagem",
        description = "Cria uma nova viagem associada a um destino para o usuário autenticado"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Viagem cadastrada com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos"),
        @ApiResponse(responseCode = "401", description = "Não autenticado")
    })
    @PostMapping
    public ResponseEntity<ViagemCreateDTO> cadastrar(@RequestBody ViagemCreateDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(viagensService.cadastrar(request));
    }

    @Operation(
        summary = "Listar viagens do usuário",
        description = "Retorna todas as viagens cadastradas e compartilhadas com o usuário autenticado"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de viagens retornada com sucesso"),
        @ApiResponse(responseCode = "401", description = "Não autenticado")
    })
    @GetMapping
    public ResponseEntity<List<ViagemResponseDTO>> listar(@AuthenticationPrincipal Jwt jwt) {
        String keycloakId = jwt.getSubject();

        return ResponseEntity.ok(
            viagensService.listarPorUsuario(keycloakId)
        );
    }

    @Operation(
        summary = "Atualizar viagem",
        description = "Atualiza os dados de uma viagem existente"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Viagem atualizada com sucesso"),
        @ApiResponse(responseCode = "404", description = "Viagem não encontrada"),
        @ApiResponse(responseCode = "401", description = "Não autenticado")
    })
    @PutMapping
    public ResponseEntity<ViagemCreateDTO> editarViagem(@RequestBody ViagemCreateDTO viagemCreateDTO) {
        return ResponseEntity.ok(viagensService.editar(viagemCreateDTO));
    }

    @Operation(
        summary = "Buscar viagem por ID",
        description = "Retorna os detalhes completos de uma viagem específica"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Viagem encontrada"),
        @ApiResponse(responseCode = "404", description = "Viagem não encontrada"),
        @ApiResponse(responseCode = "401", description = "Não autenticado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ViagemResponseDTO> buscarPorId(
        @Parameter(description = "ID da viagem") @PathVariable Long id
    ) {
        return ResponseEntity.ok(viagensService.buscarPorId(id));
    }

    @Operation(
        summary = "Cadastrar item de itinerário",
        description = "Adiciona uma nova atividade ao itinerário de uma viagem"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Item cadastrado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos"),
        @ApiResponse(responseCode = "401", description = "Não autenticado")
    })
    @PostMapping("/itinerario")
    public ResponseEntity<ItinerarioResponseDto> cadastrarItinerario(@RequestBody ItinerarioCreateDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(viagensService.cadastrarItinerario(request));
    }

    @Operation(
        summary = "Atualizar item de itinerário",
        description = "Atualiza os dados de uma atividade do itinerário"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Item atualizado com sucesso"),
        @ApiResponse(responseCode = "404", description = "Item não encontrado"),
        @ApiResponse(responseCode = "401", description = "Não autenticado")
    })
    @PutMapping("/itinerario")
    public ResponseEntity<ItinerarioResponseDto> editarItinerario(@RequestBody ItinerarioCreateDto request) {
        return ResponseEntity.status(HttpStatus.OK).body(viagensService.editarItinerario(request));
    }

    @Operation(
        summary = "Listar itinerário da viagem",
        description = "Retorna todos os itens do itinerário de uma viagem específica"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de itinerário retornada"),
        @ApiResponse(responseCode = "401", description = "Não autenticado")
    })
    @GetMapping("/itinerario/{id}")
    public ResponseEntity<List<ItinerarioResponseDto>> listarItinerarioPorViagemId(
        @Parameter(description = "ID da viagem") @PathVariable Long id
    ) {
        return ResponseEntity.ok(viagensService.listarItinerario(id));
    }

    @Operation(
        summary = "Verificar existência de itinerário",
        description = "Verifica se uma viagem possui itens de itinerário cadastrados"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Verificação realizada"),
        @ApiResponse(responseCode = "401", description = "Não autenticado")
    })
    @GetMapping("/verifica-itinerario/{id}")
    public ResponseEntity<Boolean> verificaSeExisteItinerario(
        @Parameter(description = "ID da viagem") @PathVariable Long id
    ) {
        return ResponseEntity.ok(viagensService.verificaExistenciaItinerario(id));
    }

    @Operation(
        summary = "Excluir item do itinerário",
        description = "Remove uma atividade do itinerário"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Item excluído com sucesso"),
        @ApiResponse(responseCode = "404", description = "Item não encontrado"),
        @ApiResponse(responseCode = "401", description = "Não autenticado")
    })
    @DeleteMapping("/itinerario/{id}")
    public ResponseEntity<Void> deletar(
        @Parameter(description = "ID do item do itinerário") @PathVariable Long id
    ) {
        viagensService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(
        summary = "Marcar/desmarcar como visitado",
        description = "Alterna o status de visitado de uma atividade do itinerário"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Status atualizado"),
        @ApiResponse(responseCode = "404", description = "Item não encontrado"),
        @ApiResponse(responseCode = "401", description = "Não autenticado")
    })
    @GetMapping("/itinerario/marcar-visita/{id}")
    public ResponseEntity<Void> marcarComoVisitado(
        @Parameter(description = "ID do item do itinerário") @PathVariable Long id
    ) {
        viagensService.marcarComoConcluido(id);
        return ResponseEntity.ok().build();
    }

    @Operation(
        summary = "Excluir viagem",
        description = "Remove uma viagem e todos os seus itens de itinerário"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Viagem excluída com sucesso"),
        @ApiResponse(responseCode = "404", description = "Viagem não encontrada"),
        @ApiResponse(responseCode = "401", description = "Não autenticado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarViagem(
        @Parameter(description = "ID da viagem") @PathVariable Long id
    ) {
        viagensService.deletarViagem(id);
        return ResponseEntity.noContent().build();
    }
}
