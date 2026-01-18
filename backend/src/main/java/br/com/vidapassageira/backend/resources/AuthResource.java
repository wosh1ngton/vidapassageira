package br.com.vidapassageira.backend.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import br.com.vidapassageira.backend.models.UsuarioAutenticacao;
import br.com.vidapassageira.backend.services.KeycloakUserService;
import br.com.vidapassageira.backend.services.UsuarioService;

@RestController
@RequestMapping("/api")
public class AuthResource {

    @Value("${api.tokenCadastroUsuario}")
    private String tokenCadastroUsuario;

    @Autowired
    private KeycloakUserService keycloakUserService;

    @Autowired
    private UsuarioService usuarioService;
    
    @GetMapping("/auth/register2")
    public String auth() {
        return "oi";
    }

     @GetMapping("/secure")
    public void secure() {
        System.out.println("teste");
    }

    

    @PostMapping("/auth/register")
    public ResponseEntity<Void> registrar(@RequestBody UsuarioAutenticacao usuario, 
        @RequestHeader("X-REGISTER-TOKEN") String token) {
        if(!tokenCadastroUsuario.equals(token)) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Token de cadastro inválido"
            );
        }
        String keycloakId  = this.keycloakUserService.createUser(usuario.getUsername(), usuario.getEmail(), usuario.getPassword());                
        this.usuarioService.criarUsuario(usuario.getEmail(), usuario.getUsername(), keycloakId);
        return ResponseEntity.ok().build();
    }


}
