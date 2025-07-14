package br.com.vidapassageira.backend.models.enums;

import java.util.Arrays;
import java.util.Optional;

public enum TipoSugestaoEnum {
    ONDE_FICAR(1, "ONDE_FICAR"),
    COMO_CHEGAR(2, "COMO_CHEGAR"),
    ONDE_IR(3, "ONDE_IR"),
    ONDE_COMER(4, "ONDE_COMER");

    private final int id;
    private final String nome;

    TipoSugestaoEnum(int id, String nome) {
        this.id = id;
        this.nome = nome;
    }

     public int getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public static Optional<TipoSugestaoEnum> fromId(int id) {
        return Arrays.stream(values())
                .filter(e -> e.id == id)
                .findFirst();
    }

    public static Optional<TipoSugestaoEnum> fromNome(String nome) {
        return Arrays.stream(values())
                .filter(e -> e.nome.equalsIgnoreCase(nome))
                .findFirst();
    }
}
