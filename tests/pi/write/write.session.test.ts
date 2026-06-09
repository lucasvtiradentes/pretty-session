import { describe, expect, it } from 'vitest'
import { WRITE_BODY } from '../expectations'
import { expected, fixtureExists, replayFixture, sanitize, sessionPath } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = sessionPath(dir)

describe('pi write - session mode', () => {
	it.skipIf(!fixtureExists(fixture))('parses write from session', () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(WRITE_BODY))
	})
})
