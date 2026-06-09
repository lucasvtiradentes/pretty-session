import { describe, expect, it } from 'vitest'
import { TABLE_BODY } from '../expectations'
import { expected, fixtureExists, replayFixture, sanitize, sessionPath } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = sessionPath(dir)

describe('pi table - session mode', () => {
	it.skipIf(!fixtureExists(fixture))('parses table from session', () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(TABLE_BODY))
	})
})
