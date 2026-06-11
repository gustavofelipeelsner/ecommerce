# Previsão de Vendas em E-commerce com Machine Learning

Projeto acadêmico para a disciplina de Inteligência Artificial.
Usa o dataset público da Olist (Kaggle) para prever o valor total de pedidos com três modelos de ML.

## Como rodar

### 1. Baixe o dataset
Acesse: https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce
Extraia os CSVs na pasta data/.

### 2. Instale as dependências
`ash
pip install -r requirements.txt
`

### 3. Execute
`ash
python main.py
`

## Modelos comparados
- Linear Regression
- Random Forest
- XGBoost

## Saídas geradas
- Gráficos em images/
- Melhor modelo salvo em models/best_model.pkl

## Autor
Gustavo Felipe Elsner