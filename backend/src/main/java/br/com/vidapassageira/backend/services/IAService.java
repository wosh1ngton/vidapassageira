package br.com.vidapassageira.backend.services;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.vidapassageira.backend.dtos.ia.IARequestDTO;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class IAService {

    private final WebClient webClient;

    @Value("${deepseek.api.key}")
    private String apiKey;

    private final ObjectMapper objectMapper;

    public IAService(@Qualifier("deepSeekWebClient") WebClient webClient, ObjectMapper objectMapper) {
        this.webClient = webClient;
        this.objectMapper = objectMapper;
    }

    public void streamCompletion(String prompt, SseEmitter emitter) {
        IARequestDTO request = new IARequestDTO(
                "deepseek-chat",
                List.of(new IARequestDTO.Message("user", prompt)),
                true 
        );

        webClient.post()
                .bodyValue(request)
                .retrieve()
                .bodyToFlux(String.class)
                .subscribe(
                        chunk -> {
                            try {

                                if ("[DONE]".equals(chunk.trim())) {
                                    emitter.complete();
                                    return;
                                }

                                String cleanChunk = chunk.startsWith("data:")
                                        ? chunk.substring(5)
                                        : chunk;                                

                                if (!cleanChunk.trim().isEmpty()) {                                    
                                    JsonNode node = objectMapper.readTree(cleanChunk);
                                    JsonNode contentNode = node.path("choices")
                                            .path(0)
                                            .path("delta")
                                            .path("content");

                                    String content = contentNode.isMissingNode()
                                            ? null
                                            : contentNode.asText();

                                    if (content != null) {
                                        String encoded = objectMapper.writeValueAsString(content);
                                        emitter.send(encoded);
                                    }
                                }
                            } catch (Exception e) {
                                log.error("Error processing chunk: {}", chunk, e);
                            }
                        },
                        error -> {
                            log.error("Stream error", error);
                            try {
                                emitter.send("Error in streaming");
                                emitter.completeWithError(error);
                            } catch (IOException ex) {
                                log.error("Failed to send error", ex);
                            }
                        },
                        () -> {
                            try {
                                emitter.complete();
                            } catch (Exception e) {
                                log.error("Failed to complete", e);
                            }
                        });

        emitter.onTimeout(() -> {
            log.warn("Emitter timed out");
            emitter.complete();
        });

        emitter.onCompletion(() -> log.info("Emitter completed"));
    }

}
