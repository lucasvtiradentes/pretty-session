import { describe, expect, it } from 'vitest'
import { EDIT_BODY } from '../expectations'
import { expectedStream, promptPath, runE2E, sanitize } from '../helpers'

const dir = new URL('.', import.meta.url).pathname

describe('codex edit e2e', () => {
	it('runs codex and parses Edit tool', () => {
		const output = runE2E(promptPath(dir), dir)
		expect(sanitize(output)).toBe(expectedStream(EDIT_BODY))
	}, 120_000)
})
