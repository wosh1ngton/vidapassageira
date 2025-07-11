package br.com.vidapassageira.backend.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "TIPO_SUGESTAO_IA")
public class TipoSugestaoIA {

    @Id
    @Column(name = "ID_TIPO_SUGESTAO_IA")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "NM_TIPO_SUGESTAO_IA")
    private String tipoSugestao;

}
