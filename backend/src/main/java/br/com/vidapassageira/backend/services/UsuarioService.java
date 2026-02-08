package br.com.vidapassageira.backend.services;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

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

    public Usuario buscarPorKeycloakId(String keycloakId) {
        Usuario usuario = usuarioRepository.findByKeyCloakId(keycloakId);
        if (usuario == null) {
            throw new RuntimeException("Usuário não encontrado");
        }
        return usuario;
    }

    public void excluirConta(String keycloakId) {
        Usuario usuario = buscarPorKeycloakId(keycloakId);
        // A exclusão em cascade dos dados relacionados (viagens, itinerários, etc.)
        // será feita automaticamente pelo JPA se configurado no modelo
        usuarioRepository.delete(usuario);
    }

    public Map<String, Object> exportarDados(String keycloakId) {
        Usuario usuario = buscarPorKeycloakId(keycloakId);

        Map<String, Object> dados = new HashMap<>();

        // Dados de cadastro
        Map<String, Object> cadastro = new HashMap<>();
        cadastro.put("id", usuario.getId());
        cadastro.put("username", usuario.getUserName());
        cadastro.put("email", usuario.getEmail());
        cadastro.put("keycloakId", usuario.getKeyCloakId());
        cadastro.put("termosAceitos", usuario.getTermosAceitos());
        cadastro.put("privacidadeAceita", usuario.getPrivacidadeAceita());
        cadastro.put("dataConsentimento", usuario.getDataConsentimento());
        dados.put("cadastro", cadastro);

        // Informações sobre direitos LGPD
        Map<String, String> lgpd = new HashMap<>();
        lgpd.put("dataExportacao", LocalDateTime.now().toString());
        lgpd.put("formato", "JSON");
        lgpd.put("observacao", "Dados exportados em conformidade com a LGPD (Lei 13.709/2018)");
        dados.put("lgpd", lgpd);

        return dados;
    }
}
