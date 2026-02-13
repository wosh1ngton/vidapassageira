package br.com.vidapassageira.backend.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import br.com.vidapassageira.backend.dtos.destino.DestinoCreateDTO;
import br.com.vidapassageira.backend.dtos.destino.DestinoReponseDTO;
import br.com.vidapassageira.backend.services.DestinosService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.io.IOException;
import java.util.List;

import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/destinos")
@Tag(name = "Destinos", description = "Endpoints para gerenciamento de destinos de viagem")
@SecurityRequirement(name = "bearerAuth")
public class DestinosResource {

    @Autowired
    private DestinosService destinosService;

    @Operation(
        summary = "Listar todos os destinos",
        description = "Retorna a lista completa de destinos cadastrados no sistema"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de destinos retornada com sucesso"),
        @ApiResponse(responseCode = "401", description = "Não autenticado")
    })
    @GetMapping
    public ResponseEntity<List<DestinoReponseDTO>> listar() {
        return ResponseEntity.ok(destinosService.listar());
    }

    @Operation(
        summary = "Buscar destinos",
        description = "Busca destinos por nome ou localização"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Resultados da busca retornados com sucesso"),
        @ApiResponse(responseCode = "401", description = "Não autenticado")
    })
    @GetMapping("/busca")
    public ResponseEntity<List<DestinoReponseDTO>> buscar(
            @Parameter(description = "Termo de busca") @RequestParam String termo) {
        return ResponseEntity.ok(destinosService.buscar(termo));
    }

    @Operation(
        summary = "Cadastrar novo destino",
        description = "Cria um novo destino com nome, descrição, localização e imagem"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Destino cadastrado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos ou imagem muito grande"),
        @ApiResponse(responseCode = "401", description = "Não autenticado")
    })
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DestinoReponseDTO> cadastrar(
            @Parameter(description = "Arquivo de imagem do destino") @RequestPart("imagem") MultipartFile imagem,
            @Parameter(description = "Nome do destino") @RequestPart("nome") String nome,
            @Parameter(description = "Descrição do destino") @RequestPart("descricao") String descricao,
            @Parameter(description = "Localização do destino") @RequestPart("localizacao") String localizacao) throws IOException

    {
        DestinoReponseDTO response = destinosService.cadastrar(nome, descricao, localizacao, imagem.getBytes());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(
        summary = "Atualizar destino",
        description = "Atualiza os dados de um destino existente, incluindo a imagem (opcional)"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Destino atualizado com sucesso"),
        @ApiResponse(responseCode = "404", description = "Destino não encontrado"),
        @ApiResponse(responseCode = "401", description = "Não autenticado")
    })
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DestinoReponseDTO> atualizar(
            @Parameter(description = "Dados do destino") @RequestPart("destino") DestinoCreateDTO destino,
            @Parameter(description = "Nova imagem (opcional)") @RequestPart(value = "imagem", required=false) MultipartFile imagem,
            @Parameter(description = "ID do destino") @PathVariable Long id) throws IOException {

        DestinoReponseDTO response = destinosService.atualizar(destino, id, imagem.getBytes());
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Excluir destino",
        description = "Remove um destino do sistema"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Destino excluído com sucesso"),
        @ApiResponse(responseCode = "404", description = "Destino não encontrado"),
        @ApiResponse(responseCode = "401", description = "Não autenticado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
        @Parameter(description = "ID do destino") @PathVariable Long id
    ) {
        destinosService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(
        summary = "Buscar destino por ID",
        description = "Retorna os detalhes de um destino específico"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Destino encontrado"),
        @ApiResponse(responseCode = "404", description = "Destino não encontrado"),
        @ApiResponse(responseCode = "401", description = "Não autenticado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<DestinoReponseDTO> getById(
        @Parameter(description = "ID do destino") @PathVariable Long id
    ) {
        DestinoReponseDTO response = destinosService.getById(id);
        return ResponseEntity.ok(response);
    }
}
