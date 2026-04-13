import { spawn } from "node:child_process"
import { createInterface } from "node:readline"
import { CLI_NAME } from "../constants.js"
import { ParserState } from "../handlers/base.js"
import { parseJsonLine } from "../parser.js"

function printHelp() {
	console.log(`${CLI_NAME} stream - Run claude with pretty output

Usage:
  ${CLI_NAME} stream [claude-args...]

All arguments are forwarded to claude. These flags are added automatically:
  --print --verbose --dangerously-skip-permissions --output-format stream-json

Examples:
  ${CLI_NAME} stream -p "explain this code"
  ${CLI_NAME} stream -p "fix the bug" --model sonnet --max-turns 3
  ${CLI_NAME} stream --resume`)
}

export function run(args: string[]) {
	if (args.includes("-h") || args.includes("--help")) {
		printHelp()
		process.exit(0)
	}

	const cmd = "claude"
	const cmdArgs = [
		"--print",
		"--verbose",
		"--dangerously-skip-permissions",
		"--output-format",
		"stream-json",
		"--include-partial-messages",
		...args,
	]

	const state = new ParserState("stream")

	const proc = spawn(cmd, cmdArgs, { stdio: ["inherit", "pipe", "pipe"] })

	const rl = createInterface({ input: proc.stdout ?? process.stdin })

	rl.on("line", (line) => {
		const trimmed = line.trim()
		if (trimmed) {
			const result = parseJsonLine(trimmed, state)
			const output = result.getOutput()
			if (output) process.stdout.write(output)
		}
	})

	proc.stderr?.pipe(process.stderr)

	proc.on("close", (code) => {
		process.exit(code ?? 0)
	})

	process.on("SIGINT", () => {
		proc.kill("SIGTERM")
		process.exit(130)
	})
}
