package br.com.vidapassageira.backend.services;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.vidapassageira.backend.dtos.usuario.UsuarioDTO;
import br.com.vidapassageira.backend.exceptions.EntityNotFoundException;
import br.com.vidapassageira.backend.models.Usuario;
import br.com.vidapassageira.backend.repositories.UsuarioRepository;

@Service
public class UsuarioService {

    private static final Logger log = LoggerFactory.getLogger(UsuarioService.class);

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Cria um novo usuário no banco de dados após registro no Keycloak.
     * Não expõe dados sensíveis nos logs (apenas KeycloakID).
     */
    public void criarUsuario(String email, String userName, String id, Boolean termsAccepted, Boolean privacyAccepted) {
        log.info("Tentativa de criação de usuário - KeycloakID: {}", id);

        // Verificar duplicidade e lançar exception ao invés de silent return
        if(verificaUsuarioExiste(id)) {
            log.warn("Tentativa de criar usuário duplicado - KeycloakID: {}", id);
            throw new EntityNotFoundException("Usuário já existe");
        }

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
        log.info("Usuário criado com sucesso - KeycloakID: {}", id);
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
            log.warn("Usuário não encontrado - KeycloakID: {}", keycloakId);
            throw new EntityNotFoundException("Usuário não encontrado");
        }
        return usuario;
    }

    public void excluirConta(String keycloakId) {
        log.info("Tentativa de exclusão de conta - KeycloakID: {}", keycloakId);
        Usuario usuario = buscarPorKeycloakId(keycloakId);
        // A exclusão em cascade dos dados relacionados (viagens, itinerários, etc.)
        // será feita automaticamente pelo JPA se configurado no modelo
        usuarioRepository.delete(usuario);
        log.info("Conta excluída com sucesso - KeycloakID: {}", keycloakId);
    }

    public Map<String, Object> exportarDados(String keycloakId) {
        log.info("Exportação de dados solicitada - KeycloakID: {}", keycloakId);
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
