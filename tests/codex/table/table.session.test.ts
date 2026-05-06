import { describe, expect, it } from 'vitest'
import { TABLE_ROWS } from '../expectations'
import { fixtureExists, replayFixture, sessionPath, stripAnsi } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = sessionPath(dir)

describe('codex table - session mode', () => {
	it.skipIf(!fixtureExists(fixture))('formats markdown table with aligned columns', () => {
		const output = stripAnsi(replayFixture(fixture))
		for (const row of TABLE_ROWS) expect(output).toContain(row)
	})
})
