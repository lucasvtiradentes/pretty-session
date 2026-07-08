import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'

const CLI_ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..')
const CLI_PATH = resolve(CLI_ROOT, 'src/cli.ts')
const dirs: string[] = []

afterEach(() => {
	for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true })
})

function runProvider(provider: string, input: string) {
	return spawnSync('npx', ['tsx', CLI_PATH, 'parse', provider], {
		cwd: CLI_ROOT,
		encoding: 'utf8',
		input,
	})
}

function runParse(args: string[], input: string) {
	return spawnSync('npx', ['tsx', CLI_PATH, 'parse', ...args], {
		cwd: CLI_ROOT,
		encoding: 'utf8',
		input,
	})
}

function createSessionFile() {
	const dir = mkdtempSync(join(tmpdir(), 'pretty-session-parse-'))
	dirs.push(dir)
	const path = join(dir, 'session.jsonl')
	writeFileSync(
		path,
		'{"type":"system","subtype":"init","session_id":"file-session","cwd":"/tmp","model":"test-model"}\n',
	)
	return path
}

describe('strict input validation', () => {
	it('fails when stdin contains no recognized provider events', () => {
		const result = runProvider('claude', '{"type":"not-real"}\n')

		expect(result.status).toBe(2)
		expect(result.stderr).toContain('no recognized events')
	})

	it('does not fail on empty stdin', () => {
		const result = runProvider('claude', '')

		expect(result.status).toBe(0)
		expect(result.stderr).toBe('')
	})

	it('accepts recognized events that only update parser state', () => {
		const result = runProvider(
			'claude',
			'{"type":"system","subtype":"init","session_id":"test-session","cwd":"/tmp","model":"test-model"}\n',
		)

		expect(result.status).toBe(0)
		expect(result.stdout).toContain('[session]')
		expect(result.stderr).toBe('')
	})

	it('parses a session file path argument', () => {
		const file = createSessionFile()
		const result = runParse(['claude', file], '')

		expect(result.status).toBe(0)
		expect(result.stdout).toContain('file-session')
		expect(result.stderr).toBe('')
	})
})
