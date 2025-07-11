package br.com.vidapassageira.backend.models;

import org.hibernate.annotations.Fetch;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "SUGESTAO_IA")
public class SugestaoIA {

    @Id
    @Column(name = "ID_SUGESTAO_IA", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  

    @Column(name = "DS_SUGESTAO_IA")
    private String sugestao;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ID_TIPO_SUGESTAO_IA")
    private TipoSugestaoIA tipoSugestaoIA;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ID_VIAGEM")
    private Viagem viagem;


}
