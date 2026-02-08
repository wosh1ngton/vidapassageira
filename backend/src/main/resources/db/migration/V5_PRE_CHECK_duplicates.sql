-- Script de verificação PRÉ-MIGRATION V5
-- Execute este script ANTES de rodar a migration V5 para identificar duplicatas
-- Este script NÃO modifica dados, apenas exibe informações

-- ========================================
-- 1. VERIFICAR EMAILS DUPLICADOS
-- ========================================
SELECT
    'EMAILS DUPLICADOS' AS tipo,
    NM_EMAIL AS valor,
    COUNT(*) AS quantidade,
    GROUP_CONCAT(ID_USUARIO ORDER BY ID_USUARIO) AS ids_usuarios
FROM usuario
GROUP BY NM_EMAIL
HAVING COUNT(*) > 1;

-- ========================================
-- 2. VERIFICAR USERNAMES DUPLICADOS
-- ========================================
SELECT
    'USERNAMES DUPLICADOS' AS tipo,
    NM_USUARIO AS valor,
    COUNT(*) AS quantidade,
    GROUP_CONCAT(ID_USUARIO ORDER BY ID_USUARIO) AS ids_usuarios
FROM usuario
GROUP BY NM_USUARIO
HAVING COUNT(*) > 1;

-- ========================================
-- 3. VERIFICAR TAMANHO DAS COLUNAS
-- ========================================
SELECT
    'Usuários com email > 100 caracteres' AS verificacao,
    COUNT(*) AS quantidade
FROM usuario
WHERE LENGTH(NM_EMAIL) > 100;

SELECT
    'Usuários com username > 50 caracteres' AS verificacao,
    COUNT(*) AS quantidade
FROM usuario
WHERE LENGTH(NM_USUARIO) > 50;

-- ========================================
-- INSTRUÇÕES DE CORREÇÃO MANUAL
-- ========================================
--
-- Se houver duplicatas, você precisa decidir como corrigi-las:
--
-- OPÇÃO 1: Manter o usuário mais antigo e atualizar referências
-- 1. Identifique qual ID_USUARIO manter (geralmente o menor ID)
-- 2. Atualize as tabelas relacionadas para apontar para o usuário correto:
--    UPDATE viagem SET ID_USUARIO = <id_manter> WHERE ID_USUARIO = <id_duplicado>;
--    UPDATE viagem_compartilhamento SET ID_USUARIO = <id_manter> WHERE ID_USUARIO = <id_duplicado>;
-- 3. Delete o usuário duplicado:
--    DELETE FROM usuario WHERE ID_USUARIO = <id_duplicado>;
--
-- OPÇÃO 2: Renomear o duplicado
-- UPDATE usuario SET NM_EMAIL = 'novo_email@example.com' WHERE ID_USUARIO = <id_duplicado>;
-- UPDATE usuario SET NM_USUARIO = 'novo_username' WHERE ID_USUARIO = <id_duplicado>;
--
-- OPÇÃO 3: Mesclar dados manualmente (se necessário preservar dados de ambos)
-- Requer análise caso a caso
--
-- ========================================
