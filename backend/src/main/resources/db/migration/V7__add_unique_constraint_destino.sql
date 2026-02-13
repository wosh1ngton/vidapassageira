-- V7__add_unique_constraint_destino.sql
-- Adiciona constraint UNIQUE no nome do destino para evitar duplicidade

ALTER TABLE destino ADD CONSTRAINT UK_DESTINO_NOME UNIQUE (NM_DESTINO);
