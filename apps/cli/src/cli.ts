import { createInterface } from "node:readline"
import { CLI_NAME } from "./constants"
import { ParserState } from "./handlers/base"
import { parseJsonLine } from "./parser"

const VERSION = "0.1.0"

const PROVIDERS = new Set(["claude"])

function printHelp() {
	console.log(`${CLI_NAME} - Pretty formatter for AI coding agent sessions

Usage:
  <provider-output> | ${CLI_NAME} <provider>

Providers:
  claude          Claude Code stream-json format

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

	const state = new ParserState("stream")
	const rl = createInterface({ input: process.stdin })

	rl.on("line", (line) => {
		const trimmed = line.trim()
		if (trimmed) {
			const result = parseJsonLine(trimmed, state)
			const output = result.getOutput()
			if (output) process.stdout.write(output)
		}
	})
}

main()
