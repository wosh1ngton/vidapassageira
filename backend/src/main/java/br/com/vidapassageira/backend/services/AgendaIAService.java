package br.com.vidapassageira.backend.services;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class AgendaIAService {

    private final IAService iaService;
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public AgendaIAService(IAService iaService) {
        this.iaService = iaService;
    }

    public void streamSugestaoViagem(LocalDate inicio, LocalDate fim, SseEmitter emitter) {
        long dias = ChronoUnit.DAYS.between(inicio, fim);
        String prompt = buildPrompt(inicio, fim, dias);
        iaService.streamCompletion(prompt, emitter);
    }

    private String buildPrompt(LocalDate inicio, LocalDate fim, long dias) {
        return String.format(
                "Você é um consultor de viagens especialista. O usuário tem %d dias livres " +
                "entre %s e %s. Sugira 3 destinos de viagem considerando:\n\n" +
                "1. **Época do ano e clima** — analise o período e sugira destinos com bom clima\n" +
                "2. **Duração ideal** — destinos viáveis para %d dias (sem perder tempo demais com deslocamento)\n" +
                "3. **Variedade de orçamento** — um destino econômico, um moderado e um premium\n\n" +
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
                "[/DESTINOS_JSON]",
                dias, inicio.format(FORMATTER), fim.format(FORMATTER), dias);
    }
}
