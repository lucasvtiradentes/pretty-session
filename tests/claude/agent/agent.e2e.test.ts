import { describe, expect, it } from 'vitest'
import { AGENT_BODY } from '../expectations'
import { expected, promptPath, runE2E, sanitize } from '../helpers'

const dir = new URL('.', import.meta.url).pathname

describe('agent e2e', () => {
	it('runs claude and parses Agent tool', () => {
		const output = runE2E(promptPath(dir), dir)
		expect(sanitize(output)).toBe(expected(AGENT_BODY))
	}, 120_000)
})
