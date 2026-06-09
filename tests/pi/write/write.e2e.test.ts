import { describe, expect, it } from 'vitest'
import { WRITE_BODY } from '../expectations'
import { expected, promptPath, runE2E, sanitize } from '../helpers'

const dir = new URL('.', import.meta.url).pathname

describe('pi write e2e', () => {
	it('runs pi and parses write', async () => {
		const output = await runE2E(promptPath(dir), dir, { tools: 'write' })
		expect(sanitize(output)).toBe(expected(WRITE_BODY))
	}, 120_000)
})
