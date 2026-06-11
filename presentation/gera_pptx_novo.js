// gera_pptx_novo.js — Apresentação simplificada e visual
// node gera_pptx_novo.js → presentation/apresentacao.pptx

const PptxGenJS = require('../node_modules/pptxgenjs');
const path = require('path');

const prs = new PptxGenJS();
prs.layout = 'LAYOUT_WIDE';

// Cores
const AZUL     = '2C7BB6';
const AZUL_ESC = '1A3A5C';
const VERDE    = '27AE60';
const LARANJA  = 'E67E22';
const ROXO     = '8E44AD';
const BRANCO   = 'FFFFFF';
const CINZA    = 'F4F6F8';
const TEXTO    = '2C3E50';
const CINZA_M  = '7F8C8D';

const W = 13.33;
const H = 7.5;
const OUTPUT = path.join(__dirname, 'apresentacao.pptx');

// ─── helpers ────────────────────────────────────────────────────────────────

function bg(s, color) {
  s.addShape(prs.ShapeType.rect, { x:0, y:0, w:W, h:H, fill:{color}, line:{color,width:0} });
}

function rect(s, x, y, w, h, color) {
  s.addShape(prs.ShapeType.rect, { x, y, w, h, fill:{color}, line:{color,width:0} });
}

function txt(s, text, x, y, w, h, opts={}) {
  s.addText(text, { x, y, w, h,
    fontSize: opts.size || 18,
    bold: opts.bold || false,
    color: opts.color || TEXTO,
    align: opts.align || 'left',
    valign: opts.valign || 'top',
    wrap: true,
    ...opts.extra
  });
}

function card(s, x, y, w, h, color, title, subtitle) {
  rect(s, x, y, w, h, color);
  txt(s, title,    x, y+0.08, w, 0.75, { size:28, bold:true, color:BRANCO, align:'center' });
  txt(s, subtitle, x, y+0.78, w, 0.5,  { size:13, color:BRANCO, align:'center' });
}

function header(s, titulo, cor) {
  rect(s, 0, 0, W, 1.2, cor || AZUL_ESC);
  txt(s, titulo, 0.4, 0.15, 12.5, 0.9, { size:30, bold:true, color:BRANCO, valign:'middle' });
}

function tag(s, x, y, texto, cor) {
  rect(s, x, y, 0.38, 0.38, cor);
  txt(s, texto, x, y+0.01, 0.38, 0.38, { size:16, bold:true, color:BRANCO, align:'center', valign:'middle' });
}

// ─── SLIDE 1 — CAPA ─────────────────────────────────────────────────────────
{
  const s = prs.addSlide();
  bg(s, AZUL_ESC);
  // Faixa de destaque
  rect(s, 0, 2.6, W, 0.06, AZUL);
  // Emoji decorativo
  txt(s, '🛒', 0.5, 0.7, 1.2, 1.2, { size:52, align:'center', extra:{color:'FFFFFF'} });
  // Título
  txt(s, 'Previsão de Vendas\nem E-commerce', 1.8, 0.65, 11.0, 2.0,
    { size:42, bold:true, color:BRANCO });
  // Subtítulo
  txt(s, 'Como a Inteligência Artificial pode prever o valor de um pedido antes de ele ser pago',
    1.8, 2.75, 11.0, 1.0, { size:17, color:'ABD9E9' });
  // Tags dos algoritmos
  const tags = ['Regressão Linear', 'Random Forest', 'XGBoost'];
  tags.forEach((t, i) => {
    rect(s, 1.8 + i*3.7, 4.0, 3.3, 0.55, AZUL);
    txt(s, t, 1.8 + i*3.7, 4.02, 3.3, 0.5, { size:14, color:BRANCO, align:'center' });
  });
  txt(s, 'Dataset: 100.000 pedidos reais  ·  Olist  ·  2016–2018',
    0, 6.8, W, 0.45, { size:13, color:'7F8C8D', align:'center' });
  console.log('  ✓ Slide  1 — Capa');
}

// ─── SLIDE 2 — O PROBLEMA ───────────────────────────────────────────────────
{
  const s = prs.addSlide();
  bg(s, CINZA);
  header(s, 'Qual é o Problema?');

  // Número de impacto
  rect(s, 0.4, 1.4, 5.5, 2.2, AZUL);
  txt(s, 'R$ 185 bi', 0.4, 1.5, 5.5, 1.1, { size:44, bold:true, color:BRANCO, align:'center' });
  txt(s, 'faturados pelo e-commerce\nbrasileiro em 2023', 0.4, 2.55, 5.5, 0.9,
    { size:14, color:BRANCO, align:'center' });

  // Pergunta central
  rect(s, 6.3, 1.4, 6.6, 2.2, AZUL_ESC);
  txt(s, '❓', 6.3, 1.45, 6.6, 0.8, { size:36, align:'center', extra:{color:'FFFFFF'} });
  txt(s, 'Como saber quanto\num cliente vai pagar\nantes de finalizar\no pedido?',
    6.3, 2.2, 6.6, 1.8, { size:18, bold:true, color:BRANCO, align:'center' });

  // Por que isso importa
  txt(s, 'Por que isso importa?', 0.4, 3.9, 12.5, 0.5, { size:18, bold:true, color:AZUL_ESC });
  const razoes = [
    ['💰', 'Planejar receita com antecedência'],
    ['📦', 'Organizar logística e estoque'],
    ['🎯', 'Criar ofertas personalizadas para cada cliente'],
  ];
  razoes.forEach(([emoji, texto], i) => {
    const x = 0.4 + i * 4.3;
    rect(s, x, 4.5, 4.0, 1.5, BRANCO);
    txt(s, emoji, x, 4.55, 4.0, 0.7, { size:28, align:'center' });
    txt(s, texto, x, 5.2, 4.0, 0.7, { size:13, color:TEXTO, align:'center' });
  });
  console.log('  ✓ Slide  2 — O Problema');
}

// ─── SLIDE 3 — A SOLUÇÃO ────────────────────────────────────────────────────
{
  const s = prs.addSlide();
  bg(s, CINZA);
  header(s, 'O Que Fizemos?');

  txt(s, 'Treinamos uma IA com 94.562 pedidos reais para aprender os padrões de compra.',
    0.4, 1.35, 12.5, 0.65, { size:19, color:TEXTO });

  // 5 passos visuais simples
  const passos = [
    ['📥', 'Coletamos\nos Dados', 'Dataset real\nKaggle / Olist'],
    ['🧹', 'Limpamos\nos Dados', 'Removemos\nerros e anomalias'],
    ['🔧', 'Criamos\nVariáveis', 'Extraímos\npadrões ocultos'],
    ['🤖', 'Treinamos\na IA', '3 algoritmos\ndiferentes'],
    ['🏆', 'Comparamos\nos Resultados', 'Escolhemos\no melhor'],
  ];
  passos.forEach(([emoji, titulo, desc], i) => {
    const x = 0.3 + i * 2.6;
    rect(s, x, 2.2, 2.3, 2.8, BRANCO);
    rect(s, x, 2.2, 2.3, 0.08, AZUL);
    txt(s, emoji, x, 2.3, 2.3, 0.9, { size:32, align:'center' });
    txt(s, titulo, x, 3.2, 2.3, 0.7, { size:14, bold:true, color:AZUL_ESC, align:'center' });
    txt(s, desc,   x, 3.9, 2.3, 0.9, { size:12, color:CINZA_M, align:'center' });
    // Seta
    if (i < 4) {
      txt(s, '→', x+2.3, 3.25, 0.3, 0.5, { size:22, bold:true, color:AZUL, align:'center' });
    }
  });

  txt(s, '⏱  Tempo total de execução: ~1 minuto e 40 segundos',
    0.4, 5.3, 12.5, 0.5, { size:14, color:CINZA_M });
  console.log('  ✓ Slide  3 — A Solução');
}

// ─── SLIDE 4 — OS DADOS ─────────────────────────────────────────────────────
{
  const s = prs.addSlide();
  bg(s, CINZA);
  header(s, 'De Onde Vieram os Dados?');

  // Logo / nome
  rect(s, 0.4, 1.4, 12.5, 0.7, AZUL);
  txt(s, 'Brazilian E-Commerce Dataset — Olist (Kaggle)  ·  Dados 100% reais',
    0.4, 1.44, 12.5, 0.6, { size:16, color:BRANCO, align:'center', bold:true });

  // Cards de números
  const cards = [
    [AZUL,    '94.562',  'Pedidos utilizados'],
    [VERDE,   '2 anos',  '2016 a 2018'],
    [LARANJA, '27',      'Estados do Brasil'],
    [ROXO,    '73',      'Categorias de produto'],
  ];
  cards.forEach(([cor, val, label], i) => {
    const x = 0.4 + i*3.22;
    card(s, x, 2.35, 2.9, 1.55, cor, val, label);
  });

  // O que analisamos
  txt(s, 'O que cada pedido nos conta:', 0.4, 4.15, 12.5, 0.5,
    { size:17, bold:true, color:AZUL_ESC });

  const infos = [
    ['🛍️', 'Quais produtos\nforam comprados'],
    ['📍', 'Onde mora\no cliente'],
    ['💳', 'Como vai\npagar'],
    ['📦', 'Peso e tamanho\ndos produtos'],
    ['🚚', 'Valor\ndo frete'],
  ];
  infos.forEach(([emoji, texto], i) => {
    const x = 0.4 + i*2.58;
    rect(s, x, 4.75, 2.3, 1.6, BRANCO);
    txt(s, emoji, x, 4.8, 2.3, 0.65, { size:26, align:'center' });
    txt(s, texto, x, 5.45, 2.3, 0.75, { size:12, color:TEXTO, align:'center' });
  });
  console.log('  ✓ Slide  4 — Os Dados');
}

// ─── SLIDE 5 — COMO A IA APRENDE ────────────────────────────────────────────
{
  const s = prs.addSlide();
  bg(s, CINZA);
  header(s, 'Como a IA Aprende?');

  txt(s,
    'Mostramos para o modelo milhares de pedidos onde já sabíamos o valor final.\nEle foi descobrindo sozinho quais características mais influenciam o preço.',
    0.4, 1.35, 12.5, 1.1, { size:18, color:TEXTO });

  // Divisão treino / teste visual
  rect(s, 0.4, 2.65, 8.0, 2.0, AZUL);
  txt(s, '🎓  80% dos pedidos — Treinamento', 0.4, 2.72, 8.0, 0.6,
    { size:17, bold:true, color:BRANCO, align:'center' });
  txt(s, 'A IA aprende os padrões aqui', 0.4, 3.3, 8.0, 0.6,
    { size:14, color:BRANCO, align:'center' });

  rect(s, 8.7, 2.65, 4.2, 2.0, VERDE);
  txt(s, '🧪  20% — Teste', 8.7, 2.72, 4.2, 0.6,
    { size:17, bold:true, color:BRANCO, align:'center' });
  txt(s, 'Avaliamos se acertou\npedidos nunca vistos', 8.7, 3.3, 4.2, 0.75,
    { size:14, color:BRANCO, align:'center' });

  // Numeros
  txt(s, '75.649 pedidos', 0.4, 4.8, 8.0, 0.5,
    { size:13, color:CINZA_M, align:'center' });
  txt(s, '18.913 pedidos', 8.7, 4.8, 4.2, 0.5,
    { size:13, color:CINZA_M, align:'center' });

  // Analogia
  rect(s, 0.4, 5.5, 12.5, 1.55, AZUL_ESC);
  txt(s, '💡  É como estudar com exercícios resolvidos (treino) e depois fazer a prova com questões novas (teste).',
    0.55, 5.6, 12.2, 1.3, { size:16, color:BRANCO });
  console.log('  ✓ Slide  5 — Como a IA Aprende');
}

// ─── SLIDE 6 — REGRESSÃO LINEAR ─────────────────────────────────────────────
{
  const s = prs.addSlide();
  bg(s, CINZA);
  header(s, 'Modelo 1: Regressão Linear', AZUL);

  txt(s, 'A ideia mais simples: se o preço do produto aumenta, o valor do pedido aumenta na mesma proporção.',
    0.4, 1.35, 12.5, 0.8, { size:18, color:TEXTO });

  // Analogia visual
  rect(s, 0.4, 2.3, 5.8, 3.5, BRANCO);
  txt(s, '📏', 0.4, 2.4, 5.8, 1.1, { size:52, align:'center' });
  txt(s, 'Pense em uma régua', 0.4, 3.45, 5.8, 0.5,
    { size:16, bold:true, color:AZUL_ESC, align:'center' });
  txt(s, 'O modelo traça a melhor linha\nreta que passa pelo meio\nde todos os pedidos.',
    0.4, 4.0, 5.8, 1.6, { size:14, color:TEXTO, align:'center' });

  // Características
  txt(s, 'Características:', 6.6, 2.3, 6.3, 0.5, { size:16, bold:true, color:AZUL_ESC });
  const items = [
    ['✅', 'O mais simples e rápido de treinar'],
    ['✅', 'Fácil de explicar para qualquer pessoa'],
    ['✅', 'Funciona muito bem quando a relação é direta'],
    ['⚠️', 'Não captura comportamentos complexos'],
  ];
  items.forEach(([icon, texto], i) => {
    rect(s, 6.6, 2.9 + i*0.85, 6.3, 0.72, i < 3 ? BRANCO : CINZA);
    txt(s, `${icon}  ${texto}`, 6.75, 2.95 + i*0.85, 6.0, 0.6, { size:15, color:TEXTO });
  });
  console.log('  ✓ Slide  6 — Regressão Linear');
}

// ─── SLIDE 7 — RANDOM FOREST ────────────────────────────────────────────────
{
  const s = prs.addSlide();
  bg(s, CINZA);
  header(s, 'Modelo 2: Random Forest', VERDE);

  txt(s, 'Em vez de uma única decisão, pede a opinião de 100 "árvores de decisão" diferentes e tira a média.',
    0.4, 1.35, 12.5, 0.8, { size:18, color:TEXTO });

  // Analogia
  rect(s, 0.4, 2.3, 5.8, 3.5, BRANCO);
  txt(s, '🌳🌲🌴', 0.4, 2.4, 5.8, 1.0, { size:40, align:'center' });
  txt(s, 'Uma floresta de decisões', 0.4, 3.4, 5.8, 0.5,
    { size:16, bold:true, color:'27AE60', align:'center' });
  txt(s, 'É como perguntar para 100 pessoas\ndifferentes. Cada uma vê o problema\nde um ângulo diferente.\nA resposta final é a média de todos.',
    0.4, 3.95, 5.8, 1.7, { size:13, color:TEXTO, align:'center' });

  txt(s, 'Características:', 6.6, 2.3, 6.3, 0.5, { size:16, bold:true, color:AZUL_ESC });
  const items = [
    ['✅', 'Mais preciso que a Regressão Linear'],
    ['✅', 'Detecta padrões não óbvios nos dados'],
    ['✅', 'Resistente a dados inconsistentes'],
    ['⚠️', 'Mais lento para treinar'],
  ];
  items.forEach(([icon, texto], i) => {
    rect(s, 6.6, 2.9 + i*0.85, 6.3, 0.72, i < 3 ? BRANCO : CINZA);
    txt(s, `${icon}  ${texto}`, 6.75, 2.95 + i*0.85, 6.0, 0.6, { size:15, color:TEXTO });
  });
  console.log('  ✓ Slide  7 — Random Forest');
}

// ─── SLIDE 8 — XGBOOST ──────────────────────────────────────────────────────
{
  const s = prs.addSlide();
  bg(s, CINZA);
  header(s, 'Modelo 3: XGBoost', LARANJA);

  txt(s, 'O modelo aprende com os próprios erros. Cada tentativa corrige o que errou na anterior.',
    0.4, 1.35, 12.5, 0.8, { size:18, color:TEXTO });

  rect(s, 0.4, 2.3, 5.8, 3.5, BRANCO);
  txt(s, '🎯', 0.4, 2.4, 5.8, 1.0, { size:52, align:'center' });
  txt(s, 'Aprendizado progressivo', 0.4, 3.4, 5.8, 0.5,
    { size:16, bold:true, color:LARANJA, align:'center' });
  txt(s, 'É como um estudante que refaz\nas questões que errou na prova\naté dominar cada uma delas.\nCada rodada fica melhor.',
    0.4, 3.95, 5.8, 1.7, { size:13, color:TEXTO, align:'center' });

  txt(s, 'Características:', 6.6, 2.3, 6.3, 0.5, { size:16, bold:true, color:AZUL_ESC });
  const items = [
    ['✅', 'Referência em competições de dados'],
    ['✅', 'Extremamente preciso em dados do mundo real'],
    ['✅', 'Se ajusta automaticamente aos erros'],
    ['⚠️', 'Mais complexo e demorado'],
  ];
  items.forEach(([icon, texto], i) => {
    rect(s, 6.6, 2.9 + i*0.85, 6.3, 0.72, i < 3 ? BRANCO : CINZA);
    txt(s, `${icon}  ${texto}`, 6.75, 2.95 + i*0.85, 6.0, 0.6, { size:15, color:TEXTO });
  });
  console.log('  ✓ Slide  8 — XGBoost');
}

// ─── SLIDE 9 — RESULTADOS ───────────────────────────────────────────────────
{
  const s = prs.addSlide();
  bg(s, AZUL_ESC);
  rect(s, 0, 0, W, 1.2, AZUL);
  txt(s, 'Os Resultados', 0.4, 0.15, 12.5, 0.9,
    { size:30, bold:true, color:BRANCO, valign:'middle' });

  txt(s, 'Testamos os 3 modelos em 18.913 pedidos que a IA nunca tinha visto antes.',
    0.4, 1.35, 12.5, 0.6, { size:17, color:'ABD9E9' });

  // 3 cards de resultado
  const modelos = [
    [AZUL,    '🥇', 'Regressão Linear', '100%', 'R$ 0,78', 'de erro médio'],
    [VERDE,   '🥈', 'Random Forest',    '99,98%', 'R$ 1,88', 'de erro médio'],
    [LARANJA, '🥉', 'XGBoost',          '99,92%', 'R$ 4,05', 'de erro médio'],
  ];
  modelos.forEach(([cor, medal, nome, acerto, erro, label], i) => {
    const x = 0.4 + i * 4.28;
    rect(s, x, 2.1, 3.9, 4.5, cor);
    txt(s, medal, x, 2.2, 3.9, 0.9, { size:40, align:'center' });
    txt(s, nome,  x, 3.1, 3.9, 0.6, { size:15, bold:true, color:BRANCO, align:'center' });
    txt(s, acerto, x, 3.75, 3.9, 0.9, { size:36, bold:true, color:BRANCO, align:'center' });
    txt(s, 'de acurácia', x, 4.6, 3.9, 0.4, { size:12, color:BRANCO, align:'center' });
    txt(s, erro,  x, 5.1, 3.9, 0.6, { size:22, bold:true, color:BRANCO, align:'center' });
    txt(s, label, x, 5.65, 3.9, 0.4, { size:12, color:BRANCO, align:'center' });
  });
  console.log('  ✓ Slide  9 — Resultados');
}

// ─── SLIDE 10 — QUAL MODELO GANHOU? ─────────────────────────────────────────
{
  const s = prs.addSlide();
  bg(s, CINZA);
  header(s, 'Qual Modelo Ganhou e Por Quê?');

  // Destaque do vencedor
  rect(s, 0.4, 1.4, 12.5, 2.0, AZUL);
  txt(s, '🥇  Regressão Linear venceu com R² = 1,0000',
    0.4, 1.5, 12.5, 0.75, { size:24, bold:true, color:BRANCO, align:'center' });
  txt(s, 'Erro médio de apenas R$ 0,78 em pedidos com valor médio de R$ 145',
    0.4, 2.2, 12.5, 0.6, { size:17, color:BRANCO, align:'center' });

  // Explicação em linguagem simples
  txt(s, 'Por que um modelo simples ganhou dos mais complexos?',
    0.4, 3.65, 12.5, 0.5, { size:17, bold:true, color:AZUL_ESC });

  const razoes = [
    ['💡', 'O valor final de um pedido é quase sempre:\npreço dos produtos + frete. Relação direta!'],
    ['📐', 'Quando a relação entre as variáveis é linear,\na Regressão Linear é imbatível.'],
    ['✅', 'Modelos mais complexos foram bons também,\nmas não trouxeram vantagem adicional.'],
  ];
  razoes.forEach(([icon, texto], i) => {
    rect(s, 0.4 + i*4.3, 4.3, 4.0, 2.0, BRANCO);
    txt(s, icon,  0.4 + i*4.3, 4.38, 4.0, 0.7, { size:30, align:'center' });
    txt(s, texto, 0.4 + i*4.3, 5.1, 4.0, 1.1, { size:13, color:TEXTO, align:'center' });
  });
  console.log('  ✓ Slide 10 — Qual Modelo Ganhou?');
}

// ─── SLIDE 11 — NA PRÁTICA ──────────────────────────────────────────────────
{
  const s = prs.addSlide();
  bg(s, CINZA);
  header(s, 'O Que Isso Significa na Prática?');

  txt(s, 'Com esse modelo, uma empresa de e-commerce poderia:',
    0.4, 1.35, 12.5, 0.55, { size:18, color:TEXTO });

  const apps = [
    ['💰', 'Prever Receita', 'Saber quanto vai\nfaturar amanhã\ncom os pedidos em aberto'],
    ['🚨', 'Detectar Fraudes', 'Pedido esperado: R$ 120\nPedido recebido: R$ 1.200\n→ Algo está errado'],
    ['🎁', 'Personalizar Ofertas', 'Dar desconto para clientes\nque provavelmente fariam\npedidos de alto valor'],
    ['📊', 'Planejar Estoque', 'Antecipar quais categorias\nde produto vão movimentar\nmais receita'],
  ];
  apps.forEach(([icon, titulo, desc], i) => {
    const x = 0.4 + i * 3.22;
    rect(s, x, 2.1, 2.9, 4.5, BRANCO);
    rect(s, x, 2.1, 2.9, 0.08, AZUL);
    txt(s, icon,   x, 2.2, 2.9, 0.9, { size:32, align:'center' });
    txt(s, titulo, x, 3.1, 2.9, 0.55, { size:14, bold:true, color:AZUL_ESC, align:'center' });
    txt(s, desc,   x, 3.7, 2.9, 1.7, { size:12, color:TEXTO, align:'center' });
  });
  console.log('  ✓ Slide 11 — Na Prática');
}

// ─── SLIDE 12 — O QUE APRENDEMOS ────────────────────────────────────────────
{
  const s = prs.addSlide();
  bg(s, CINZA);
  header(s, 'O Que Aprendemos?');

  const aprendizados = [
    ['🤖', 'IA funciona\ncom dados reais',
     'Usamos 94.562 pedidos reais e obtivemos resultados excelentes.'],
    ['📊', 'Simplicidade\ntambém vence',
     'O modelo mais simples teve o melhor desempenho neste problema.'],
    ['🔄', 'O pipeline\ncompleto importa',
     'Limpeza e preparação dos dados foram tão importantes quanto o algoritmo.'],
    ['💡', 'Resultados\nexplicáveis',
     'O valor de um pedido = preço + frete. A IA confirmou o que o senso comum dizia.'],
  ];

  aprendizados.forEach(([icon, titulo, desc], i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = 0.4  + col * 6.5;
    const y = 1.45 + row * 2.6;
    rect(s, x, y, 6.0, 2.3, BRANCO);
    rect(s, x, y, 0.08, 2.3, AZUL);
    txt(s, icon,   x+0.25, y+0.15, 1.0, 0.9, { size:32 });
    txt(s, titulo, x+1.3,  y+0.12, 4.5, 0.75, { size:17, bold:true, color:AZUL_ESC });
    txt(s, desc,   x+1.3,  y+0.9,  4.5, 1.2,  { size:13, color:TEXTO });
  });
  console.log('  ✓ Slide 12 — O Que Aprendemos?');
}

// ─── SLIDE 13 — DEMONSTRAÇÃO AO VIVO ────────────────────────────────────────
{
  const s = prs.addSlide();
  bg(s, AZUL_ESC);
  rect(s, 0, 0, W, 1.2, AZUL);
  txt(s, 'Demonstração ao Vivo 🚀', 0.4, 0.15, 12.5, 0.9,
    { size:30, bold:true, color:BRANCO, valign:'middle' });

  txt(s, 'Execute no terminal:', 0.4, 1.4, 12.5, 0.5, { size:18, color:'ABD9E9' });

  // Bloco de código
  rect(s, 0.4, 2.0, 12.5, 1.1, '0D1117');
  txt(s, 'python -X utf8 main.py', 0.75, 2.08, 12.0, 0.95,
    { size:24, bold:true, color:'58A6FF' });

  // O que vai aparecer
  txt(s, 'O que você vai ver:', 0.4, 3.35, 12.5, 0.5, { size:18, color:'ABD9E9' });
  const saida = [
    '✓  94.562 pedidos carregados do dataset Olist',
    '✓  3 modelos treinados automaticamente',
    '✓  Tabela de comparação de resultados',
    '✓  4 gráficos salvos em images/',
    '✓  Melhor modelo salvo em models/',
  ];
  saida.forEach((linha, i) => {
    txt(s, linha, 0.5, 3.95 + i*0.58, 12.3, 0.55, { size:15, color:BRANCO });
  });
  console.log('  ✓ Slide 13 — Demonstração ao Vivo');
}

// ─── SLIDE 14 — OBRIGADO ────────────────────────────────────────────────────
{
  const s = prs.addSlide();
  bg(s, AZUL_ESC);
  rect(s, 0, 0, W, 0.08, AZUL);
  rect(s, 0, 7.42, W, 0.08, AZUL);

  txt(s, '🙏', 0.4, 1.0, W-0.8, 1.2, { size:52, align:'center' });
  txt(s, 'Obrigado!', 0, 2.2, W, 1.0,
    { size:52, bold:true, color:BRANCO, align:'center' });
  txt(s, 'Dúvidas?', 0, 3.2, W, 0.7,
    { size:26, color:'ABD9E9', align:'center' });

  // Resumo final
  rect(s, 1.5, 4.2, 10.3, 1.8, AZUL);
  const resumo = '94.562 pedidos  ·  3 algoritmos  ·  R² = 1,0000  ·  Erro médio: R$ 0,78';
  txt(s, resumo, 1.5, 4.55, 10.3, 0.9,
    { size:15, color:BRANCO, align:'center', bold:true });

  txt(s, 'github.com/gustavofelipeelsner/ecommerce',
    0, 6.6, W, 0.5, { size:14, color:'7F8C8D', align:'center' });
  console.log('  ✓ Slide 14 — Obrigado');
}

// ─── SALVAR ──────────────────────────────────────────────────────────────────
prs.writeFile({ fileName: OUTPUT }).then(() => {
  console.log(`\n✓ Nova apresentação salva em: ${OUTPUT}`);
  console.log(`  Total: 14 slides`);
}).catch(err => { console.error(err); process.exit(1); });
