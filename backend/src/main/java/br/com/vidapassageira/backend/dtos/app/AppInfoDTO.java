package br.com.vidapassageira.backend.dtos.app;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para informações da aplicação (versão, nome, etc.)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppInfoDTO {

    private String name;
    private String version;
    private String description;

}
