package br.com.vidapassageira.backend.filters;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.github.benmanes.caffeine.cache.Cache;

import br.com.vidapassageira.backend.config.RateLimitConfig;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

/**
 * Filtro de Rate Limiting para proteger endpoints de registro contra ataques automatizados.
 *
 * Aplica rate limiting apenas no endpoint /api/auth/register
 * Limite: 3 tentativas por IP a cada 15 minutos
 */
@Slf4j
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final Cache<String, Bucket> ipBucketCache;
    private final RateLimitConfig rateLimitConfig;

    public RateLimitFilter(Cache<String, Bucket> ipBucketCache, RateLimitConfig rateLimitConfig) {
        this.ipBucketCache = ipBucketCache;
        this.rateLimitConfig = rateLimitConfig;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Aplicar rate limiting apenas no endpoint de registro
        if (!request.getRequestURI().equals("/api/auth/register")) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientIp = getClientIP(request);
        Bucket bucket = ipBucketCache.get(clientIp, key -> rateLimitConfig.createNewBucket());

        if (bucket == null) {
            bucket = rateLimitConfig.createNewBucket();
            ipBucketCache.put(clientIp, bucket);
        }

        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);

        if (probe.isConsumed()) {
            // Request permitido - adicionar headers informativos
            response.addHeader("X-Rate-Limit-Remaining", String.valueOf(probe.getRemainingTokens()));
            filterChain.doFilter(request, response);
        } else {
            // Rate limit excedido
            long waitForRefill = probe.getNanosToWaitForRefill() / 1_000_000_000;

            log.warn("Rate limit exceeded for IP: {} on endpoint: {}", clientIp, request.getRequestURI());

            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.addHeader("X-Rate-Limit-Retry-After-Seconds", String.valueOf(waitForRefill));

            String jsonResponse = String.format(
                "{\"status\": 429, \"message\": \"Muitas tentativas de registro. Tente novamente em %d minutos.\", \"retryAfterSeconds\": %d}",
                waitForRefill / 60,
                waitForRefill
            );

            response.getWriter().write(jsonResponse);
        }
    }

    /**
     * Extrai o IP real do cliente, considerando proxies e load balancers.
     * Verifica os headers X-Forwarded-For, X-Real-IP e Proxy-Client-IP
     *
     * @param request HttpServletRequest
     * @return Endereço IP do cliente
     */
    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader != null && !xfHeader.isEmpty() && !"unknown".equalsIgnoreCase(xfHeader)) {
            // X-Forwarded-For pode conter múltiplos IPs, pegar o primeiro
            return xfHeader.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp;
        }

        String proxyClientIp = request.getHeader("Proxy-Client-IP");
        if (proxyClientIp != null && !proxyClientIp.isEmpty() && !"unknown".equalsIgnoreCase(proxyClientIp)) {
            return proxyClientIp;
        }

        // Fallback para remote address
        return request.getRemoteAddr();
    }
}
