#!/usr/bin/env python3
"""Generate an interactive HTML chart for the Ink demo."""

from __future__ import annotations

from datetime import datetime
from pathlib import Path
import random

import plotly.graph_objects as go

OUTPUT_DIR = Path(__file__).resolve().parent / "output"


def main() -> None:
    OUTPUT_DIR.mkdir(exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = OUTPUT_DIR / f"chart_{timestamp}.html"

    x_values = list(range(1, 8))
    y_values = [random.randint(40, 120) for _ in x_values]

    figure = go.Figure(
        data=[
            go.Scatter(
                x=x_values,
                y=y_values,
                mode="lines+markers",
                line=dict(color="#1f77b4", width=2),
                marker=dict(size=8),
                name="随机样本",
            )
        ]
    )
    figure.update_layout(
        title="随机指标趋势",
        xaxis_title="样本序号",
        yaxis_title="随机值",
        template="plotly_dark",
    )
    figure.write_html(output_file, auto_open=False, include_plotlyjs="cdn")

    print(f"HTML 图表已生成: {output_file}")


if __name__ == "__main__":
    main()
