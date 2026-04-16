import { createInterface } from "node:readline"
import { CLI_NAME } from "./constants"
import { ParserState } from "./providers/claude/handlers/base"
import { parseJsonLine } from "./providers/claude/parser"
import { CodexState, finalizeCodex, parseCodexLine } from "./providers/codex/parser"
import type { ParseResult } from "./result"

const VERSION = "0.1.0"

const PROVIDERS = new Set(["claude", "codex"])

function printHelp() {
	console.log(`${CLI_NAME} - Pretty formatter for AI coding agent sessions

Usage:
  <provider-output> | ${CLI_NAME} <provider>

Providers:
  claude          Claude Code stream-json format
  codex           OpenAI Codex CLI session format

Options:
  -h, --help         Show this help
  -v, --version      Show version

Environment:
  PS_TOOL_RESULT_MAX_CHARS   Max chars for tool results (default: 300, 0=hide)
  PS_READ_PREVIEW_LINES      Lines to preview from Read (default: 5, 0=hide)

Examples:
  claude -p "explain this code" --output-format stream-json | ${CLI_NAME} claude
  cat session.jsonl | ${CLI_NAME} claude`)
}

function main() {
	const args = process.argv.slice(2)

	if (args.length === 0 || args.includes("-h") || args.includes("--help")) {
		printHelp()
		process.exit(0)
	}

	if (args.includes("-v") || args.includes("--version")) {
		console.log(VERSION)
		process.exit(0)
	}

	const provider = args[0]

	if (!PROVIDERS.has(provider)) {
		console.error(`Unknown provider: ${provider}`)
		console.error(`Run '${CLI_NAME} --help' for usage`)
		process.exit(1)
	}

	let parseLine: (line: string) => ParseResult
	let onClose: (() => ParseResult) | undefined

	if (provider === "claude") {
		const state = new ParserState("stream")
		parseLine = (line) => parseJsonLine(line, state)
	} else {
		const state = new CodexState()
		parseLine = (line) => parseCodexLine(line, state)
		onClose = () => finalizeCodex(state)
	}

	const rl = createInterface({ input: process.stdin })

	rl.on("line", (line) => {
		const trimmed = line.trim()
		if (trimmed) {
			const output = parseLine(trimmed).getOutput()
			if (output) process.stdout.write(output)
		}
	})

	if (onClose) {
		const finalize = onClose
		rl.on("close", () => {
			const output = finalize().getOutput()
			if (output) process.stdout.write(output)
		})
	}
}

main()
