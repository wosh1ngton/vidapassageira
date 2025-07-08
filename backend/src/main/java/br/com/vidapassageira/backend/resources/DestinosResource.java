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

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/destinos")
public class DestinosResource {

    @Autowired
    private DestinosService destinosService;

    @GetMapping
    public ResponseEntity<List<DestinoReponseDTO>> listar() {
        return ResponseEntity.ok(destinosService.listar());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DestinoReponseDTO> cadastrar(
            @RequestPart("imagem") MultipartFile imagem,
            @RequestPart("nome") String nome,
            @RequestPart("descricao") String descricao,
            @RequestPart("localizacao") String localizacao) throws IOException

    {
        DestinoReponseDTO response = destinosService.cadastrar(nome, descricao, localizacao, imagem.getBytes());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DestinoReponseDTO> atualizar(
            @RequestPart("destino") DestinoCreateDTO destino,
            @RequestPart(value = "imagem", required=false) MultipartFile imagem,
            @PathVariable Long id) throws IOException {       
        
        DestinoReponseDTO response = destinosService.atualizar(destino, id, imagem.getBytes());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        destinosService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DestinoReponseDTO> getById(@PathVariable Long id) {
        DestinoReponseDTO response = destinosService.getById(id);
        return ResponseEntity.ok(response);
    }
}
