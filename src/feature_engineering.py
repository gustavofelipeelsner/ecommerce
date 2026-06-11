# =============================================================================
# feature_engineering.py — Criação de novas features e codificação categórica
# =============================================================================

import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder


# Features que serão usadas no treinamento dos modelos
FEATURE_COLUMNS = [
    "price",
    "freight_value",
    "n_items",
    "product_weight_g",
    "product_volume_cm3",
    "product_photos_qty",
    "payment_installments",
    "freight_ratio",
    "price_per_item",
    "order_month",
    "order_day_of_week",
    "order_hour",
    "customer_state_enc",
    "product_category_enc",
    "payment_type_enc",
]

TARGET_COLUMN = "payment_value"


def create_temporal_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Extrai features temporais a partir do timestamp de compra:
    - order_month       : mês do pedido (1–12)
    - order_day_of_week : dia da semana (0=segunda, 6=domingo)
    - order_hour        : hora do pedido (0–23)
    """
    ts = pd.to_datetime(df["order_purchase_timestamp"])
    df["order_month"]       = ts.dt.month
    df["order_day_of_week"] = ts.dt.dayofweek
    df["order_hour"]        = ts.dt.hour
    return df


def create_product_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Cria features derivadas das dimensões do produto:
    - product_volume_cm3 : volume do produto em cm³ (comprimento × altura × largura)
    """
    df["product_volume_cm3"] = (
        df["product_length_cm"] *
        df["product_height_cm"] *
        df["product_width_cm"]
    )
    # Substitui volume nulo por mediana (quando dimensões ausentes)
    median_vol = df["product_volume_cm3"].median()
    df["product_volume_cm3"] = df["product_volume_cm3"].fillna(median_vol)
    return df


def create_ratio_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Cria features de razão:
    - freight_ratio  : proporção do frete em relação ao preço do produto
    - price_per_item : preço médio por item no pedido
    """
    # Evita divisão por zero
    df["freight_ratio"] = df["freight_value"] / (df["price"] + 1e-9)
    df["price_per_item"] = df["price"] / df["n_items"].clip(lower=1)
    return df


def encode_categoricals(df: pd.DataFrame) -> tuple[pd.DataFrame, dict]:
    """
    Codifica variáveis categóricas com LabelEncoder.

    Retorna o DataFrame com as colunas codificadas e um dicionário
    com os encoders treinados (necessário para decodificação futura).

    Returns
    -------
    df       : DataFrame com colunas *_enc adicionadas
    encoders : dict {coluna: LabelEncoder treinado}
    """
    encoders = {}
    cat_map = {
        "customer_state":    "customer_state_enc",
        "product_category":  "product_category_enc",
        "payment_type":      "payment_type_enc",
    }

    for col, enc_col in cat_map.items():
        le = LabelEncoder()
        df[enc_col] = le.fit_transform(df[col].astype(str))
        encoders[col] = le
        n_classes = len(le.classes_)
        print(f"    {col:30s} → {enc_col} ({n_classes} categorias únicas)")

    return df, encoders


def engineer_features(df: pd.DataFrame) -> tuple[pd.DataFrame, dict]:
    """
    Pipeline completo de engenharia de atributos.

    Etapas:
    1. Features temporais (mês, dia da semana, hora)
    2. Features de produto (volume)
    3. Features de razão (freight_ratio, price_per_item)
    4. Codificação de variáveis categóricas

    Parameters
    ----------
    df : pd.DataFrame
        Dataset pré-processado.

    Returns
    -------
    tuple[pd.DataFrame, dict]
        - DataFrame com todas as features adicionadas
        - Dicionário com LabelEncoders treinados
    """
    print("  Criando features temporais...")
    df = create_temporal_features(df)

    print("  Criando features de produto...")
    df = create_product_features(df)

    print("  Criando features de razão...")
    df = create_ratio_features(df)

    print("  Codificando variáveis categóricas...")
    df, encoders = encode_categoricals(df)

    # Verificar se todas as features foram criadas
    missing_cols = [c for c in FEATURE_COLUMNS if c not in df.columns]
    if missing_cols:
        raise ValueError(f"Features ausentes após engenharia: {missing_cols}")

    print(f"\n  ✓ {len(FEATURE_COLUMNS)} features prontas para treinamento")
    return df, encoders


def get_X_y(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.Series]:
    """
    Separa o DataFrame em matriz de features (X) e vetor alvo (y).

    Returns
    -------
    X : pd.DataFrame com as colunas de FEATURE_COLUMNS
    y : pd.Series com payment_value
    """
    X = df[FEATURE_COLUMNS].copy()
    y = df[TARGET_COLUMN].copy()
    return X, y
