package br.com.vidapassageira.backend.models.enums;

import java.util.Arrays;

public enum TipoSugestaoEnum {
    ONDE_FICAR(1),
    COMO_CHEGAR(2),
    ONDE_IR(3),
    ONDE_COMER(4);

   private final int id;

    TipoSugestaoEnum(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public static TipoSugestaoEnum fromId(int id) {
        return Arrays.stream(values())
            .filter(e -> e.id == id)
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Invalid ID: " + id));
    }
}

