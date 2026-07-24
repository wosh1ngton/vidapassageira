package br.com.vidapassageira.backend.services;

import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Iterator;

import javax.imageio.ImageIO;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

/**
 * Obtem uma imagem representativa para um destino. Tenta buscar uma foto real na
 * Wikipedia (sem chave de API) e, se nao encontrar, gera um placeholder no tema
 * da aplicacao. Sempre retorna um JPEG valido.
 */
@Slf4j
@Service
public class ImagemDestinoService {

    private static final int LARGURA = 800;
    private static final int ALTURA = 500;
    private static final Color COR_FUNDO = new Color(0x81, 0x9d, 0x6a); // --cor-primaria (sage green)

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public ImagemDestinoService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .followRedirects(HttpClient.Redirect.NORMAL)
                .build();
    }

    public byte[] obterImagem(String nome, String localizacao) {
        byte[] imagem = buscarNaWikipedia(nome);
        if (imagem == null && localizacao != null && !localizacao.isBlank()) {
            imagem = buscarNaWikipedia(localizacao);
        }
        if (imagem == null) {
            imagem = gerarPlaceholder(nome);
        }
        return imagem;
    }

    private byte[] buscarNaWikipedia(String titulo) {
        if (titulo == null || titulo.isBlank()) {
            return null;
        }
        try {
            String encoded = URLEncoder.encode(titulo, StandardCharsets.UTF_8);
            String url = "https://pt.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages"
                    + "&piprop=thumbnail&pithumbsize=" + LARGURA + "&redirects=1&titles=" + encoded;

            HttpRequest request = HttpRequest.newBuilder(URI.create(url))
                    .timeout(Duration.ofSeconds(6))
                    .header("User-Agent", "VidaPassageira/1.0 (sugestao de destino)")
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) {
                return null;
            }

            JsonNode pages = objectMapper.readTree(response.body()).path("query").path("pages");
            for (JsonNode page : pages) {
                String source = page.path("thumbnail").path("source").asText(null);
                if (source != null && !source.isBlank()) {
                    return baixarComoJpeg(source);
                }
            }
        } catch (Exception e) {
            log.warn("Falha ao buscar imagem na Wikipedia para '{}': {}", titulo, e.getMessage());
        }
        return null;
    }

    private byte[] baixarComoJpeg(String urlImagem) {
        try {
            HttpRequest request = HttpRequest.newBuilder(URI.create(urlImagem))
                    .timeout(Duration.ofSeconds(8))
                    .header("User-Agent", "VidaPassageira/1.0 (sugestao de destino)")
                    .GET()
                    .build();

            HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());
            if (response.statusCode() != 200) {
                return null;
            }

            // Normaliza para JPEG (a aplicacao exibe as imagens como data:image/jpeg).
            BufferedImage original = ImageIO.read(new ByteArrayInputStream(response.body()));
            if (original == null) {
                return null;
            }
            BufferedImage rgb = new BufferedImage(original.getWidth(), original.getHeight(),
                    BufferedImage.TYPE_INT_RGB);
            Graphics2D g = rgb.createGraphics();
            g.drawImage(original, 0, 0, Color.WHITE, null);
            g.dispose();

            return paraJpeg(rgb);
        } catch (Exception e) {
            log.warn("Falha ao baixar imagem '{}': {}", urlImagem, e.getMessage());
            return null;
        }
    }

    private byte[] gerarPlaceholder(String nome) {
        BufferedImage img = new BufferedImage(LARGURA, ALTURA, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = img.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

        g.setColor(COR_FUNDO);
        g.fillRect(0, 0, LARGURA, ALTURA);

        // Icone simples (marcador) desenhado com formas para nao depender de assets.
        g.setColor(new Color(255, 255, 255, 60));
        g.fillOval(LARGURA / 2 - 90, 70, 180, 180);

        g.setColor(Color.WHITE);
        String texto = (nome == null || nome.isBlank()) ? "Destino" : nome.trim();
        Font fonte = new Font("SansSerif", Font.BOLD, 48);
        g.setFont(fonte);
        FontMetrics fm = g.getFontMetrics();

        // Trunca o texto se nao couber na largura disponivel.
        int larguraMax = LARGURA - 80;
        while (fm.stringWidth(texto) > larguraMax && texto.length() > 4) {
            texto = texto.substring(0, texto.length() - 2);
        }
        if (fm.stringWidth((nome == null ? "" : nome.trim())) > larguraMax) {
            texto = texto + "…";
        }

        int x = (LARGURA - fm.stringWidth(texto)) / 2;
        int y = 340;
        g.drawString(texto, x, y);

        g.setFont(new Font("SansSerif", Font.PLAIN, 22));
        FontMetrics fm2 = g.getFontMetrics();
        String legenda = "VidaPassageira";
        g.drawString(legenda, (LARGURA - fm2.stringWidth(legenda)) / 2, 400);

        g.dispose();
        return paraJpeg(img);
    }

    private byte[] paraJpeg(BufferedImage img) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            boolean ok = ImageIO.write(img, "jpg", baos);
            if (!ok) {
                Iterator<?> it = ImageIO.getImageWritersByFormatName("jpeg");
                if (!it.hasNext()) {
                    return new byte[0];
                }
            }
            return baos.toByteArray();
        } catch (Exception e) {
            log.error("Falha ao codificar imagem em JPEG", e);
            return new byte[0];
        }
    }
}
