import { appendFileSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { Provider } from '../src/constants'
import { createProviderParser } from '../src/lib/provider-parser'
import { watchLines } from '../src/lib/stream'

const dirs: string[] = []

afterEach(() => {
	for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true })
})

describe('watchLines', () => {
	it('replays existing lines by default', async () => {
		const path = createSessionFile('old-session')
		const controller = new AbortController()
		let output = ''

		const watch = watchLines({
			path,
			createParser: () => createProviderParser(Provider.Claude),
			intervalMs: 10,
			signal: controller.signal,
			write: (chunk) => {
				output += chunk
			},
		})

		await waitFor(() => output.includes('old-session'))
		controller.abort()
		await watch

		expect(output).toContain('old-session')
	})

	it('can start from the end and only print appended lines', async () => {
		const path = createSessionFile('old-session')
		const controller = new AbortController()
		let output = ''

		const watch = watchLines({
			path,
			createParser: () => createProviderParser(Provider.Claude),
			fromEnd: true,
			intervalMs: 10,
			signal: controller.signal,
			write: (chunk) => {
				output += chunk
			},
		})

		await delay(30)
		appendFileSync(path, `${sessionLine('new-session')}\n`)
		await waitFor(() => output.includes('new-session'))
		controller.abort()
		await watch

		expect(output).not.toContain('old-session')
		expect(output).toContain('new-session')
	})

	it('restarts from the beginning when the file is truncated', async () => {
		const path = createSessionFile('old-session')
		const controller = new AbortController()
		let output = ''
		let error = ''

		const watch = watchLines({
			path,
			createParser: () => createProviderParser(Provider.Claude),
			intervalMs: 10,
			signal: controller.signal,
			write: (chunk) => {
				output += chunk
			},
			writeError: (chunk) => {
				error += chunk
			},
		})

		await waitFor(() => output.includes('old-session'))
		writeFileSync(path, `${sessionLine('new')}\n`)
		await waitFor(() => output.includes('new'))
		controller.abort()
		await watch

		expect(error).toContain('file truncated')
		expect(output).toContain('new')
	})
})

function createSessionFile(sessionId: string) {
	const dir = mkdtempSync(join(tmpdir(), 'pretty-session-watch-'))
	dirs.push(dir)
	const path = join(dir, 'session.jsonl')
	writeFileSync(path, `${sessionLine(sessionId)}\n`)
	return path
}

function sessionLine(sessionId: string) {
	return JSON.stringify({
		type: 'system',
		subtype: 'init',
		session_id: sessionId,
		cwd: '/tmp',
		model: 'test-model',
	})
}

async function waitFor(predicate: () => boolean) {
	const started = Date.now()
	while (!predicate()) {
		if (Date.now() - started > 1000) throw new Error('timed out waiting for watch output')
		await delay(10)
	}
}

function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}
