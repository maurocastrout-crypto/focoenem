-- ================================================================
-- CONTEÚDO — MATEMÁTICA
-- ================================================================

insert into public.aulas (area, topico, subtopico, ordem, titulo, duracao_estimada_min, slides) values

-- ── Funções do 1º Grau ──────────────────────────────────────────
('matematica', 'Funções', 'Função do 1º grau', 1, 'Função do 1º Grau', 25, '[
  {
    "tipo": "capa",
    "titulo": "Função do 1º Grau",
    "corpo": "<p>Também chamada de <strong>função afim</strong>, é uma das mais cobradas no ENEM.</p>",
    "dica": "Este tópico aparece em média 3x por ano no ENEM"
  },
  {
    "tipo": "conteudo",
    "titulo": "O que é uma função do 1º grau?",
    "corpo": "<p>Uma função <strong>f(x) = ax + b</strong> é do 1º grau quando <strong>a ≠ 0</strong>.</p><ul><li><strong>a</strong> = coeficiente angular (define a inclinação)</li><li><strong>b</strong> = coeficiente linear (onde a reta cruza o eixo y)</li></ul><p>Exemplos: f(x) = 2x + 3 &nbsp;|&nbsp; f(x) = -x + 5 &nbsp;|&nbsp; f(x) = 4x</p>"
  },
  {
    "tipo": "formula",
    "titulo": "Fórmula principal",
    "formula": "f(x) = ax + b, onde a ≠ 0",
    "corpo": "<p><strong>a &gt; 0</strong> → função crescente (sobe da esquerda para direita)<br><strong>a &lt; 0</strong> → função decrescente (desce da esquerda para direita)</p>"
  },
  {
    "tipo": "conteudo",
    "titulo": "Zero da função (raiz)",
    "corpo": "<p>O <strong>zero</strong> é o valor de x onde f(x) = 0 — ou seja, onde a reta cruza o eixo x.</p><p><strong>Como calcular:</strong></p><ol><li>Iguale f(x) a zero: ax + b = 0</li><li>Isole x: x = -b/a</li></ol>",
    "dica": "O zero é muito cobrado em questões de ENEM — memorize: x = -b/a"
  },
  {
    "tipo": "exemplo",
    "titulo": "Exemplo resolvido",
    "corpo": "<p><strong>Problema:</strong> Encontre o zero de f(x) = 3x - 9</p><p><strong>Resolução:</strong></p><ol><li>3x - 9 = 0</li><li>3x = 9</li><li>x = 9/3</li><li><strong>x = 3</strong> ✓</li></ol><p>Verificação: f(3) = 3(3) - 9 = 9 - 9 = 0 ✓</p>"
  },
  {
    "tipo": "exercicio",
    "titulo": "Pratique agora",
    "exercicio": {
      "enunciado": "Qual é o zero da função f(x) = 2x - 8?",
      "alternativas": [
        {"letra": "A", "texto": "x = 4"},
        {"letra": "B", "texto": "x = -4"},
        {"letra": "C", "texto": "x = 8"},
        {"letra": "D", "texto": "x = 2"}
      ],
      "resposta": "A",
      "explicacao": "2x - 8 = 0 → 2x = 8 → x = 4"
    }
  },
  {
    "tipo": "conteudo",
    "titulo": "Gráfico da função afim",
    "corpo": "<p>O gráfico de f(x) = ax + b é sempre uma <strong>reta</strong>.</p><p>Para traçar, basta encontrar <strong>dois pontos</strong>:</p><ol><li>Calcule f(0) = b → ponto (0, b)</li><li>Calcule o zero → ponto (−b/a, 0)</li><li>Ligue os dois pontos com uma reta</li></ol>",
    "dica": "Sempre marque pelo menos 2 pontos para traçar a reta com precisão"
  },
  {
    "tipo": "exercicio",
    "titulo": "Questão estilo ENEM",
    "exercicio": {
      "enunciado": "Um táxi cobra R$ 5,00 de bandeirada mais R$ 2,00 por km rodado. A função que representa o custo C em relação à distância x é C(x) = 2x + 5. Qual o custo para uma corrida de 8 km?",
      "alternativas": [
        {"letra": "A", "texto": "R$ 21,00"},
        {"letra": "B", "texto": "R$ 16,00"},
        {"letra": "C", "texto": "R$ 18,00"},
        {"letra": "D", "texto": "R$ 13,00"}
      ],
      "resposta": "A",
      "explicacao": "C(8) = 2(8) + 5 = 16 + 5 = R$ 21,00"
    }
  },
  {
    "tipo": "resumo",
    "titulo": "Resumo — Função do 1º Grau",
    "corpo": "<ul><li>f(x) = <strong>ax + b</strong>, com a ≠ 0</li><li>Gráfico: <strong>reta</strong></li><li>a &gt; 0 → crescente | a &lt; 0 → decrescente</li><li>Zero: <strong>x = −b/a</strong></li><li>Ponto no eixo y: <strong>(0, b)</strong></li></ul>",
    "dica": "Pronto para a mini-prova! Você estudou os conceitos essenciais de função do 1º grau."
  }
]'),

-- ── Função do 2º Grau ────────────────────────────────────────────
('matematica', 'Funções', 'Função do 2º grau', 2, 'Função do 2º Grau (Quadrática)', 30, '[
  {
    "tipo": "capa",
    "titulo": "Função do 2º Grau",
    "corpo": "<p>Também chamada de <strong>função quadrática</strong>. Seu gráfico é uma <strong>parábola</strong>.</p>",
    "dica": "A mais cobrada em cálculo no ENEM — aparecem situações de máximo e mínimo"
  },
  {
    "tipo": "conteudo",
    "titulo": "Forma geral",
    "corpo": "<p><strong>f(x) = ax² + bx + c</strong>, com a ≠ 0</p><ul><li><strong>a &gt; 0</strong> → parábola com concavidade para <strong>cima</strong> (∪) — tem ponto mínimo</li><li><strong>a &lt; 0</strong> → parábola com concavidade para <strong>baixo</strong> (∩) — tem ponto máximo</li></ul>"
  },
  {
    "tipo": "formula",
    "titulo": "Fórmula de Bhaskara",
    "formula": "x = (-b ± √Δ) / 2a    onde    Δ = b² - 4ac",
    "corpo": "<p><strong>Δ &gt; 0</strong> → dois roots reais e distintos<br><strong>Δ = 0</strong> → um root real (duplo)<br><strong>Δ &lt; 0</strong> → sem roots reais</p>"
  },
  {
    "tipo": "formula",
    "titulo": "Vértice da parábola",
    "formula": "Xv = -b / 2a     Yv = -Δ / 4a",
    "corpo": "<p>O vértice é o ponto de <strong>máximo</strong> (a &lt; 0) ou <strong>mínimo</strong> (a &gt; 0) da função.</p><p>Muito cobrado em problemas de otimização no ENEM!</p>"
  },
  {
    "tipo": "exemplo",
    "titulo": "Exemplo resolvido com Bhaskara",
    "corpo": "<p><strong>Encontre as raízes de f(x) = x² - 5x + 6</strong></p><ol><li>a=1, b=-5, c=6</li><li>Δ = (-5)² - 4(1)(6) = 25 - 24 = <strong>1</strong></li><li>x = (5 ± √1) / 2</li><li>x₁ = (5+1)/2 = <strong>3</strong></li><li>x₂ = (5-1)/2 = <strong>2</strong></li></ol>"
  },
  {
    "tipo": "exercicio",
    "titulo": "Pratique Bhaskara",
    "exercicio": {
      "enunciado": "Quais são as raízes de f(x) = x² - 7x + 12?",
      "alternativas": [
        {"letra": "A", "texto": "x = 3 e x = 4"},
        {"letra": "B", "texto": "x = -3 e x = -4"},
        {"letra": "C", "texto": "x = 2 e x = 6"},
        {"letra": "D", "texto": "x = 1 e x = 12"}
      ],
      "resposta": "A",
      "explicacao": "Δ = 49 - 48 = 1. x = (7±1)/2 → x₁=4, x₂=3"
    }
  },
  {
    "tipo": "exercicio",
    "titulo": "Questão ENEM — Máximo e mínimo",
    "exercicio": {
      "enunciado": "Um objeto é lançado para cima. Sua altura em metros é dada por h(t) = -5t² + 20t, onde t é o tempo em segundos. Qual a altura máxima atingida?",
      "alternativas": [
        {"letra": "A", "texto": "20 metros"},
        {"letra": "B", "texto": "10 metros"},
        {"letra": "C", "texto": "15 metros"},
        {"letra": "D", "texto": "25 metros"}
      ],
      "resposta": "A",
      "explicacao": "a=-5, b=20. Xv = -20/(2×-5) = 2s. h(2) = -5(4)+20(2) = -20+40 = 20m"
    }
  },
  {
    "tipo": "resumo",
    "titulo": "Resumo — Função do 2º Grau",
    "corpo": "<ul><li>f(x) = <strong>ax² + bx + c</strong>, a ≠ 0</li><li>Gráfico: <strong>parábola</strong></li><li>Raízes: Bhaskara — <strong>Δ = b² - 4ac</strong></li><li>Vértice: <strong>Xv = -b/2a</strong></li><li>a &gt; 0 → mínimo | a &lt; 0 → máximo</li></ul>"
  }
]'),

-- ── Progressão Aritmética ────────────────────────────────────────
('matematica', 'Progressões', 'Progressão Aritmética', 1, 'Progressão Aritmética (PA)', 20, '[
  {
    "tipo": "capa",
    "titulo": "Progressão Aritmética",
    "corpo": "<p>Uma sequência onde a <strong>diferença entre termos consecutivos</strong> é sempre a mesma.</p>",
    "dica": "PA aparece em problemas de juros simples, escadas, fileiras — muito prático no ENEM"
  },
  {
    "tipo": "conteudo",
    "titulo": "O que é uma PA?",
    "corpo": "<p>Em uma PA, cada termo é obtido <strong>somando uma constante r</strong> (razão) ao anterior.</p><p><strong>Exemplo:</strong> 2, 5, 8, 11, 14... (razão r = 3)</p><p>Verificação: 5-2=3, 8-5=3, 11-8=3 ✓</p>"
  },
  {
    "tipo": "formula",
    "titulo": "Fórmulas da PA",
    "formula": "Termo geral: aₙ = a₁ + (n-1)·r\nSoma: Sₙ = n·(a₁ + aₙ)/2",
    "corpo": "<p><strong>aₙ</strong> = n-ésimo termo &nbsp;|&nbsp; <strong>a₁</strong> = primeiro termo &nbsp;|&nbsp; <strong>r</strong> = razão &nbsp;|&nbsp; <strong>n</strong> = posição do termo</p>"
  },
  {
    "tipo": "exemplo",
    "titulo": "Exemplo resolvido",
    "corpo": "<p><strong>Na PA (3, 7, 11, 15...), qual é o 10º termo?</strong></p><ol><li>a₁ = 3, r = 4</li><li>a₁₀ = 3 + (10-1)·4</li><li>a₁₀ = 3 + 36 = <strong>39</strong></li></ol><p><strong>Qual a soma dos 10 primeiros termos?</strong></p><ol><li>S₁₀ = 10·(3 + 39)/2 = 10·42/2 = <strong>210</strong></li></ol>"
  },
  {
    "tipo": "exercicio",
    "titulo": "Questão ENEM estilo",
    "exercicio": {
      "enunciado": "Um cinema tem 20 fileiras. A primeira tem 15 cadeiras e cada fileira seguinte tem 3 cadeiras a mais. Quantas cadeiras tem a última fileira?",
      "alternativas": [
        {"letra": "A", "texto": "72"},
        {"letra": "B", "texto": "75"},
        {"letra": "C", "texto": "57"},
        {"letra": "D", "texto": "60"}
      ],
      "resposta": "A",
      "explicacao": "a₂₀ = 15 + (20-1)·3 = 15 + 57 = 72 cadeiras"
    }
  },
  {
    "tipo": "resumo",
    "titulo": "Resumo — PA",
    "corpo": "<ul><li>Razão: <strong>r = aₙ - aₙ₋₁</strong> (constante)</li><li>Termo geral: <strong>aₙ = a₁ + (n-1)·r</strong></li><li>Soma: <strong>Sₙ = n·(a₁ + aₙ)/2</strong></li></ul>"
  }
]'),

-- ── Probabilidade ────────────────────────────────────────────────
('matematica', 'Probabilidade', 'Probabilidade simples', 1, 'Probabilidade', 25, '[
  {
    "tipo": "capa",
    "titulo": "Probabilidade",
    "corpo": "<p>A chance de um evento acontecer. Usada em jogos, seguros, medicina e muito mais.</p>",
    "dica": "Questões de probabilidade caem todo ano no ENEM — geralmente na parte contextualizada"
  },
  {
    "tipo": "formula",
    "titulo": "Fórmula da Probabilidade",
    "formula": "P(A) = número de casos favoráveis / número de casos possíveis",
    "corpo": "<p>O resultado sempre está entre <strong>0 e 1</strong> (ou 0% e 100%).</p><p>P = 0 → evento impossível &nbsp;|&nbsp; P = 1 → evento certo</p>"
  },
  {
    "tipo": "exemplo",
    "titulo": "Exemplo com dados",
    "corpo": "<p><strong>Lançando um dado, qual a probabilidade de sair número par?</strong></p><ol><li>Casos favoráveis: {2, 4, 6} → 3 casos</li><li>Casos possíveis: {1, 2, 3, 4, 5, 6} → 6 casos</li><li>P = 3/6 = <strong>1/2 = 50%</strong></li></ol>"
  },
  {
    "tipo": "exercicio",
    "titulo": "Pratique",
    "exercicio": {
      "enunciado": "Uma urna tem 3 bolas vermelhas, 4 azuis e 3 brancas. Qual a probabilidade de sortear uma bola azul?",
      "alternativas": [
        {"letra": "A", "texto": "2/5"},
        {"letra": "B", "texto": "3/10"},
        {"letra": "C", "texto": "4/10"},
        {"letra": "D", "texto": "1/3"}
      ],
      "resposta": "A",
      "explicacao": "P = 4/10 = 2/5. Total = 3+4+3 = 10 bolas."
    }
  },
  {
    "tipo": "resumo",
    "titulo": "Resumo — Probabilidade",
    "corpo": "<ul><li>P(A) = <strong>favoráveis / possíveis</strong></li><li>0 ≤ P ≤ 1</li><li>P(não A) = <strong>1 - P(A)</strong></li></ul>"
  }
]');
