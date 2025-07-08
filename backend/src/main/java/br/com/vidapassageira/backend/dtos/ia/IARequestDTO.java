package br.com.vidapassageira.backend.dtos.ia;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IARequestDTO {
    
    private String model;    
    private List<Message> messages;
    private boolean stream;
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Message {
        private String role;
        private String content;
    }
}
