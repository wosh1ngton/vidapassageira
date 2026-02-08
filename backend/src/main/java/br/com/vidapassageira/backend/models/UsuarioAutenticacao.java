package br.com.vidapassageira.backend.models;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO para autenticação e registro de usuários.
 * Inclui validações JSR-380 para prevenir ataques e dados malformados.
 */
@Data
public class UsuarioAutenticacao {

    @NotBlank(message = "Nome de usuário é obrigatório")
    @Size(min = 3, max = 50, message = "Nome de usuário deve ter entre 3 e 50 caracteres")
    @Pattern(regexp = "^[a-zA-Z0-9_-]+$", message = "Nome de usuário deve conter apenas letras, números, _ e -")
    private String username;

    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "E-mail inválido")
    @Size(max = 100, message = "E-mail muito longo")
    private String email;

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 8, max = 100, message = "Senha deve ter entre 8 e 100 caracteres")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
        message = "Senha deve conter: letra maiúscula, letra minúscula, número e caractere especial (@$!%*?&)"
    )
    private String password;

    @NotNull(message = "Aceitação dos termos é obrigatória")
    @AssertTrue(message = "Você deve aceitar os Termos de Uso")
    private Boolean termsAccepted;

    @NotNull(message = "Aceitação da política de privacidade é obrigatória")
    @AssertTrue(message = "Você deve aceitar a Política de Privacidade")
    private Boolean privacyAccepted;
}   
