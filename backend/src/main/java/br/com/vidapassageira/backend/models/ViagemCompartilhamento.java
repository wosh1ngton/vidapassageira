package br.com.vidapassageira.backend.models;

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
@Table(name= "viagem_compartilhamento")
public class ViagemCompartilhamento {

    @Id
    @Column(name= "ID_VIAGEM_COMPARTILHAMENTO")
    @GeneratedValue(strategy = GenerationType.IDENTITY)  
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ID_VIAGEM")
    private Viagem viagem;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ID_USUARIO")
    private Usuario usuario;
    
}
