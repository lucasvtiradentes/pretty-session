import { run as runShow } from "./commands/show"
import { run as runStream } from "./commands/stream"
import { CLI_NAME } from "./constants"

const VERSION = "0.1.0"

function printHelp() {
	console.log(`${CLI_NAME} - Pretty formatter for AI coding agent sessions

Usage:
  ${CLI_NAME} <command> [options]

Commands:
  stream [claude-args...]          Run claude with pretty output (forwards all args)
  show <file.jsonl>                Replay a saved session (.jsonl)

Options:
  -h, --help         Show this help
  -v, --version      Show version

Environment:
  PS_TOOL_RESULT_MAX_CHARS   Max chars for tool results (default: 300, 0=hide)
  PS_READ_PREVIEW_LINES      Lines to preview from Read (default: 5, 0=hide)

Examples:
  ${CLI_NAME} stream -p "explain this code"
  ${CLI_NAME} show ~/.claude/projects/.../session.jsonl`)
}

const COMMANDS: Record<string, (args: string[]) => void | Promise<void>> = {
	stream: runStream,
	show: runShow,
}

async function main() {
	const args = process.argv.slice(2)

	if (args.length === 0 || args.includes("-h") || args.includes("--help")) {
		printHelp()
		process.exit(0)
	}

	if (args.includes("-v") || args.includes("--version")) {
		console.log(VERSION)
		process.exit(0)
	}

	const command = args[0]
	const subArgs = args.slice(1)

	const handler = COMMANDS[command]
	if (!handler) {
		console.log(`Unknown command: ${command}`)
		console.log(`Run '${CLI_NAME} --help' for usage`)
		process.exit(1)
	}

	await handler(subArgs)
}

main()
