-- Migration V4: Adiciona campos de consentimento LGPD na tabela usuario
-- Data: 2026-02-06
-- Descrição: Campos para rastreamento de aceitação de termos e política de privacidade

ALTER TABLE `usuario`
ADD COLUMN `FG_TERMOS_ACEITOS` bit(1) DEFAULT b'0' COMMENT 'Flag indicando aceitação dos Termos de Uso',
ADD COLUMN `FG_PRIVACIDADE_ACEITA` bit(1) DEFAULT b'0' COMMENT 'Flag indicando aceitação da Política de Privacidade',
ADD COLUMN `DT_CONSENTIMENTO` datetime DEFAULT NULL COMMENT 'Data e hora do consentimento inicial';

-- Índice para consultas por data de consentimento
CREATE INDEX `IDX_USUARIO_DT_CONSENTIMENTO` ON `usuario` (`DT_CONSENTIMENTO`);
