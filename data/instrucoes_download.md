# Instruções para Download do Dataset

## Dataset: Brazilian E-Commerce Public Dataset by Olist

### Link direto
https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce

---

## Passo a passo

### Opção 1 — Download manual (navegador)

1. Acesse o link acima e faça login na sua conta Kaggle
2. Clique no botão **Download** (ícone de seta para baixo) no canto superior direito
3. Extraia o arquivo `.zip` baixado
4. Copie os arquivos CSV listados abaixo para **esta pasta** (`data/`)

### Opção 2 — Kaggle CLI (recomendado)

```bash
# 1. Instale a CLI do Kaggle
pip install kaggle

# 2. Configure sua chave de API
#    Acesse: https://www.kaggle.com/settings → API → Create New Token
#    Salve o arquivo kaggle.json em ~/.kaggle/kaggle.json

# 3. Baixe e extraia o dataset
kaggle datasets download -d olistbr/brazilian-ecommerce
unzip brazilian-ecommerce.zip -d data/
```

---

## Arquivos necessários

Após a extração, a pasta `data/` deve conter os seguintes arquivos:

| Arquivo CSV | Tamanho aprox. | Obrigatório |
|-------------|----------------|-------------|
| `olist_orders_dataset.csv` | ~6 MB | ✅ Sim |
| `olist_order_items_dataset.csv` | ~9 MB | ✅ Sim |
| `olist_order_payments_dataset.csv` | ~6 MB | ✅ Sim |
| `olist_products_dataset.csv` | ~2 MB | ✅ Sim |
| `olist_customers_dataset.csv` | ~6 MB | ✅ Sim |
| `product_category_name_translation.csv` | ~1 KB | ✅ Sim |
| `olist_sellers_dataset.csv` | ~1 MB | Não usado |
| `olist_geolocation_dataset.csv` | ~70 MB | Não usado |
| `olist_order_reviews_dataset.csv` | ~8 MB | Não usado |

**Total necessário: ~30 MB**

---

## Verificação

Após colocar os arquivos, execute o verificador:

```bash
python -c "from src.data_loader import load_dataset; load_dataset()"
```

Se os arquivos estiverem corretos, você verá:
```
  Carregando CSVs do dataset Olist...
    ✓ orders        →  99.441 linhas | 8 colunas
    ✓ items         → 112.650 linhas | 7 colunas
    ...
```

---

## Licença do Dataset

O dataset está disponível sob licença **CC BY-NC-SA 4.0**.  
Uso permitido para fins acadêmicos e de pesquisa.  
Fonte: Olist — https://olist.com
