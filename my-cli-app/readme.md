# my-cli-app

Ink + React demo CLI，展示了基础输入、Python 脚本调用以及生成 HTML 图表的流程。

## 依赖

- Node.js ≥ 16
- [uv](https://docs.astral.sh/uv/)（建议 0.7+）与 Python ≥ 3.9，用于管理 Python 依赖

## 安装

```bash
npm install
uv sync  # 安装 plotly 等 Python 依赖，并生成/更新 uv.lock
```

## 开发模式

打开两个终端：

1. `npm run dev` – 持续编译 TypeScript。
2. `node dist/cli.js` – 运行 CLI，终端内提供以下交互示例：
   - 计数器（方向键控制）
   - `uv run python scripts/demo.py` 的输出
   - `uv run python scripts/chart_report.py` 生成的 Plotly HTML 图表（按 `o` 可直接在浏览器打开最新图表）

在 Python 视图内按 `r` 可重新执行脚本，按 `m` 返回菜单，按 `q` 退出程序。

生成的图表会保存在 `scripts/output/` 目录；在图表界面按 `o` 可以直接调用系统浏览器打开最新图表。

## 分发

```bash
npm pack  # 会自动运行 npm run build
```

生成的压缩包包含：

- `dist/` 内编译后的 CLI 入口
- `scripts/` 目录及示例 Python 脚本
- `pyproject.toml` 与 `uv.lock`（供 uv 同步依赖）

同事可通过 `npm install -g my-cli-app-*.tgz` 安装，并运行 `uv sync` 准备 Python 依赖。随后直接执行 `my-cli-app` 即可体验全部功能。
