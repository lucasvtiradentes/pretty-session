import { describe, expect, it } from 'vitest'
import { GLOB_BODY } from '../expectations'
import { expected, fixtureExists, replayFixture, sanitize, sessionPath } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = sessionPath(dir)

describe('glob - session mode', () => {
	it.skipIf(!fixtureExists(fixture))('parses Glob tool', () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(GLOB_BODY))
	})
})
