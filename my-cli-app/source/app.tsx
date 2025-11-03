import React, {useEffect, useState} from 'react';
import {Box, Text, useInput} from 'ink';
import {Select} from '@inkjs/ui';
import Link from 'ink-link';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {fileURLToPath, pathToFileURL} from 'node:url';

type View = 'menu' | 'counter' | 'about' | 'python' | 'chart';
const execFileAsync = promisify(execFile);
const pythonScriptPath = fileURLToPath(new URL('../scripts/demo.py', import.meta.url));
const chartScriptPath = fileURLToPath(new URL('../scripts/chart_report.py', import.meta.url));

export default function App() {
	const [view, setView] = useState<View>('menu');
	const [count, setCount] = useState(0);
	const [pythonRunId, setPythonRunId] = useState(0);
	const [pythonRunning, setPythonRunning] = useState(false);
	const [pythonOutput, setPythonOutput] = useState<string | null>(null);
	const [pythonError, setPythonError] = useState<string | null>(null);
	const [chartRunId, setChartRunId] = useState(0);
	const [chartRunning, setChartRunning] = useState(false);
	const [chartOutput, setChartOutput] = useState<string | null>(null);
	const [chartError, setChartError] = useState<string | null>(null);
	const [chartFilePath, setChartFilePath] = useState<string | null>(null);
	const [chartLink, setChartLink] = useState<string | null>(null);
	const [chartOpenMessage, setChartOpenMessage] = useState<string | null>(null);

	useInput((input, key) => {
		if (input === 'q') {
			process.exit(0);
		}

		if (input === 'm') {
			setView('menu');
			return;
		}

		if (view === 'python' && input === 'r') {
			setPythonRunId(id => id + 1);
			return;
		}

		if (view === 'chart' && input === 'r') {
			setChartRunId(id => id + 1);
			return;
		}

		if (view === 'chart' && input === 'o') {
			if (!chartFilePath) {
				setChartOpenMessage('请先生成图表再尝试打开。');
				return;
			}

			setChartOpenMessage('正在尝试使用系统浏览器打开图表...');

			const platform = process.platform;
			const openCommand =
				platform === 'darwin'
					? {command: 'open', args: [chartFilePath]}
					: platform === 'win32'
						? {command: 'cmd', args: ['/c', 'start', '', chartFilePath]}
						: {command: 'xdg-open', args: [chartFilePath]};

			execFileAsync(openCommand.command, openCommand.args)
				.then(() => {
					setChartOpenMessage('已调用系统浏览器打开图表。');
				})
				.catch(error => {
					const message = error instanceof Error ? error.message : String(error);
					setChartOpenMessage(`打开失败: ${message}`);
				});

			return;
		}

		if (view === 'counter') {
			if (key.upArrow) {
				setCount(current => current + 1);
			}

			if (key.downArrow) {
				setCount(current => current - 1);
			}
		}
	});

	useEffect(() => {
		if (view !== 'python') {
			return;
		}

		let cancelled = false;
		setPythonRunning(true);
		setPythonOutput(null);
		setPythonError(null);

		// Run the demo Python script and surface its output inside the Ink UI.
		const runScript = async () => {
			try {
				const {stdout, stderr} = await execFileAsync('uv', ['run', 'python', pythonScriptPath], {
					env: process.env,
				});

				if (cancelled) {
					return;
				}

				const cleanStdout = stdout.trim();
				const cleanStderr = stderr.trim();
				setPythonOutput(cleanStdout || '脚本执行成功，但没有输出。');
				setPythonError(cleanStderr || null);
			} catch (error) {
				if (cancelled) {
					return;
				}

				const message = error instanceof Error ? error.message : String(error);
				setPythonError(message);
				setPythonOutput(null);
			} finally {
				if (!cancelled) {
					setPythonRunning(false);
				}
			}
		};

		runScript().catch(() => {
			// Errors are handled inside runScript; this catch avoids unhandled promise warnings.
		});

		return () => {
			cancelled = true;
		};
	}, [view, pythonRunId]);

	useEffect(() => {
		if (view !== 'chart') {
			return;
		}

		let cancelled = false;
		setChartRunning(true);
		setChartOutput(null);
		setChartError(null);
		setChartFilePath(null);
		setChartLink(null);
		setChartOpenMessage(null);

		// Generate an HTML chart via uv-managed Python environment.
		const runScript = async () => {
			try {
				const {stdout, stderr} = await execFileAsync('uv', ['run', 'python', chartScriptPath], {
					env: process.env,
				});

				if (cancelled) {
					return;
				}

				const cleanStdout = stdout.trim();
				const cleanStderr = stderr.trim();
				setChartOutput(cleanStdout || '图表脚本执行成功。');
				setChartError(cleanStderr || null);

				const pathMatch = cleanStdout.match(/HTML 图表已生成:\s*(.+)$/m);
				const filePath = pathMatch?.[1]?.trim();
				if (filePath) {
					setChartFilePath(filePath);
					try {
						setChartLink(pathToFileURL(filePath).toString());
					} catch {
						setChartLink(null);
					}
				}
			} catch (error) {
				if (cancelled) {
					return;
				}

				const message = error instanceof Error ? error.message : String(error);
				setChartError(message);
				setChartOutput(null);
			} finally {
				if (!cancelled) {
					setChartRunning(false);
				}
			}
		};

		runScript().catch(() => {
			// Errors are handled inside runScript; this catch avoids unhandled promise warnings.
		});

		return () => {
			cancelled = true;
		};
	}, [view, chartRunId]);

	if (view === 'menu') {
		return (
			<Box flexDirection="column" padding={1} borderStyle="round" borderColor="green">
				<Text color="green" bold>
					欢迎使用我的 CLI 工具!
				</Text>
				<Text>请选择一个示例场景，或按 q 退出。</Text>
				<Box marginTop={1}>
					<Select
						options={[
							{label: '计数器示例', value: 'counter'},
							{label: 'Python 脚本示例', value: 'python'},
							{label: 'Python 图表报告 (HTML)', value: 'chart'},
							{label: '关于此 Demo', value: 'about'},
							{label: '退出', value: 'exit'},
						]}
						onChange={value => {
							if (value === 'exit') {
								process.exit(0);
								return;
							}

							setView(value as View);
						}}
					/>
				</Box>
				<Text dimColor>在其他界面按 m 返回菜单，按 q 退出程序。</Text>
			</Box>
		);
	}

	if (view === 'counter') {
		return (
			<Box flexDirection="column" borderStyle="round" padding={1}>
				<Text color="cyan">按 ↑↓ 键改变数字，按 m 返回菜单，按 q 退出</Text>
				<Text>
					当前计数:{' '}
					<Text color={count >= 0 ? 'green' : 'red'} bold>
						{count}
					</Text>
				</Text>
			</Box>
		);
	}

	if (view === 'python') {
		return (
			<Box flexDirection="column" padding={1} borderStyle="round">
				<Text color="yellow" bold>
					Python 脚本示例
				</Text>
				<Text>
					选择此项后会通过 uv 运行 `scripts/demo.py`，按 r 可重新执行，按 m 返回菜单。
				</Text>
				<Box flexDirection="column" marginTop={1}>
					<Text color={pythonRunning ? 'cyan' : 'green'}>
						{pythonRunning ? '正在运行 uv run python scripts/demo.py...' : '执行完成'}
					</Text>
					{pythonOutput && (
						<Box flexDirection="column" marginTop={1}>
							<Text bold>标准输出:</Text>
							<Text>{pythonOutput}</Text>
						</Box>
					)}
					{pythonError && (
						<Box flexDirection="column" marginTop={1}>
							<Text color="red" bold>
								错误信息:
							</Text>
							<Text color="red">{pythonError}</Text>
						</Box>
					)}
				</Box>
				<Box marginTop={1}>
					<Text dimColor>需要安装 uv 与 python，可通过 `uv run` 统一管理依赖。</Text>
				</Box>
			</Box>
		);
	}

	if (view === 'chart') {
		return (
			<Box flexDirection="column" padding={1} borderStyle="round">
				<Text color="magenta" bold>
					Python 图表报告
				</Text>
				<Text>
					uv 会运行 `scripts/chart_report.py` 生成 Plotly HTML 报告，按 r 可重新执行，按 m
					返回菜单。
				</Text>
				<Box flexDirection="column" marginTop={1}>
					<Text color={chartRunning ? 'cyan' : 'green'}>
						{chartRunning ? '正在运行 uv run python scripts/chart_report.py...' : '执行完成'}
					</Text>
					{chartOutput && (
						<Box flexDirection="column" marginTop={1}>
							<Text bold>标准输出:</Text>
							<Text>{chartOutput}</Text>
						</Box>
					)}
					{chartError && (
						<Box flexDirection="column" marginTop={1}>
							<Text color="red" bold>
								错误信息:
							</Text>
							<Text color="red">{chartError}</Text>
						</Box>
					)}
				</Box>
				{chartLink && chartFilePath && (
					<Box flexDirection="column" marginTop={1}>
						<Text bold>打开图表:</Text>
						<Link url={chartLink}>{chartFilePath}</Link>
					</Box>
				)}
				{chartOpenMessage && (
					<Box marginTop={1}>
						<Text dimColor>{chartOpenMessage}</Text>
					</Box>
				)}
				<Box marginTop={1}>
					<Text dimColor>
						生成的 HTML 可在 `scripts/output/` 中找到，可用浏览器打开预览。按 o 调用系统浏览器。
					</Text>
				</Box>
			</Box>
		);
	}

	return (
		<Box flexDirection="column" padding={1} borderStyle="round">
			<Text bold>这是一个简单的 Ink + React 终端界面示例。</Text>
			<Text>使用 Ink 提供的 Flexbox 布局和 React Hooks 构建交互体验。</Text>
			<Text dimColor>按 m 返回菜单，按 q 退出。</Text>
		</Box>
	);
}
