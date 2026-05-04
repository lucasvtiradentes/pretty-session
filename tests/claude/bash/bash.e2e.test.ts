import { describe, expect, it } from 'vitest'
import { BASH_BODY } from '../expectations'
import { expected, promptPath, runE2E, sanitize } from '../helpers'

const dir = new URL('.', import.meta.url).pathname

describe('bash e2e', () => {
	it('runs claude and parses Bash tool', () => {
		const output = runE2E(promptPath(dir), dir)
		expect(sanitize(output)).toBe(expected(BASH_BODY))
	}, 120_000)
})
