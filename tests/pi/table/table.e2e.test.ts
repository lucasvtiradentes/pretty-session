import { describe, expect, it } from 'vitest'
import { TABLE_BODY } from '../expectations'
import { expected, promptPath, runE2E, sanitize } from '../helpers'

const dir = new URL('.', import.meta.url).pathname

describe('pi table e2e', () => {
	it('runs pi and parses table', async () => {
		const output = await runE2E(promptPath(dir), dir, { tools: 'read' })
		expect(sanitize(output)).toBe(expected(TABLE_BODY))
	}, 120_000)
})
