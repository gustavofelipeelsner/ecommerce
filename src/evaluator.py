# =============================================================================
# evaluator.py — Avaliação de desempenho dos modelos de regressão
# =============================================================================

import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


def compute_metrics(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    model_name: str,
) -> dict:
    """
    Calcula as quatro métricas padrão de regressão para um par (real, previsto).

    Métricas calculadas:
    - MAE  (Mean Absolute Error)       : erro absoluto médio em R$
    - MSE  (Mean Squared Error)        : erro quadrático médio
    - RMSE (Root Mean Squared Error)   : raiz do MSE, mesma unidade do alvo
    - R²   (Coefficient of Determination) : proporção da variância explicada

    Parameters
    ----------
    y_true     : valores reais de payment_value
    y_pred     : valores preditos pelo modelo
    model_name : nome do modelo (usado como rótulo no DataFrame de resultados)

    Returns
    -------
    dict com as quatro métricas e o nome do modelo
    """
    mae  = mean_absolute_error(y_true, y_pred)
    mse  = mean_squared_error(y_true, y_pred)
    rmse = np.sqrt(mse)
    r2   = r2_score(y_true, y_pred)

    return {
        "Model": model_name,
        "MAE":   round(mae,  4),
        "MSE":   round(mse,  4),
        "RMSE":  round(rmse, 4),
        "R²":    round(r2,   4),
    }


def evaluate_all_models(
    predictions: dict,
    y_test: np.ndarray,
) -> pd.DataFrame:
    """
    Avalia todos os modelos e retorna uma tabela comparativa de métricas.

    Parameters
    ----------
    predictions : dict {nome_modelo: array de previsões}
    y_test      : valores reais do conjunto de teste

    Returns
    -------
    pd.DataFrame com colunas [Model, MAE, MSE, RMSE, R²],
    ordenado pelo menor RMSE.
    """
    results = []
    for model_name, y_pred in predictions.items():
        metrics = compute_metrics(y_test, y_pred, model_name)
        results.append(metrics)

    df_results = pd.DataFrame(results).sort_values("RMSE").reset_index(drop=True)
    return df_results


def print_results_table(df_results: pd.DataFrame) -> None:
    """
    Exibe a tabela de resultados formatada no console.

    Parameters
    ----------
    df_results : DataFrame retornado por evaluate_all_models()
    """
    separator = "-" * 70
    print(f"\n{separator}")
    print(f"{'RESULTADOS — COMPARAÇÃO DE MODELOS':^70}")
    print(separator)
    print(f"{'Modelo':<22} {'MAE':>10} {'MSE':>14} {'RMSE':>10} {'R²':>8}")
    print(separator)

    for _, row in df_results.iterrows():
        print(
            f"{row['Model']:<22} "
            f"{row['MAE']:>10.4f} "
            f"{row['MSE']:>14.2f} "
            f"{row['RMSE']:>10.4f} "
            f"{row['R²']:>8.4f}"
        )

    print(separator)
    best = df_results.iloc[0]
    print(f"\n  Melhor modelo: {best['Model']} (RMSE = {best['RMSE']:.4f} | R² = {best['R²']:.4f})")
    print(separator)
