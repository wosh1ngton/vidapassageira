package br.com.vidapassageira.backend.resources;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;

import br.com.vidapassageira.backend.dtos.exceptions.ErrorResponse;
import br.com.vidapassageira.backend.exceptions.EntityNotFoundException;
import br.com.vidapassageira.backend.exceptions.SugestaoDuplicadaException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
        ErrorResponse error = new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Erro interno no servidor");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
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

    @ExceptionHandler(HttpClientErrorException.class)
    public ResponseEntity<ErrorResponse> handleKeycloakException(HttpClientErrorException ex) {
        String errorMessage = ex.getResponseBodyAsString();
        if (ex.getStatusCode() == HttpStatus.CONFLICT) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ErrorResponse(HttpStatus.CONFLICT.value(), errorMessage));
        }
        return ResponseEntity.status(ex.getStatusCode())
                .body(new ErrorResponse(ex.getRawStatusCode(), errorMessage));
    }

}
