import { open, readFile, stat } from 'node:fs/promises'
import { createInterface } from 'node:readline'
import type { ParseResult } from './result'

export interface LineParser {
	parseLine(line: string): ParseResult
	finalize?(): ParseResult
}

export function streamLines(parser: LineParser) {
	return new Promise<void>((resolve) => {
		const rl = createInterface({ input: process.stdin })
		let stats = createParseStats()

		rl.on('line', (line) => {
			stats = parseLine(line, parser, stats, (output) => process.stdout.write(output))
		})

		rl.on('close', () => {
			finalizeParse(parser, stats, (output) => process.stdout.write(output))
			resolve()
		})
	})
}

export async function parseFileLines(path: string, parser: LineParser, options: ParseFileLinesOptions = {}) {
	let stats = createParseStats()
	const content = await readFile(path, 'utf8')
	const lines = options.filterLines?.(content.split('\n')) ?? content.split('\n')
	for (const line of lines) stats = parseLine(line, parser, stats, (output) => process.stdout.write(output))
	finalizeParse(parser, stats, (output) => process.stdout.write(output))
}

interface ParseFileLinesOptions {
	filterLines?(lines: string[]): string[]
}

interface ParseStats {
	linesRead: number
	recognizedEvents: number
}

function createParseStats(): ParseStats {
	return { linesRead: 0, recognizedEvents: 0 }
}

function parseLine(line: string, parser: LineParser, stats: ParseStats, write: (output: string) => void): ParseStats {
	const trimmed = line.trim()
	if (!trimmed) return stats

	const result = parser.parseLine(trimmed)
	if (result.recognized) stats.recognizedEvents++
	const output = result.getOutput()
	if (output) write(output)

	return { ...stats, linesRead: stats.linesRead + 1 }
}

function finalizeParse(parser: LineParser, stats: ParseStats, write: (output: string) => void) {
	if (parser.finalize) {
		const output = parser.finalize().getOutput()
		if (output) write(output)
	}
	if (stats.linesRead > 0 && stats.recognizedEvents === 0) {
		process.stderr.write('error: no recognized events; check that the provider command matches the input\n')
		process.exitCode = 2
	}
}

interface WatchLinesOptions {
	path: string
	createParser(): LineParser
	fromEnd?: boolean
	intervalMs?: number
	signal?: AbortSignal
	write?(output: string): void
	writeError?(output: string): void
}

export async function watchLines(options: WatchLinesOptions) {
	const write = options.write ?? ((output) => process.stdout.write(output))
	const writeError = options.writeError ?? ((output) => process.stderr.write(output))
	const intervalMs = options.intervalMs ?? 250
	let parser = options.createParser()
	let offset = options.fromEnd ? await getFileSize(options.path) : 0
	let partial = ''

	while (!options.signal?.aborted) {
		let size: number
		try {
			size = await getFileSize(options.path)
		} catch (error) {
			throw new Error(`failed to stat '${options.path}': ${formatError(error)}`)
		}

		if (size < offset) {
			writeError(`watch: file truncated; restarting from beginning: ${options.path}\n`)
			parser = options.createParser()
			offset = 0
			partial = ''
		}

		if (size > offset) {
			const chunk = await readChunk(options.path, offset, size - offset)
			offset = size
			partial = feedChunk(`${partial}${chunk}`, parser, write)
		}

		await sleep(intervalMs, options.signal)
	}
}

async function readChunk(path: string, position: number, length: number) {
	const handle = await open(path, 'r')
	try {
		const buffer = Buffer.alloc(length)
		const { bytesRead } = await handle.read(buffer, 0, length, position)
		return buffer.subarray(0, bytesRead).toString('utf8')
	} finally {
		await handle.close()
	}
}

function feedChunk(chunk: string, parser: LineParser, write: (output: string) => void) {
	const normalized = chunk.replace(/\r\n/g, '\n')
	const lines = normalized.split('\n')
	const partial = lines.pop() ?? ''

	for (const line of lines) {
		const trimmed = line.trim()
		if (!trimmed) continue
		const output = parser.parseLine(trimmed).getOutput()
		if (output) write(output)
	}

	return partial
}

async function getFileSize(path: string) {
	return (await stat(path)).size
}

function sleep(ms: number, signal?: AbortSignal) {
	if (signal?.aborted) return Promise.resolve()
	return new Promise<void>((resolve) => {
		const timeout = setTimeout(resolve, ms)
		signal?.addEventListener(
			'abort',
			() => {
				clearTimeout(timeout)
				resolve()
			},
			{ once: true },
		)
	})
}

function formatError(error: unknown) {
	return error instanceof Error ? error.message : String(error)
}
