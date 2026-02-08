package br.com.vidapassageira.backend.resources;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;

import br.com.vidapassageira.backend.dtos.exceptions.ErrorResponse;
import br.com.vidapassageira.backend.exceptions.EntityNotFoundException;
import br.com.vidapassageira.backend.exceptions.SugestaoDuplicadaException;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
        log.error("Unhandled exception", ex);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse(
                        500,
                        "Erro interno no servidor"));
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleEntityNotFound(EntityNotFoundException ex) {
        ErrorResponse errorResponse = new ErrorResponse(HttpStatus.NOT_FOUND.value(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(SugestaoDuplicadaException.class)
    public ResponseEntity<ErrorResponse> handleSugestaoDuplicada(SugestaoDuplicadaException ex) {
        ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    /**
     * Handler para validações JSR-380 (Bean Validation).
     * Captura erros de validação de entrada (@Valid, @NotBlank, @Email, etc.)
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.toList());

        log.warn("Validation error during registration: {}", errors);

        String errorMessage = String.join("; ", errors);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(400, errorMessage));
    }

    /**
     * Handler para violações de constraints de banco de dados.
     * Principalmente para detectar duplicações de email/username.
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDatabaseConstraintViolation(DataIntegrityViolationException ex) {
        log.warn("Database constraint violation during registration: {}", ex.getMessage());

        String message = ex.getMessage() != null ? ex.getMessage().toLowerCase() : "";

        // Detectar violação de constraint único (email ou username duplicado)
        if (message.contains("uk_usuario_email") || message.contains("uk_usuario_username") ||
            message.contains("duplicate entry") || message.contains("unique")) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ErrorResponse(409, "E-mail ou nome de usuário já cadastrado"));
        }

        // Para outros erros de integridade, retornar mensagem genérica
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse(500, "Erro ao processar cadastro"));
    }

    /**
     * Handler para erros do Keycloak.
     * SANITIZA as mensagens para não expor informações sensíveis.
     */
    @ExceptionHandler(HttpClientErrorException.class)
    public ResponseEntity<ErrorResponse> handleKeycloakException(HttpClientErrorException ex) {
        log.warn("Keycloak error during registration: {} - Status: {}", ex.getMessage(), ex.getStatusCode());

        // NÃO expor mensagem original do Keycloak (pode revelar se usuário existe)
        if (ex.getStatusCode() == HttpStatus.CONFLICT) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ErrorResponse(409, "E-mail ou nome de usuário já cadastrado"));
        }

        // Para outros erros do Keycloak, mensagem genérica
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse(500, "Erro ao processar cadastro. Tente novamente."));
    }

}
