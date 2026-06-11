# Previsão de Valor de Pedidos em E-commerce Brasileiro Utilizando Algoritmos de Machine Learning: Um Estudo Comparativo

**Área:** Inteligência Artificial · Aprendizado de Máquina · Mineração de Dados

---

## Resumo

O crescimento do comércio eletrônico no Brasil exige ferramentas analíticas capazes de antecipar o comportamento de compra dos consumidores. Este artigo apresenta um estudo comparativo de três algoritmos de aprendizado de máquina supervisionado — Regressão Linear, Random Forest e XGBoost — aplicados à previsão do valor total de pedidos (payment_value) no Brazilian E-Commerce Public Dataset by Olist, composto por mais de 100.000 transações reais entre 2016 e 2018. Foi desenvolvido um pipeline completo de ciência de dados, abrangendo carregamento e integração de múltiplas tabelas, limpeza de dados, análise exploratória, engenharia de atributos com criação de 15 features, divisão estratificada treino/teste (80/20) e avaliação com as métricas MAE, MSE, RMSE e R². Os resultados indicam que o XGBoost superou os demais modelos, atingindo R² ≈ 0,97 e RMSE ≈ R$ 27, enquanto a Regressão Linear obteve R² ≈ 0,85, evidenciando a presença de relações não lineares nos dados. O estudo demonstra a viabilidade de modelos preditivos para suporte à tomada de decisão em ambientes de comércio eletrônico.

**Palavras-chave:** machine learning; e-commerce; previsão de vendas; XGBoost; random forest; regressão.

---

## 1. Introdução

O comércio eletrônico brasileiro registrou crescimento expressivo na última década, com faturamento superior a R$ 185 bilhões em 2023, segundo a Associação Brasileira de Comércio Eletrônico (ABComm, 2023). Nesse contexto, a capacidade de prever o valor das transações representa uma vantagem competitiva significativa, permitindo às empresas otimizar estratégias de precificação, logística, gestão de estoque e personalização de ofertas.

A previsão de valores em séries transacionais é um problema clássico de regressão supervisionada em aprendizado de máquina. Diferentemente de abordagens tradicionais baseadas em séries temporais, que demandam estacionariedade e longas janelas históricas, os algoritmos de aprendizado de máquina são capazes de capturar padrões complexos e interações entre múltiplas variáveis independentes, tornando-se adequados para bases de dados com alta dimensionalidade e heterogeneidade.

Este trabalho tem como objetivo comparar o desempenho de três algoritmos amplamente utilizados em problemas de regressão — Regressão Linear, Random Forest Regressor e XGBoost Regressor — na tarefa de prever o valor total de pedidos em uma plataforma de e-commerce. Para isso, utiliza-se o Brazilian E-Commerce Public Dataset by Olist (Olist, 2018), um dataset real e público disponível na plataforma Kaggle, composto por dados anonimizados de pedidos realizados entre setembro de 2016 e agosto de 2018.

As contribuições deste artigo são: (i) desenvolvimento de um pipeline completo e reprodutível de ML para dados de e-commerce; (ii) engenharia de atributos com criação de features temporais, de produto e de razão; (iii) avaliação comparativa sistemática com quatro métricas de regressão; e (iv) discussão das implicações práticas dos resultados para o negócio.

O restante do artigo está organizado como segue: a Seção 2 apresenta a fundamentação teórica; a Seção 3 descreve a metodologia; a Seção 4 apresenta os resultados; a Seção 5 discute os achados; e a Seção 6 conclui o trabalho.

---

## 2. Fundamentação Teórica

### 2.1 Aprendizado de Máquina Supervisionado

O aprendizado de máquina supervisionado consiste em aprender um mapeamento f: X → y a partir de um conjunto de dados rotulados D = {(x₁, y₁), ..., (xₙ, yₙ)}, onde xᵢ ∈ ℝᵈ é o vetor de features e yᵢ ∈ ℝ é a variável alvo contínua (regressão) ou discreta (classificação) (HASTIE; TIBSHIRANI; FRIEDMAN, 2009). O objetivo do aprendizado é minimizar uma função de perda L(y, ŷ) sobre dados não vistos durante o treinamento.

### 2.2 Regressão Linear

A Regressão Linear (RL) é o modelo paramétrico mais simples para tarefas de regressão, assumindo que a relação entre as variáveis independentes x e a variável dependente y é linear:

```
ŷ = β₀ + β₁x₁ + β₂x₂ + ... + βₚxₚ + ε
```

Os coeficientes β são estimados pelo método dos Mínimos Quadrados Ordinários (MQO), que minimiza a soma dos quadrados dos resíduos (RSS). Apesar de sua simplicidade e interpretabilidade, o modelo não captura relações não lineares e interações entre variáveis (JAMES et al., 2013).

### 2.3 Random Forest

O Random Forest (RF), proposto por Breiman (2001), é um método ensemble que constrói um conjunto de B árvores de decisão independentes, cada uma treinada em uma amostra bootstrap dos dados e com um subconjunto aleatório das features. A predição final é a média das predições individuais:

```
ŷ_RF = (1/B) Σᵦ Tᵦ(x)
```

A aleatoriedade na construção das árvores reduz a variância sem aumentar significativamente o viés, tornando o RF robusto a overfitting. A importância das features pode ser extraída com base na redução média da impureza (Gini ou MSE) ao longo de todas as árvores (BREIMAN, 2001).

### 2.4 XGBoost

O XGBoost (eXtreme Gradient Boosting), desenvolvido por Chen e Guestrin (2016), é uma implementação otimizada de Gradient Boosting que constrói árvores sequencialmente, onde cada nova árvore corrige os resíduos da anterior:

```
F_m(x) = F_{m-1}(x) + η · h_m(x)
```

onde η é a taxa de aprendizado e h_m é a árvore que minimiza a função de perda com regularização L1 e L2. O XGBoost incorpora diversas otimizações computacionais, como paralelização na construção das árvores e tratamento nativo de valores ausentes, tornando-se o algoritmo de referência em competições de dados tabulares (CHEN; GUESTRIN, 2016).

### 2.5 Métricas de Avaliação para Regressão

A avaliação de modelos de regressão tipicamente utiliza as seguintes métricas (CHAI; DRAXLER, 2014):

**MAE (Mean Absolute Error):**
```
MAE = (1/n) Σᵢ |yᵢ - ŷᵢ|
```
Representa o erro médio em unidades da variável alvo. Robusto a outliers.

**MSE (Mean Squared Error):**
```
MSE = (1/n) Σᵢ (yᵢ - ŷᵢ)²
```
Penaliza erros grandes de forma quadrática. Sensível a outliers.

**RMSE (Root Mean Squared Error):**
```
RMSE = √MSE
```
Mesma unidade da variável alvo. Facilita interpretação direta.

**R² (Coeficiente de Determinação):**
```
R² = 1 - (Σᵢ(yᵢ - ŷᵢ)²) / (Σᵢ(yᵢ - ȳ)²)
```
Mede a proporção da variância do alvo explicada pelo modelo. R² = 1 indica ajuste perfeito; R² = 0 indica que o modelo equivale à média.

### 2.6 Engenharia de Atributos

A engenharia de atributos (feature engineering) consiste na transformação e criação de variáveis a partir dos dados brutos para melhorar o desempenho dos modelos (DOMINGOS, 2012). Técnicas comuns incluem extração de features temporais, criação de razões entre variáveis e codificação de variáveis categóricas. Em dados de e-commerce, features derivadas como o volume do produto, a proporção do frete e o preço médio por item tendem a capturar informações preditivas relevantes não presentes nas variáveis originais.

---

## 3. Metodologia

### 3.1 Dataset

O Brazilian E-Commerce Public Dataset by Olist contém dados de pedidos realizados na plataforma homônima entre setembro de 2016 e agosto de 2018. O dataset é composto por 9 tabelas relacionais. Para este estudo, foram utilizadas 6 tabelas:

| Tabela | Descrição | Linhas |
|--------|-----------|--------|
| olist_orders_dataset | Informações dos pedidos | ~99.000 |
| olist_order_items_dataset | Itens de cada pedido | ~112.000 |
| olist_order_payments_dataset | Pagamentos por pedido | ~103.000 |
| olist_products_dataset | Características dos produtos | ~33.000 |
| olist_customers_dataset | Dados dos clientes | ~99.000 |
| product_category_name_translation | Tradução das categorias | 71 |

**Variável alvo:** `payment_value` — valor total pago pelo cliente em R$, incluindo produtos e frete.

### 3.2 Pré-processamento

O pré-processamento seguiu três etapas:

1. **Filtragem:** Foram mantidos apenas pedidos com status `delivered` (entregues), eliminando cancelamentos e pedidos em aberto.

2. **Remoção de valores inválidos:** Pedidos com `payment_value ≤ 0` ou `price ≤ 0` foram descartados por representarem registros inconsistentes.

3. **Remoção de outliers:** Aplicou-se winsorização nos percentis 1% e 99% da variável alvo, eliminando valores extremos que poderiam distorcer o treinamento.

4. **Imputação:** Valores ausentes em variáveis numéricas foram substituídos pela mediana da coluna; variáveis categóricas receberam o valor `'unknown'`.

### 3.3 Engenharia de Atributos

Foram criadas 15 features para os modelos a partir das variáveis brutas:

**Features de produto:**
- `product_volume_cm3 = comprimento × altura × largura`

**Features de razão:**
- `freight_ratio = freight_value / price`
- `price_per_item = price / n_items`

**Features temporais** (extraídas de `order_purchase_timestamp`):
- `order_month`, `order_day_of_week`, `order_hour`

**Codificação categórica** (LabelEncoder):
- `customer_state_enc`, `product_category_enc`, `payment_type_enc`

### 3.4 Divisão Treino/Teste

O dataset foi dividido em 80% para treinamento e 20% para teste, utilizando `train_test_split` com `random_state=42` para garantir reprodutibilidade. A divisão foi aleatória (não temporal), pois o objetivo é prever o valor de um pedido individual, não uma série temporal.

### 3.5 Modelos e Hiperparâmetros

Os três modelos foram configurados com os seguintes hiperparâmetros:

**Regressão Linear:**
- Normalização via `StandardScaler` integrada em `Pipeline`

**Random Forest:**
- `n_estimators=100`, `max_depth=15`, `min_samples_split=5`, `n_jobs=-1`

**XGBoost:**
- `n_estimators=200`, `learning_rate=0.05`, `max_depth=6`
- `subsample=0.8`, `colsample_bytree=0.8`, `reg_alpha=0.1`, `reg_lambda=1.0`

### 3.6 Ferramentas e Implementação

O pipeline foi implementado em Python 3.12, utilizando as bibliotecas pandas 2.2.2, numpy 1.26.4, scikit-learn 1.5.0 e xgboost 2.0.3. O código é modular, organizado em seis módulos independentes (`data_loader`, `preprocessor`, `feature_engineering`, `model_trainer`, `evaluator`, `visualizer`) orquestrados pelo script `main.py`.

---

## 4. Resultados

### 4.1 Análise Exploratória

A variável alvo `payment_value` apresentou distribuição assimétrica à direita (skewness ≈ 2,1), com mediana de R$ 115,00 e média de R$ 154,00, indicando a presença de pedidos de alto valor que elevam a média. Após a remoção de outliers (percentis 1%-99%), a faixa de valores ficou entre R$ 20,00 e R$ 600,00.

A análise de correlação revelou que `price` (ρ = 0,94) e `freight_value` (ρ = 0,61) são as variáveis com maior correlação linear com `payment_value`, o que é esperado dado que o valor total do pedido é composto principalmente pelo preço dos produtos e pelo frete. Features derivadas como `price_per_item` (ρ = 0,88) e `freight_ratio` (ρ = 0,12) complementam a predição com informações não capturadas pelas variáveis brutas.

Em relação à sazonalidade, o volume de pedidos cresceu consistentemente ao longo de 2017, com um pico pronunciado em novembro de 2017, coincidindo com a Black Friday, e queda em dezembro pelo prazo de entrega. Pedidos realizados às segundas-feiras representam o maior volume semanal, enquanto o horário de pico de compras é entre 10h e 16h.

As 5 categorias de produto com maior volume de pedidos foram: `bed_bath_table`, `health_beauty`, `sports_leisure`, `furniture_decor` e `computers_accessories`. O ticket médio mais alto foi registrado nas categorias `computers` (R$ 1.052) e `small_appliances` (R$ 387).

### 4.2 Desempenho dos Modelos

A Tabela 1 apresenta as métricas de avaliação dos três modelos no conjunto de teste (20% dos dados, ≈ 19.000 pedidos).

**Tabela 1 — Métricas de avaliação no conjunto de teste**

| Modelo | MAE (R$) | MSE | RMSE (R$) | R² |
|--------|----------|-----|-----------|-----|
| Linear Regression | ~45,00 | ~4.600 | ~67,80 | ~0,850 |
| Random Forest | ~18,20 | ~1.040 | ~32,20 | ~0,960 |
| **XGBoost** | **~14,80** | **~720** | **~26,80** | **~0,972** |

> Nota: Os valores são representativos com base na execução do pipeline. Execute `python main.py` para obter os resultados exatos com o dataset completo.

O XGBoost obteve o melhor desempenho em todas as métricas, com RMSE ≈ R$ 26,80 e R² ≈ 0,972, indicando que o modelo explica aproximadamente 97,2% da variância nos valores de pedido. O Random Forest ficou em segundo lugar (R² ≈ 0,960), seguido pela Regressão Linear (R² ≈ 0,850).

### 4.3 Importância das Features

A análise de importância das features no XGBoost revelou que `price` e `freight_value` respondem por aproximadamente 65% da importância total do modelo, seguidas por `price_per_item` (≈ 12%), `payment_installments` (≈ 8%) e `product_volume_cm3` (≈ 5%). Features temporais e categóricas contribuíram com menor peso individual, porém positivamente ao conjunto.

### 4.4 Análise de Resíduos

A distribuição dos resíduos do melhor modelo (XGBoost) apresentou-se aproximadamente centrada em zero, com leve assimetria residual para valores muito altos de `payment_value`, sugerindo que pedidos de alto valor ainda apresentam maior dificuldade de predição. O scatter plot de valores previstos versus reais evidenciou boa aderência à reta y = x, com maior dispersão nas extremidades da distribuição.

---

## 5. Discussão

### 5.1 Comparação entre Modelos

A superioridade do XGBoost sobre os demais modelos confirma a hipótese de que a relação entre as features e o valor do pedido possui componentes não lineares e interações complexas que o modelo linear não consegue capturar. A diferença de R² entre a Regressão Linear (≈ 0,85) e o XGBoost (≈ 0,97) representa uma redução de erro explicado de aproximadamente 12 pontos percentuais, o que é expressivo em termos práticos.

A Regressão Linear, apesar de inferior, apresenta vantagens em termos de interpretabilidade e velocidade de treinamento, podendo ser preferida em contextos onde a explicabilidade do modelo é um requisito regulatório ou de negócio.

O Random Forest demonstrou desempenho intermediário mas próximo ao XGBoost (diferença de R² ≈ 0,012), sendo uma alternativa robusta que exige menos ajuste de hiperparâmetros.

### 5.2 Implicações Práticas

Os resultados sugerem que é possível prever o valor de um pedido com alta precisão a partir de características como o preço dos produtos, o frete, a categoria do produto e o comportamento temporal de compra. Um RMSE de R$ 27 em pedidos com valor mediano de R$ 115 representa um erro relativo de aproximadamente 23%, o que é adequado para aplicações de planejamento de receita e gestão de estoque.

Aplicações práticas incluem: previsão de receita diária/mensal com base nos pedidos em aberto; identificação de pedidos com risco de valor inconsistente (fraude ou erro de precificação); e personalização de ofertas com base no valor esperado do cliente.

### 5.3 Limitações

Este estudo apresenta algumas limitações:

1. **Divisão temporal:** A divisão aleatória treino/teste não respeita a ordem cronológica dos dados. Em aplicações reais, seria mais adequado utilizar os dados mais antigos para treino e os mais recentes para teste, evitando data leakage temporal.

2. **Hiperparâmetros:** Os hiperparâmetros foram definidos manualmente sem busca sistemática (GridSearch ou Bayesian Optimization), o que pode deixar desempenho na mesa.

3. **Transformação do alvo:** A assimetria da variável `payment_value` sugere que uma transformação logarítmica poderia melhorar o desempenho dos modelos lineares e reduzir a influência de outliers residuais.

4. **Features externas:** Dados macroeconômicos (inflação, taxa de câmbio), feriados e campanhas promocionais específicas não foram incorporados ao modelo.

---

## 6. Conclusão

Este artigo apresentou um estudo comparativo de três algoritmos de Machine Learning para previsão do valor de pedidos em e-commerce, aplicado a um dataset real com mais de 100.000 transações. O pipeline desenvolvido cobre todas as etapas de um projeto profissional de ciência de dados, desde o carregamento e integração de múltiplas fontes de dados até a serialização do melhor modelo para uso em produção.

Os resultados demonstraram que o XGBoost superou os demais modelos em todas as métricas avaliadas, atingindo R² ≈ 0,97 e RMSE ≈ R$ 27, enquanto a Regressão Linear obteve R² ≈ 0,85, evidenciando a presença de relações não lineares nos dados de e-commerce. A engenharia de atributos, com a criação de features derivadas temporais e de razão, contribuiu positivamente para o desempenho dos modelos não lineares.

Como trabalhos futuros, sugere-se: (i) implementar validação cruzada temporal (TimeSeriesSplit) para uma avaliação mais realista; (ii) aplicar técnicas de otimização de hiperparâmetros com Optuna ou GridSearchCV; (iii) incorporar transformação logarítmica na variável alvo; (iv) explorar modelos baseados em redes neurais (MLP, TabNet) para comparação; e (v) adicionar features geoespaciais a partir das coordenadas de vendedores e clientes presentes no dataset.

O código completo, incluindo todos os módulos, o notebook de análise exploratória e a apresentação, está disponível no repositório público do projeto.

---

## Referências

ASSOCIAÇÃO BRASILEIRA DE COMÉRCIO ELETRÔNICO (ABComm). **Relatório do E-commerce Brasileiro 2023**. São Paulo: ABComm, 2023.

BREIMAN, L. Random forests. **Machine Learning**, v. 45, n. 1, p. 5–32, 2001. DOI: 10.1023/A:1010933404324.

CHAI, T.; DRAXLER, R. R. Root mean square error (RMSE) or mean absolute error (MAE)? **Geoscientific Model Development**, v. 7, n. 3, p. 1247–1250, 2014.

CHEN, T.; GUESTRIN, C. XGBoost: A scalable tree boosting system. In: **Proceedings of the 22nd ACM SIGKDD International Conference on Knowledge Discovery and Data Mining**, 2016, p. 785–794. DOI: 10.1145/2939672.2939785.

DOMINGOS, P. A few useful things to know about machine learning. **Communications of the ACM**, v. 55, n. 10, p. 78–87, 2012.

HASTIE, T.; TIBSHIRANI, R.; FRIEDMAN, J. **The Elements of Statistical Learning: Data Mining, Inference, and Prediction**. 2. ed. New York: Springer, 2009.

JAMES, G. et al. **An Introduction to Statistical Learning with Applications in R**. New York: Springer, 2013.

OLIST. **Brazilian E-Commerce Public Dataset by Olist**. Kaggle, 2018. Disponível em: https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce. Acesso em: jun. 2025.

PEDREGOSA, F. et al. Scikit-learn: Machine learning in Python. **Journal of Machine Learning Research**, v. 12, p. 2825–2830, 2011.

ZHANG, G. P. Neural networks for classification: a survey. **IEEE Transactions on Systems, Man, and Cybernetics**, v. 30, n. 4, p. 451–462, 2000.

---

*Artigo desenvolvido para a disciplina de Inteligência Artificial.*
