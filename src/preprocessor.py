# =============================================================================
# preprocessor.py — Limpeza de dados e tratamento de valores ausentes
# =============================================================================

import numpy as np
import pandas as pd


# Colunas numéricas com imputação por mediana
NUMERIC_COLS = [
    "price",
    "freight_value",
    "n_items",
    "product_weight_g",
    "product_length_cm",
    "product_height_cm",
    "product_width_cm",
    "product_photos_qty",
    "payment_installments",
]

# Colunas categóricas com imputação por 'unknown'
CATEGORICAL_COLS = [
    "product_category",
    "payment_type",
    "customer_state",
]


def remove_invalid_rows(df: pd.DataFrame) -> pd.DataFrame:
    """
    Remove linhas com valores inválidos no alvo e em colunas críticas.
    - payment_value <= 0  : pedidos sem pagamento registrado
    - price <= 0          : itens sem preço válido
    """
    n_before = len(df)
    df = df[df["payment_value"] > 0].copy()
    df = df[df["price"] > 0].copy()
    df = df.dropna(subset=["customer_state"]).copy()
    n_removed = n_before - len(df)
    print(f"  Linhas removidas (inválidas): {n_removed:,}")
    return df


def remove_outliers(df: pd.DataFrame, column: str = "payment_value",
                    lower_q: float = 0.01, upper_q: float = 0.99) -> pd.DataFrame:
    """
    Remove outliers extremos da variável alvo usando percentis.

    Os 1% inferiores e 1% superiores de payment_value são descartados
    para evitar que valores atípicos distorçam o treinamento.

    Parameters
    ----------
    df       : DataFrame de entrada
    column   : coluna alvo para remoção de outliers
    lower_q  : percentil inferior (padrão 1%)
    upper_q  : percentil superior (padrão 99%)
    """
    q_low  = df[column].quantile(lower_q)
    q_high = df[column].quantile(upper_q)
    n_before = len(df)
    df = df[(df[column] >= q_low) & (df[column] <= q_high)].copy()
    n_removed = n_before - len(df)
    print(f"  Outliers removidos ({lower_q*100:.0f}%-{upper_q*100:.0f}%): {n_removed:,}"
          f"  | faixa de valores: R$ {q_low:.2f} – R$ {q_high:.2f}")
    return df


def impute_missing(df: pd.DataFrame) -> pd.DataFrame:
    """
    Trata valores ausentes:
    - Colunas numéricas  → mediana da coluna
    - Colunas categóricas → string 'unknown'
    """
    missing_before = df.isnull().sum().sum()

    # Imputação numérica por mediana
    for col in NUMERIC_COLS:
        if col in df.columns and df[col].isnull().any():
            median_val = df[col].median()
            df[col] = df[col].fillna(median_val)

    # Imputação categórica por 'unknown'
    for col in CATEGORICAL_COLS:
        if col in df.columns and df[col].isnull().any():
            df[col] = df[col].fillna("unknown")

    missing_after = df.isnull().sum().sum()
    print(f"  Valores ausentes: {missing_before:,} → {missing_after:,}")
    return df


def preprocess(df: pd.DataFrame) -> pd.DataFrame:
    """
    Pipeline completo de pré-processamento:
    1. Remove linhas inválidas
    2. Remove outliers extremos
    3. Imputa valores ausentes

    Parameters
    ----------
    df : pd.DataFrame
        Dataset bruto retornado por data_loader.load_dataset().

    Returns
    -------
    pd.DataFrame
        Dataset limpo e pronto para feature engineering.
    """
    print(f"  Shape inicial: {df.shape}")

    df = remove_invalid_rows(df)
    df = remove_outliers(df)
    df = impute_missing(df)

    print(f"  Shape final:   {df.shape}")
    return df
