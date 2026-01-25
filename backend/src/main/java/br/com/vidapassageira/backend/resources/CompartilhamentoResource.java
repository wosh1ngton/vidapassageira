package br.com.vidapassageira.backend.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.vidapassageira.backend.dtos.compartilhamento.ViagemCompartilhamentoDTO;
import br.com.vidapassageira.backend.services.CompartilhamentoService;

@RestController
@RequestMapping("/api/compartilhamento")
public class CompartilhamentoResource {
    
    @Autowired
    private CompartilhamentoService service;

    @PostMapping
    public ResponseEntity<ViagemCompartilhamentoDTO> compartilharViagem(@RequestBody  ViagemCompartilhamentoDTO dto) {
        return ResponseEntity.ok(service.compartilhar(dto));
    }
}
