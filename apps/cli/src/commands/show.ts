import { createReadStream } from "node:fs"
import { existsSync } from "node:fs"
import { createInterface } from "node:readline"
import { CLI_NAME } from "../constants.js"
import { ParserState } from "../handlers/base.js"
import { parseJsonLine } from "../parser.js"

function printHelp() {
	console.log(`${CLI_NAME} show - Replay a saved session

Usage:
  ${CLI_NAME} show <file.jsonl>

Examples:
  ${CLI_NAME} show ~/.claude/projects/.../session.jsonl`)
}

async function replay(filePath: string): Promise<number> {
	const state = new ParserState("replay")
	const r = state.renderer

	let input: NodeJS.ReadableStream

	if (filePath === "-") {
		input = process.stdin
		process.stdout.write(`${r.dim("[replay] stdin")}\n\n`)
	} else {
		if (!existsSync(filePath)) {
			console.log(`Error: File not found: ${filePath}`)
			return 1
		}
		input = createReadStream(filePath, { encoding: "utf-8" })
		process.stdout.write(`${r.dim(`[replay] ${filePath}`)}\n\n`)
	}

	const rl = createInterface({ input })

	for await (const line of rl) {
		const trimmed = line.trim()
		if (trimmed) {
			const result = parseJsonLine(trimmed, state)
			const output = result.getOutput()
			if (output) process.stdout.write(output)
		}
	}

	return 0
}

export async function run(args: string[]) {
	if (args.length === 0 || args.includes("-h") || args.includes("--help")) {
		printHelp()
		process.exit(0)
	}

	const code = await replay(args[0])
	process.exit(code)
}
