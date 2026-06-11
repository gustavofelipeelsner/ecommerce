# =============================================================================
# visualizer.py — Geração e salvamento automático de gráficos
# =============================================================================

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import seaborn as sns
from pathlib import Path

IMAGES_DIR = Path(__file__).resolve().parent.parent / "images"

# Paleta e estilo padrão do projeto
PALETTE = "Blues_d"
ACCENT  = "#2c7bb6"
FIG_DPI = 150

# Colunas numéricas usadas no heatmap de correlação
CORR_COLS = [
    "payment_value",
    "price",
    "freight_value",
    "n_items",
    "product_weight_g",
    "product_volume_cm3",
    "payment_installments",
    "freight_ratio",
    "price_per_item",
]


def _save(fig: plt.Figure, filename: str) -> None:
    """Salva a figura na pasta images/ com DPI fixo."""
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    path = IMAGES_DIR / filename
    fig.savefig(path, dpi=FIG_DPI, bbox_inches="tight")
    plt.close(fig)
    print(f"  ✓ Salvo: {path}")


def plot_sales_distribution(df: pd.DataFrame) -> None:
    """
    Gráfico 1 — Distribuição dos valores de pedido (payment_value).

    Combina histograma de frequência com curva KDE (densidade) para
    visualizar a forma da distribuição da variável alvo.
    """
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))
    fig.suptitle("Distribuição dos Valores de Pedido (payment_value)", fontsize=14, fontweight="bold")

    # Histograma principal
    ax1 = axes[0]
    ax1.hist(df["payment_value"], bins=60, color=ACCENT, edgecolor="white", alpha=0.85)
    ax1.set_xlabel("Valor do Pedido (R$)")
    ax1.set_ylabel("Frequência")
    ax1.set_title("Histograma")
    ax1.xaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f"R${x:,.0f}"))
    ax1.tick_params(axis="x", rotation=30)

    # KDE (densidade)
    ax2 = axes[1]
    sns.kdeplot(df["payment_value"], ax=ax2, color=ACCENT, fill=True, alpha=0.4)
    ax2.set_xlabel("Valor do Pedido (R$)")
    ax2.set_ylabel("Densidade")
    ax2.set_title("Densidade (KDE)")
    ax2.xaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f"R${x:,.0f}"))
    ax2.tick_params(axis="x", rotation=30)

    # Linha de mediana
    mediana = df["payment_value"].median()
    for ax in axes:
        ax.axvline(mediana, color="red", linestyle="--", linewidth=1.5, label=f"Mediana: R${mediana:.2f}")
        ax.legend()

    plt.tight_layout()
    _save(fig, "01_distribuicao_vendas.png")


def plot_correlation_heatmap(df: pd.DataFrame) -> None:
    """
    Gráfico 2 — Heatmap de correlação entre as features numéricas.

    Utiliza correlação de Pearson para identificar quais variáveis têm
    maior relação linear com a variável alvo (payment_value).
    """
    cols_available = [c for c in CORR_COLS if c in df.columns]
    corr_matrix = df[cols_available].corr()

    fig, ax = plt.subplots(figsize=(11, 9))
    mask = np.triu(np.ones_like(corr_matrix, dtype=bool))

    sns.heatmap(
        corr_matrix,
        mask=mask,
        annot=True,
        fmt=".2f",
        cmap="coolwarm",
        center=0,
        vmin=-1,
        vmax=1,
        square=True,
        linewidths=0.5,
        ax=ax,
        annot_kws={"size": 9},
    )
    ax.set_title("Correlação entre Variáveis Numéricas", fontsize=14, fontweight="bold", pad=15)
    plt.tight_layout()
    _save(fig, "02_correlacao_variaveis.png")


def plot_predictions_vs_actual(
    y_test: np.ndarray,
    y_pred: np.ndarray,
    model_name: str,
    r2: float,
) -> None:
    """
    Gráfico 3 — Previsões vs Valores Reais (scatter plot do melhor modelo).

    A linha diagonal perfeita (y = x) serve como referência: quanto mais
    próximos os pontos dessa linha, melhor o modelo.

    Parameters
    ----------
    y_test     : valores reais do conjunto de teste
    y_pred     : previsões do melhor modelo
    model_name : nome do modelo (usado no título)
    r2         : coeficiente de determinação (R²) do modelo
    """
    fig, ax = plt.subplots(figsize=(8, 7))

    lim_min = min(y_test.min(), y_pred.min()) * 0.95
    lim_max = max(y_test.max(), y_pred.max()) * 1.05

    # Linha de predição perfeita
    ax.plot([lim_min, lim_max], [lim_min, lim_max],
            color="red", linestyle="--", linewidth=1.5, label="Predição perfeita (y = x)")

    # Scatter dos pontos
    ax.scatter(y_test, y_pred, alpha=0.25, s=12, color=ACCENT, label="Pedidos do conjunto de teste")

    ax.set_xlabel("Valor Real (R$)")
    ax.set_ylabel("Valor Previsto (R$)")
    ax.set_title(
        f"Previsões vs Valores Reais\n{model_name}  |  R² = {r2:.4f}",
        fontsize=13,
        fontweight="bold",
    )
    ax.set_xlim(lim_min, lim_max)
    ax.set_ylim(lim_min, lim_max)
    ax.xaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f"R${x:,.0f}"))
    ax.yaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f"R${x:,.0f}"))
    ax.tick_params(axis="x", rotation=30)
    ax.tick_params(axis="y", rotation=30)
    ax.legend()

    plt.tight_layout()
    _save(fig, "03_previsoes_vs_reais.png")


def plot_model_comparison(df_results: pd.DataFrame) -> None:
    """
    Gráfico 4 — Comparação de desempenho entre os três modelos.

    Exibe dois subplots lado a lado:
    - Esquerda : RMSE de cada modelo (menor = melhor)
    - Direita  : R²  de cada modelo (maior = melhor)

    Parameters
    ----------
    df_results : DataFrame com colunas [Model, MAE, MSE, RMSE, R²]
    """
    fig, axes = plt.subplots(1, 2, figsize=(13, 5))
    fig.suptitle("Comparação de Desempenho dos Modelos", fontsize=14, fontweight="bold")

    colors = [ACCENT, "#74add1", "#abd9e9"]

    # --- RMSE (menor = melhor) ---
    ax1 = axes[0]
    bars1 = ax1.bar(df_results["Model"], df_results["RMSE"], color=colors, edgecolor="white")
    ax1.set_title("RMSE — Menor é melhor", fontweight="bold")
    ax1.set_ylabel("RMSE (R$)")
    ax1.set_ylim(0, df_results["RMSE"].max() * 1.25)
    ax1.tick_params(axis="x", rotation=15)
    for bar, val in zip(bars1, df_results["RMSE"]):
        ax1.text(bar.get_x() + bar.get_width() / 2,
                 bar.get_height() + df_results["RMSE"].max() * 0.02,
                 f"{val:.2f}", ha="center", va="bottom", fontsize=10, fontweight="bold")

    # --- R² (maior = melhor) ---
    ax2 = axes[1]
    bars2 = ax2.bar(df_results["Model"], df_results["R²"], color=colors, edgecolor="white")
    ax2.set_title("R² — Maior é melhor", fontweight="bold")
    ax2.set_ylabel("R²")
    ax2.set_ylim(0, min(df_results["R²"].max() * 1.15, 1.0))
    ax2.tick_params(axis="x", rotation=15)
    for bar, val in zip(bars2, df_results["R²"]):
        ax2.text(bar.get_x() + bar.get_width() / 2,
                 bar.get_height() + 0.01,
                 f"{val:.4f}", ha="center", va="bottom", fontsize=10, fontweight="bold")

    plt.tight_layout()
    _save(fig, "04_comparacao_modelos.png")


def generate_all_plots(
    df: pd.DataFrame,
    y_test: np.ndarray,
    predictions: dict,
    df_results: pd.DataFrame,
) -> None:
    """
    Gera e salva todos os 4 gráficos do projeto.

    Parameters
    ----------
    df          : DataFrame completo (com features e alvo)
    y_test      : valores reais do conjunto de teste
    predictions : dict {nome_modelo: array de previsões}
    df_results  : DataFrame com métricas dos modelos
    """
    plt.style.use("seaborn-v0_8-whitegrid")

    print("  Gerando gráficos...")

    # Gráfico 1 — Distribuição das vendas
    plot_sales_distribution(df)

    # Gráfico 2 — Heatmap de correlação
    plot_correlation_heatmap(df)

    # Gráfico 3 — Previsões vs reais (melhor modelo)
    best_name = df_results.iloc[0]["Model"]
    best_r2   = df_results.iloc[0]["R²"]
    plot_predictions_vs_actual(y_test, predictions[best_name], best_name, best_r2)

    # Gráfico 4 — Comparação dos modelos
    plot_model_comparison(df_results)
