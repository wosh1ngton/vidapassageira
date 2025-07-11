package br.com.vidapassageira.backend.resources;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.vidapassageira.backend.dtos.sugestaoIa.SugestaoIaCreateDTO;
import br.com.vidapassageira.backend.dtos.sugestaoIa.SugestaoIaResponseDTO;
import br.com.vidapassageira.backend.services.SugestaoIAService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;





@RestController
@RequestMapping("/api/sugestao-ia")
public class SugestaoIAResource {

    @Autowired
    private SugestaoIAService sugestaoIAService;

    @PostMapping
    public ResponseEntity<SugestaoIaCreateDTO> saveOndeIr(@RequestBody SugestaoIaCreateDTO request) {
        var sugestaoIASaved = this.sugestaoIAService.save(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(sugestaoIASaved);
    }

    @GetMapping("/{viagemId}/{tipoSugestaoId}")
    public ResponseEntity<SugestaoIaResponseDTO> getOpiniao(@PathVariable Long viagemId, @PathVariable Integer tipoSugestaoId) {
        var response = this.sugestaoIAService.getByViagemIdAndTipo(viagemId, tipoSugestaoId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{viagemId}")
    public ResponseEntity<List<SugestaoIaResponseDTO>> getOpiniao(@PathVariable Long viagemId) {
        var response = this.sugestaoIAService.getByViagemId(viagemId);
        return ResponseEntity.ok(response);
    }
    

}
