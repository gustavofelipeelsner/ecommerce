# =============================================================================
# data_loader.py — Carregamento e merge das tabelas do dataset Olist
# =============================================================================
# Dataset: Brazilian E-Commerce Public Dataset by Olist (Kaggle)
# URL: https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce
# =============================================================================

import os
import pandas as pd
from pathlib import Path

# Diretório de dados relativo à raiz do projeto
DATA_DIR = Path(__file__).resolve().parent.parent / "data"

REQUIRED_FILES = [
    "olist_orders_dataset.csv",
    "olist_order_items_dataset.csv",
    "olist_order_payments_dataset.csv",
    "olist_products_dataset.csv",
    "olist_customers_dataset.csv",
    "product_category_name_translation.csv",
]


def _check_files() -> None:
    """Verifica se todos os arquivos CSV necessários existem na pasta data/."""
    missing = [f for f in REQUIRED_FILES if not (DATA_DIR / f).exists()]
    if missing:
        raise FileNotFoundError(
            "\n[ERRO] Arquivos não encontrados na pasta data/:\n"
            + "\n".join(f"  - {f}" for f in missing)
            + "\n\nBaixe o dataset em:"
            + "\nhttps://www.kaggle.com/datasets/olistbr/brazilian-ecommerce"
            + "\ne extraia todos os CSVs na pasta data/"
        )


def load_raw_data() -> dict[str, pd.DataFrame]:
    """
    Carrega todos os CSVs necessários do dataset Olist.

    Returns
    -------
    dict[str, pd.DataFrame]
        Dicionário com cada tabela carregada como DataFrame.
    """
    _check_files()

    print("  Carregando CSVs do dataset Olist...")
    tables = {
        "orders":       pd.read_csv(DATA_DIR / "olist_orders_dataset.csv"),
        "items":        pd.read_csv(DATA_DIR / "olist_order_items_dataset.csv"),
        "payments":     pd.read_csv(DATA_DIR / "olist_order_payments_dataset.csv"),
        "products":     pd.read_csv(DATA_DIR / "olist_products_dataset.csv"),
        "customers":    pd.read_csv(DATA_DIR / "olist_customers_dataset.csv"),
        "categories":   pd.read_csv(DATA_DIR / "product_category_name_translation.csv"),
    }

    for name, df in tables.items():
        print(f"    ✓ {name:12s} → {df.shape[0]:>7,} linhas | {df.shape[1]:>2} colunas")

    return tables


def merge_tables(tables: dict[str, pd.DataFrame]) -> pd.DataFrame:
    """
    Realiza o merge de todas as tabelas e agrega ao nível de pedido (order_id).

    Estratégia de agregação por pedido:
    - price          : soma dos preços dos itens
    - freight_value  : soma do frete dos itens
    - n_items        : contagem de itens
    - product_*      : média das dimensões e peso dos produtos
    - payment_value  : soma dos pagamentos  ← variável alvo
    - payment_type   : tipo de pagamento mais frequente
    - payment_installments : número máximo de parcelas

    Parameters
    ----------
    tables : dict[str, pd.DataFrame]
        Dicionário retornado por load_raw_data().

    Returns
    -------
    pd.DataFrame
        DataFrame unificado com uma linha por pedido.
    """
    orders    = tables["orders"]
    items     = tables["items"]
    payments  = tables["payments"]
    products  = tables["products"]
    customers = tables["customers"]
    categories = tables["categories"]

    # --- 1. Filtrar apenas pedidos com status 'delivered' ---
    print("\n  Filtrando pedidos entregues...")
    orders = orders[orders["order_status"] == "delivered"].copy()
    orders["order_purchase_timestamp"] = pd.to_datetime(orders["order_purchase_timestamp"])

    # --- 2. Traduzir categorias de produto ---
    products = products.merge(categories, on="product_category_name", how="left")

    # --- 3. Enriquecer itens com informações de produto ---
    items_enriched = items.merge(
        products[[
            "product_id",
            "product_category_name_english",
            "product_weight_g",
            "product_length_cm",
            "product_height_cm",
            "product_width_cm",
            "product_photos_qty",
        ]],
        on="product_id",
        how="left",
    )

    # --- 4. Agregar itens por pedido ---
    print("  Agregando itens por pedido...")
    items_agg = (
        items_enriched.groupby("order_id")
        .agg(
            price=("price", "sum"),
            freight_value=("freight_value", "sum"),
            n_items=("order_item_id", "count"),
            product_weight_g=("product_weight_g", "mean"),
            product_length_cm=("product_length_cm", "mean"),
            product_height_cm=("product_height_cm", "mean"),
            product_width_cm=("product_width_cm", "mean"),
            product_photos_qty=("product_photos_qty", "mean"),
            product_category=("product_category_name_english",
                              lambda x: x.mode().iloc[0] if not x.mode().empty else "unknown"),
        )
        .reset_index()
    )

    # --- 5. Agregar pagamentos por pedido ---
    print("  Agregando pagamentos por pedido...")
    payments_agg = (
        payments.groupby("order_id")
        .agg(
            payment_value=("payment_value", "sum"),
            payment_installments=("payment_installments", "max"),
            payment_type=("payment_type", lambda x: x.mode().iloc[0]),
        )
        .reset_index()
    )

    # --- 6. Merge final ---
    print("  Realizando merge das tabelas...")
    df = (
        orders[["order_id", "customer_id", "order_purchase_timestamp"]]
        .merge(items_agg,   on="order_id",   how="inner")
        .merge(payments_agg, on="order_id",   how="inner")
        .merge(
            customers[["customer_id", "customer_state"]],
            on="customer_id",
            how="left",
        )
    )

    print(f"\n  ✓ Dataset unificado: {df.shape[0]:,} pedidos | {df.shape[1]} colunas")
    return df


def load_dataset() -> pd.DataFrame:
    """
    Função principal: carrega, une e retorna o dataset completo.

    Returns
    -------
    pd.DataFrame
        Dataset pronto para pré-processamento.
    """
    tables = load_raw_data()
    df = merge_tables(tables)
    return df
