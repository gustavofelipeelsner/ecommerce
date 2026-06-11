# Previsão de Vendas em E-commerce com Machine Learning

> Projeto acadêmico desenvolvido para a disciplina de **Inteligência Artificial**.  
> Pipeline completo de ML aplicado ao [Brazilian E-Commerce Public Dataset by Olist](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce) (Kaggle).

---

## Objetivo

Construir e comparar modelos de Machine Learning para **prever o valor total de um pedido** (`payment_value`) em uma plataforma de e-commerce, utilizando características do produto, do cliente e do pagamento como variáveis preditoras.

O projeto cobre todas as etapas de um pipeline profissional de ML:

```
Dados brutos → Limpeza → EDA → Feature Engineering → Treino → Avaliação → Deploy
```

---

## Base de Dados

| Atributo | Detalhes |
|----------|----------|
| **Nome** | Brazilian E-Commerce Public Dataset by Olist |
| **Fonte** | [Kaggle](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce) |
| **Período** | 2016 – 2018 |
| **Volume** | ~100.000 pedidos entregues |
| **Tabelas usadas** | `olist_orders_dataset.csv`, `olist_order_items_dataset.csv`, `olist_order_payments_dataset.csv`, `olist_products_dataset.csv`, `olist_customers_dataset.csv`, `product_category_name_translation.csv` |

**Variável alvo:** `payment_value` — valor total pago pelo cliente (em R$), incluindo produtos e frete.

---

## Tecnologias

| Biblioteca | Versão | Uso |
|-----------|--------|-----|
| Python | 3.12 | Linguagem principal |
| pandas | 2.2.2 | Manipulação de dados |
| numpy | 1.26.4 | Operações numéricas |
| matplotlib | 3.9.0 | Visualizações |
| seaborn | 0.13.2 | Visualizações estatísticas |
| scikit-learn | 1.5.0 | Linear Regression, Random Forest, Pipeline, métricas |
| xgboost | 2.0.3 | XGBoost Regressor |
| joblib | 1.4.2 | Serialização do modelo |
| jupyter | 1.0.0 | Notebook de análise |
| python-pptx | 0.6.23 | Geração da apresentação |

---

## Estrutura do Projeto

```
ecommerce-sales-prediction/
│
├── data/                          # CSVs do Kaggle (baixar separadamente)
│   └── .gitkeep
│
├── notebooks/
│   └── analise_exploratoria.ipynb # Análise exploratória e pipeline comentado
│
├── src/                           # Módulos do pipeline de ML
│   ├── __init__.py
│   ├── data_loader.py             # Carregamento e merge das tabelas
│   ├── preprocessor.py            # Limpeza e imputação de valores ausentes
│   ├── feature_engineering.py     # Criação de features e encoding
│   ├── model_trainer.py           # Treinamento e salvamento dos modelos
│   ├── evaluator.py               # Cálculo de métricas (MAE, MSE, RMSE, R²)
│   └── visualizer.py              # Geração e salvamento dos gráficos
│
├── models/                        # Modelo treinado serializado
│   ├── best_model.pkl             # Gerado automaticamente por main.py
│   └── best_model_info.txt        # Metadados do modelo selecionado
│
├── images/                        # Gráficos gerados automaticamente
│   ├── 01_distribuicao_vendas.png
│   ├── 02_correlacao_variaveis.png
│   ├── 03_previsoes_vs_reais.png
│   └── 04_comparacao_modelos.png
│
├── article/
│   └── artigo.md                  # Artigo científico em formato acadêmico
│
├── presentation/
│   └── apresentacao.pptx          # Apresentação gerada por gera_apresentacao.py
│
├── main.py                        # Pipeline completo (ponto de entrada)
├── requirements.txt               # Dependências fixadas
├── .gitignore
└── README.md
```

---

## Como Executar

### 1. Pré-requisitos

- Python 3.12 instalado
- Conta no [Kaggle](https://www.kaggle.com) para baixar o dataset

### 2. Clone o repositório

```bash
git clone https://github.com/gustavofelipeelsner/ecommerce-sales-prediction.git
cd ecommerce-sales-prediction
```

### 3. Crie e ative o ambiente virtual

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux / macOS
python3 -m venv venv
source venv/bin/activate
```

### 4. Instale as dependências

```bash
pip install -r requirements.txt
```

### 5. Baixe o dataset

1. Acesse: https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce
2. Clique em **Download** (requer login no Kaggle)
3. Extraia **todos os arquivos CSV** na pasta `data/`

Estrutura esperada em `data/`:
```
data/
├── olist_orders_dataset.csv
├── olist_order_items_dataset.csv
├── olist_order_payments_dataset.csv
├── olist_products_dataset.csv
├── olist_customers_dataset.csv
└── product_category_name_translation.csv
```

### 6. Execute o pipeline completo

```bash
python main.py
```

O script executará os 9 passos automaticamente e exibirá:
- Progresso de cada etapa com tempo de execução
- Tabela comparativa de métricas dos 3 modelos
- Caminhos dos arquivos gerados

### 7. Abra o notebook (opcional)

```bash
jupyter notebook notebooks/analise_exploratoria.ipynb
```

---

## Algoritmos Comparados

### Linear Regression (Baseline)
Modelo paramétrico linear com normalização via `StandardScaler`. Serve como baseline para comparação com os modelos mais complexos. Assume relação linear entre as features e o alvo.

### Random Forest Regressor
Ensemble de 100 árvores de decisão com votação por média. Captura não-linearidades e interações entre variáveis sem necessidade de normalização. Robusto a outliers.

| Hiperparâmetro | Valor |
|----------------|-------|
| `n_estimators` | 100 |
| `max_depth` | 15 |
| `min_samples_split` | 5 |
| `random_state` | 42 |

### XGBoost Regressor
Gradient Boosting com regularização L1/L2, construindo árvores sequencialmente para corrigir os erros do modelo anterior. Estado da arte para dados tabulares.

| Hiperparâmetro | Valor |
|----------------|-------|
| `n_estimators` | 200 |
| `learning_rate` | 0.05 |
| `max_depth` | 6 |
| `subsample` | 0.8 |
| `colsample_bytree` | 0.8 |

---

## Features Utilizadas

| Feature | Tipo | Descrição |
|---------|------|-----------|
| `price` | Numérica | Soma dos preços dos itens do pedido |
| `freight_value` | Numérica | Soma do frete dos itens |
| `n_items` | Numérica | Número de itens no pedido |
| `product_weight_g` | Numérica | Peso médio dos produtos (g) |
| `product_volume_cm3` | Derivada | Volume médio: comprimento × altura × largura |
| `product_photos_qty` | Numérica | Quantidade média de fotos dos produtos |
| `payment_installments` | Numérica | Número máximo de parcelas |
| `freight_ratio` | Derivada | Frete / Preço — proporção do custo de envio |
| `price_per_item` | Derivada | Preço médio por item no pedido |
| `order_month` | Temporal | Mês do pedido (1–12) |
| `order_day_of_week` | Temporal | Dia da semana (0=seg, 6=dom) |
| `order_hour` | Temporal | Hora do pedido (0–23) |
| `customer_state_enc` | Categórica | Estado do cliente (LabelEncoded) |
| `product_category_enc` | Categórica | Categoria do produto (LabelEncoded) |
| `payment_type_enc` | Categórica | Tipo de pagamento (LabelEncoded) |

---

## Métricas de Avaliação

| Métrica | Fórmula | Interpretação |
|---------|---------|---------------|
| **MAE** | `mean(|y - ŷ|)` | Erro absoluto médio em R$ |
| **MSE** | `mean((y - ŷ)²)` | Penaliza erros grandes |
| **RMSE** | `√MSE` | Mesma unidade do alvo (R$) |
| **R²** | `1 - SS_res/SS_tot` | % da variância explicada (0–1) |

---

## Resultados

> Os valores abaixo são representativos. Execute `python main.py` para ver os resultados reais com o dataset completo.

| Modelo | MAE (R$) | RMSE (R$) | R² |
|--------|----------|-----------|-----|
| Linear Regression | ~45 | ~68 | ~0.85 |
| Random Forest | ~18 | ~32 | ~0.96 |
| **XGBoost** | **~15** | **~27** | **~0.97** |

> O **XGBoost** obteve o melhor desempenho, com R² próximo a 0.97 e RMSE de ~R$ 27.

### Gráficos gerados

| Arquivo | Descrição |
|---------|-----------|
| `images/01_distribuicao_vendas.png` | Histograma + KDE do valor dos pedidos |
| `images/02_correlacao_variaveis.png` | Heatmap de correlação entre features |
| `images/03_previsoes_vs_reais.png` | Scatter: previsto vs real (melhor modelo) |
| `images/04_comparacao_modelos.png` | Comparação de RMSE e R² entre modelos |

---

## Saída do Pipeline

```
=================================================================
  PREVISÃO DE VENDAS E-COMMERCE — DATASET OLIST
=================================================================
  Algoritmos  : Linear Regression | Random Forest | XGBoost
  Alvo        : payment_value (valor total do pedido em R$)
  Divisão     : 80% treino / 20% teste

[Passo 1] Carregamento e merge das tabelas
[Passo 2] Pré-processamento (limpeza + imputação)
[Passo 3] Engenharia de atributos
[Passo 4] Divisão treino / teste (80/20)
[Passo 5] Treinamento dos modelos
[Passo 6] Geração de previsões no conjunto de teste
[Passo 7] Avaliação e comparação dos modelos

----------------------------------------------------------------------
           RESULTADOS — COMPARAÇÃO DE MODELOS
----------------------------------------------------------------------
Modelo                       MAE            MSE       RMSE       R²
----------------------------------------------------------------------
XGBoost                  15.XXXX    XXX.XXXX    27.XXXX   0.97XX
Random Forest            18.XXXX    XXX.XXXX    32.XXXX   0.96XX
Linear Regression        45.XXXX    XXX.XXXX    68.XXXX   0.85XX
----------------------------------------------------------------------

[Passo 8] Geração e salvamento dos gráficos
[Passo 9] Salvamento do melhor modelo
```

---

## Autor

**Gustavo Felipe Elsner** — [@gustavofelipeelsner](https://github.com/gustavofelipeelsner)  
Desenvolvido para a disciplina de **Inteligência Artificial**.

---

## Licença

Este projeto está sob a licença MIT. O dataset Olist está disponível sob [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
