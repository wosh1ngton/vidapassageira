package br.com.vidapassageira.backend.models;

import java.time.LocalDate;

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
@Table(name = "VIAGEM")
public class Viagem {

    @Id
    @Column(name = "ID_VIAGEM") 
    @GeneratedValue(strategy = GenerationType.IDENTITY)   
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ID_DESTINO")
    private Destino destino;

    @Column(name = "DT_IDA")
    private LocalDate dataIda;

    @Column(name = "DT_VOLTA")
    private LocalDate dataVolta;
}
