import { createInterface } from "node:readline"
import type { ParseResult } from "./result"

export interface LineParser {
	parseLine(line: string): ParseResult
	finalize?(): ParseResult
}

export function streamLines(parser: LineParser) {
	const rl = createInterface({ input: process.stdin })

	rl.on("line", (line) => {
		const trimmed = line.trim()
		if (trimmed) {
			const output = parser.parseLine(trimmed).getOutput()
			if (output) process.stdout.write(output)
		}
	})

	if (parser.finalize) {
		const finalize = parser.finalize
		rl.on("close", () => {
			const output = finalize().getOutput()
			if (output) process.stdout.write(output)
		})
	}
}
