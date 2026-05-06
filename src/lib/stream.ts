import { createInterface } from 'node:readline'
import type { ParseResult } from './result'

interface LineParser {
	parseLine(line: string): ParseResult
	finalize?(): ParseResult
}

export function streamLines(parser: LineParser) {
	const rl = createInterface({ input: process.stdin })
	let linesRead = 0
	let recognizedEvents = 0

	rl.on('line', (line) => {
		const trimmed = line.trim()
		if (trimmed) {
			linesRead++
			const result = parser.parseLine(trimmed)
			if (result.recognized) recognizedEvents++
			const output = result.getOutput()
			if (output) process.stdout.write(output)
		}
	})

	rl.on('close', () => {
		if (parser.finalize) {
			const finalize = parser.finalize
			const output = finalize().getOutput()
			if (output) process.stdout.write(output)
		}
		if (linesRead > 0 && recognizedEvents === 0) {
			process.stderr.write('error: no recognized events; check that the provider command matches the input\n')
			process.exitCode = 2
		}
	})
}
