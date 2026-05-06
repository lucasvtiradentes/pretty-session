import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const CLI_ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..')
const CLI_PATH = resolve(CLI_ROOT, 'src/bin.ts')

function runProvider(provider: string, input: string) {
	return spawnSync('npx', ['tsx', CLI_PATH, provider], {
		cwd: CLI_ROOT,
		encoding: 'utf8',
		input,
	})
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
})
