-- ================================================================
-- CONTEÚDO — CIÊNCIAS HUMANAS, NATUREZA, LINGUAGENS, REDAÇÃO
-- ================================================================

insert into public.aulas (area, topico, subtopico, ordem, titulo, duracao_estimada_min, slides) values

-- ════════════════════════════════════════════════════════════════
-- CIÊNCIAS HUMANAS
-- ════════════════════════════════════════════════════════════════

('ciencias_humanas', 'História do Brasil', 'República Velha', 1, 'República Velha (1889–1930)', 25, '[
  {
    "tipo": "capa",
    "titulo": "República Velha (1889–1930)",
    "corpo": "<p>O período da história do Brasil que vai da Proclamação da República até a Revolução de 1930.</p>",
    "dica": "Muito cobrado no ENEM — foque em coronelismo, café com leite e movimentos sociais"
  },
  {
    "tipo": "conteudo",
    "titulo": "Proclamação da República",
    "corpo": "<p>Em <strong>15 de novembro de 1889</strong>, o Marechal Deodoro da Fonseca proclamou a República no Brasil, encerrando o período monárquico.</p><ul><li>Dom Pedro II foi exilado em Portugal</li><li>Brasil se tornou uma República Federativa</li><li>Os militares assumiram o poder inicialmente</li></ul>"
  },
  {
    "tipo": "conteudo",
    "titulo": "Política do Café com Leite",
    "corpo": "<p>Acordo entre as oligarquias de <strong>São Paulo</strong> (café) e <strong>Minas Gerais</strong> (leite) para revezar a presidência.</p><p><strong>Como funcionava:</strong></p><ul><li>Eleições eram controladas pelos coronéis locais</li><li>Fraudes eleitorais eram comuns (<em>voto de cabresto</em>)</li><li>As demais regiões do Brasil eram marginalizadas</li></ul>",
    "dica": "Coronelismo = domínio político dos grandes proprietários rurais sobre a população local"
  },
  {
    "tipo": "conteudo",
    "titulo": "Movimentos sociais da República Velha",
    "corpo": "<table style=width:100%><tr><th>Movimento</th><th>Período</th><th>Local</th></tr><tr><td><strong>Canudos</strong></td><td>1893-1897</td><td>Bahia</td></tr><tr><td><strong>Contestado</strong></td><td>1912-1916</td><td>PR/SC</td></tr><tr><td><strong>Cangaço</strong></td><td>1870-1940</td><td>Nordeste</td></tr><tr><td><strong>Revolta da Chibata</strong></td><td>1910</td><td>Rio de Janeiro</td></tr></table>"
  },
  {
    "tipo": "exercicio",
    "titulo": "Questão ENEM",
    "exercicio": {
      "enunciado": "O coronelismo, prática política característica da República Velha, consistia em:",
      "alternativas": [
        {"letra": "A", "texto": "Domínio político de grandes proprietários rurais que controlavam eleições e populações locais"},
        {"letra": "B", "texto": "Sistema de governo militar que controlava as cidades"},
        {"letra": "C", "texto": "Movimento de trabalhadores urbanos contra os industriais"},
        {"letra": "D", "texto": "Aliança entre militares e a Igreja Católica"}
      ],
      "resposta": "A",
      "explicacao": "O coronelismo era o poder exercido pelos grandes fazendeiros (coronéis) sobre a população rural, controlando votos e favores em troca de proteção."
    }
  },
  {
    "tipo": "resumo",
    "titulo": "Resumo — República Velha",
    "corpo": "<ul><li>1889-1930: primeiro período republicano</li><li><strong>Política do café com leite</strong>: SP e MG revezam a presidência</li><li><strong>Coronelismo</strong>: controle político local por fazendeiros</li><li>Movimentos sociais: Canudos, Contestado, Cangaço</li><li>Fim: Revolução de 1930 — Getúlio Vargas sobe ao poder</li></ul>"
  }
]'),

('ciencias_humanas', 'História do Brasil', 'Ditadura Militar', 2, 'Ditadura Militar (1964–1985)', 30, '[
  {
    "tipo": "capa",
    "titulo": "Ditadura Militar Brasileira",
    "corpo": "<p>Período de 1964 a 1985 em que militares governaram o Brasil, suprimindo direitos políticos e civis.</p>",
    "dica": "Tema recorrente no ENEM — foque nos Atos Institucionais, AI-5 e redemocratização"
  },
  {
    "tipo": "conteudo",
    "titulo": "O Golpe de 1964",
    "corpo": "<p>Em <strong>31 de março de 1964</strong>, militares depuseram o presidente João Goulart (Jango), que propunha as <em>Reformas de Base</em>.</p><p><strong>Principais justificativas dos militares:</strong></p><ul><li>Risco de avanço comunista</li><li>Instabilidade econômica</li><li>Apoio dos EUA ao golpe (Guerra Fria)</li></ul>"
  },
  {
    "tipo": "conteudo",
    "titulo": "Atos Institucionais — AI-5",
    "corpo": "<p>Os Atos Institucionais eram decretos que modificavam a constituição sem aprovação do Congresso.</p><p><strong>AI-5 (1968)</strong> — o mais severo:</p><ul><li>Fechamento do Congresso Nacional</li><li>Cassação de mandatos</li><li>Suspensão do habeas corpus</li><li>Censura à imprensa e às artes</li><li>Proibição de manifestações políticas</li></ul>",
    "dica": "O AI-5 é chamado de golpe dentro do golpe — endurecimento máximo do regime"
  },
  {
    "tipo": "conteudo",
    "titulo": "Abertura e Redemocratização",
    "corpo": "<p><strong>1974</strong>: General Geisel inicia abertura política <em>lenta, gradual e segura</em>.</p><p><strong>Principais marcos da redemocratização:</strong></p><ul><li>1979 — Lei da Anistia: exilados retornam</li><li>1984 — Diretas Já: movimento popular por eleições diretas</li><li>1985 — Tancredo Neves (civil) eleito indiretamente</li><li>1988 — Nova Constituição (<em>Constituição Cidadã</em>)</li></ul>"
  },
  {
    "tipo": "exercicio",
    "titulo": "Questão ENEM",
    "exercicio": {
      "enunciado": "O movimento Diretas Já (1983-1984) foi uma mobilização popular que reivindicava:",
      "alternativas": [
        {"letra": "A", "texto": "Eleições diretas para presidente da República"},
        {"letra": "B", "texto": "O retorno dos militares ao poder"},
        {"letra": "C", "texto": "A aprovação do AI-5"},
        {"letra": "D", "texto": "A criação de novos partidos políticos"}
      ],
      "resposta": "A",
      "explicacao": "O movimento Diretas Já reuniu milhões de brasileiros pedindo eleições diretas para presidente, direito que havia sido suprimido durante a ditadura."
    }
  },
  {
    "tipo": "resumo",
    "titulo": "Resumo — Ditadura Militar",
    "corpo": "<ul><li>1964: golpe militar derruba João Goulart</li><li>AI-5 (1968): endurecimento máximo do regime</li><li>Resistência: guerrilha, arte, movimentos estudantis</li><li>Abertura: lenta, gradual e segura (Geisel, 1974)</li><li>1985: fim da ditadura — Nova República</li><li>1988: Constituição Cidadã</li></ul>"
  }
]'),

('ciencias_humanas', 'Geopolítica', 'Globalização', 1, 'Globalização e Geopolítica Mundial', 20, '[
  {
    "tipo": "capa",
    "titulo": "Globalização",
    "corpo": "<p>Processo de integração econômica, cultural e política entre os países do mundo.</p>",
    "dica": "Relacione globalização com desigualdades, fluxos migratórios e conflitos culturais para o ENEM"
  },
  {
    "tipo": "conteudo",
    "titulo": "O que é globalização?",
    "corpo": "<p>A globalização acelerou-se após a <strong>Guerra Fria (1991)</strong> com:</p><ul><li>Queda das barreiras comerciais</li><li>Avanço das tecnologias de comunicação (internet)</li><li>Expansão das multinacionais</li><li>Blocos econômicos (União Europeia, Mercosul)</li></ul>"
  },
  {
    "tipo": "conteudo",
    "titulo": "Impactos da Globalização",
    "corpo": "<p><strong>Positivos:</strong></p><ul><li>Troca de conhecimentos e culturas</li><li>Crescimento econômico de países emergentes</li><li>Acesso a tecnologias</li></ul><p><strong>Negativos:</strong></p><ul><li>Aumento das desigualdades entre países ricos e pobres</li><li>Homogeneização cultural (perda de identidades locais)</li><li>Vulnerabilidade a crises financeiras globais</li></ul>"
  },
  {
    "tipo": "exercicio",
    "titulo": "Questão ENEM",
    "exercicio": {
      "enunciado": "Uma consequência da globalização que gera preocupação para países em desenvolvimento é:",
      "alternativas": [
        {"letra": "A", "texto": "A dependência econômica de países ricos e a perda de soberania nacional"},
        {"letra": "B", "texto": "O aumento do isolamento cultural"},
        {"letra": "C", "texto": "A redução do comércio internacional"},
        {"letra": "D", "texto": "O fortalecimento das economias locais"}
      ],
      "resposta": "A",
      "explicacao": "A globalização pode gerar dependência econômica, pois países em desenvolvimento ficam sujeitos às decisões de corporações multinacionais e países ricos."
    }
  },
  {
    "tipo": "resumo",
    "titulo": "Resumo — Globalização",
    "corpo": "<ul><li>Integração econômica, política e cultural mundial</li><li>Acelerou após 1991 (fim da Guerra Fria)</li><li>Positivo: troca de conhecimento e crescimento</li><li>Negativo: desigualdades e dependência</li><li>Índice Gini mede desigualdade de renda</li></ul>"
  }
]'),

-- ════════════════════════════════════════════════════════════════
-- CIÊNCIAS DA NATUREZA
-- ════════════════════════════════════════════════════════════════

('ciencias_natureza', 'Física — Mecânica', 'Leis de Newton', 1, 'As 3 Leis de Newton', 30, '[
  {
    "tipo": "capa",
    "titulo": "As 3 Leis de Newton",
    "corpo": "<p>Formuladas por Isaac Newton no século XVII, são a base da mecânica clássica.</p>",
    "dica": "As 3 leis são certeza no ENEM — entenda o conceito antes de decorar a fórmula"
  },
  {
    "tipo": "conteudo",
    "titulo": "1ª Lei — Princípio da Inércia",
    "corpo": "<p><em>Todo corpo em repouso permanece em repouso, e todo corpo em movimento permanece em movimento uniforme em linha reta, a não ser que uma força externa atue sobre ele.</em></p><p><strong>Exemplos no dia a dia:</strong></p><ul><li>Cinto de segurança: protege pois o corpo tende a continuar em movimento quando o carro freia</li><li>Toalha de mesa puxada bruscamente: os objetos ficam no lugar</li></ul>"
  },
  {
    "tipo": "formula",
    "titulo": "2ª Lei — Princípio Fundamental",
    "formula": "F = m · a",
    "corpo": "<p><strong>F</strong> = Força resultante (N) &nbsp;|&nbsp; <strong>m</strong> = massa (kg) &nbsp;|&nbsp; <strong>a</strong> = aceleração (m/s²)</p><p>Quanto maior a massa, maior a força necessária para acelerar. Quanto maior a força, maior a aceleração.</p>"
  },
  {
    "tipo": "conteudo",
    "titulo": "3ª Lei — Ação e Reação",
    "corpo": "<p><em>Para toda ação há uma reação igual e contrária.</em></p><p><strong>Importante:</strong> ação e reação atuam em <strong>corpos diferentes</strong>.</p><p><strong>Exemplos:</strong></p><ul><li>Foguete: gases empurram para baixo → foguete sobe</li><li>Nadar: mão empurra água para trás → corpo vai para frente</li><li>Andar: pé empurra chão para trás → chão empurra pé para frente</li></ul>"
  },
  {
    "tipo": "exercicio",
    "titulo": "Questão ENEM",
    "exercicio": {
      "enunciado": "Um carro de 1000 kg acelera de 0 a 20 m/s em 10 segundos. Qual a força resultante que age sobre ele?",
      "alternativas": [
        {"letra": "A", "texto": "2000 N"},
        {"letra": "B", "texto": "20000 N"},
        {"letra": "C", "texto": "200 N"},
        {"letra": "D", "texto": "10000 N"}
      ],
      "resposta": "A",
      "explicacao": "a = Δv/Δt = 20/10 = 2 m/s². F = m·a = 1000·2 = 2000 N"
    }
  },
  {
    "tipo": "resumo",
    "titulo": "Resumo — Leis de Newton",
    "corpo": "<ul><li><strong>1ª Lei (Inércia):</strong> corpo tende a manter seu estado</li><li><strong>2ª Lei:</strong> F = m·a (força = massa × aceleração)</li><li><strong>3ª Lei (Ação/Reação):</strong> forças em corpos diferentes, iguais e opostas</li></ul>"
  }
]'),

('ciencias_natureza', 'Química Orgânica', 'Hidrocarbonetos', 1, 'Química Orgânica — Introdução', 25, '[
  {
    "tipo": "capa",
    "titulo": "Química Orgânica",
    "corpo": "<p>Estudo dos compostos de carbono. O carbono é especial: forma 4 ligações e pode se unir a si mesmo.</p>",
    "dica": "No ENEM, foque em funções orgânicas do cotidiano — álcool, ácido acético, glicose"
  },
  {
    "tipo": "conteudo",
    "titulo": "Por que o carbono é especial?",
    "corpo": "<p>O carbono (C) tem 4 elétrons na camada de valência, podendo fazer <strong>4 ligações covalentes</strong>.</p><p><strong>Propriedades únicas:</strong></p><ul><li>Liga-se a outros carbonos formando cadeias longas</li><li>Forma cadeias abertas (acíclicas) ou fechadas (cíclicas)</li><li>Origina milhões de compostos diferentes</li></ul>"
  },
  {
    "tipo": "conteudo",
    "titulo": "Hidrocarbonetos",
    "corpo": "<p>Compostos formados apenas por <strong>C e H</strong>.</p><table style=width:100%><tr><th>Tipo</th><th>Ligações</th><th>Exemplo</th></tr><tr><td><strong>Alcanos</strong></td><td>Simples (C-C)</td><td>Metano (CH₄)</td></tr><tr><td><strong>Alcenos</strong></td><td>Uma dupla (C=C)</td><td>Eteno (C₂H₄)</td></tr><tr><td><strong>Alcinos</strong></td><td>Uma tripla (C≡C)</td><td>Etino (C₂H₂)</td></tr></table>"
  },
  {
    "tipo": "conteudo",
    "titulo": "Funções Orgânicas do Cotidiano",
    "corpo": "<ul><li>🍷 <strong>Álcool etílico</strong> (etanol) — bebidas e combustível</li><li>🍋 <strong>Ácido acético</strong> — vinagre</li><li>🍬 <strong>Glicose</strong> — açúcar no sangue (energia)</li><li>🧴 <strong>Ésteres</strong> — perfumes e aromas</li><li>🔵 <strong>Polietileno</strong> — sacolas plásticas</li></ul>"
  },
  {
    "tipo": "exercicio",
    "titulo": "Questão ENEM",
    "exercicio": {
      "enunciado": "O etanol (C₂H₅OH) é usado como combustível no Brasil. A função química do etanol é:",
      "alternativas": [
        {"letra": "A", "texto": "Álcool"},
        {"letra": "B", "texto": "Ácido carboxílico"},
        {"letra": "C", "texto": "Éster"},
        {"letra": "D", "texto": "Cetona"}
      ],
      "resposta": "A",
      "explicacao": "O grupo funcional -OH (hidroxila) ligado a carbono saturado caracteriza os álcoois. Etanol = álcool etílico."
    }
  },
  {
    "tipo": "resumo",
    "titulo": "Resumo — Química Orgânica",
    "corpo": "<ul><li>Carbono faz <strong>4 ligações</strong></li><li>Hidrocarbonetos: só C e H</li><li>Alcanos (simples) → Alcenos (dupla) → Alcinos (tripla)</li><li>Grupos funcionais definem a função orgânica</li><li>-OH = álcool &nbsp;|&nbsp; -COOH = ácido carboxílico</li></ul>"
  }
]'),

('ciencias_natureza', 'Biologia Celular', 'Mitose e Meiose', 1, 'Divisão Celular — Mitose e Meiose', 30, '[
  {
    "tipo": "capa",
    "titulo": "Divisão Celular",
    "corpo": "<p>Como as células se reproduzem: <strong>mitose</strong> (crescimento) e <strong>meiose</strong> (reprodução).</p>",
    "dica": "Diferença mitose × meiose é uma das mais cobradas em biologia no ENEM"
  },
  {
    "tipo": "conteudo",
    "titulo": "Mitose",
    "corpo": "<p>Divisão que gera <strong>2 células filhas idênticas</strong> à célula mãe.</p><ul><li>Mantém o número de cromossomos (diplóide → diplóide)</li><li>Ocorre em: crescimento, regeneração, cicatrização</li><li>Fases: Prófase → Metáfase → Anáfase → Telófase</li></ul>"
  },
  {
    "tipo": "conteudo",
    "titulo": "Meiose",
    "corpo": "<p>Divisão que gera <strong>4 células filhas</strong> com <strong>metade</strong> dos cromossomos.</p><ul><li>Reduz o número de cromossomos (diplóide → haplóide)</li><li>Ocorre em: formação de gametas (espermatozoide e óvulo)</li><li>Gera variabilidade genética (essencial para evolução)</li></ul>"
  },
  {
    "tipo": "conteudo",
    "titulo": "Comparativo rápido",
    "corpo": "<table style=width:100%><tr><th></th><th>Mitose</th><th>Meiose</th></tr><tr><td>Células geradas</td><td>2</td><td>4</td></tr><tr><td>Cromossomos</td><td>Igual (2n)</td><td>Metade (n)</td></tr><tr><td>Onde ocorre</td><td>Células somáticas</td><td>Gônadas</td></tr><tr><td>Função</td><td>Crescimento</td><td>Reprodução</td></tr></table>"
  },
  {
    "tipo": "exercicio",
    "titulo": "Questão ENEM",
    "exercicio": {
      "enunciado": "Uma célula humana possui 46 cromossomos. Após a meiose, cada célula resultante terá quantos cromossomos?",
      "alternativas": [
        {"letra": "A", "texto": "23"},
        {"letra": "B", "texto": "46"},
        {"letra": "C", "texto": "92"},
        {"letra": "D", "texto": "12"}
      ],
      "resposta": "A",
      "explicacao": "A meiose reduz o número de cromossomos à metade. 46/2 = 23 cromossomos (célula haplóide)."
    }
  },
  {
    "tipo": "resumo",
    "titulo": "Resumo — Divisão Celular",
    "corpo": "<ul><li><strong>Mitose:</strong> 2 células, mesmo nº cromossomos, crescimento</li><li><strong>Meiose:</strong> 4 células, metade dos cromossomos, gametas</li><li>Humanos: 46 cromossomos (diplóide) → gametas com 23 (haplóide)</li></ul>"
  }
]'),

-- ════════════════════════════════════════════════════════════════
-- LINGUAGENS
-- ════════════════════════════════════════════════════════════════

('linguagens', 'Interpretação de Texto', 'Inferência', 1, 'Como Interpretar Textos no ENEM', 25, '[
  {
    "tipo": "capa",
    "titulo": "Interpretação de Texto",
    "corpo": "<p>A habilidade mais cobrada no ENEM. Não é só ler — é entender o que está escrito e o que está nas entrelinhas.</p>",
    "dica": "Leia o enunciado da questão ANTES do texto — isso orienta onde focar"
  },
  {
    "tipo": "conteudo",
    "titulo": "Tipos de informação no texto",
    "corpo": "<p><strong>Informação explícita:</strong> está escrita diretamente no texto.<br>Ex: O texto diz que a personagem tem 30 anos.</p><p><strong>Informação implícita (inferência):</strong> não está escrita, mas é possível concluir pelo contexto.<br>Ex: O texto descreve que ela dirige para o trabalho todo dia → inferimos que ela tem carteira de motorista.</p>",
    "dica": "No ENEM, a maioria das questões exige inferência — não fica só na superfície"
  },
  {
    "tipo": "conteudo",
    "titulo": "Estratégias de leitura",
    "corpo": "<ol><li><strong>Leia o enunciado primeiro</strong> — saber o que se pede orienta a leitura</li><li><strong>Identifique a ideia central</strong> de cada parágrafo</li><li><strong>Marque palavras-chave</strong> e conectivos importantes</li><li><strong>Fique atento ao tom</strong> — o texto é irônico? crítico? neutro?</li><li><strong>Descarte as alternativas absurdas</strong> primeiro</li></ol>"
  },
  {
    "tipo": "conteudo",
    "titulo": "Armadilhas comuns do ENEM",
    "corpo": "<ul><li><strong>Alternativa parcialmente correta:</strong> certa no começo, errada no final — leia até o fim</li><li><strong>Exagero:</strong> o texto sugere algo moderado, a alternativa generaliza demais</li><li><strong>Inversão:</strong> troca causa por consequência</li><li><strong>Fora do texto:</strong> verdadeiro no mundo real, mas não está no texto</li></ul>",
    "dica": "A resposta correta SEMPRE tem base no texto. Se não encontrou no texto, descarte."
  },
  {
    "tipo": "resumo",
    "titulo": "Resumo — Interpretação",
    "corpo": "<ul><li>Leia o enunciado antes do texto</li><li>Explícito = está escrito | Implícito = conclusão lógica</li><li>A resposta SEMPRE tem base no texto</li><li>Cuidado com: exagero, inversão, fora do texto</li></ul>"
  }
]'),

('linguagens', 'Literatura Brasileira', 'Modernismo', 1, 'Modernismo Brasileiro', 25, '[
  {
    "tipo": "capa",
    "titulo": "Modernismo Brasileiro",
    "corpo": "<p>Movimento literário e artístico que rompeu com as tradições do século XIX e buscou uma identidade cultural brasileira.</p>",
    "dica": "A Semana de Arte Moderna de 1922 é o marco — saiba o que ela representou"
  },
  {
    "tipo": "conteudo",
    "titulo": "Semana de Arte Moderna (1922)",
    "corpo": "<p>Realizada em <strong>fevereiro de 1922</strong> no Teatro Municipal de São Paulo.</p><p><strong>O que propunha:</strong></p><ul><li>Ruptura com o passadismo (Parnasianismo e Simbolismo)</li><li>Liberdade de criação — sem regras rígidas</li><li>Valorização da cultura e identidade brasileira</li><li>Linguagem próxima da fala cotidiana</li></ul>"
  },
  {
    "tipo": "conteudo",
    "titulo": "Principais autores e obras",
    "corpo": "<table style=width:100%><tr><th>Autor</th><th>Obra</th><th>Destaque</th></tr><tr><td><strong>Oswald de Andrade</strong></td><td>Manifesto Antropófago</td><td>Devorar cultura estrangeira e transformar</td></tr><tr><td><strong>Mário de Andrade</strong></td><td>Macunaíma</td><td>Herói sem nenhum caráter — identidade brasileira</td></tr><tr><td><strong>Manuel Bandeira</strong></td><td>Pasárgada</td><td>Verso livre, linguagem simples</td></tr><tr><td><strong>Carlos Drummond</strong></td><td>No meio do caminho</td><td>Cotidiano, ironia, existencialismo</td></tr></table>"
  },
  {
    "tipo": "exercicio",
    "titulo": "Questão ENEM",
    "exercicio": {
      "enunciado": "A Semana de Arte Moderna de 1922 ficou marcada pela proposta de:",
      "alternativas": [
        {"letra": "A", "texto": "Ruptura com as formas tradicionais e busca por uma arte autenticamente brasileira"},
        {"letra": "B", "texto": "Retorno ao estilo parnasiano de poesia com formas fixas"},
        {"letra": "C", "texto": "Valorização exclusiva da cultura europeia no Brasil"},
        {"letra": "D", "texto": "Proibição de qualquer influência estrangeira na arte brasileira"}
      ],
      "resposta": "A",
      "explicacao": "O Modernismo propunha romper com o conservadorismo artístico e criar uma arte que refletisse a realidade e identidade brasileira."
    }
  },
  {
    "tipo": "resumo",
    "titulo": "Resumo — Modernismo",
    "corpo": "<ul><li>Marco: <strong>Semana de 22</strong> — São Paulo</li><li>Ruptura com Parnasianismo e Simbolismo</li><li>Verso livre, linguagem cotidiana</li><li>Valorização do Brasil e da cultura popular</li><li>Oswald, Mário de Andrade, Drummond, Bandeira</li></ul>"
  }
]'),

-- ════════════════════════════════════════════════════════════════
-- REDAÇÃO
-- ════════════════════════════════════════════════════════════════

('redacao', 'Estrutura Dissertativa', 'Introdução', 1, 'Como Estruturar a Redação do ENEM', 35, '[
  {
    "tipo": "capa",
    "titulo": "Redação do ENEM",
    "corpo": "<p>Texto dissertativo-argumentativo de até 30 linhas. Vale até <strong>1000 pontos</strong> — 20% da nota total!</p>",
    "dica": "A redação é avaliada em 5 competências — entender cada uma é o caminho para a nota 1000"
  },
  {
    "tipo": "conteudo",
    "titulo": "As 5 Competências",
    "corpo": "<ol><li><strong>C1 — Norma culta:</strong> gramática, ortografia, pontuação</li><li><strong>C2 — Tema e tipo textual:</strong> dissertativo-argumentativo, sem fugir do tema</li><li><strong>C3 — Argumentação:</strong> usar argumentos consistentes e dados para defender a tese</li><li><strong>C4 — Coesão:</strong> conectivos e progressão lógica das ideias</li><li><strong>C5 — Proposta de intervenção:</strong> solução detalhada para o problema</li></ol>",
    "dica": "Cada competência vale 200 pontos. Zerar qualquer uma compromete muito a nota"
  },
  {
    "tipo": "conteudo",
    "titulo": "Estrutura da Redação",
    "corpo": "<p><strong>1. Introdução</strong> (~5 linhas)</p><ul><li>Apresentar o tema com contexto</li><li>Tese: ponto de vista que você vai defender</li></ul><p><strong>2. Desenvolvimento</strong> (~20 linhas — 2 parágrafos)</p><ul><li>Argumento 1 + evidência/dado</li><li>Argumento 2 + evidência/dado</li></ul><p><strong>3. Conclusão</strong> (~5 linhas)</p><ul><li>Retomar a tese</li><li>Proposta de intervenção COMPLETA</li></ul>"
  },
  {
    "tipo": "conteudo",
    "titulo": "Proposta de Intervenção Completa",
    "corpo": "<p>A proposta deve ter <strong>5 elementos</strong>:</p><ol><li><strong>Ação</strong> — o que será feito</li><li><strong>Agente</strong> — quem fará (governo, escola, família, mídia)</li><li><strong>Modo</strong> — como será feito</li><li><strong>Finalidade</strong> — para quê (com conector: a fim de, para que)</li><li><strong>Detalhamento</strong> — informação adicional que completa</li></ol>",
    "dica": "Proposta incompleta = desconto. Proposta completa = 200 pontos na C5!"
  },
  {
    "tipo": "exemplo",
    "titulo": "Exemplo de Proposta Completa",
    "corpo": "<p><strong>Tema: Desafios da educação no Brasil</strong></p><p>É necessário que o <strong>Governo Federal</strong> [agente] <strong>invista em capacitação de professores</strong> [ação], <strong>por meio de programas de formação continuada e aumento salarial</strong> [modo], <strong>a fim de melhorar a qualidade do ensino público</strong> [finalidade] <strong>e reduzir a evasão escolar no país</strong> [detalhamento].</p>"
  },
  {
    "tipo": "conteudo",
    "titulo": "Conectivos essenciais",
    "corpo": "<p><strong>Adição:</strong> além disso, ademais, outrossim<br><strong>Oposição:</strong> entretanto, contudo, porém, no entanto<br><strong>Causa:</strong> pois, porque, visto que, uma vez que<br><strong>Conclusão:</strong> portanto, logo, assim, dessa forma<br><strong>Explicação:</strong> ou seja, isto é, a saber<br><strong>Concessão:</strong> embora, ainda que, apesar de</p>",
    "dica": "Variar os conectivos mostra domínio da língua — evite repetir sempre o mesmo"
  },
  {
    "tipo": "exercicio",
    "titulo": "Identifique os elementos",
    "exercicio": {
      "enunciado": "Na frase: 'O Ministério da Educação deve criar campanhas de conscientização nas escolas por meio de oficinas, para combater o bullying e reduzir a violência escolar.' — Qual elemento da proposta de intervenção está FALTANDO?",
      "alternativas": [
        {"letra": "A", "texto": "Detalhamento"},
        {"letra": "B", "texto": "Agente"},
        {"letra": "C", "texto": "Finalidade"},
        {"letra": "D", "texto": "Modo"}
      ],
      "resposta": "A",
      "explicacao": "Temos: agente (MEC), ação (criar campanhas), modo (oficinas), finalidade (combater bullying). Falta o detalhamento — uma informação adicional que completa a proposta."
    }
  },
  {
    "tipo": "resumo",
    "titulo": "Resumo — Redação ENEM",
    "corpo": "<ul><li>5 competências de 200 pontos cada = 1000 total</li><li>Estrutura: <strong>Introdução → 2 Desenvolvimentos → Conclusão</strong></li><li>Proposta de intervenção: <strong>ação + agente + modo + finalidade + detalhamento</strong></li><li>Nunca fuja do tema — C2 zerada = máximo 400 pontos</li><li>Use conectivos variados para coesão</li></ul>"
  }
]');
