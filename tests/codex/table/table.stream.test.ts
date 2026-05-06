import { describe, expect, it } from 'vitest'
import { TABLE_ROWS } from '../expectations'
import { fixtureExists, replayFixture, streamPath, stripAnsi } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = streamPath(dir)

describe('codex table - stream mode', () => {
	it.skipIf(!fixtureExists(fixture))('formats markdown table with aligned columns from stream', () => {
		const output = stripAnsi(replayFixture(fixture))
		for (const row of TABLE_ROWS) expect(output).toContain(row)
	})
})
