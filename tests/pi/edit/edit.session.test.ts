import { describe, expect, it } from 'vitest'
import { EDIT_BODY } from '../expectations'
import { expected, fixtureExists, replayFixture, sanitize, sessionPath } from '../helpers'

const dir = new URL('.', import.meta.url).pathname
const fixture = sessionPath(dir)

describe('pi edit - session mode', () => {
	it.skipIf(!fixtureExists(fixture))('parses edit from session', () => {
		expect(sanitize(replayFixture(fixture))).toBe(expected(EDIT_BODY))
	})
})
