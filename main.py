# =============================================================================
# main.py — Pipeline completo de previsão de vendas e-commerce (Olist)
# =============================================================================
#
# Execução:
#   python main.py
#
# Pré-requisito:
#   1. pip install -r requirements.txt
#   2. Baixar o dataset em: https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce
#   3. Extrair os CSVs na pasta data/
#
# Saídas geradas automaticamente:
#   - images/01_distribuicao_vendas.png
#   - images/02_correlacao_variaveis.png
#   - images/03_previsoes_vs_reais.png
#   - images/04_comparacao_modelos.png
#   - models/best_model.pkl
#   - models/best_model_info.txt
# =============================================================================

import sys
import time
import warnings
from pathlib import Path

import numpy as np
import pandas as pd

warnings.filterwarnings("ignore")

# Garante que o diretório raiz do projeto está no path
PROJECT_ROOT = Path(__file__).resolve().parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from src.data_loader       import load_dataset
from src.preprocessor      import preprocess
from src.feature_engineering import engineer_features, get_X_y
from src.model_trainer     import split_data, build_models, train_models, generate_predictions, save_best_model
from src.evaluator         import evaluate_all_models, print_results_table
from src.visualizer        import generate_all_plots


# =============================================================================
# Utilitários de log
# =============================================================================

def section(title: str) -> None:
    """Imprime um cabeçalho de seção formatado."""
    width = 65
    print(f"\n{'=' * width}")
    print(f"  {title}")
    print(f"{'=' * width}")


def step(number: int, description: str) -> float:
    """Imprime o início de um passo e retorna o timestamp."""
    print(f"\n[Passo {number}] {description}")
    print(f"{'-' * 50}")
    return time.time()


def done(start: float) -> None:
    """Imprime o tempo decorrido de um passo."""
    elapsed = time.time() - start
    print(f"  → Concluído em {elapsed:.1f}s")


# =============================================================================
# Pipeline principal
# =============================================================================

def main() -> None:

    pipeline_start = time.time()

    section("PREVISÃO DE VENDAS E-COMMERCE — DATASET OLIST")
    print("  Algoritmos  : Linear Regression | Random Forest | XGBoost")
    print("  Alvo        : payment_value (valor total do pedido em R$)")
    print("  Divisão     : 80% treino / 20% teste")

    # ------------------------------------------------------------------
    # Passo 1 — Carregamento dos dados
    # ------------------------------------------------------------------
    t = step(1, "Carregamento e merge das tabelas")
    df_raw = load_dataset()
    done(t)

    # ------------------------------------------------------------------
    # Passo 2 — Pré-processamento
    # ------------------------------------------------------------------
    t = step(2, "Pré-processamento (limpeza + imputação)")
    df_clean = preprocess(df_raw)
    done(t)

    # ------------------------------------------------------------------
    # Passo 3 — Engenharia de atributos
    # ------------------------------------------------------------------
    t = step(3, "Engenharia de atributos")
    df_featured, encoders = engineer_features(df_clean)
    done(t)

    # ------------------------------------------------------------------
    # Passo 4 — Separação X / y e divisão treino/teste
    # ------------------------------------------------------------------
    t = step(4, "Divisão treino / teste (80/20)")
    X, y = get_X_y(df_featured)
    X_train, X_test, y_train, y_test = split_data(X, y)
    done(t)

    # Estatísticas do alvo
    print(f"\n  Estatísticas de payment_value (treino):")
    print(f"    Média   : R$ {y_train.mean():.2f}")
    print(f"    Mediana : R$ {y_train.median():.2f}")
    print(f"    Mín     : R$ {y_train.min():.2f}")
    print(f"    Máx     : R$ {y_train.max():.2f}")
    print(f"    Desvio  : R$ {y_train.std():.2f}")

    # ------------------------------------------------------------------
    # Passo 5 — Treinamento dos modelos
    # ------------------------------------------------------------------
    t = step(5, "Treinamento dos modelos")
    models = build_models()
    trained_models = train_models(models, X_train, y_train)
    done(t)

    # ------------------------------------------------------------------
    # Passo 6 — Geração de previsões
    # ------------------------------------------------------------------
    t = step(6, "Geração de previsões no conjunto de teste")
    predictions = generate_predictions(trained_models, X_test)
    done(t)

    # ------------------------------------------------------------------
    # Passo 7 — Avaliação dos modelos
    # ------------------------------------------------------------------
    t = step(7, "Avaliação e comparação dos modelos")
    df_results = evaluate_all_models(predictions, y_test)
    print_results_table(df_results)
    done(t)

    # ------------------------------------------------------------------
    # Passo 8 — Geração dos gráficos
    # ------------------------------------------------------------------
    t = step(8, "Geração e salvamento dos gráficos")
    generate_all_plots(df_featured, y_test, predictions, df_results)
    done(t)

    # ------------------------------------------------------------------
    # Passo 9 — Salvamento do melhor modelo
    # ------------------------------------------------------------------
    t = step(9, "Salvamento do melhor modelo")
    best_model_name = save_best_model(trained_models, df_results)
    done(t)

    # ------------------------------------------------------------------
    # Resumo final
    # ------------------------------------------------------------------
    total_time = time.time() - pipeline_start
    best = df_results.iloc[0]

    section("PIPELINE CONCLUÍDO COM SUCESSO")
    print(f"  Tempo total        : {total_time:.1f}s")
    print(f"  Amostras usadas    : {len(df_featured):,} pedidos")
    print(f"  Features           : {X.shape[1]} atributos")
    print()
    print(f"  MELHOR MODELO      : {best['Model']}")
    print(f"    MAE              : R$ {best['MAE']:.4f}")
    print(f"    RMSE             : R$ {best['RMSE']:.4f}")
    print(f"    R²               : {best['R²']:.4f}")
    print()
    print("  Arquivos gerados:")
    print("    images/01_distribuicao_vendas.png")
    print("    images/02_correlacao_variaveis.png")
    print("    images/03_previsoes_vs_reais.png")
    print("    images/04_comparacao_modelos.png")
    print("    models/best_model.pkl")
    print("    models/best_model_info.txt")
    print(f"\n{'=' * 65}\n")


if __name__ == "__main__":
    main()
