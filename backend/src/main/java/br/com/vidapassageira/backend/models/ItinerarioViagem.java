package br.com.vidapassageira.backend.models;

import java.time.LocalDateTime;

import javax.print.DocFlavor.STRING;

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
@Table(name = "ITINERARIO_VIAGEM")
public class ItinerarioViagem {
    
    @Id
    @Column(name = "ID_ITINERARIO_VIAGEM")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "NM_PASSEIO")
    private String nome;

    @Column(name = "DS_PASSEIO")
    private String descricao;

    @Column(name = "QT_ORCAMENTO")
    private Double orcamento;

    @Column(name = "NR_DURACAO")
    private Double duracaoHoras;

    @Column(name = "NM_CATEGORIA")
    private String categoria;

    @Column(name = "DS_MELHOR_HORARIO")
    private String melhorHorario; 
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ID_VIAGEM")
    private Viagem viagem;

}
