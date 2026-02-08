package br.com.vidapassageira.backend.resources;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.vidapassageira.backend.dtos.app.AppInfoDTO;

/**
 * Controller REST para expor informações da aplicação.
 * Endpoint público (não requer autenticação).
 */
@RestController
@RequestMapping("/api/app")
public class AppInfoResource {

    @Value("${spring.application.name:VidaPassageira}")
    private String appName;

    @Value("${app.version:1.0.0}")
    private String appVersion;

    @Value("${app.description:Plataforma de Planejamento de Viagens}")
    private String appDescription;

    /**
     * GET /api/app/info
     * Retorna informações da aplicação (versão, nome, descrição).
     * Endpoint público - não requer autenticação.
     *
     * @return AppInfoDTO com informações da aplicação
     */
    @GetMapping("/info")
    public ResponseEntity<AppInfoDTO> getAppInfo() {
        AppInfoDTO appInfo = new AppInfoDTO(appName, appVersion, appDescription);
        return ResponseEntity.ok(appInfo);
    }

}
