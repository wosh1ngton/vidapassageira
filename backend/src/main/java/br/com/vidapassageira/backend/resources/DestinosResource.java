package br.com.vidapassageira.backend.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import br.com.vidapassageira.backend.dtos.destino.DestinoCreateDTO;
import br.com.vidapassageira.backend.dtos.destino.DestinoReponseDTO;
import br.com.vidapassageira.backend.services.DestinosService;
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

    @PostMapping
    public ResponseEntity<DestinoReponseDTO> cadastrar(@RequestBody DestinoCreateDTO request) {
        DestinoReponseDTO response = destinosService.cadastrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DestinoReponseDTO> atualizar(
        @RequestBody DestinoCreateDTO request,
        @PathVariable Long id) {
        DestinoReponseDTO response = destinosService.atualizar(request, id);
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
