import { createInterface } from "node:readline"
import { CLI_NAME, PROVIDER_VALUES, Provider } from "./constants"
import { ParserState } from "./providers/claude/handlers/base"
import { parseJsonLine } from "./providers/claude/parser"
import { CodexState, finalizeCodex, parseCodexLine } from "./providers/codex/parser"
import type { ParseResult } from "./result"

const VERSION = "0.1.0"

function printHelp() {
	console.log(`${CLI_NAME} - Pretty formatter for AI coding agent sessions

Usage:
  <provider-output> | ${CLI_NAME} <provider>

Providers:
  ${Provider.Claude}          Claude Code (stream + session auto-detected)
  ${Provider.Codex}           OpenAI Codex CLI (stream + session auto-detected)

Options:
  -h, --help         Show this help
  -v, --version      Show version

Environment:
  PS_TOOL_RESULT_MAX_CHARS   Max chars for tool results (default: 300, 0=hide)
  PS_READ_PREVIEW_LINES      Lines to preview from Read (default: 5, 0=hide)

Examples:
  claude -p "explain this code" --output-format stream-json | ${CLI_NAME} ${Provider.Claude}
  cat ~/.claude/projects/.../session.jsonl | ${CLI_NAME} ${Provider.Claude}
  codex exec "do something" --json | ${CLI_NAME} ${Provider.Codex}
  cat ~/.codex/sessions/.../session.jsonl | ${CLI_NAME} ${Provider.Codex}`)
}

function createParser(provider: Provider): { parseLine: (line: string) => ParseResult; onClose?: () => ParseResult } {
	switch (provider) {
		case Provider.Claude: {
			const state = new ParserState()
			return { parseLine: (line) => parseJsonLine(line, state) }
		}
		case Provider.Codex: {
			const state = new CodexState()
			return { parseLine: (line) => parseCodexLine(line, state), onClose: () => finalizeCodex(state) }
		}
	}
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

	const providerArg = args[0]

	if (!PROVIDER_VALUES.includes(providerArg)) {
		console.error(`Unknown provider: ${providerArg}`)
		console.error(`Run '${CLI_NAME} --help' for usage`)
		process.exit(1)
	}

	const { parseLine, onClose } = createParser(providerArg as Provider)

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
