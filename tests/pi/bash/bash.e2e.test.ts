import { describe, expect, it } from 'vitest'
import { BASH_BODY } from '../expectations'
import { expected, promptPath, runE2E, sanitize } from '../helpers'

const dir = new URL('.', import.meta.url).pathname

describe('pi bash e2e', () => {
	it('runs pi and parses bash', async () => {
		const output = await runE2E(promptPath(dir), dir, { tools: 'bash' })
		expect(sanitize(output)).toBe(expected(BASH_BODY))
	}, 120_000)
})
