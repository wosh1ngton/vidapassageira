-- Migration V5: Adicionar constraints únicos e índices em usuario
-- Objetivo: Prevenir duplicação de email e username no nível do banco de dados
-- Data: 2026-02-06

-- IMPORTANTE: Se esta migration falhar com erro de duplicate entry,
-- significa que existem emails ou usernames duplicados no banco.
-- Use as queries abaixo para identificar e corrigir manualmente:
--
-- Para encontrar emails duplicados:
-- SELECT NM_EMAIL, COUNT(*) as total FROM usuario GROUP BY NM_EMAIL HAVING COUNT(*) > 1;
--
-- Para encontrar usernames duplicados:
-- SELECT NM_USUARIO, COUNT(*) as total FROM usuario GROUP BY NM_USUARIO HAVING COUNT(*) > 1;

-- Passo 1: Reduzir tamanho das colunas ANTES de adicionar constraints
-- Isso evita problemas com índices muito grandes
-- Username: 50 caracteres (suficiente para a maioria dos casos)
-- Email: 100 caracteres (adequado para endereços de email)
ALTER TABLE `usuario`
MODIFY COLUMN `NM_USUARIO` VARCHAR(50) NOT NULL,
MODIFY COLUMN `NM_EMAIL` VARCHAR(100) NOT NULL;

-- Passo 2: Adicionar constraint único em EMAIL
-- NOTA: Falhará se houver emails duplicados
ALTER TABLE `usuario`
ADD CONSTRAINT `UK_USUARIO_EMAIL` UNIQUE (`NM_EMAIL`);

-- Passo 3: Adicionar constraint único em USERNAME
-- NOTA: Falhará se houver usernames duplicados
ALTER TABLE `usuario`
ADD CONSTRAINT `UK_USUARIO_USERNAME` UNIQUE (`NM_USUARIO`);

-- Passo 4: Adicionar índices para performance em buscas
-- (Os UNIQUE constraints acima já criam índices únicos,
--  mas se precisar de índices adicionais para buscas específicas, adicione aqui)
