-- Remove a integracao com Google Calendar.
-- A feature foi descontinuada para garantir isolamento total entre
-- dados obtidos via APIs do Google e o servico de IA de terceiros (DeepSeek),
-- conforme a Limited Use do Google API Services User Data Policy.
-- As tabelas armazenavam tokens OAuth do Google (dados do usuario Google) e
-- por isso sao removidas tambem por boa pratica de privacidade.

DROP TABLE IF EXISTS `google_calendar_selecao`;
DROP TABLE IF EXISTS `google_calendar_token`;
