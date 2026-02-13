-- V6__seed_destinos.sql
-- Seed de destinos populares ao redor do mundo, com foco no Brasil
-- Imagens (FL_DESTINO) ficam NULL - podem ser adicionadas via interface

-- =============================================
-- BRASIL
-- =============================================

INSERT INTO destino (NM_DESTINO, DS_LOCALIZACAO, DS_DESTINO) VALUES
('Rio de Janeiro', 'Rio de Janeiro, RJ - Brasil', 'Cidade Maravilhosa, famosa pelo Cristo Redentor, Pão de Açúcar, praias de Copacabana e Ipanema, e pelo Carnaval. Combina belezas naturais com vida urbana vibrante.'),
('São Paulo', 'São Paulo, SP - Brasil', 'Maior metrópole da América do Sul, conhecida pela gastronomia diversificada, vida cultural intensa, museus, parques e uma vida noturna agitada.'),
('Salvador', 'Salvador, BA - Brasil', 'Primeira capital do Brasil, rica em história e cultura afro-brasileira. O Pelourinho, praias tropicais e a culinária baiana são destaques imperdíveis.'),
('Florianópolis', 'Florianópolis, SC - Brasil', 'Ilha da Magia com mais de 40 praias, dunas, lagoas e trilhas. Destino perfeito para surfistas, famílias e amantes da natureza.'),
('Foz do Iguaçu', 'Foz do Iguaçu, PR - Brasil', 'Lar das Cataratas do Iguaçu, uma das Sete Maravilhas Naturais do Mundo. Também abriga a Usina de Itaipu e a tríplice fronteira.'),
('Gramado', 'Gramado, RS - Brasil', 'Charmosa cidade serrana com arquitetura europeia, chocolaterias, fondue e o famoso Natal Luz. Clima frio e aconchegante durante o inverno.'),
('Recife', 'Recife, PE - Brasil', 'Veneza brasileira, com rios, pontes e uma rica cena cultural. Marco Zero, Recife Antigo e a proximidade com Olinda e Porto de Galinhas são atrativos.'),
('Fortaleza', 'Fortaleza, CE - Brasil', 'Capital do sol, com praias paradisíacas como Praia do Futuro e Canoa Quebrada. Porta de entrada para o litoral cearense e a Rota das Falésias.'),
('Manaus', 'Manaus, AM - Brasil', 'Portal da Amazônia, onde o Rio Negro encontra o Solimões. Teatro Amazonas, passeios de barco pela floresta e ecoturismo único no mundo.'),
('Brasília', 'Brasília, DF - Brasil', 'Capital federal projetada por Oscar Niemeyer e Lúcio Costa. Patrimônio Mundial da UNESCO com arquitetura modernista impressionante.'),
('Curitiba', 'Curitiba, PR - Brasil', 'Capital ecológica do Brasil, com parques urbanos, Jardim Botânico icônico, e excelente qualidade de vida. Porta de entrada para o passeio de trem pela Serra do Mar.'),
('Natal', 'Natal, RN - Brasil', 'Cidade do Sol com dunas, praias de águas mornas e passeios de buggy. Genipabu, Pipa e Maracajaú são paradas obrigatórias.'),
('Maceió', 'Maceió, AL - Brasil', 'Capital alagoana com piscinas naturais de águas cristalinas e tons de verde esmeralda. Praia do Francês e Maragogi são destinos imperdíveis.'),
('Fernando de Noronha', 'Fernando de Noronha, PE - Brasil', 'Arquipélago paradisíaco com águas transparentes, vida marinha abundante e praias consideradas entre as mais bonitas do mundo.'),
('Ouro Preto', 'Ouro Preto, MG - Brasil', 'Cidade histórica do ciclo do ouro com igrejas barrocas, casarões coloniais e ladeiras de pedra. Patrimônio Mundial da UNESCO.'),
('Chapada Diamantina', 'Lençóis, BA - Brasil', 'Parque Nacional com cachoeiras, grutas, morros e trilhas espetaculares. Destino ideal para aventureiros e amantes do trekking.'),
('Lençóis Maranhenses', 'Barreirinhas, MA - Brasil', 'Deserto de dunas brancas com lagoas de água doce cristalina entre maio e setembro. Paisagem surreal e única no planeta.'),
('Jericoacoara', 'Jijoca de Jericoacoara, CE - Brasil', 'Vila de pescadores transformada em destino paradisíaco. Dunas, lagoas, kitesurf e pôr do sol na Duna do Pôr do Sol.'),
('Paraty', 'Paraty, RJ - Brasil', 'Centro histórico colonial preservado, cercado por ilhas, cachoeiras e Mata Atlântica. Patrimônio Mundial misto da UNESCO.'),
('Campos do Jordão', 'Campos do Jordão, SP - Brasil', 'Suíça brasileira na Serra da Mantiqueira. Clima frio, fondue, cervejarias artesanais e o famoso Festival de Inverno.'),
('Porto de Galinhas', 'Ipojuca, PE - Brasil', 'Praia com piscinas naturais formadas por recifes de coral, águas mornas e cristalinas. Eleita várias vezes a melhor praia do Brasil.'),
('Alter do Chão', 'Santarém, PA - Brasil', 'Caribe amazônico com praias de água doce, floresta e cultura ribeirinha. A Ilha do Amor é o cartão-postal.'),
('Chapada dos Veadeiros', 'Alto Paraíso de Goiás, GO - Brasil', 'Parque Nacional com cachoeiras, formações rochosas milenares e céu estrelado. Destino místico e de ecoturismo no cerrado.'),
('Arraial do Cabo', 'Arraial do Cabo, RJ - Brasil', 'Caribe brasileiro com águas azul-turquesa, mergulho e praias selvagens. Prainhas do Pontal do Atalaia é um cenário de cartão postal.'),

-- =============================================
-- AMÉRICA DO SUL
-- =============================================

('Buenos Aires', 'Buenos Aires - Argentina', 'Capital argentina com tango, arquitetura europeia, culinária de primeira e vida cultural intensa. La Boca, Recoleta e San Telmo encantam visitantes.'),
('Cusco', 'Cusco - Peru', 'Antiga capital do Império Inca e porta de entrada para Machu Picchu. Riqueza histórica, ruínas e cultura andina preservada.'),
('Machu Picchu', 'Aguas Calientes - Peru', 'Cidadela inca no topo dos Andes, uma das Sete Maravilhas do Mundo Moderno. Paisagem deslumbrante e história milenar.'),
('Cartagena', 'Cartagena - Colômbia', 'Cidade murada colonial com ruas coloridas, praias caribenhas e gastronomia vibrante. Patrimônio Mundial da UNESCO.'),
('Santiago', 'Santiago - Chile', 'Capital chilena cercada pela Cordilheira dos Andes. Vinícolas, gastronomia, cultura e proximidade com estações de esqui.'),
('Bariloche', 'San Carlos de Bariloche - Argentina', 'Patagônia argentina com lagos, montanhas nevadas, chocolaterias e esportes de inverno. Paisagens alpinas na América do Sul.'),
('Deserto do Atacama', 'San Pedro de Atacama - Chile', 'Deserto mais árido do mundo com gêiseres, salares, vales lunares e céu estrelado perfeito para astronomia.'),

-- =============================================
-- AMÉRICA DO NORTE E CENTRAL
-- =============================================

('Nova York', 'Nova York, NY - Estados Unidos', 'A cidade que nunca dorme. Times Square, Central Park, Estátua da Liberdade, Broadway e uma infinidade de museus e restaurantes.'),
('Cancún', 'Cancún - México', 'Paraíso caribenho com praias de areia branca, ruínas maias, cenotes e resorts all-inclusive. Vida noturna agitada.'),
('Orlando', 'Orlando, FL - Estados Unidos', 'Capital mundial dos parques temáticos com Walt Disney World, Universal Studios e SeaWorld. Destino ideal para famílias.'),
('Cidade do México', 'Cidade do México - México', 'Megalópole rica em história asteca e colonial, museus de classe mundial, gastronomia patrimônio da UNESCO e cultura vibrante.'),
('San Francisco', 'San Francisco, CA - Estados Unidos', 'Cidade icônica com Golden Gate Bridge, Alcatraz, bondinhos e a diversidade cultural do bairro de Castro e Chinatown.'),
('Havana', 'Havana - Cuba', 'Capital cubana com carros clássicos, arquitetura colonial colorida, música ao vivo e o charme único de Habana Vieja.'),

-- =============================================
-- EUROPA
-- =============================================

('Paris', 'Paris - França', 'Cidade Luz com Torre Eiffel, Louvre, Notre-Dame e gastronomia refinada. Capital mundial da moda, arte e romance.'),
('Roma', 'Roma - Itália', 'Cidade Eterna com Coliseu, Vaticano, Fontana di Trevi e ruínas imperiais. Berço da civilização ocidental e da culinária italiana.'),
('Barcelona', 'Barcelona - Espanha', 'Capital catalã com obras de Gaudí, praias mediterrâneas, Las Ramblas e uma gastronomia entre as melhores do mundo.'),
('Londres', 'Londres - Inglaterra', 'Metrópole global com Big Ben, Palácio de Buckingham, museus gratuitos de classe mundial e pubs tradicionais.'),
('Amsterdã', 'Amsterdã - Países Baixos', 'Cidade dos canais, bicicletas e museus como Van Gogh e Anne Frank. Arquitetura charmosa e ambiente cosmopolita.'),
('Lisboa', 'Lisboa - Portugal', 'Capital portuguesa com bondinhos, pastéis de Belém, fado e bairros históricos como Alfama. Charme europeu com preços acessíveis.'),
('Porto', 'Porto - Portugal', 'Cidade do vinho do Porto com Ribeira, Livraria Lello e pontes sobre o Douro. Patrimônio Mundial com gastronomia incrível.'),
('Praga', 'Praga - República Tcheca', 'Cidade das Cem Torres com castelo medieval, Ponte Carlos e cerveja artesanal. Uma das cidades mais bonitas da Europa Central.'),
('Santorini', 'Santorini - Grécia', 'Ilha grega com casinhas brancas e cúpulas azuis, pôr do sol em Oia, praias vulcânicas e vinhos locais.'),
('Istambul', 'Istambul - Turquia', 'Cidade entre dois continentes com Santa Sofia, Mesquita Azul, Grand Bazaar e culinária turca. Encontro de Oriente e Ocidente.'),

-- =============================================
-- ÁSIA
-- =============================================

('Tóquio', 'Tóquio - Japão', 'Megalópole que mistura tradição e ultramodernidade. Templos, tecnologia, culinária japonesa autêntica e cultura pop vibrante.'),
('Bangkok', 'Bangkok - Tailândia', 'Capital tailandesa com templos dourados, mercados flutuantes, street food premiada e vida noturna agitada.'),
('Bali', 'Bali - Indonésia', 'Ilha dos Deuses com templos hindus, terraços de arroz, praias de surfe e retiros de yoga. Espiritualidade e natureza exuberante.'),
('Singapura', 'Singapura', 'Cidade-estado futurista com Gardens by the Bay, Marina Bay Sands, gastronomia multicultural e limpeza impecável.'),
('Kyoto', 'Kyoto - Japão', 'Antiga capital imperial com milhares de templos, jardins zen, gueixas e cerimônia do chá. Japão tradicional preservado.'),
('Hanói', 'Hanói - Vietnã', 'Capital vietnamita com Old Quarter caótico e encantador, comida de rua incrível, lagos serenos e história milenar.'),

-- =============================================
-- OCEANIA
-- =============================================

('Sydney', 'Sydney - Austrália', 'Cidade icônica com Opera House, Harbour Bridge, praias de surfe como Bondi e estilo de vida ao ar livre.'),
('Queenstown', 'Queenstown - Nova Zelândia', 'Capital mundial da aventura com bungee jumping, esqui, trilhas e paisagens de tirar o fôlego às margens do Lago Wakatipu.'),

-- =============================================
-- ÁFRICA E ORIENTE MÉDIO
-- =============================================

('Cidade do Cabo', 'Cidade do Cabo - África do Sul', 'Cidade entre montanhas e oceano com Table Mountain, vinícolas, pinguins em Boulders Beach e diversidade cultural.'),
('Marrakech', 'Marrakech - Marrocos', 'Cidade imperial com medina labiríntica, souks coloridos, Jardim Majorelle e a icônica praça Jemaa el-Fna.'),
('Dubai', 'Dubai - Emirados Árabes', 'Cidade futurista com Burj Khalifa, ilhas artificiais, shopping centers gigantes e experiências de luxo no deserto.');
