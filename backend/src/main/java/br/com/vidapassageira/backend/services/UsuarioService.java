package br.com.vidapassageira.backend.services;

import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.vidapassageira.backend.dtos.usuario.UsuarioDTO;
import br.com.vidapassageira.backend.models.Usuario;
import br.com.vidapassageira.backend.repositories.UsuarioRepository;

@Service
public class UsuarioService {


    @Autowired
    private UsuarioRepository usuarioRepository;

    public void criarUsuario(String email, String userName, String id, Boolean termsAccepted, Boolean privacyAccepted) {
        if(verificaUsuarioExiste(id)) return;

        Usuario usuario = new Usuario();
        usuario.setEmail(email);
        usuario.setUserName(userName);
        usuario.setKeyCloakId(id);
        usuario.setTermosAceitos(termsAccepted);
        usuario.setPrivacidadeAceita(privacyAccepted);

        // Registra a data do consentimento se ambos foram aceitos
        if (Boolean.TRUE.equals(termsAccepted) && Boolean.TRUE.equals(privacyAccepted)) {
            usuario.setDataConsentimento(LocalDateTime.now());
        }

        usuarioRepository.save(usuario);
    }

    public boolean verificaUsuarioExiste(String sub) {
        var result = usuarioRepository.existsByKeyCloakId(sub);
        return result;
    }

    public List<UsuarioDTO> buscaPorNomeEmail(String nome) {
        var usuarios = usuarioRepository.findByUserNameContainingIgnoreCase(nome);
        List<UsuarioDTO> usuariosEncontrados = new LinkedList<UsuarioDTO>();
        usuarios.forEach(user -> {
            UsuarioDTO usuarioEncontrado = new UsuarioDTO();
            usuarioEncontrado.setId(user.getId());
            usuarioEncontrado.setEmail(user.getEmail());
            usuarioEncontrado.setUsername(user.getUserName());
            usuariosEncontrados.add(usuarioEncontrado);
        });

        return usuariosEncontrados;
    }
}
