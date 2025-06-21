package br.com.vidapassageira.backend.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.vidapassageira.backend.models.Usuario;
import br.com.vidapassageira.backend.services.KeycloakUserService;

@RestController
@RequestMapping("/api")
public class AuthResource {

    @Autowired
    private KeycloakUserService keycloakUserService;

    
    @GetMapping("/auth/register2")
    public String auth() {
        return "oi";
    }

     @GetMapping("/secure")
    public void secure() {
        System.out.println("teste");
    }

    @PostMapping("/auth/register")
    public ResponseEntity<Void> registrar(@RequestBody Usuario usuario) {
        this.keycloakUserService.createUser(usuario.getUsername(), usuario.getEmail(), usuario.getPassword());        
        return ResponseEntity.ok().build();
    }


}
