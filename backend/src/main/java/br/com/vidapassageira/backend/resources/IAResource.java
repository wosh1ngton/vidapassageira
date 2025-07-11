package br.com.vidapassageira.backend.resources;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import br.com.vidapassageira.backend.dtos.viagem.ViagemResponseDTO;
import br.com.vidapassageira.backend.services.IAService;
import br.com.vidapassageira.backend.services.ViagensService;

@RestController
@RequestMapping("/api/planejamento-ia")
public class IAResource {

    private final IAService iaservice;
    private final ViagensService viagensService;

    public IAResource(IAService iaservice, ViagensService viagensService) {
        this.iaservice = iaservice;
        this.viagensService = viagensService;
    }   

    @GetMapping(value = "/onde-ir-async", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter ondIrAsync(@RequestParam Long destino) {
        SseEmitter emitter = new SseEmitter(60_000L);
        ViagemResponseDTO viagemDto = this.viagensService.buscarPorId(destino);

        String questaoCompleta = "O que fazer em " + viagemDto.getDestino().getLocalizacao() + "?";

        iaservice.streamCompletion(questaoCompleta, emitter);
        return emitter;
    }

    @GetMapping(value = "/onde-ficar-async", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter ondFicarAsync(@RequestParam Long destino) {
        SseEmitter emitter = new SseEmitter(60_000L);
        ViagemResponseDTO viagemDto = this.viagensService.buscarPorId(destino);

        String questaoCompleta = "Me dê as melhores localizações para hospedagem em " + viagemDto.getDestino().getLocalizacao() + "?";

        iaservice.streamCompletion(questaoCompleta, emitter);
        return emitter;
    }

    @GetMapping(value = "/como-chegar-async", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter comoChegarAsync(@RequestParam Long destino) {
        SseEmitter emitter = new SseEmitter(60_000L);
        ViagemResponseDTO viagemDto = this.viagensService.buscarPorId(destino);

        String questaoCompleta = "Me dê sugestões de melhor meio de transporte para chegar em " + viagemDto.getDestino().getLocalizacao() + ", considere custo-benefício e tempo de viagem";

        iaservice.streamCompletion(questaoCompleta, emitter);
        return emitter;
    }

}
