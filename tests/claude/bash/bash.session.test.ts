import { describe, expect, it } from 'vitest'
import { BASH_BODY } from '../expectations'
import { expected, fixtureExists, replayFixture, sanitize, sessionPath } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = sessionPath(dir)

describe('bash - session mode', () => {
	it.skipIf(!fixtureExists(fixture))('parses Bash tool', () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(BASH_BODY))
	})
})
