package br.com.vidapassageira.backend.resources;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import br.com.vidapassageira.backend.dtos.viagem.ViagemResponseDTO;
import br.com.vidapassageira.backend.models.enums.TipoSugestaoEnum;
import br.com.vidapassageira.backend.services.IAService;
import br.com.vidapassageira.backend.services.SugestaoIAService;
import br.com.vidapassageira.backend.services.ViagensService;

@RestController
@RequestMapping("/api/planejamento-ia")
public class IAResource {

    private final IAService iaservice;
    private final ViagensService viagensService;
    private final SugestaoIAService sugestaoIAService;

    public IAResource(IAService iaservice, ViagensService viagensService, SugestaoIAService sugestaoIAService) {
        this.iaservice = iaservice;
        this.viagensService = viagensService;
        this.sugestaoIAService = sugestaoIAService;
    }       

    @GetMapping(value = "/gerar-async", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter gerarSugestao(
        @RequestParam Long destino,
        @RequestParam TipoSugestaoEnum tipo
        ) {
        SseEmitter emitter = new SseEmitter(60_000L);
        ViagemResponseDTO viagemDto = this.viagensService.buscarPorId(destino);     
        
        String prompt = sugestaoIAService.gerarPrompt(tipo, viagemDto);
        iaservice.streamCompletion(prompt, emitter);
        return emitter;
    }

}
