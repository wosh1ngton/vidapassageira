package br.com.vidapassageira.backend.resources;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.vidapassageira.backend.dtos.viagem.ViagemCreateDTO;
import br.com.vidapassageira.backend.dtos.viagem.ViagemResponseDTO;
import br.com.vidapassageira.backend.services.ViagensService;

@RestController
@RequestMapping("/api/viagens")
public class ViagensResource {

    @Autowired
    private ViagensService viagensService;

    @PostMapping
    public ResponseEntity<ViagemCreateDTO> cadastrar(@RequestBody ViagemCreateDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(viagensService.cadastrar(request));
    }

    @GetMapping
    public ResponseEntity<List<ViagemResponseDTO>> listar() {
        return ResponseEntity.ok(viagensService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ViagemResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(viagensService.buscarPorId(id));
    }
}
