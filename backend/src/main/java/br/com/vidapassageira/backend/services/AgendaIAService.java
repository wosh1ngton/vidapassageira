package br.com.vidapassageira.backend.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import br.com.vidapassageira.backend.models.Usuario;
import br.com.vidapassageira.backend.models.Viagem;
import br.com.vidapassageira.backend.repositories.UsuarioRepository;
import br.com.vidapassageira.backend.repositories.ViagemRepository;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class AgendaIAService {

    private final IAService iaService;
    private final ViagemRepository viagemRepository;
    private final UsuarioRepository usuarioRepository;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    // Limite de viagens do historico injetadas no prompt, para nao estourar o contexto.
    private static final int LIMITE_HISTORICO = 15;

    public AgendaIAService(IAService iaService, ViagemRepository viagemRepository,
            UsuarioRepository usuarioRepository) {
        this.iaService = iaService;
        this.viagemRepository = viagemRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public void streamSugestaoViagem(LocalDate inicio, LocalDate fim, BigDecimal orcamento,
            String keycloakId, SseEmitter emitter) {
        long dias = ChronoUnit.DAYS.between(inicio, fim);
        String historico = montarHistorico(keycloakId);
        String prompt = buildPrompt(inicio, fim, dias, orcamento, historico);
        iaService.streamCompletion(prompt, emitter);
    }

    /**
     * Monta um resumo dos destinos que o usuario ja visitou/planejou, usado para
     * personalizar as sugestoes (evitar repeticao e inferir preferencias).
     */
    private String montarHistorico(String keycloakId) {
        Usuario usuario = usuarioRepository.findByKeyCloakId(keycloakId);
        if (usuario == null) {
            return "";
        }

        List<Viagem> viagens = viagemRepository.findAllByUsuario_Id(usuario.getId());
        if (viagens == null || viagens.isEmpty()) {
            return "";
        }

        return viagens.stream()
                .filter(v -> v.getDestino() != null)
                .limit(LIMITE_HISTORICO)
                .map(v -> {
                    String nome = v.getDestino().getNome();
                    String local = v.getDestino().getLocalizacao();
                    if (local != null && !local.isBlank()) {
                        return "- " + nome + " (" + local + ")";
                    }
                    return "- " + nome;
                })
                .collect(Collectors.joining("\n"));
    }

    private String buildPrompt(LocalDate inicio, LocalDate fim, long dias, BigDecimal orcamento, String historico) {
        StringBuilder prompt = new StringBuilder();

        prompt.append(String.format(
                "Você é um consultor de viagens especialista. O usuário tem %d dias livres " +
                "entre %s e %s. Sugira 3 destinos de viagem considerando:\n\n" +
                "1. **Época do ano e clima** — analise o período e sugira destinos com bom clima\n" +
                "2. **Duração ideal** — destinos viáveis para %d dias (sem perder tempo demais com deslocamento)\n",
                dias, inicio.format(FORMATTER), fim.format(FORMATTER), dias));

        if (orcamento != null && orcamento.signum() > 0) {
            prompt.append(String.format(
                    "3. **Orçamento disponível** — o usuário tem cerca de R$ %s por pessoa (hospedagem + " +
                    "transporte + alimentação). Sugira destinos que caibam nesse orçamento e deixe claro " +
                    "como a estimativa se encaixa nesse valor.\n\n",
                    orcamento.toPlainString()));
        } else {
            prompt.append(
                    "3. **Variedade de orçamento** — um destino econômico, um moderado e um premium\n\n");
        }

        if (historico != null && !historico.isBlank()) {
            prompt.append(
                    "O usuário já viajou/planejou para os seguintes destinos. Use esse histórico para " +
                    "inferir o perfil e as preferências dele e **NÃO repita esses destinos** — sugira " +
                    "lugares novos que combinem com esse gosto (ou proponha algo complementar, ex.: se só " +
                    "há praias, considere serra/cidade histórica):\n")
                  .append(historico)
                  .append("\n\n");
        }

        prompt.append(
                "Para cada destino, forneça:\n" +
                "- **Nome do destino** e localização\n" +
                "- **Por que visitar** nessa época\n" +
                "- **Atividade imperdível** — a experiência mais marcante\n" +
                "- **Estimativa de orçamento** por pessoa (hospedagem + transporte + alimentação)\n" +
                "- **Dica especial** do consultor\n\n" +
                "Priorize destinos no Brasil, mas inclua opções internacionais se forem viáveis para o período. " +
                "Responda em português brasileiro de forma envolvente e inspiradora.\n\n" +
                "IMPORTANTE: No final da sua resposta, inclua um bloco com os destinos exatamente neste formato " +
                "(substitua pelos nomes e localizações reais dos destinos sugeridos):\n" +
                "[DESTINOS_JSON]\n" +
                "[{\"nome\":\"Nome do Destino 1\",\"localizacao\":\"Cidade, Estado/País\"},{\"nome\":\"Nome do Destino 2\",\"localizacao\":\"Cidade, Estado/País\"},{\"nome\":\"Nome do Destino 3\",\"localizacao\":\"Cidade, Estado/País\"}]\n" +
                "[/DESTINOS_JSON]");

        return prompt.toString();
    }
}
