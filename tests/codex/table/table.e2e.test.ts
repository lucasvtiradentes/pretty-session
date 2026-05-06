import { describe, expect, it } from 'vitest'
import { TABLE_ROWS } from '../expectations'
import { promptPath, runE2E, stripAnsi } from '../helpers'

const dir = new URL('.', import.meta.url).pathname

describe('codex table e2e', () => {
	it('runs codex and formats markdown table', () => {
		const output = stripAnsi(runE2E(promptPath(dir), dir))
		for (const row of TABLE_ROWS) expect(output).toContain(row)
	}, 120_000)
})
