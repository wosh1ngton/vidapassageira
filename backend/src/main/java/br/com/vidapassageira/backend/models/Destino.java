package br.com.vidapassageira.backend.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "DESTINO")
public class Destino {

    @Id
    @Column(name = "ID_DESTINO", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "NM_DESTINO", nullable = false)
    private String nome;

    @Column(name = "DS_LOCALIZACAO", nullable = false)
    private String localizacao;

    @Column(name = "DS_DESTINO", nullable = true)
    private String descricao;

    @Lob
    @Column(name = "FL_DESTINO", columnDefinition = "LONGBLOB")
    private byte[] imagem;
}
