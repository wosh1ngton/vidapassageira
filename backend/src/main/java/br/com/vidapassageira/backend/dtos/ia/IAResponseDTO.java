package br.com.vidapassageira.backend.dtos.ia;

import java.util.List;

import lombok.Data;

@Data
public class IAResponseDTO {

    private List<Choice> choices;
    private Usage usage;
    
    @Data
    public static class Choice {
        private Message message;
        private Delta delta;
        
        @Data
        public static class Message {
            private String content;
        }

        @Data
        public static class Delta {
            private String content;
        }
    }

    @Data
    public static class Usage {
        private int prompt_tokens;
        private int completion_tokens;
        private int prompt_cache_hit_tokens;        
        private int total_tokens;
    }
}
