package br.com.vidapassageira.backend.config;

import java.time.Duration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;

/**
 * Configuração de Rate Limiting usando Bucket4j com cache Caffeine.
 *
 * Estratégia:
 * - 7 tentativas de registro por IP a cada 15 minutos
 * - Cache expira após 30 minutos de inatividade
 */
@Configuration
public class RateLimitConfig {

    /**
     * Cache Caffeine para armazenar buckets por IP.
     * Expira após 30 minutos de inatividade.
     */
    @Bean
    public Cache<String, Bucket> ipBucketCache() {
        return Caffeine.newBuilder()
                .expireAfterAccess(Duration.ofMinutes(30))
                .maximumSize(100_000)
                .build();
    }

    /**
     * Cria um bucket para rate limiting com as seguintes regras:
     * - Capacidade: 7 tokens
     * - Refill: 7 tokens a cada 15 minutos
     *
     * Isso permite no máximo 7 tentativas de registro a cada 15 minutos por IP.
     * Limite aumentado para acomodar erros na criação de senha complexa.
     *
     * @return Bucket configurado com as regras de rate limiting
     */
    public Bucket createNewBucket() {
        Bandwidth limit = Bandwidth.builder()
                .capacity(7)
                .refillIntervally(7, Duration.ofMinutes(15))
                .build();

        return Bucket.builder()
                .addLimit(limit)
                .build();
    }
}
