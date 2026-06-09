import { describe, expect, it } from 'vitest'
import { EDIT_BODY } from '../expectations'
import { expected, promptPath, runE2E, sanitize } from '../helpers'

const dir = new URL('.', import.meta.url).pathname

describe('pi edit e2e', () => {
	it('runs pi and parses edit', async () => {
		const output = await runE2E(promptPath(dir), dir, { tools: 'write,edit' })
		expect(sanitize(output)).toBe(expected(EDIT_BODY))
	}, 120_000)
})
