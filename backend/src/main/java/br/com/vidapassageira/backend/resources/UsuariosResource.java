package br.com.vidapassageira.backend.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.vidapassageira.backend.dtos.usuario.UserRepresentation;
import br.com.vidapassageira.backend.services.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
public class UsuariosResource {

    @Autowired
    private UsuarioService service;

    @PostMapping
    public ResponseEntity<String> criarUsuario(@RequestBody UserRepresentation userRepresentation) {
        service.criarUsuario(userRepresentation.getEmail(), userRepresentation.getUsername(), userRepresentation.getId());
        return ResponseEntity.ok("ok");
    }

    @GetMapping("/verifica-existencia/{sub}")
    public ResponseEntity<Boolean> usuarioExiste(@PathVariable("sub") String sub) {
        var existe = service.verificaUsuarioExiste(sub);
        return ResponseEntity.ok(existe);
    }

}
