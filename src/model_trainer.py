# =============================================================================
# model_trainer.py — Treinamento e seleção dos modelos de Machine Learning
# =============================================================================

import joblib
import numpy as np
import pandas as pd
from pathlib import Path

from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from xgboost import XGBRegressor

MODELS_DIR = Path(__file__).resolve().parent.parent / "models"
RANDOM_STATE = 42
TEST_SIZE = 0.2


def split_data(
    X: pd.DataFrame,
    y: pd.Series,
    test_size: float = TEST_SIZE,
    random_state: int = RANDOM_STATE,
) -> tuple:
    """
    Divide os dados em conjuntos de treino e teste (80/20).

    Parameters
    ----------
    X            : matriz de features
    y            : vetor alvo
    test_size    : proporção de dados para teste (padrão 20%)
    random_state : semente aleatória para reprodutibilidade

    Returns
    -------
    X_train, X_test, y_train, y_test
    """
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=test_size,
        random_state=random_state,
    )
    print(f"  Treino : {X_train.shape[0]:,} amostras ({(1-test_size)*100:.0f}%)")
    print(f"  Teste  : {X_test.shape[0]:,} amostras ({test_size*100:.0f}%)")
    return X_train, X_test, y_train, y_test


def build_models() -> dict:
    """
    Instancia os três modelos de regressão para comparação.

    - Linear Regression  : modelo base linear (com normalização via Pipeline)
    - Random Forest      : ensemble de árvores de decisão
    - XGBoost            : gradient boosting com regularização

    Todos os hiperparâmetros são explícitos para garantir reprodutibilidade.

    Returns
    -------
    dict {nome: modelo_sklearn}
    """
    models = {
        "Linear Regression": Pipeline([
            ("scaler", StandardScaler()),
            ("regressor", LinearRegression()),
        ]),
        "Random Forest": RandomForestRegressor(
            n_estimators=100,
            max_depth=15,
            min_samples_split=5,
            min_samples_leaf=2,
            n_jobs=-1,
            random_state=RANDOM_STATE,
        ),
        "XGBoost": XGBRegressor(
            n_estimators=200,
            max_depth=6,
            learning_rate=0.05,
            subsample=0.8,
            colsample_bytree=0.8,
            reg_alpha=0.1,
            reg_lambda=1.0,
            n_jobs=-1,
            random_state=RANDOM_STATE,
            verbosity=0,
        ),
    }
    return models


def train_models(
    models: dict,
    X_train: pd.DataFrame,
    y_train: pd.Series,
) -> dict:
    """
    Treina todos os modelos no conjunto de treino.

    Parameters
    ----------
    models  : dicionário {nome: modelo} retornado por build_models()
    X_train : features de treino
    y_train : alvo de treino

    Returns
    -------
    dict {nome: modelo treinado}
    """
    trained = {}
    for name, model in models.items():
        print(f"  Treinando {name}...", end=" ", flush=True)
        model.fit(X_train, y_train)
        trained[name] = model
        print("✓")
    return trained


def generate_predictions(
    trained_models: dict,
    X_test: pd.DataFrame,
) -> dict:
    """
    Gera previsões de todos os modelos sobre o conjunto de teste.

    Returns
    -------
    dict {nome: array de previsões}
    """
    predictions = {}
    for name, model in trained_models.items():
        predictions[name] = model.predict(X_test)
    return predictions


def save_best_model(
    trained_models: dict,
    results_df: pd.DataFrame,
    metric: str = "RMSE",
) -> str:
    """
    Salva o melhor modelo (menor RMSE) em models/best_model.pkl.

    Também salva um arquivo de metadados (models/best_model_info.txt)
    com o nome do modelo, a métrica e os resultados comparativos.

    Parameters
    ----------
    trained_models : dicionário de modelos treinados
    results_df     : DataFrame com métricas (retornado por evaluator)
    metric         : métrica usada para selecionar o melhor modelo

    Returns
    -------
    str : nome do melhor modelo
    """
    MODELS_DIR.mkdir(parents=True, exist_ok=True)

    # Seleciona o modelo com menor RMSE
    best_name = results_df.loc[results_df[metric].idxmin(), "Model"]
    best_model = trained_models[best_name]

    # Salva o modelo serializado
    model_path = MODELS_DIR / "best_model.pkl"
    joblib.dump(best_model, model_path)
    print(f"  Modelo salvo em: {model_path}")

    # Salva metadados do modelo selecionado
    info_path = MODELS_DIR / "best_model_info.txt"
    with open(info_path, "w", encoding="utf-8") as f:
        f.write(f"Melhor modelo: {best_name}\n")
        f.write(f"Critério de seleção: menor {metric}\n\n")
        f.write("Resultados comparativos:\n")
        f.write(results_df.to_string(index=False))
    print(f"  Metadados salvos em: {info_path}")

    return best_name


def load_best_model():
    """
    Carrega o melhor modelo salvo em models/best_model.pkl.

    Returns
    -------
    Modelo scikit-learn / XGBoost carregado.
    """
    model_path = MODELS_DIR / "best_model.pkl"
    if not model_path.exists():
        raise FileNotFoundError(
            f"Modelo não encontrado em {model_path}. Execute main.py primeiro."
        )
    return joblib.load(model_path)
