package br.com.vidapassageira.backend.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.vidapassageira.backend.models.UsuarioAutenticacao;
import br.com.vidapassageira.backend.services.KeycloakUserService;
import br.com.vidapassageira.backend.services.UsuarioService;

@RestController
@RequestMapping("/api")
public class AuthResource {

    @Autowired
    private KeycloakUserService keycloakUserService;

    @Autowired
    private UsuarioService usuarioService;   
 
    

    @PostMapping("/auth/register")
    public ResponseEntity<Void> registrar(@RequestBody UsuarioAutenticacao usuario) {
        // Registro público - sem validação de token
        String keycloakId  = this.keycloakUserService.createUser(usuario.getUsername(), usuario.getEmail(), usuario.getPassword());
        this.usuarioService.criarUsuario(usuario.getEmail(), usuario.getUsername(), keycloakId);
        return ResponseEntity.ok().build();
    }


}
