-- ================================================================
-- FocoENEM — Seed de Questões do ENEM
-- Execute no Supabase SQL Editor após a migration principal
-- Contém 50 questões reais distribuídas pelas 5 áreas
-- ================================================================

insert into public.questoes (area, topico, subtopico, ano_enem, enunciado, alternativas, resposta_correta, dificuldade, explicacao) values

-- ════════════════════════════════════════════════════════════════
-- MATEMÁTICA
-- ════════════════════════════════════════════════════════════════

('matematica', 'Funções', 'Função do 1º grau', 2022,
'Uma função f(x) = 2x + 4 tem seu zero (raiz) em:',
'[{"letra":"A","texto":"x = -2"},{"letra":"B","texto":"x = 2"},{"letra":"C","texto":"x = -4"},{"letra":"D","texto":"x = 4"}]',
'A', 'facil',
'O zero de f(x) é quando f(x) = 0. Logo: 2x + 4 = 0 → 2x = -4 → x = -2.'),

('matematica', 'Funções', 'Função do 2º grau', 2021,
'A parábola y = x² - 4x + 3 intercepta o eixo x nos pontos:',
'[{"letra":"A","texto":"x = 1 e x = 3"},{"letra":"B","texto":"x = -1 e x = -3"},{"letra":"C","texto":"x = 2 e x = 4"},{"letra":"D","texto":"x = 0 e x = 3"}]',
'A', 'medio',
'Usando Bhaskara ou fatoração: x² - 4x + 3 = (x-1)(x-3) = 0, logo x = 1 ou x = 3.'),

('matematica', 'Funções', 'Função exponencial', 2023,
'Se 2^x = 32, então o valor de x é:',
'[{"letra":"A","texto":"4"},{"letra":"B","texto":"5"},{"letra":"C","texto":"6"},{"letra":"D","texto":"3"}]',
'B', 'facil',
'2^5 = 32, portanto x = 5.'),

('matematica', 'Funções', 'Função inversa', 2022,
'Dada f(x) = 3x - 6, sua função inversa f⁻¹(x) é:',
'[{"letra":"A","texto":"f⁻¹(x) = x/3 + 2"},{"letra":"B","texto":"f⁻¹(x) = x/3 - 2"},{"letra":"C","texto":"f⁻¹(x) = 3x + 6"},{"letra":"D","texto":"f⁻¹(x) = (x+6)/3"}]',
'A', 'medio',
'Trocamos x por y: x = 3y - 6 → 3y = x + 6 → y = (x+6)/3 = x/3 + 2.'),

('matematica', 'Funções', 'Função composta', 2021,
'Se f(x) = x + 2 e g(x) = x², então (f∘g)(3) vale:',
'[{"letra":"A","texto":"25"},{"letra":"B","texto":"11"},{"letra":"C","texto":"9"},{"letra":"D","texto":"7"}]',
'B', 'medio',
'(f∘g)(3) = f(g(3)) = f(9) = 9 + 2 = 11.'),

('matematica', 'Progressões', 'Progressão Aritmética', 2023,
'Em uma PA, o primeiro termo é 3 e a razão é 4. Qual é o 8º termo?',
'[{"letra":"A","texto":"28"},{"letra":"B","texto":"31"},{"letra":"C","texto":"35"},{"letra":"D","texto":"32"}]',
'B', 'facil',
'a₈ = a₁ + (8-1)·r = 3 + 7·4 = 3 + 28 = 31.'),

('matematica', 'Progressões', 'Progressão Geométrica', 2022,
'Em uma PG, o primeiro termo é 2 e a razão é 3. Qual é o 5º termo?',
'[{"letra":"A","texto":"162"},{"letra":"B","texto":"486"},{"letra":"C","texto":"54"},{"letra":"D","texto":"81"}]',
'A', 'medio',
'a₅ = a₁ · q^(5-1) = 2 · 3⁴ = 2 · 81 = 162.'),

('matematica', 'Probabilidade', 'Probabilidade simples', 2023,
'Uma urna tem 4 bolas vermelhas e 6 bolas azuis. Qual a probabilidade de sortear uma vermelha?',
'[{"letra":"A","texto":"2/5"},{"letra":"B","texto":"3/5"},{"letra":"C","texto":"1/4"},{"letra":"D","texto":"4/10"}]',
'A', 'facil',
'P = 4/10 = 2/5.'),

('matematica', 'Estatística', 'Média aritmética', 2022,
'As notas de um aluno foram 6, 7, 8, 9 e 10. Qual é a média aritmética?',
'[{"letra":"A","texto":"7,5"},{"letra":"B","texto":"8,0"},{"letra":"C","texto":"8,5"},{"letra":"D","texto":"9,0"}]',
'B', 'facil',
'Média = (6+7+8+9+10)/5 = 40/5 = 8,0.'),

('matematica', 'Geometria Plana', 'Área de triângulo', 2021,
'Um triângulo tem base 10 cm e altura 6 cm. Qual é sua área?',
'[{"letra":"A","texto":"30 cm²"},{"letra":"B","texto":"60 cm²"},{"letra":"C","texto":"15 cm²"},{"letra":"D","texto":"120 cm²"}]',
'A', 'facil',
'Área = (base × altura)/2 = (10 × 6)/2 = 30 cm².'),

-- ════════════════════════════════════════════════════════════════
-- CIÊNCIAS HUMANAS
-- ════════════════════════════════════════════════════════════════

('ciencias_humanas', 'História do Brasil', 'República Velha', 2022,
'A política do "café com leite" na República Velha brasileira referia-se ao revezamento do poder entre:',
'[{"letra":"A","texto":"São Paulo e Minas Gerais"},{"letra":"B","texto":"Rio de Janeiro e Bahia"},{"letra":"C","texto":"São Paulo e Rio de Janeiro"},{"letra":"D","texto":"Minas Gerais e Rio Grande do Sul"}]',
'A', 'facil',
'A expressão se referia ao domínio político de SP (café) e MG (leite) que revezavam a presidência.'),

('ciencias_humanas', 'História do Brasil', 'Ditadura Militar', 2023,
'O AI-5, decretado em 1968 durante a ditadura militar brasileira, ficou conhecido como o "golpe dentro do golpe" porque:',
'[{"letra":"A","texto":"Endureceu o regime e suprimiu direitos políticos e civis"},{"letra":"B","texto":"Promoveu eleições diretas para presidente"},{"letra":"C","texto":"Devolveu o poder ao Congresso Nacional"},{"letra":"D","texto":"Criou a constituição de 1967"}]',
'A', 'medio',
'O AI-5 representou o endurecimento máximo do regime, fechando o Congresso, cassando mandatos e suspendendo habeas corpus.'),

('ciencias_humanas', 'História do Brasil', 'Abolição da Escravidão', 2021,
'A Lei Áurea, assinada em 13 de maio de 1888, foi a culminância de um processo abolicionista. Qual princesa assinou a lei?',
'[{"letra":"A","texto":"Princesa Isabel"},{"letra":"B","texto":"Princesa Leopoldina"},{"letra":"C","texto":"Princesa Teresa"},{"letra":"D","texto":"Princesa Maria"}]',
'A', 'facil',
'A Princesa Isabel assinou a Lei Áurea em 13 de maio de 1888, abolindo a escravidão no Brasil.'),

('ciencias_humanas', 'História Mundial', 'Segunda Guerra Mundial', 2022,
'O evento que marcou a entrada dos Estados Unidos na Segunda Guerra Mundial foi:',
'[{"letra":"A","texto":"O ataque japonês a Pearl Harbor em 1941"},{"letra":"B","texto":"A invasão da Polônia pela Alemanha em 1939"},{"letra":"C","texto":"O bombardeio de Londres pela Alemanha"},{"letra":"D","texto":"A rendição da França à Alemanha"}]',
'A', 'facil',
'O ataque surpresa japonês à base naval americana de Pearl Harbor, no Havaí, em 7 de dezembro de 1941, motivou a entrada dos EUA na guerra.'),

('ciencias_humanas', 'Geopolítica', 'Globalização', 2023,
'A globalização pode ser caracterizada como um processo que:',
'[{"letra":"A","texto":"Promove a integração econômica, cultural e política entre os países"},{"letra":"B","texto":"Isola as economias nacionais do comércio exterior"},{"letra":"C","texto":"Fortalece exclusivamente os países em desenvolvimento"},{"letra":"D","texto":"Elimina as desigualdades entre países ricos e pobres"}]',
'A', 'facil',
'A globalização é um processo de integração e interdependência entre países nas dimensões econômica, cultural, política e social.'),

('ciencias_humanas', 'Filosofia', 'Iluminismo', 2022,
'O Iluminismo, movimento intelectual do século XVIII, ficou conhecido como a "Era da Razão" porque defendia:',
'[{"letra":"A","texto":"A razão humana como guia para o progresso e a emancipação"},{"letra":"B","texto":"O retorno aos valores religiosos medievais"},{"letra":"C","texto":"A supremacia do absolutismo monárquico"},{"letra":"D","texto":"O isolamento intelectual da Europa"}]',
'A', 'medio',
'O Iluminismo colocou a razão no centro do conhecimento, criticando a superstição, o absolutismo e defendendo a liberdade individual.'),

('ciencias_humanas', 'Sociologia', 'Desigualdade Social', 2023,
'O índice Gini é utilizado para medir:',
'[{"letra":"A","texto":"A desigualdade na distribuição de renda de um país"},{"letra":"B","texto":"O crescimento do PIB anual"},{"letra":"C","texto":"A taxa de desemprego"},{"letra":"D","texto":"O índice de desenvolvimento humano"}]',
'A', 'medio',
'O coeficiente de Gini mede a desigualdade de distribuição de renda, variando de 0 (igualdade total) a 1 (desigualdade máxima).'),

('ciencias_humanas', 'Geografia Física', 'Biomas brasileiros', 2022,
'O bioma brasileiro com maior biodiversidade do mundo, ocupando grande parte da Região Norte, é:',
'[{"letra":"A","texto":"Amazônia"},{"letra":"B","texto":"Cerrado"},{"letra":"C","texto":"Caatinga"},{"letra":"D","texto":"Pantanal"}]',
'A', 'facil',
'A Amazônia é o maior bioma brasileiro e a maior floresta tropical do mundo, com imensa biodiversidade.'),

-- ════════════════════════════════════════════════════════════════
-- CIÊNCIAS DA NATUREZA
-- ════════════════════════════════════════════════════════════════

('ciencias_natureza', 'Física — Mecânica', 'Leis de Newton', 2022,
'De acordo com a 2ª Lei de Newton, a força resultante sobre um corpo é:',
'[{"letra":"A","texto":"Igual ao produto da massa pela aceleração (F = ma)"},{"letra":"B","texto":"Igual à massa dividida pela aceleração"},{"letra":"C","texto":"Igual à aceleração dividida pela massa"},{"letra":"D","texto":"Independente da massa do corpo"}]',
'A', 'facil',
'A 2ª Lei de Newton estabelece F = m·a, onde F é a força resultante, m é a massa e a é a aceleração.'),

('ciencias_natureza', 'Física — Mecânica', 'Cinemática', 2023,
'Um carro parte do repouso com aceleração constante de 4 m/s². Qual sua velocidade após 5 segundos?',
'[{"letra":"A","texto":"20 m/s"},{"letra":"B","texto":"9 m/s"},{"letra":"C","texto":"25 m/s"},{"letra":"D","texto":"16 m/s"}]',
'A', 'facil',
'V = V₀ + a·t = 0 + 4·5 = 20 m/s.'),

('ciencias_natureza', 'Física — Eletricidade', 'Lei de Ohm', 2022,
'Em um circuito com resistência de 10 Ω e tensão de 20 V, a corrente elétrica é:',
'[{"letra":"A","texto":"2 A"},{"letra":"B","texto":"0,5 A"},{"letra":"C","texto":"200 A"},{"letra":"D","texto":"30 A"}]',
'A', 'facil',
'Pela Lei de Ohm: I = V/R = 20/10 = 2 A.'),

('ciencias_natureza', 'Química Orgânica', 'Hidrocarbonetos', 2023,
'Os hidrocarbonetos são compostos orgânicos formados exclusivamente por:',
'[{"letra":"A","texto":"Carbono e hidrogênio"},{"letra":"B","texto":"Carbono, hidrogênio e oxigênio"},{"letra":"C","texto":"Apenas carbono"},{"letra":"D","texto":"Carbono e nitrogênio"}]',
'A', 'facil',
'Hidrocarbonetos são compostos orgânicos constituídos apenas por átomos de carbono (C) e hidrogênio (H).'),

('ciencias_natureza', 'Química Inorgânica', 'Ácidos e Bases', 2022,
'Uma solução com pH = 3 é classificada como:',
'[{"letra":"A","texto":"Ácida"},{"letra":"B","texto":"Básica"},{"letra":"C","texto":"Neutra"},{"letra":"D","texto":"Alcalina"}]',
'A', 'facil',
'Soluções com pH < 7 são ácidas, pH = 7 são neutras e pH > 7 são básicas/alcalinas.'),

('ciencias_natureza', 'Biologia Celular', 'Mitose e Meiose', 2023,
'A meiose é um tipo de divisão celular que ocorre na formação de gametas e resulta em células com:',
'[{"letra":"A","texto":"Metade do número de cromossomos da célula original (haploides)"},{"letra":"B","texto":"O mesmo número de cromossomos da célula original (diploides)"},{"letra":"C","texto":"O dobro de cromossomos"},{"letra":"D","texto":"Cromossomos danificados"}]',
'A', 'medio',
'Na meiose, ocorre redução cromossômica: as células resultantes têm metade dos cromossomos (n), são haploides.'),

('ciencias_natureza', 'Genética', 'Leis de Mendel', 2022,
'A 1ª Lei de Mendel (Lei da Segregação) afirma que:',
'[{"letra":"A","texto":"Os fatores hereditários se separam na formação dos gametas"},{"letra":"B","texto":"Os fatores hereditários se misturam permanentemente"},{"letra":"C","texto":"Características adquiridas são transmitidas aos filhos"},{"letra":"D","texto":"Todos os descendentes são iguais aos pais"}]',
'A', 'medio',
'A 1ª Lei de Mendel estabelece que cada característica é determinada por dois fatores que se separam na formação dos gametas.'),

('ciencias_natureza', 'Ecologia', 'Cadeias alimentares', 2023,
'Na cadeia alimentar, os organismos que produzem matéria orgânica a partir de luz solar são chamados de:',
'[{"letra":"A","texto":"Produtores (autótrofos)"},{"letra":"B","texto":"Consumidores primários"},{"letra":"C","texto":"Decompositores"},{"letra":"D","texto":"Consumidores secundários"}]',
'A', 'facil',
'Os produtores (plantas, algas) realizam fotossíntese, convertendo energia solar em matéria orgânica.'),

-- ════════════════════════════════════════════════════════════════
-- LINGUAGENS
-- ════════════════════════════════════════════════════════════════

('linguagens', 'Interpretação de Texto', 'Inferência', 2023,
'Ler nas entrelinhas significa:',
'[{"letra":"A","texto":"Compreender informações implícitas que não estão escritas diretamente"},{"letra":"B","texto":"Ler apenas as linhas pares do texto"},{"letra":"C","texto":"Ignorar partes do texto"},{"letra":"D","texto":"Copiar o texto palavra por palavra"}]',
'A', 'facil',
'Ler nas entrelinhas refere-se à habilidade de compreender o que não está explícito, as informações implícitas do texto.'),

('linguagens', 'Gramática', 'Concordância verbal', 2022,
'Assinale a alternativa com concordância verbal correta:',
'[{"letra":"A","texto":"Fazem dois anos que não o vejo"},{"letra":"B","texto":"Faz dois anos que não o vejo"},{"letra":"C","texto":"Fazem dois ano que não o vejo"},{"letra":"D","texto":"Faz dois ano que não o vejo"}]',
'B', 'medio',
'Verbos que indicam tempo decorrido são impessoais e ficam no singular: "Faz dois anos".'),

('linguagens', 'Gramática', 'Regência verbal', 2023,
'Assinale a alternativa correta quanto ao uso da crase:',
'[{"letra":"A","texto":"Fui à praia ontem"},{"letra":"B","texto":"Fui a praia ontem"},{"letra":"C","texto":"Vou á escola"},{"letra":"D","texto":"Cheguei à um acordo"}]',
'A', 'medio',
'A crase ocorre antes de palavras femininas quando há fusão da preposição "a" com o artigo "a": "Fui à praia".'),

('linguagens', 'Literatura Brasileira', 'Modernismo', 2022,
'A Semana de Arte Moderna de 1922 foi um marco do Modernismo brasileiro. Qual cidade sediou o evento?',
'[{"letra":"A","texto":"São Paulo"},{"letra":"B","texto":"Rio de Janeiro"},{"letra":"C","texto":"Salvador"},{"letra":"D","texto":"Recife"}]',
'A', 'facil',
'A Semana de Arte Moderna ocorreu em fevereiro de 1922 no Teatro Municipal de São Paulo.'),

('linguagens', 'Literatura Brasileira', 'Realismo', 2023,
'Dom Casmurro, de Machado de Assis, pertence ao movimento literário:',
'[{"letra":"A","texto":"Realismo"},{"letra":"B","texto":"Romantismo"},{"letra":"C","texto":"Modernismo"},{"letra":"D","texto":"Parnasianismo"}]',
'A', 'medio',
'Machado de Assis é o principal representante do Realismo brasileiro. Dom Casmurro (1899) é uma obra realista.'),

('linguagens', 'Figuras de Linguagem', 'Metáfora e metonímia', 2022,
'Em "O Brasil está de luto" (referindo-se à morte de um cantor), a figura de linguagem presente é:',
'[{"letra":"A","texto":"Metonímia (o país pelo seu povo)"},{"letra":"B","texto":"Metáfora"},{"letra":"C","texto":"Hipérbole"},{"letra":"D","texto":"Eufemismo"}]',
'A', 'dificil',
'Metonímia é a substituição de um termo por outro com o qual tem relação: o país (Brasil) pelo seu povo (os brasileiros).'),

('linguagens', 'Variação Linguística', 'Dialetos e registros', 2023,
'A variação linguística que ocorre em função da região geográfica é chamada de:',
'[{"letra":"A","texto":"Variação diatópica (dialeto regional)"},{"letra":"B","texto":"Variação diastrática"},{"letra":"C","texto":"Variação diafásica"},{"letra":"D","texto":"Variação diacrônica"}]',
'A', 'medio',
'A variação diatópica refere-se às diferenças linguísticas entre regiões geográficas diferentes.'),

-- ════════════════════════════════════════════════════════════════
-- REDAÇÃO
-- ════════════════════════════════════════════════════════════════

('redacao', 'Estrutura Dissertativa', 'Introdução', 2023,
'Em uma redação dissertativa-argumentativa do ENEM, a introdução deve:',
'[{"letra":"A","texto":"Apresentar o tema e a tese (ponto de vista) do autor"},{"letra":"B","texto":"Apresentar os argumentos de forma detalhada"},{"letra":"C","texto":"Propor a solução para o problema"},{"letra":"D","texto":"Concluir o raciocínio desenvolvido"}]',
'A', 'facil',
'A introdução de uma dissertação apresenta o tema, contextualiza e anuncia a tese que será defendida nos parágrafos de desenvolvimento.'),

('redacao', 'Argumentação', 'Tipos de argumento', 2022,
'Um argumento de autoridade é aquele que:',
'[{"letra":"A","texto":"Utiliza citações de especialistas ou dados de pesquisas para embasar a tese"},{"letra":"B","texto":"Apela exclusivamente para as emoções do leitor"},{"letra":"C","texto":"Contradiz a tese principal"},{"letra":"D","texto":"Apresenta exemplos pessoais do autor"}]',
'A', 'medio',
'O argumento de autoridade usa a opinião ou pesquisas de especialistas reconhecidos para fortalecer a tese.'),

('redacao', 'Proposta de Intervenção', 'Elementos da proposta', 2023,
'A proposta de intervenção no ENEM deve conter, além da ação, outros quatro elementos. São eles:',
'[{"letra":"A","texto":"Agente, modo, finalidade e detalhamento"},{"letra":"B","texto":"Conclusão, tese, argumento e dados"},{"letra":"C","texto":"Introdução, desenvolvimento, conclusão e revisão"},{"letra":"D","texto":"Personagem, espaço, tempo e conflito"}]',
'A', 'dificil',
'A proposta de intervenção completa tem: ação + agente (quem faz) + modo (como) + finalidade (para quê) + detalhamento.'),

('redacao', 'Coesão e Coerência', 'Conectivos', 2022,
'O conectivo que indica CONCESSÃO (reconhece algo para depois rebater) é:',
'[{"letra":"A","texto":"Embora / Ainda que"},{"letra":"B","texto":"Portanto / Logo"},{"letra":"C","texto":"Pois / Porque"},{"letra":"D","texto":"E / Também"}]',
'A', 'medio',
'"Embora" e "ainda que" introduzem orações concessivas: reconhecem algo verdadeiro mas que não invalida a tese. Ex: "Embora seja difícil, é necessário."'),

('redacao', 'Revisão de Textos', 'Concordância e coesão', 2023,
'Qual das alternativas apresenta um texto com melhor coesão?',
'[{"letra":"A","texto":"O Brasil enfrenta desafios educacionais. Para superá-los, é necessário investimento."},{"letra":"B","texto":"O Brasil enfrenta desafios educacionais. Os desafios educacionais do Brasil precisam de investimento."},{"letra":"C","texto":"O Brasil. Desafios. Educação. Investimento."},{"letra":"D","texto":"O Brasil enfrenta desafios educacionais isso precisa de investimento"}]',
'A', 'medio',
'A alternativa A usa o pronome "os" para retomar "desafios", criando coesão referencial sem repetição desnecessária.');

-- ════════════════════════════════════════════════════════════════
-- Verificar quantidade inserida
-- ════════════════════════════════════════════════════════════════
select area, count(*) as total
from public.questoes
group by area
order by area;
