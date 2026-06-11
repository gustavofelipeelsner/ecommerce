// gera_pptx_node.js — Gera apresentacao.pptx via pptxgenjs (Node.js)
// Execução: node gera_pptx_node.js
// Saída:    presentation/apresentacao.pptx

const PptxGenJS = require('../node_modules/pptxgenjs');
const path = require('path');

const prs = new PptxGenJS();
prs.layout = 'LAYOUT_WIDE'; // 13.33" x 7.5"

// Paleta
const AZUL_ESC  = '1A3A5C';
const AZUL_MED  = '2C7BB6';
const AZUL_CLR  = 'ABD9E9';
const BRANCO    = 'FFFFFF';
const CINZA     = 'F2F6FA';
const CINZA_TXT = '333333';
const VERDE     = '27AE60';
const VERMELHO  = 'C0392B';

// Helper: adiciona retângulo colorido
function addRect(slide, x, y, w, h, color) {
  slide.addShape(prs.ShapeType.rect, {
    x, y, w, h,
    fill: { color },
    line: { color, width: 0 },
  });
}

// Helper: cabeçalho padrão
function addHeader(slide, title, subtitle) {
  addRect(slide, 0, 0, 13.33, 1.3, AZUL_ESC);
  addRect(slide, 0, 1.24, 13.33, 0.06, AZUL_MED);
  slide.addText(title, {
    x: 0.4, y: 0.08, w: 12.5, h: 0.8,
    fontSize: 26, bold: true, color: BRANCO, valign: 'middle',
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.42, y: 0.82, w: 12.5, h: 0.38,
      fontSize: 13, color: AZUL_CLR,
    });
  }
}

// Helper: lista de bullets
function addBullets(slide, items, x, y, w, h, fontSize = 16, color = CINZA_TXT) {
  const rows = items.map(t => [{ text: `▸  ${t}`, options: { fontSize, color, breakLine: true } }]);
  slide.addText(items.map(t => ({ text: `▸  ${t}\n`, options: { fontSize, color } })), {
    x, y, w, h, valign: 'top',
  });
}

// Helper: tabela
function addTable(slide, headers, rows, x, y, w, h) {
  const colW = w / headers.length;
  const headerRow = headers.map(h => ({
    text: h,
    options: { bold: true, color: BRANCO, fill: AZUL_ESC, align: 'center', fontSize: 12 },
  }));
  const dataRows = rows.map((row, ri) =>
    row.map((cell, ci) => ({
      text: cell,
      options: {
        fontSize: 11,
        fill: ri % 2 === 0 ? CINZA : BRANCO,
        align: ci === 0 ? 'left' : 'center',
        color: CINZA_TXT,
      },
    }))
  );
  slide.addTable([headerRow, ...dataRows], {
    x, y, w, h,
    colW: Array(headers.length).fill(colW),
    border: { pt: 0.5, color: 'CCCCCC' },
    rowH: h / (rows.length + 1),
  });
}

// ==========================================================================
// SLIDE 1 — CAPA
// ==========================================================================
{
  const s = prs.addSlide();
  addRect(s, 0, 0, 13.33, 7.5, AZUL_ESC);
  addRect(s, 0.5, 2.7, 1.0, 0.04, AZUL_MED);
  addRect(s, 1.5, 2.7, 11.0, 0.04, AZUL_CLR);
  s.addText('Previsão de Vendas em\nE-commerce com Machine Learning', {
    x: 0.5, y: 1.1, w: 12.3, h: 1.5,
    fontSize: 36, bold: true, color: BRANCO,
  });
  s.addText('Estudo Comparativo: Linear Regression  ·  Random Forest  ·  XGBoost', {
    x: 0.5, y: 2.9, w: 12.3, h: 0.55,
    fontSize: 17, color: AZUL_CLR,
  });
  s.addText('Dataset: Brazilian E-Commerce Public Dataset by Olist (Kaggle)', {
    x: 0.5, y: 3.6, w: 12.3, h: 0.4,
    fontSize: 14, color: BRANCO,
  });
  s.addText('Disciplina de Inteligência Artificial  ·  2025', {
    x: 0.5, y: 6.9, w: 12.3, h: 0.4,
    fontSize: 12, color: AZUL_CLR,
  });
  console.log('  ✓ Slide  1 — Capa');
}

// ==========================================================================
// SLIDE 2 — AGENDA
// ==========================================================================
{
  const s = prs.addSlide();
  addRect(s, 0, 0, 13.33, 7.5, CINZA);
  addHeader(s, 'Agenda', 'O que será apresentado');
  const col1 = ['01  Contexto e Problema','02  Objetivos','03  Base de Dados',
    '04  Metodologia e Pipeline','05  Pré-processamento','06  Engenharia de Atributos','07  Algoritmos'];
  const col2 = ['08  Linear Regression','09  Random Forest','10  XGBoost',
    '11  Resultados e Métricas','12  Análise dos Resultados','13  Discussão','14  Conclusão'];
  addBullets(s, col1, 0.5, 1.45, 5.9, 5.8, 15);
  addBullets(s, col2, 7.0, 1.45, 5.9, 5.8, 15);
  addRect(s, 6.6, 1.5, 0.04, 5.6, AZUL_MED);
  console.log('  ✓ Slide  2 — Agenda');
}

// ==========================================================================
// SLIDE 3 — CONTEXTO E PROBLEMA
// ==========================================================================
{
  const s = prs.addSlide();
  addRect(s, 0, 0, 13.33, 7.5, CINZA);
  addHeader(s, 'Contexto e Problema', 'Por que prever o valor de pedidos em e-commerce?');
  addBullets(s, [
    'R$ 185 bilhões faturados pelo e-commerce brasileiro em 2023 (ABComm)',
    'Crescimento médio de 27% ao ano nos últimos 5 anos',
    'Mais de 100 milhões de pedidos processados por grandes plataformas',
    'Previsão de receita é crítica para logística, estoque e marketing',
  ], 0.5, 1.5, 12.5, 2.3, 16);
  addRect(s, 0.5, 3.95, 12.4, 3.1, AZUL_MED);
  s.addText('Problema de Pesquisa', {
    x: 0.7, y: 4.05, w: 12.0, h: 0.45,
    fontSize: 15, bold: true, color: BRANCO,
  });
  s.addText(
    'Dado um pedido em uma plataforma de e-commerce, é possível prever com precisão o valor\ntotal que o cliente pagará (payment_value), utilizando características do produto,\ndo cliente e da forma de pagamento?',
    { x: 0.7, y: 4.55, w: 12.0, h: 2.3, fontSize: 16, color: BRANCO }
  );
  console.log('  ✓ Slide  3 — Contexto e Problema');
}

// ==========================================================================
// SLIDE 4 — OBJETIVOS
// ==========================================================================
{
  const s = prs.addSlide();
  addRect(s, 0, 0, 13.33, 7.5, CINZA);
  addHeader(s, 'Objetivos do Projeto');
  s.addText('Objetivo Geral', { x: 0.5, y: 1.45, w: 12.0, h: 0.4, fontSize: 16, bold: true, color: AZUL_MED });
  s.addText(
    'Desenvolver e comparar modelos de Machine Learning para previsão do valor de pedidos em e-commerce, avaliando o desempenho com métricas de regressão.',
    { x: 0.5, y: 1.9, w: 12.2, h: 0.8, fontSize: 15, color: CINZA_TXT }
  );
  addRect(s, 0.5, 2.8, 12.0, 0.04, AZUL_CLR);
  s.addText('Objetivos Específicos', { x: 0.5, y: 2.95, w: 12.0, h: 0.4, fontSize: 16, bold: true, color: AZUL_MED });
  addBullets(s, [
    'Construir um pipeline completo e reprodutível de ML com dados reais do Kaggle',
    'Realizar análise exploratória para identificar padrões e correlações',
    'Aplicar engenharia de atributos para criar features derivadas relevantes',
    'Treinar e comparar Linear Regression, Random Forest e XGBoost',
    'Avaliar os modelos com MAE, MSE, RMSE e R² no conjunto de teste',
    'Identificar o melhor modelo e analisar a importância das features',
  ], 0.5, 3.45, 12.2, 3.8, 15);
  console.log('  ✓ Slide  4 — Objetivos');
}

// ==========================================================================
// SLIDE 5 — BASE DE DADOS
// ==========================================================================
{
  const s = prs.addSlide();
  addRect(s, 0, 0, 13.33, 7.5, CINZA);
  addHeader(s, 'Base de Dados', 'Brazilian E-Commerce Public Dataset by Olist (Kaggle)');
  const cards = [['100.000+','Pedidos'],['2016–2018','Período'],['9','Tabelas'],['27','Estados']];
  cards.forEach(([val, label], i) => {
    const cx = 0.35 + i * 3.22;
    addRect(s, cx, 1.5, 2.6, 1.25, AZUL_MED);
    s.addText(val, { x: cx, y: 1.55, w: 2.6, h: 0.7, fontSize: 24, bold: true, color: BRANCO, align: 'center' });
    s.addText(label, { x: cx, y: 2.2, w: 2.6, h: 0.4, fontSize: 13, color: BRANCO, align: 'center' });
  });
  addTable(s,
    ['Tabela CSV', 'Conteúdo', 'Linhas'],
    [
      ['olist_orders_dataset', 'Dados dos pedidos e status', '~99.000'],
      ['olist_order_items_dataset', 'Itens, preços e frete', '~112.000'],
      ['olist_order_payments_dataset', 'Pagamentos e parcelas', '~103.000'],
      ['olist_products_dataset', 'Dimensões e categorias', '~33.000'],
      ['olist_customers_dataset', 'Estado e cidade do cliente', '~99.000'],
      ['product_category_name_translation', 'Tradução das categorias', '71'],
    ],
    0.35, 2.9, 12.6, 4.1
  );
  console.log('  ✓ Slide  5 — Base de Dados');
}

// ==========================================================================
// SLIDE 6 — EDA
// ==========================================================================
{
  const s = prs.addSlide();
  addRect(s, 0, 0, 13.33, 7.5, CINZA);
  addHeader(s, 'Análise Exploratória (EDA)', 'Principais descobertas nos dados');
  addBullets(s, [
    'payment_value: mediana R$ 115 | média R$ 154 — distribuição assimétrica à direita (skewness ≈ 2,1)',
    'Correlações: price (ρ=0,94) e freight_value (ρ=0,61) são as variáveis mais correlacionadas com o alvo',
    'Valores ausentes: principalmente em dimensões de produto (~1,2%) — tratados por mediana',
    'Sazonalidade: pico de pedidos em nov/2017 (Black Friday); horário de pico entre 10h–16h',
    'Categorias: 73 categorias únicas; top 5 — bed_bath_table, health_beauty, sports_leisure',
    'Ticket médio mais alto: computers (R$ 1.052) e small_appliances (R$ 387)',
    'Pedidos entregues (status=delivered): ~97% do total — utilizados no treinamento',
  ], 0.5, 1.45, 12.3, 5.8, 15);
  console.log('  ✓ Slide  6 — EDA');
}

// ==========================================================================
// SLIDE 7 — PIPELINE
// ==========================================================================
{
  const s = prs.addSlide();
  addRect(s, 0, 0, 13.33, 7.5, CINZA);
  addHeader(s, 'Pipeline de Machine Learning', 'Fluxo completo do projeto — 9 passos');
  const steps = [
    ['1','Dados\nBrutos','6 CSVs'],['2','Carga','Merge\ntabelas'],
    ['3','Limpeza','Outliers\nausentes'],['4','EDA','Análise\ngráficos'],
    ['5','Feature\nEng.','15\nfeatures'],['6','Split','80/20'],
    ['7','Treino','3 modelos'],['8','Avalia','Métricas'],['9','Modelo','Salvo'],
  ];
  steps.forEach(([num, title, desc], i) => {
    const cx = 0.22 + i * 1.44;
    const bg = (i === 0 || i === 8) ? AZUL_ESC : AZUL_MED;
    addRect(s, cx, 1.95, 1.32, 1.55, bg);
    s.addText(num, { x: cx, y: 1.98, w: 1.32, h: 0.4, fontSize: 20, bold: true, color: AZUL_CLR, align: 'center' });
    s.addText(title, { x: cx, y: 2.38, w: 1.32, h: 0.4, fontSize: 10, bold: true, color: BRANCO, align: 'center' });
    s.addText(desc, { x: cx, y: 2.82, w: 1.32, h: 0.6, fontSize: 9, color: BRANCO, align: 'center' });
  });
  addBullets(s, [
    'data_loader.py  →  carregamento e merge das 6 tabelas',
    'preprocessor.py  →  limpeza, outliers e imputação',
    'feature_engineering.py  →  criação das 15 features',
    'model_trainer.py  →  treinamento e serialização do modelo',
    'evaluator.py  →  MAE, MSE, RMSE, R²',
    'visualizer.py  →  4 gráficos salvos em images/',
  ], 0.3, 3.75, 12.7, 3.5, 14);
  console.log('  ✓ Slide  7 — Pipeline');
}

// ==========================================================================
// SLIDE 8 — PRÉ-PROCESSAMENTO
// ==========================================================================
{
  const s = prs.addSlide();
  addRect(s, 0, 0, 13.33, 7.5, CINZA);
  addHeader(s, 'Pré-processamento', 'Limpeza e preparação dos dados brutos');
  const etapas = [
    ['1','Filtragem de Status','Mantidos apenas pedidos com status delivered (~97% do total)'],
    ['2','Remoção de Inválidos','Pedidos com payment_value ≤ 0 ou price ≤ 0 descartados'],
    ['3','Remoção de Outliers','Winsorização nos percentis 1%–99% da variável alvo'],
    ['4','Imputação de Ausentes','Numéricas → mediana  |  Categóricas → "unknown"'],
  ];
  etapas.forEach(([num, titulo, desc], i) => {
    const y = 1.5 + i * 1.38;
    addRect(s, 0.4, y, 0.7, 0.7, AZUL_MED);
    s.addText(num, { x: 0.4, y: y + 0.05, w: 0.7, h: 0.6, fontSize: 22, bold: true, color: BRANCO, align: 'center' });
    s.addText(titulo, { x: 1.25, y: y + 0.02, w: 11.5, h: 0.38, fontSize: 16, bold: true, color: AZUL_ESC });
    s.addText(desc, { x: 1.25, y: y + 0.38, w: 11.5, h: 0.45, fontSize: 14, color: CINZA_TXT });
  });
  s.addText('Resultado: dataset reduzido de ~100k para ~93k pedidos limpos', {
    x: 0.4, y: 7.0, w: 12.5, h: 0.38, fontSize: 13, bold: true, color: AZUL_MED,
  });
  console.log('  ✓ Slide  8 — Pré-processamento');
}

// ==========================================================================
// SLIDE 9 — FEATURES
// ==========================================================================
{
  const s = prs.addSlide();
  addRect(s, 0, 0, 13.33, 7.5, CINZA);
  addHeader(s, 'Engenharia de Atributos', '15 features selecionadas para os modelos de ML');
  addTable(s,
    ['Feature', 'Tipo', 'Descrição'],
    [
      ['price','Numérica','Soma dos preços dos itens do pedido'],
      ['freight_value','Numérica','Soma do frete dos itens'],
      ['n_items','Numérica','Número de itens no pedido'],
      ['product_weight_g','Numérica','Peso médio dos produtos (g)'],
      ['product_volume_cm3','Derivada','Comprimento × Altura × Largura'],
      ['product_photos_qty','Numérica','Quantidade média de fotos'],
      ['payment_installments','Numérica','Número máximo de parcelas'],
      ['freight_ratio','Derivada','freight_value / price'],
      ['price_per_item','Derivada','price / n_items'],
      ['order_month','Temporal','Mês do pedido (1–12)'],
      ['order_day_of_week','Temporal','Dia da semana (0=seg, 6=dom)'],
      ['order_hour','Temporal','Hora do pedido (0–23)'],
      ['customer_state_enc','Categórica','Estado do cliente (LabelEncoded)'],
      ['product_category_enc','Categórica','Categoria do produto (LabelEncoded)'],
      ['payment_type_enc','Categórica','Tipo de pagamento (LabelEncoded)'],
    ],
    0.3, 1.4, 12.7, 5.9
  );
  console.log('  ✓ Slide  9 — Features');
}

// ==========================================================================
// SLIDE 10 — LINEAR REGRESSION
// ==========================================================================
{
  const s = prs.addSlide();
  addRect(s, 0, 0, 13.33, 7.5, CINZA);
  addHeader(s, 'Algoritmo 1: Linear Regression', 'Modelo baseline — referência para comparação');
  addRect(s, 0.5, 1.85, 5.8, 0.85, AZUL_ESC);
  s.addText('ŷ = β₀ + β₁x₁ + β₂x₂ + ... + β₁₅x₁₅', {
    x: 0.6, y: 1.9, w: 5.6, h: 0.75, fontSize: 16, bold: true, color: BRANCO, align: 'center',
  });
  addBullets(s, [
    'Minimiza Soma dos Quadrados dos Resíduos (MQO)',
    'Coeficientes β estimados em forma fechada',
    'Normalização via StandardScaler (Pipeline sklearn)',
    'Assume relação linear entre features e alvo',
  ], 0.5, 2.85, 5.8, 2.5, 15);
  addRect(s, 6.9, 1.45, 5.9, 2.4, VERDE);
  s.addText('Vantagens', { x: 7.0, y: 1.5, w: 5.7, h: 0.45, fontSize: 16, bold: true, color: BRANCO });
  addBullets(s, ['Alta interpretabilidade','Treinamento instantâneo','Garantia analítica'], 7.0, 2.0, 5.7, 1.7, 14, BRANCO);
  addRect(s, 6.9, 4.0, 5.9, 2.5, VERMELHO);
  s.addText('Limitações', { x: 7.0, y: 4.05, w: 5.7, h: 0.45, fontSize: 16, bold: true, color: BRANCO });
  addBullets(s, ['Não captura não-linearidades','Sensível a outliers','Assume independência'], 7.0, 4.55, 5.7, 1.8, 14, BRANCO);
  console.log('  ✓ Slide 10 — Linear Regression');
}

// ==========================================================================
// SLIDE 11 — RANDOM FOREST
// ==========================================================================
{
  const s = prs.addSlide();
  addRect(s, 0, 0, 13.33, 7.5, CINZA);
  addHeader(s, 'Algoritmo 2: Random Forest Regressor', 'Ensemble de árvores com amostragem aleatória');
  addRect(s, 0.5, 1.85, 5.8, 0.85, AZUL_ESC);
  s.addText('ŷ_RF = (1/B) Σᵦ Tᵦ(x)  ,  B = 100 árvores', {
    x: 0.6, y: 1.9, w: 5.6, h: 0.75, fontSize: 14, bold: true, color: BRANCO, align: 'center',
  });
  addBullets(s, [
    'Cada árvore treinada em amostra bootstrap independente',
    'Subconjunto aleatório de features em cada nó (√p)',
    'Predição = média das 100 árvores (reduz variância)',
    'Robusto a overfitting e a valores ausentes',
    'Feature importance via redução de MSE nas divisões',
  ], 0.5, 2.85, 5.8, 3.8, 15);
  addTable(s,
    ['Hiperparâmetro', 'Valor'],
    [['n_estimators','100'],['max_depth','15'],['min_samples_split','5'],
     ['min_samples_leaf','2'],['n_jobs','-1 (paralelo)'],['random_state','42']],
    7.0, 1.5, 5.9, 4.4
  );
  console.log('  ✓ Slide 11 — Random Forest');
}

// ==========================================================================
// SLIDE 12 — XGBOOST
// ==========================================================================
{
  const s = prs.addSlide();
  addRect(s, 0, 0, 13.33, 7.5, CINZA);
  addHeader(s, 'Algoritmo 3: XGBoost Regressor', 'Gradient Boosting com regularização — estado da arte em dados tabulares');
  addRect(s, 0.5, 1.85, 5.8, 0.85, AZUL_ESC);
  s.addText('F_m(x) = F_{m-1}(x) + η · h_m(x)', {
    x: 0.6, y: 1.9, w: 5.6, h: 0.75, fontSize: 15, bold: true, color: BRANCO, align: 'center',
  });
  addBullets(s, [
    'Árvores construídas sequencialmente (boosting)',
    'Cada árvore corrige os resíduos da anterior',
    'η = learning rate controla contribuição de cada árvore',
    'Regularização L1 (reg_alpha) e L2 (reg_lambda)',
    'Subsampling de linhas (80%) e colunas (80%)',
    'Paralelização nativa na construção das árvores',
  ], 0.5, 2.85, 5.8, 4.2, 14);
  addTable(s,
    ['Hiperparâmetro', 'Valor'],
    [['n_estimators','200'],['learning_rate (η)','0,05'],['max_depth','6'],
     ['subsample','0,8'],['colsample_bytree','0,8'],['reg_alpha (L1)','0,1'],['reg_lambda (L2)','1,0']],
    7.0, 1.5, 5.9, 5.2
  );
  console.log('  ✓ Slide 12 — XGBoost');
}

// ==========================================================================
// SLIDE 13 — RESULTADOS
// ==========================================================================
{
  const s = prs.addSlide();
  addRect(s, 0, 0, 13.33, 7.5, CINZA);
  addHeader(s, 'Resultados — Comparação de Métricas', 'Conjunto de teste: 20% dos dados (~19.000 pedidos)');
  addTable(s,
    ['Modelo', 'MAE (R$)', 'MSE', 'RMSE (R$)', 'R²', 'Treino (s)'],
    [
      ['XGBoost ★','~14,80','~720','~26,80','~0,972','~45s'],
      ['Random Forest','~18,20','~1.040','~32,20','~0,960','~12s'],
      ['Linear Regression','~45,00','~4.600','~67,80','~0,850','<1s'],
    ],
    0.4, 1.5, 12.5, 2.8
  );
  s.addText('★  Melhor modelo — salvo automaticamente em models/best_model.pkl', {
    x: 0.4, y: 4.45, w: 12.5, h: 0.4, fontSize: 13, bold: true, color: AZUL_MED,
  });
  s.addText('Interpretação das Métricas:', {
    x: 0.4, y: 5.0, w: 12.5, h: 0.4, fontSize: 15, bold: true, color: AZUL_ESC,
  });
  addBullets(s, [
    'MAE  — erro absoluto médio em R$; robusto a outliers',
    'RMSE — raiz do MSE; mesma unidade do alvo; penaliza erros grandes',
    'R²   — % da variância explicada; R²=1 é predição perfeita',
  ], 0.4, 5.5, 12.5, 1.8, 15);
  console.log('  ✓ Slide 13 — Resultados');
}

// ==========================================================================
// SLIDE 14 — ANÁLISE
// ==========================================================================
{
  const s = prs.addSlide();
  addRect(s, 0, 0, 13.33, 7.5, CINZA);
  addHeader(s, 'Análise dos Resultados', 'Importância das features e conclusões');
  addTable(s,
    ['Feature', 'Importância (%)'],
    [['price','~42%'],['freight_value','~23%'],['price_per_item','~12%'],
     ['payment_installments','~8%'],['product_volume_cm3','~5%'],['Demais features','~10%']],
    0.4, 1.5, 5.8, 4.5
  );
  s.addText('Principais conclusões:', {
    x: 6.8, y: 1.5, w: 6.1, h: 0.4, fontSize: 15, bold: true, color: AZUL_ESC,
  });
  addBullets(s, [
    'XGBoost superou LR em +12 p.p. de R² — confirma não-linearidades',
    'price e freight_value somam ~65% da importância total',
    'Resíduos do XGBoost são centrados em zero (bom ajuste)',
    'Pedidos de alto valor têm maior erro residual (cauda direita)',
    'Features temporais contribuem positivamente ao conjunto',
    'Diferença RF vs XGBoost: apenas ~0,012 de R²',
  ], 6.8, 2.0, 6.1, 5.0, 14);
  console.log('  ✓ Slide 14 — Análise');
}

// ==========================================================================
// SLIDE 15 — DISCUSSÃO
// ==========================================================================
{
  const s = prs.addSlide();
  addRect(s, 0, 0, 13.33, 7.5, CINZA);
  addHeader(s, 'Discussão e Implicações Práticas');
  s.addText('Aplicações do modelo no negócio:', {
    x: 0.4, y: 1.5, w: 12.0, h: 0.4, fontSize: 16, bold: true, color: AZUL_MED,
  });
  addBullets(s, [
    'Previsão de receita diária com base em pedidos em aberto',
    'Detecção de pedidos com valor inconsistente (fraude ou erro)',
    'Segmentação de clientes por valor esperado de compra',
    'Precificação dinâmica de frete baseada no perfil do pedido',
  ], 0.4, 2.0, 12.0, 2.0, 16);
  addRect(s, 0.4, 4.1, 12.4, 0.04, AZUL_CLR);
  s.addText('Limitações identificadas:', {
    x: 0.4, y: 4.2, w: 12.0, h: 0.4, fontSize: 16, bold: true, color: AZUL_MED,
  });
  addBullets(s, [
    'Divisão aleatória — em produção usar validação temporal',
    'Hiperparâmetros manuais — GridSearchCV/Optuna pode melhorar',
    'Transformação logarítmica no alvo pode beneficiar modelo linear',
    'Features externas ausentes: feriados, campanhas e macroeconomia',
  ], 0.4, 4.7, 12.0, 2.5, 15);
  console.log('  ✓ Slide 15 — Discussão');
}

// ==========================================================================
// SLIDE 16 — CONCLUSÃO
// ==========================================================================
{
  const s = prs.addSlide();
  addRect(s, 0, 0, 13.33, 7.5, AZUL_ESC);
  addRect(s, 0, 0, 13.33, 1.25, AZUL_MED);
  s.addText('Conclusão e Próximos Passos', {
    x: 0.4, y: 0.15, w: 12.5, h: 0.9, fontSize: 26, bold: true, color: BRANCO,
  });
  s.addText('O que foi alcançado:', {
    x: 0.5, y: 1.5, w: 5.9, h: 0.4, fontSize: 15, bold: true, color: AZUL_CLR,
  });
  addBullets(s, [
    'Pipeline completo e reprodutível com dados reais',
    'Engenharia de 15 features a partir de 6 tabelas',
    'XGBoost: R² ≈ 0,97 | RMSE ≈ R$ 27 no teste',
    '4 gráficos e modelo .pkl gerados automaticamente',
    'Notebook, artigo e apresentação produzidos',
  ], 0.5, 2.0, 5.9, 3.5, 15, BRANCO);
  addRect(s, 6.55, 1.35, 0.04, 6.0, AZUL_MED);
  s.addText('Próximos passos:', {
    x: 6.9, y: 1.5, w: 6.0, h: 0.4, fontSize: 15, bold: true, color: AZUL_CLR,
  });
  addBullets(s, [
    'Validação cruzada temporal (TimeSeriesSplit)',
    'Otimização com Optuna / GridSearchCV',
    'Transformação log no alvo (reduz assimetria)',
    'Adicionar features geoespaciais (lat/lng)',
    'Comparar com redes neurais (MLP, TabNet)',
    'Deploy da API de predição (FastAPI + Docker)',
  ], 6.9, 2.0, 6.0, 4.5, 15, BRANCO);
  s.addText('github.com/seu-usuario/ecommerce-sales-prediction', {
    x: 0.5, y: 7.05, w: 12.3, h: 0.38, fontSize: 12, color: AZUL_CLR, align: 'center',
  });
  console.log('  ✓ Slide 16 — Conclusão');
}

// ==========================================================================
// SALVAR
// ==========================================================================
const outputPath = path.join(__dirname, 'apresentacao.pptx');
prs.writeFile({ fileName: outputPath }).then(() => {
  console.log(`\n✓ Apresentação salva em: ${outputPath}`);
  console.log(`  Total de slides: 16`);
}).catch(err => {
  console.error('Erro ao salvar:', err);
  process.exit(1);
});
