import { closeSync, openSync, readSync } from 'node:fs'
import { parseJsonRecord } from './json'

const CHUNK_SIZE = 64 * 1024

export function findJsonlRecord(
	path: string,
	matches: (record: Record<string, unknown>) => boolean,
): Record<string, unknown> | null {
	let fd: number
	try {
		fd = openSync(path, 'r')
	} catch {
		return null
	}

	try {
		const buffer = Buffer.alloc(CHUNK_SIZE)
		let pending = ''

		while (true) {
			const bytesRead = readSync(fd, buffer, 0, buffer.length, null)
			if (bytesRead === 0) break

			const lines = `${pending}${buffer.subarray(0, bytesRead).toString('utf8')}`.split('\n')
			pending = lines.pop() ?? ''

			for (const line of lines) {
				const record = parseJsonRecord(line.trim())
				if (record && matches(record)) return record
			}
		}

		const record = parseJsonRecord(pending.trim())
		if (record && matches(record)) return record
	} finally {
		closeSync(fd)
	}

	return null
}
